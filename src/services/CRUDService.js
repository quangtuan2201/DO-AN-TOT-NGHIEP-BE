const bcrypt = require("bcryptjs");
import db from "../models/index";
let salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  try {
    let hasPass = await hasPassword(data.password);
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
  } catch (error) {
    return `User creation failed :${error}`;
  }
};
let hasPassword = (password) => {
  return new Promise(async (resole, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resole(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};
//
let getAllUser = async () => {
  try {
    return await db.User.findAll({
      raw: true,
    });
  } catch (error) {
    return `Get user faild : ${error}`;
  }
};
//[edit-crud]
const findOneById = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
      raw: true,
    });

    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error.message);
    throw error; // Ném lỗi để xử lý sau này (nếu cần)
  }
};
//UpdataUserdata
const updateUserData = async (data) => {
  try {
    let user = await db.User.findOne({
      where: { id: data.id },
    });
    if (user) {
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.emaill = data.emaill; //
      user.phoneNumber = data.phoneNumber;
      // user.gender = data.phoneNumber;
      user.update = new Date();
      let result = await user.save();
    } else {
      res.send("Khong update duoc thong tin !");
    }
    return result;
  } catch (error) {
    console.log(`${error}`);
  }
};
const deleteOneUser = async (id) => {
  try {
    let action = db.User.destroy({
      where: { id },
      raw: true,
    });
    return "Delete success!";
  } catch (error) {
    console.error(`deleteOneUser():${err}`);
  }
};

module.exports = {
  createNewUser,
  getAllUser,
  findOneById,
  updateUserData,
  deleteOneUser,
};
