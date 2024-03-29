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
    const checkPass = await hashPassword.comparePasswords(
      password,
      user.password
    );
    const message = user
      ? (await hashPassword.comparePasswords(password, user.password))
        ? "Dang nhap thanh cong"
        : "Sai mat khau"
      : "Email khong hop le!";
    delete user.password;
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
  const user = await userService.deleteUser(userId);
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

//[GET]: /api/specialty-search
const getSearchResult = async (req, res) => {
  try {
    const keyword = req.query?.keyword;

    if (!keyword) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing parameter keyword in the request.",
      });
    }
    const response = await userService.handlGetSearchResult(keyword);
    return res.status(response.errCode === 0 ? 200 : 404).json(response);
  } catch (error) {
    res.status(404).json({
      errCode: -1,
      message: `Error form server ${error.message}`,
    });
  }
};

const getStatisticsByDate = async (req, res) => {
  try {
    const { doctorId, startDateTime, endDateTime } = req.query;
    const response = await userService.handlGetStatisticsByDate(req.query);
    response
      ? res.status(200).json(response)
      : {
          errCode: -1,
          message: `Get data Statistics by date fail `,
        };
  } catch (error) {
    res.status(404).json({
      errCode: -2,
      message: `Error from server ${error.message}`,
    });
  }
};
//
const getHistorysByDate = async (req, res) => {
  try {
    const response = await userService.handlGetHistoryBookingByDate(req.query);
    response
      ? res.status(200).json(response)
      : res.status(200).json({
          errCode: -1,
          message: "Get history by date fail",
        });
  } catch (error) {
    res.status(404).json({
      error: -2,
      message: `Error from server ${error.message}`,
    });
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
  getSearchResult,
  getStatisticsByDate,
  getHistorysByDate,
};
