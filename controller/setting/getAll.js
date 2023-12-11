const handler = async (req) => {
    let user_id = req.user.id;
    return await req.context.getSettings(user_id);
};
  
module.exports = { handler, auth: true };