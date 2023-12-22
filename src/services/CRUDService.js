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
//
let getAllUser = async () => {
  try {
    return await db.User.findAll({
      raw: true,
    });
  } catch (err) {
    return `Get user faild : ${err}`;
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
  } catch (err) {
    console.log(err);
    throw err; // Ném lỗi để xử lý sau này (nếu cần)
  }
};
//UpdataUserdata
const updateUserData = async (data) => {
  // console.log("id update", data.id);
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
  } catch (err) {
    console.log(`${err}`);
  }
};
const deleteOneUser = async (id) => {
  try {
    let action = db.User.destroy({
      where: { id },
      raw: true,
    });
    return "Delete success!";
  } catch (err) {
    console.log(`deleteOneUser():${err}`);
  }
};

module.exports = {
  createNewUser,
  getAllUser,
  findOneById,
  updateUserData,
  deleteOneUser,
};
