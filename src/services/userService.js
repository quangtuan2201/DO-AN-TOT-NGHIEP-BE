import db from "../models/index";
import { hashPassword } from "../utils/passwordUtils";

const checkEmail = async (userEmail) => {
  try {
    let result = await db.User.findOne({
      attributes: ["email", "roleId", "firstName", "lastName"],
      where: { email: userEmail },
      raw: true,
    });
    return result;
  } catch (err) {
    // res.status(500).json({ success: false, error: `Internal Server Error"${err}"` });
    throw `error "${err}"`;
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
      : {
          attributes: { exclude: ["password"] },
        };
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
    throw error;
  }
};
const editUser = async (newUser) => {
  try {
    let user = await db.User.findOne({
      where: { id: newUser.id },
      attributes: { exclude: ["password"] },
      raw: false,
    });
    console.log("newUser:", newUser);
    if (user) {
      user.email = newUser.email;
      user.firstName = newUser.firstName;
      user.lastName = newUser.lastName;
      user.address = newUser.address;
      user.phoneNumber = newUser.phoneNumber;
      user.gender = newUser.gender;
      user.image = newUser.image;
      user.roleId = newUser.roleId;
      user.positionId = newUser.positionId;
      user.createdAt = newUser.createdAt;
      user.updatedAt = new Date();
      let result = await user.save();
      return result;
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    throw error;
  }
};
const createUser = async (newUser) => {
  // console.log("NEW USER ; ", newUser);
  try {
    let hasPass = await hashPassword(newUser.password);
    newUser.password = hasPass;
    const response = await db.User.create(
      {
        email: newUser.email,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        address: newUser.address,
        phoneNumber: newUser.phoneNumber,
        // gender: newUser.gender === "M"
        gender:
          newUser.gender === "M"
            ? "M"
            : newUser?.gender === "F"
            ? "F"
            : newUser?.gender === "O"
            ? "O"
            : "",
        // raw: true,
        image: newUser.image,
        roleId: newUser.roleId,
        positionId: newUser.positionId,
      },
      {
        attributes: { exclude: ["password"] }, // Loại bỏ trường password từ kết quả trả về
      }
    );
    console.log("RESPONSE: ", response);
    return response;
  } catch (err) {
    return `User creation failed :${err}`;
  }
};
const getAllCodeService = async (typeField) => {
  try {
    console.log("typeField");
    const type = typeField.type;
    const value = typeField.value;
    if (!typeField) {
      return {};
    }
    const response = await db.Allcode.findAll({
      where: { [type]: value },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
const updateUser = async (updateField) => {
  try {
    const existingUser = await db.User.findOne({
      where: { id: updateField.id },
      attributes: { exclude: ["password"] },
      // raw: true,
    });
    if (!existingUser) {
      throw new Error("User does not exist");
    }
    Object.keys(updateField).forEach((field) => {
      existingUser[field] = updateField[field];
    });
    existingUser.updatedAt = new Date();
    const updateUser = await existingUser.save();
    return updateUser;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  checkEmail,
  getAllUsers,
  editUser,
  updateUser,
  deleteUser,
  createUser,
  getAllCodeService,
};
