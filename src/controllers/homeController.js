import db from '../models/index';
let getHomepage = async (req , res)=> {
     try{
          let data = await db.User.findAll();
           console.log('data',JSON.stringify(data));
          return res.render('homepage.ejs',{
               data : JSON.stringify(data),
          });
     }catch(err){
          console.log(`Get data failed :${err}`);
     }
    
};
//
let getAboutpage = (req , res) => {
     return res.render('about.ejs');
}
module.exports = {getHomepage,getAboutpage};