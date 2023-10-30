
let getHomepage = (req , res)=> {
     return res.render('homepage.ejs');
};
//
let getAboutpage = (req , res) => {
     return res.render('about.ejs');
}
module.exports = {getHomepage,getAboutpage};