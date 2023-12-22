import { render } from "ejs";
import db from "../models/index";
import {
  createNewUser,
  getAllUser,
  findOneById,
  updateUserData,
  deleteOneUser,
} from "../services/CRUDService";
import { hashPassword } from "../utils/passwordUtils";
// import { Json } from "sequelize/types/lib/utils";

//[url : / ]
let getHomepage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    //  console.log('data',JSON.stringify(data));
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (err) {
    console.log(`Get data failed :${err}`);
  }
};

//
let getAboutpage = (req, res) => {
  return res.render("about.ejs");
};

// [/create]
let getCreate = (req, res) => {
  return res.render("create.ejs");
};

//[/post-crud]
let postCRUD = async (req, res) => {
  // console.log(req.body);
  let message = await createNewUser(req.body);
  console.log("message :", message);
  return res.send("post CRUD");
};

//[/get-crud]
let getCRUD = async (req, res) => {
  let data = await getAllUser();
  return res.render("displayUser.ejs", { data });
};

//[/edit-crud]
let getEditCRUD = async (req, res) => {
  const recordId = req.query.id;
  // console.log("action:", action);

  if (recordId) {
    let user = await findOneById(recordId);
    res.render("editCRUD", { user: user });
    // res.status(200).json(itemEdit);
  } else {
    res.send("update user not found !");
  }
};

//put-crud
let putCRUD = async (req, res) => {
  let data = req.body;
  // console.log("user edit:", data);
  let updateUser = await updateUserData(data);
  res.redirect("/get-crud");
};
//deleteCRUD
let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  let result = await deleteOneUser(id);
  if (result) {
    console.log(result);
    // res.status(200).json(result);
    res.redirect("/get-crud");
  }
};

module.exports = {
  getHomepage,
  getAboutpage,
  getCreate,
  postCRUD,
  getCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
