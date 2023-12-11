const Joi = require('joi');

const body_schema = Joi.object({
    name: Joi.string().required(),
    value: Joi.string().required(),
});

const handler = async (req) => {
    let user_id = req.user.id;
    let { id } = req.params;
    let { name, value } = req.body;
    return await req.context.addOrUpdateSettings(id, user_id, name, value);
}

module.exports = { handler, body_schema, auth: true };