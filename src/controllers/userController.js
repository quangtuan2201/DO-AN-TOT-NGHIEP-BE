import db from "../models/index";
import userService from "../services/userService";
import hashPassword from "../utils/passwordUtils";

const handleLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    // console.log("Email:", email);
    // console.log("password: ", password);
    if (!email || !password) {
      return res.status.json({
        success: false,
        error: "The email or password field is blank",
      });
    }
    let user = await userService.checkEmail(email);
    // console.log("Ktra email đã tồn tại :", user);
    // const pass = await hashPassword.comparePasswords(password, user.password);
    // console.log(
    //   "check pass:",
    //   pass,
    //   "pasInput:",
    //   password,
    //   "passGetDb:",
    //   user.password
    // );
    const message = user
      ? (await hashPassword.comparePasswords(password, user.password))
        ? "Dang nhap thanh cong"
        : "Sai mat khau"
      : "Email khong hop le!";
    const status = user
      ? message.includes("Dang nhap thanh cong")
        ? 200
        : 401
      : 400;
    res.status(status).json({
      errCode: 0,
      message: message,
      data: user ? (message !== "Sai mat khau" ? user : {}) : {},
    });
  } catch (err) {
    res.status(500).json({
      errCode: -1,
      error: `Internal Server Error"${err}"`,
      user: {},
    });
  }
};
const handleGetUsers = async (req, res) => {
  let userId = req.query.id;
  const users = await userService.getAllUsers(userId);
  const response =
    users.length > 0
      ? {
          errCode: 0,
          message: "get users Success ",
          user: users,
        }
      : {
          errCode: 1,
          message: "get users fail",
          user: [],
        };
  return res.status(users.length > 0 ? 200 : 404).json(response);
};
const handleDeleteUser = async (req, res) => {
  const userId = req.query.id;
  // console.log(userId);
  const user = await userService.deleteUser(userId);
  // console.log("DELETE user :", user);
  const response = user
    ? {
        errCode: 0,
        message: "delete user success",
        userId: userId,
      }
    : {
        errCode: 1,
        message: "delete user fail",
        userId: undefined,
      };
  return res.status(user ? 200 : 404).json(response);
};
const handleEditUsers = async (req, res) => {
  const updateUser = req.body;
  // const user = await( userId ? userService.getAllUsers(userId.id):'UserId underfined');
  if (!updateUser.id) {
    res.status(400).json({ errCode: 1, error: "User ID is required" });
  }
  const newUser = await userService.editUser(updateUser);
  const response = newUser
    ? {
        errCode: 0,
        message: "Update user success",
        user: newUser,
      }
    : {
        errCode: 1,
        message: "Update user fail",
        user: {},
      };
  return res.status(newUser ? 200 : 404).json(response);
};
const handleCreateUser = async (req, res) => {
  const newUser = req.body;
  const createUser = await userService.createUser(newUser);
  // console.log("CREATE_USER in userController.js__1; ", createUser.dataValues);
  // console.log("CREATE_USER in userController.js__2", createUser);
  // console.log("CHECK", createUser.dataValues === createUser);
  const response = createUser
    ? {
        errCode: 0,
        message: "Create user success",
        user: createUser,
      }
    : {
        errCode: 1,
        message: "Creare user fail",
        user: {},
      };
  return res.status(createUser ? 200 : 400).json(response);
};
const handlGetAllCode = async (req, res) => {
  try {
    let nameField = req.query.type
      ? { type: "type", value: req.query.type }
      : { type: "keyMap", value: req.query.keyMap };
    let data = await userService.getAllCodeService(nameField);
    let response = {
      errCode: 0,
      data,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(` exception: ${error}`);
    return res.status(400).json({
      errCode: -1,
      errMessage: "Erroe form server !",
    });
  }
};
const handlUpdateUsers = async (req, res) => {
  try {
    const updateFields = req.body;
    if (!updateFields.id) {
      res.status(400).json({ errCode: 1, error: "'User ID is required'" });
    }
    const user = await userService.updateUser(updateFields);
    res.status(200).json({
      errCode: 0,
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ errCode: 1, error: "An error occurred while updating the user" });
  }
};

module.exports = {
  handleLogin,
  handleGetUsers,
  handleDeleteUser,
  handleEditUsers,
  handlUpdateUsers,
  handleCreateUser,
  handlGetAllCode,
};
