const {Sequelize} = require('sequelize');
//passinf prameters separately (other dialects)
const sequelize = new Sequelize('test','root',null,{
     host : '127.0.0.1',
     dialect : 'mysql',
     logging : false,
});
let  connectDB = async () =>{
     try{
          await sequelize.authenticate();
          console.log('Connect Database Successfully !');
     }catch(error) {
          console.log(`Connect Database Failed : ${error} !`);
     }
}

module.exports = connectDB;