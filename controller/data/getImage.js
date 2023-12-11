const handler = async (req) => {
    let { image } = await req.context.getRandom(null, true, null);
    return image;
};

module.exports = { handler, auth: true, auth_optional: true };