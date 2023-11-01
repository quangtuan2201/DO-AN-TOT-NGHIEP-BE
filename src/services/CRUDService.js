const bcrypt = require("bcryptjs");
import db from "../models/index";
let salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  try {
    let hasPass = await hasPassword(data.password);
    //     console.log("hasPass:", hasPass);
    data.password = hasPass;
    await db.User.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      gender: data.gender === "1" ? true : false,
      // image: data.STRING,
      // roleId: data.STRING,
      // positionId: data.STRING,
    });
    return "create user success";
  } catch (err) {
    return `User creation failed :${err}`;
  }
};
let hasPassword = (password) => {
  return new Promise(async (resole, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resole(hashPassword);
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = createNewUser;
