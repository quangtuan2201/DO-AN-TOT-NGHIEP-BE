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
  // console.log("user: ", process.env.EMAIL_APP_PASSWORD);
  // console.log("pass: ", process.env.EMAIL_APP);

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

const sendAttachment = async (dataSend) => {
  try {
    // console.log("sendAttachment: ", dataSend);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_APP,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    // console.log("user: ", process.env.EMAIL_APP_PASSWORD);
    // console.log("pass: ", process.env.EMAIL_APP);

    // async..await is not allowed in global scope, must use a wrapper
    // send mail with defined transport object
    //   console.log("transporter: ", transporter);
    const info = await transporter.sendMail({
      from: `nnguyentuananh2201@gmail.com`, // sender address
      to: dataSend.email,
      subject: "Kết quả đặt lịch khám bệnh ✔", // Subject line
      text: "Hello world?", // plain text body
      html: getBodyHTMLEmailRemedy(dataSend),
      attachments: [
        {
          filename: "patient.jpg",
          content: dataSend.imageBase64.split("base64,")[1],
          encoding: "base64",
        },
      ],
    });
    return info;
  } catch (error) {
    console.log("Error send confirm." + error.message);
    throw error;
  }
};
const getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = ` <h3>Xin chào ${dataSend.firstName}! </h3>
    <p>Bạn nhận được vì trước đó bạn đã đặt lịch khám bệnh online trên BookingCare thành công. </p>
    <p><strong>Thông tin đặt lịch khám bệnh:</strong> </p>
    <p><strong>Ghi chú:</strong>${dataSend.description}</p>
    <p>Thông tin đơn thuốc / hóa đơn được gửi trong file đính kèm </p>
    <div><i>Xin chân thành cảm ơn!</i></div>
  `;
  } else {
    result = `<h3>Dear ${dataSend.firstName}! </h3>
    <p>You receive it because you have previously successfully booked an online medical appointment on BookingCare. </p>
    <p><strong>Information for scheduling medical examination:</strong> </p>
    <p>Prescription / invoice information is sent in the attached file </p>
    <div><i>Thank you very much!</i></div>`;
  }
  return result;
};
const sendEmailCancel = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  // send mail with defined transport object
  //   console.log("transporter: ", transporter);
  const info = await transporter.sendMail({
    from: `BookingCare`, // sender address
    to: dataSend.email,
    subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
    text: "Hello world?", // plain text body
    html: getBodyHTMLEmailCancel(dataSend),
  });
  return info;
};
const getBodyHTMLEmailCancel = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = ` <h3>Xin chào ${dataSend.firstName}! </h3>
    <p>Bạn nhận được vì trước đó bạn đã đặt lịch khám bệnh online trên BookingCare đã bị hủy. </p>
    <p><strong>Lý do bị hủy:</strong>${dataSend.description} </p>
    <div><i>Bạn có thể liện hệ số điện thoại hostline để được hỗ trợ hoặc có thể đến trực tiếp cơ sở để nhận được tư vấn ! Xin chân thành cảm ơn!</i></div>
  `;
  } else {
    result = `<h3>Dear ${dataSend.firstName}! </h3>
    <p>You receive this because you previously booked an online medical appointment on BookingCare that was canceled. </p>
    <p><strong>Reason for cancellation:</strong>${dataSend.description} </p>
    <div><i>You can contact the hostline phone number for support or you can come directly to the facility to receive advice! Thank you very much!</i></div>`;
  }
  return result;
};

module.exports = {
  sendSimpleEmail,
  getBodyHTMLEmail,
  sendAttachment,
  getBodyHTMLEmailRemedy,
  sendEmailCancel,
  getBodyHTMLEmailCancel,
};
