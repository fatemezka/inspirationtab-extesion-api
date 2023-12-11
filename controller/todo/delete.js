const handler = async (req) => {
    let user_id = req.user.id;
    let { id } = req.params;
    return await req.context.deleteTodo(id, user_id);
};

module.exports = { handler, auth: true };