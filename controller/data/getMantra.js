const handler = async (req) => {
    let { mantra } = await req.context.getRandom(null, null, true);
    return mantra;
};

module.exports = { handler, auth: true, auth_optional: true };