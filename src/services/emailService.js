require("dotenv").config();
// const nodemailer = require("nodemailer");
// import nodemailer from "nodemailer";
const nodemailer = require("nodemailer");

const sendSimpleEmail = async (dataSend) => {
  console.log("receivers: ", dataSend);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  console.log("user: ", process.env.EMAIL_APP_PASSWORD);
  console.log("pass: ", process.env.EMAIL_APP);

  // async..await is not allowed in global scope, must use a wrapper
  // send mail with defined transport object
  //   console.log("transporter: ", transporter);
  const info = await transporter.sendMail({
    from: `nnguyentuananh2201@gmail.com`, // sender address
    to: dataSend.reciverEmail,
    subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
    text: "Hello world?", // plain text body
    html: getBodyHTMLEmail(dataSend),
  });
  return info;
};

const getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = ` <h3>Xin chào ${dataSend.patientName}! </h3>
    <p>Bạn nhận được vì trước đó bạn đã đặt lịch khám bệnh online trên BookingCare. </p>
    <p>Thông tin đặt lịch khám bệnh: </p>
    <div><b>Thời gian: ${dataSend.time}</b> </div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
    <p>Nếu các thông tin trên là đúng sự thật , vui lòng click vào đường link vui lòng
    click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.
    </p>
    <div>
   <a href=${dataSend.redirectLink} target="_blank">click here!</a> 
   <div>Xin chân thành cảm ơn !</div>
    </div>`;
  } else {
    result = `<h3>Dear ${dataSend.patientName}! </h3>
    <p>You receive it because you previously booked an online medical appointment on BookingCare. </p>
    <p>Information for scheduling medical examination: </p>
    <div><b>Time: ${dataSend.time}</b> </div>
    <div><b>Doctor: ${dataSend.doctorName}</b></div>
    <p>If the above information is true, please click on the link
    Click on the link below to confirm and complete the medical appointment booking procedure.
    </p>
    <div>
   <a href=${dataSend.redirectLink} target="_blank">click here!</a>
   <div>Thank you very much!</div>
    </div>`;
  }
  return result;
};

module.exports = {
  sendSimpleEmail,
  getBodyHTMLEmail,
};

// main().catch(console.error);
