import express from "express";
import bodyParser from "body-parser";
import viewsEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
// import dotenv from "dotenv";
require("dotenv").config();
import connectDB from "./config/connectDB";
const cors = require("cors");
// require('dotenv').config();
// dotenv.config();

let app = express();
// console.log(app)
app.use(cors());
//
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// Middleware để xử lý giới hạn kích thước dữ liệu JSON
app.use(bodyParser.json({ limit: "50mb" }));
// Middleware để xử lý giới hạn kích thước tải lên
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
viewsEngine(app);
//khởi tạo tuyến đường
initWebRoutes(app);
// connect DB
connectDB();

let port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Backend NodeJS is running on the port ${port}`);
});
