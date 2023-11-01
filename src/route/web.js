import express from "express";
import {
  getHomepage,
  getAboutpage,
  getCreate,
  postCRUD,
} from "../controllers/homeController";
console.log(getAboutpage);

let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/", getHomepage);
  router.get("/about", getAboutpage);
  router.get("/create", getCreate);
  router.post("/post-crud", postCRUD);
  return app.use("/", router);
};
module.exports = initWebRoutes;
