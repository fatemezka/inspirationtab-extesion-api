const Joi = require('joi');

const body_schema = Joi.object({
    name: Joi.string(),
    date: Joi.string(),
    list: Joi.string(),
    completed: Joi.boolean()
});

const handler = async (req) => {
    let user_id = req.user.id;
    let { id } = req.params;
    let { name, date, list, completed } = req.body;
    return await req.context.addOrUpdateTodo(id, user_id, name, date, list, completed);
}

module.exports = { handler, body_schema, auth: true };