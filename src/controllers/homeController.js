import db from "../models/index";
import createNewUser from "../services/CRUDService";
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
  console.log(req.body);
  let message = await createNewUser(req.body);
  console.log("message :", message);
  return res.send("post CRUD");
};

module.exports = { getHomepage, getAboutpage, getCreate, postCRUD };
