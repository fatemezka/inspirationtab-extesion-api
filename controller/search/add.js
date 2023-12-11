const Joi = require('joi');

const body_schema = Joi.object({
	query: Joi.string().required()
});

const handler = async (req) =>
{
	let user_id;
	try
	{
		user_id = req.user.id;
	}
	catch {
		user_id = null;
	}
	
	let ip = req.getIP();
	let { query } = req.body;
	return req.context.addSearch(user_id, query, ip);
}

module.exports = { handler, body_schema, auth: true, auth_optional: true };