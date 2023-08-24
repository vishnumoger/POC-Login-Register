const otpGenerator = require('otp-generator');

const generateAndSaveOtp = async () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
 
  return otp;
};

module.exports = generateAndSaveOtp;
