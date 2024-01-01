const { Sequelize } = require("sequelize");
//passinf prameters separately (other dialects)
const sequelize = new Sequelize("bookingcare", "root", null, {
  host: "127.0.0.1",
  dialect: "mysql",
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
  },
  logging: false,
});
let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connect Database Successfully !");
  } catch (error) {
    console.log(`Connect Database Failed : ${error} !`);
  }
};

module.exports = connectDB;
