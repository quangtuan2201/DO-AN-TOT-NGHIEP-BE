const bcrypt = require("bcryptjs");

let salt = bcrypt.genSaltSync(10);
// Hàm mã hóa mật khẩu
const hashPassword = async (password) => {
  try {
    let hasPassword = await bcrypt.hashSync(password, salt);
    return hasPassword;
  } catch (error) {
    return `error:${error}`;
  }
};
// Hàm kiểm tra mật khẩu đã được mã hóa
const comparePasswords = async (inputPassword, hashedPassword) => {
  try {
    let match = await bcrypt.compare(inputPassword, hashedPassword);
    console.log("match password: ".match);
    return match;
  } catch (error) {
    return `error :${error}`;
  }
};
module.exports = {
  hashPassword,
  comparePasswords,
};
