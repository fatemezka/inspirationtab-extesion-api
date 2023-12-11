const Joi = require('joi');

const body_schema = Joi.object({
    completed: Joi.boolean().required(),
});

const handler = async (req) => {
    let user_id = req.user.id;
    let { id } = req.params;
    let { completed } = req.body;
    return await req.context.completeTodo(id, user_id, completed);
}

module.exports = { handler, body_schema, auth: true };