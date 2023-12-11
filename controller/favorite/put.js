const Joi = require('joi');

const body_schema = Joi.object({
    url: Joi.string().required(),
});

const handler = async (req) => {
    let user_id = req.user.id;
    let { id } = req.params;
    let { url } = req.body;
    return await req.context.addOrUpdateFavorite(id, user_id, url);
}

module.exports = { handler, body_schema, auth: true };