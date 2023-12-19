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
import doctorController from "../controllers/doctorController";

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
  router.get("/api/users", userController.handleGetUsers);
  //[PUT] :/api/edit-user
  router.put("/api/users", userController.handleEditUsers);
  //[PATH]
  router.patch("/api/users", userController.handlUpdateUsers);
  //[DELETE] /api/delte-user
  router.delete("/api/users", userController.handleDeleteUser);
  //[GET] /allcode
  router.get("/api/allcode", userController.handlGetAllCode);
  //[GET] //api/top-doctor-home
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  //[GET] //api/get-all-doctors
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);
  //[POST] /api/save-info-doctor
  router.post("/api/save-info-doctor", doctorController.saveInfoDoctor);
  //[GET] /api/detail-doctor
  router.get("/api/detail-doctor-by-id", doctorController.getDetailDoctorById);
  //[GET] /api/allcode-sechedule-hours
  router.get(
    "/api/allcode-schedule-hours",
    doctorController.allCodeScheduleHours
  );
  //[GET] /api/bukk-create-schedule
  router.post("/api/bulk-create-schedule", doctorController.bukkCreateSchedule);
  //[GET] /api/get-schedule-doctor-by-date
  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.getScheduleDoctorByDate
  );
  router.get(
    "/api/get-info-address-clinic",
    doctorController.getInfoAddressClinic
  );

  return app.use("/", router);
};
module.exports = initWebRoutes;
