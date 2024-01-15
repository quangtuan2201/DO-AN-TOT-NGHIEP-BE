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
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import handBookController from "../controllers/handBookController";

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
  //[GET] /api/specialty-search
  router.get("/api/search", userController.getSearchResult);
  //[GET] /allcode
  router.get("/api/allcode", userController.handlGetAllCode);
  //[GET]: get-statistics-by-date
  router.get("/api/get-statistics-by-date", userController.getStatisticsByDate);
  //[GET]:get-historys-booking-by-date
  router.get(
    "/api/get-historys-booking-by-date",
    userController.getHistorysByDate
  );
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
  //[GET] /api/get-profile-doctor-By-id
  router.get(
    "/api/get-profile-doctor-by-id",
    doctorController.getProfileDoctorById
  );
  //[GET] : /api/send-remedy
  router.post("/api/send-remeder", doctorController.sendRemedy);
  //[POST] /spi/patient-book-appintment]
  router.post(
    "/api/patient-book-appointment",
    patientController.saveBookAppointment
  );
  //[post]: /api/verify-book-appointment
  router.post(
    "/api/verify-book-appointment",
    patientController.saveVerifiyBookAppointment
  );
  //[post]: /api/create-new-specialty
  router.post(
    "/api/create-new-specialty",
    specialtyController.createNewSpecialty
  );
  //[GET] //api/get-all-specialty
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  //[GET] //api/get-all-specialty
  router.get("/api/get-specialty-by-id", specialtyController.getSpecialtyById);
  //[POST] /api/save-info-clinic
  router.post("/api/save-info-clinic", clinicController.saveInfoClinic);
  //[GET] //api/get-all-clinic
  router.get("/api/get-all-clinic", clinicController.getAllClinic);
  //[GET] //api/get-clinic-by-id
  router.get("/api/get-info-clinic-by-id", clinicController.getInfoClinicById);
  //[GET] //api/get-list-patient-for-doctor
  router.get(
    "/api/get-list-patient-for-doctor",
    patientController.getListPatientForDoctor
  );
  //[GET]: /api/create-new-handbook
  router.post("/api/create-new-handbook", handBookController.createNewHanbook);
  //[GET] : /api/get-all-handbooks
  router.get("/api/get-all-handbooks", handBookController.getAllHandBooks);
  //[GET]: /api/get-detail-hanbook
  router.get("/api/get-detail-hanbook", handBookController.getDetailHanbook);

  return app.use("/", router);
};
module.exports = initWebRoutes;
