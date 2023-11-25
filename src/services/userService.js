import db from "../models/index";
import { hashPassword } from "../utils/passwordUtils";

const checkEmail = async (userEmail) => {
  try {
    let result = await db.User.findOne({
      where: { email: userEmail },
      raw: true,
    });
    console.log("resukt findone user:", result);
    return result;
  } catch (err) {
    // res.status(500).json({ success: false, error: `Internal Server Error"${err}"` });
    return `error "${err}"`;
  }
};
const getAllUsers = async (userId) => {
  try {
    let option = userId
      ? {
          where: { id: userId },
          attributes: { exclude: ["password"] },
          // raw: true,
        }
      : {};
    let users = await db.User.findAll(option);
    return users;
  } catch (error) {
    console.log("Loi khi lay nguoi dung ");
    throw error;
  }
};
const deleteUser = async (userId) => {
  try {
    const action = await db.User.destroy({
      where: { id: userId },
    });
    return action;
  } catch (error) {
    return error;
  }
};
const editUser = async (newUser) => {
  try {
    let user = await db.User.findOne({
      where: { id: newUser.id },
      raw: false,
    });
    if (user) {
      user.email = newUser.email;
      user.firstName = newUser.firstName;
      user.lastName = newUser.lastName;
      user.address = newUser.address;
      user.phoneNumber = newUser.phoneNumber;
      user.gender = newUser.gender;
      user.createdAt = newUser.createdAt;
      user.updatedAt = new Date();
      let result = await user.save();
      return result;
    } else {
      return user;
    }
  } catch (error) {
    throw error;
  }
};
const createUser = async (newUser) => {
  try {
    let hasPass = await hashPassword(newUser.password);
    console.log("hasPass:", hasPass);
    newUser.password = hasPass;
    const response = await db.User.create({
      email: newUser.email,
      password: newUser.password,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      address: newUser.address,
      phoneNumber: newUser.phoneNumber,
      gender: newUser.gender === "1" ? true : false,
      // raw: false,
      // image: newUser.STRING,
      // roleId: newUser.STRING,
      // positionId: newUser.STRING,
    });
    return response;
  } catch (err) {
    return `User creation failed :${err}`;
  }
};
module.exports = { checkEmail, getAllUsers, editUser, deleteUser, createUser };
