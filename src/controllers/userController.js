import db from "../models/index";
import userService from "../services/userService";
import hashPassword from "../utils/passwordUtils";

const handleLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
      return res.status.json({
        success: false,
        error: "The email or password field is blank",
      });
    }
    let user = await userService.checkEmail(email);
    console.log("Ktra email đã tồn tại :", user);
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
      success: status === 200,
      message: message,
      user: user ? (message !== "Sai mat khau" ? user : {}) : {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: `Internal Server Error"${err}"`,
      user: {},
    });
  }
};
const handleGetUsers = async (req, res) => {
  let userId = req.query.id;
  const users = await userService.getAllUsers(userId);
  console.log("users", users);
  // if (users.length > 0) {
  //   return res.status(200).json({
  //     errCode: 0,
  //     message: "get users Success ",
  //     data: users,
  //   });
  // } else {
  //   return res.status(404).json({
  //     errCode: 1,
  //     message: "get users fail",
  //     data: {},
  //   });
  // }
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
  console.log(userId);
  const user = await userService.deleteUser(userId);
  console.log("DELETE user :", user);
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
  const user = req.body;
  // const user = await( userId ? userService.getAllUsers(userId.id):'UserId underfined');
  const newUser = await userService.editUser(user);
  console.log("newUser:", newUser);
  const response = newUser
    ? {
        errCode: 0,
        message: "Update user success",
        user: newUser,
      }
    : {
        errCode: 1,
        message: "Update user fail",
        user: undefined,
      };
  return res.status(newUser ? 200 : 404).json(response);
};
const handleCreateUser = async (req, res) => {
  const newUser = req.body;
  console.log("nenUser", newUser);
  const createUser = await userService.createUser(newUser);
  console.log("createUser", createUser);
  const response = createUser
    ? {
        errCode: 0,
        message: "Create user success",
        user: newUser,
      }
    : {
        errCode: 1,
        message: "Creare user fail",
        user: {},
      };
  return res.status(createUser ? 200 : 400).json(response);
};

module.exports = {
  handleLogin,
  handleGetUsers,
  handleDeleteUser,
  handleEditUsers,
  handleCreateUser,
};
