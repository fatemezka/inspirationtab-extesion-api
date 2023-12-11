const { time_operation } = require("namira");

function otpGenerator(length, digit) {
  if (!length)
    length = 6;
  if (!digit)
    digit = 3;
  let dig = [];
  for (let i = 0; i < digit; i++)
    dig[i] = parseInt(Math.random() * 9 + 1);
  let ans = '';
  for (let i = 0; i < length; i++)
    ans = ans + '' + dig[parseInt((Math.random() * dig.length))];
  return ans;
}

function waitTime(otp_wait_time, otp_max_attempt, user_otp_attempt) {
  let wait_time = parseInt(otp_wait_time);
  let extra_attempt = user_otp_attempt - otp_max_attempt;
  if (extra_attempt > 0)
    wait_time = Math.min(Math.pow(2, extra_attempt), 24) * 60;
  return wait_time;
}

async function onSafeRequest(otp_wait_time, otp_max_attempt, user_otp_time, user_otp_attempt, handler) {
  // check wait time        
  let wait_time = waitTime(otp_wait_time, otp_max_attempt, user_otp_attempt);
  let wait_date = time_operation.minutesAgo(wait_time);
  let next_time = time_operation.diffInSecond(user_otp_time, wait_date, false);
  if (next_time > 0) {
    return {
      error: 'Too many request, please try again in ' + next_time + ' seconds.',
      next_time
    };
  }
  await handler();
  wait_time = waitTime(otp_wait_time, otp_max_attempt, user_otp_attempt + 1);
  next_time = wait_time * 60;
  return { next_time };
}

async function onSafeVerify(req, code, otp_expire_time, otp_try_attempt, user_otp, user_otp_time, user_try_attempt, errorHandler, handler) {
  if (!user_otp)
    req.throw(403, "The OTP not generated yet.");

  if (user_otp_time < time_operation.minutesAgo(otp_expire_time))
    req.throw(403, "The OTP code expired. Please request again.");

  if (user_try_attempt > otp_try_attempt)
    req.throw(403, "The try limit attempt exceeded. Please request again.");

  if (user_otp !== code) {
    await errorHandler();
    req.throw(403, "Wrong code.");
  }
  await handler();
}

module.exports = {
  otpGenerator,
  onSafeRequest,
  onSafeVerify
}; 
