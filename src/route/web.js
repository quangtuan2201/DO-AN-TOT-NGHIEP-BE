import express, { Router } from "express";
import {
  getHomepage,
  getAboutpage,
  getCreate,
  postCRUD,
  getCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
} from "../controllers/homeController";
import userController from "../controllers/userController";

// console.log(getAboutpage);

let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/", getHomepage);
  router.get("/about", getAboutpage);
  router.get("/create", getCreate);
  router.post("/post-crud", postCRUD);
  router.get("/get-crud", getCRUD);
  router.get("/edit-crud", getEditCRUD);

  router.post("/put-crud", putCRUD);
  router.get("/delete-crud", deleteCRUD);

  //[URL: /api/login]
  router.post("/api/login", userController.handleLogin);
  //[POST] /api/users
  router.post("/api/users", userController.handleCreateUser);
  //[GET] : /api/get-all-users
  router.get("/api/get-all-users", userController.handleGetUsers);
  //[PUT] :/api/edit-user
  router.put("/api/users", userController.handleEditUsers);
  //[DELETE] /api/delte-user
  router.delete("/api/delete-user", userController.handleDeleteUser);
  return app.use("/", router);
};
module.exports = initWebRoutes;
