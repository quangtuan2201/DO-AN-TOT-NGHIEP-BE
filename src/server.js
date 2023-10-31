import express from 'express';
import bodyParser from 'body-parser';
import viewsEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import dotenv  from 'dotenv';;
import connectDB from './config/connectDB';
// require('dotenv').config();
dotenv.config();

let app = express();
// console.log(app)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

viewsEngine(app);
//khởi tạo tuyến đường
initWebRoutes(app);
// connect DB
connectDB();

let port = process.env.PORT || 6969;
console.log(port)
app.listen(3000,()=>{
     console.log(`Backend NodeJS is running on the port ${port}`)
})

