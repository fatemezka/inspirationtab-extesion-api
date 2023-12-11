const handler = async (req) => {
	let { quote } = await req.context.getRandom(true, null, null);
	return quote;
};

module.exports = { handler, auth: true, auth_optional: true };