import express from "express";
import { getHomepage} from "../controllers/homeController";
// console.log(getHomepage);

let router = express.Router();
let initWebRoutes = (app) => {
     router.get('/',getHomepage);
     router.get('/home' , (req , res) =>{
          res.send("hello home!")     
     })
     return app.use('/',router);
}
module.exports = initWebRoutes;