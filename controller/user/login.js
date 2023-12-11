const Joi = require('joi');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const body_schema = Joi.object({
    name: Joi.string().allow(""),
    email: Joi.string().required().email(),
    password: Joi.string().regex(PATTERN).required()
        .messages({
            "string.pattern.base": "Please select a password with a minimum of 8 characters least one upper and lower case character and at least one number and one special character."
        }),
    newsletter: Joi.boolean().allow(""),
});

const handler = async (req) =>
{
    let { name, email, password, newsletter } = req.body;
    password = await Bcrypt.hash(password, process.env.bcrypt_salt);
    let user = await req.context.getOrAddUser(name, email, password, newsletter);
    if (user.password !== password)
        req.throw(400, 'Invalid password.');
    const payload = { user_id: user.id, created_at: new Date() };
    let token = jwt.sign(payload, process.env.jwt_key);
    user = req.context.database.models.user.secure(user);
    return { token, user };
}

module.exports = { handler, body_schema, auth: false }