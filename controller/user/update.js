const Joi = require("joi");
const Bcrypt = require("bcrypt");
const fsPromises = require('fs').promises;
const { email_operation } = require("namira-nodejs");
const { otpGenerator, onSafeRequest } = require("../../util/otp_operation");
const PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const body_schema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required().email(),
	new_password: Joi.string().regex(PATTERN).allow(""),
	repeat_password: Joi.any()
		.equal(Joi.ref("new_password"))
		.messages({ "any.only": '"Confirm password" does not match.' }),
});


async function sendEmail(email, user_id, otp) {
	let html = await fsPromises.readFile('./data/email_confirmation.html');
	html = html.toString()
		.replace("{{user_id}}", user_id)
		.replace("{{otp}}", otp);

	email_operation.send(
		email,
		`Confirm email`,
		"",
		html
	);
}

async function changePassword(req, user, new_password) {
	let { error, next_time } = await onSafeRequest(
		process.env.e_otp_wait_time,
		process.env.e_otp_max_attempt,
		user.e_otp_time,
		user.e_otp_attempt,
		async () => {
			// update user
			user.new_password = new_password;
			user.e_otp = otpGenerator(6, 4);
			user.e_otp_time = new Date();
			user.e_otp_attempt += 1;
			user.e_try_attempt = 0;
			// Send email        
			await sendEmail(user.email, user.id, user.e_otp);
		}
	);
	if (error)
		req.throw(400, error);
}

const handler = async (req) => {
	let { name, email, new_password } = req.body;
	let user = req.user;

	// name
	user.name = name;

	// email
	if (user.email !== email) {
		if (await req.context.isEmailExist(email))
			req.throw(400, "Email exists.");

		user.email = email;
		user.e_approved = false;
	}

	// password
	if (new_password && new_password !== "") {
		new_password = await Bcrypt.hash(new_password, process.env.bcrypt_salt);
		if (user.password !== new_password) {
			if (user.e_approved)
				user.password = new_password;
			else
				await changePassword(req, user, new_password);
		}
	}
	user = await req.context.editUser(user);
	return req.context.database.models.user.secure(user);
};

module.exports = { handler, body_schema, auth: true };
