import express from "express";
import { getHomepage,getAboutpage} from "../controllers/homeController";
 console.log(getAboutpage);

let router = express.Router();
let initWebRoutes = (app) => {
     router.get('/',getHomepage);
     router.get('/about' , getAboutpage);
     return app.use('/',router);
}
module.exports = initWebRoutes;