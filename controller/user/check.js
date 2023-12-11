const Joi = require("joi");

const body_schema = Joi.object({
	email: Joi.string().email().required()
});

const handler = async (req) => {
	let { email } = req.body;
	let user = await req.context.getModel("user", null, null, { where: { email } }, true);
	if (user)
		return req.context.database.models.user.secure(user);
	return false;
};

module.exports = { handler, body_schema, auth: false };