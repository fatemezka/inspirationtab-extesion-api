const handler = async (req) => {
  return req.context.database.models.user.secure(req.user);
};

module.exports = { handler, auth: true };