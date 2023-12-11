const Joi = require('joi');

const body_schema = Joi.object({
    name: Joi.string().required(),
    logo: Joi.string().allow(""),
    url: Joi.string().required(),
});

const handler = async (req) => {
    let user_id = req.user.id;
    let { id } = req.params;
    let { name, logo, url } = req.body;
    return await req.context.addOrUpdateLink(id, user_id, name, logo, url);
}

module.exports = { handler, body_schema, auth: true };