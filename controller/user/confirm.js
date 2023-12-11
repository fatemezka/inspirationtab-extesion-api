const Joi = require("joi");
const { onSafeVerify } = require('../../util/otp_operation');

const query_schema = Joi.object({
  otp: Joi.string().min(6).max(6).required()
});

const handler = async (req) => {
  let { user_id } = req.params;
  let { otp } = req.query;
  let user = await req.context.getUser(user_id);
  if (!user)
    req.thow(404, "User not found.");

  await onSafeVerify(
    req,
    otp,
    process.env.e_otp_expire_time,
    process.env.e_try_max_attempt,
    user.e_otp,
    user.e_otp_time,
    user.e_try_attempt,
    async () => {
      user.e_try_attempt++;
      await req.context.editUser(user);
    },
    async () => {
      user.e_otp = null;
      user.e_otp_time = null;
      user.e_otp_attempt = 0;
      user.e_approved = true;
      user.password = user.new_password;
      user.new_password = null;
      await req.context.editUser(user);
    });
  return null;
};

module.exports = { handler, query_schema, auth: false };