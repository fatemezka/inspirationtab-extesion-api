const Jwt = require("jsonwebtoken");

async function token_parser(req, jwt_key) {
    let token = req.headers['x-gg-jwt'];
    if (!token)
        req.throw(403, 'No Token.');
    // decode
    let decoded;
    try {
        decoded = Jwt.verify(token, jwt_key);
    }
    catch (err) {
        req.throw(403, 'Bad Token.');
    }
    let user = await req.context.getUser(decoded.user_id);
    return user;
}

module.exports = { token_parser };