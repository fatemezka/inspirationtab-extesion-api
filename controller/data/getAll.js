const handler = async (req) => {
	return await req.context.getRandom(true, true, true);
};

module.exports = { handler, auth: true, auth_optional: true };
