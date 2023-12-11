const Joi = require('joi');

const body_schema = Joi.object({});

const handler = async (req) => {
    let user_id = req.user.id;
    let { id } = req.params;
    return await req.context.deleteLink(id, user_id);
}

module.exports = { handler, body_schema, auth: true };