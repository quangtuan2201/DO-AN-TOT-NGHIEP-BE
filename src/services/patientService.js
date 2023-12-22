import db from "../models/index";
require("dotenv").config();
const nodemailer = require("nodemailer");
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
// let id = uuidv4();

const builURLEmail = (doctorId, token) => {
  let result = "";
  result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};
const handlSaveBookAppoientment = async (patientInfo) => {
  try {
    // console.log("patient InFo ", patientInfo);
    console.log("---------------------------");
    console.log("----------->  Info pateint service : ", patientInfo);
    console.log("---------------------------");
    if (
      !patientInfo.email ||
      !patientInfo.doctorId ||
      !patientInfo.timeType ||
      !patientInfo.date ||
      !patientInfo.fullName
    ) {
      return {
        errCode: 1,
        message: `Missing parameter !`,
      };
    } else {
      let token = uuidv4();
      await emailService.sendSimpleEmail({
        reciverEmail: patientInfo.email,
        patientName: patientInfo.fullName,
        time: patientInfo.timeString,
        doctorName: patientInfo.doctorName,
        language: patientInfo.language,
        redirectLink: builURLEmail(+patientInfo.doctorId, token),
      });
      const isUser = await db.User.findOrCreate({
        where: {
          email: patientInfo.email,
        },
        attributes: { exclude: ["password", "image"] },

        defaults: {
          email: patientInfo.email,
          roleId: "R3",
        },
        // raw: true,
      });
      console.log("==>>> IS USer: ", isUser);
      console.log("===>>> User booking : ", isUser[0].id);

      if (isUser && isUser[0]) {
        console.log("Check --> true");
        const response = await db.Booking.findOrCreate({
          where: { patientId: isUser[0].id },
          defaults: {
            statusId: "S1",
            doctorId: patientInfo.doctorId,
            patientId: isUser[0].id,
            date: patientInfo.date,
            timeType: patientInfo.timeType,
            token,
          },
        });
        console.log("response : ", response);
        return {
          errCode: 0,
          data: response,
          message: "Save info patient appientment success !",
        };
      } else {
        return {
          errCode: 1,
          message: "Save info patient appientment fail !",
        };
      }
    }
  } catch (error) {
    console.error("Save info book appointment fail !", error.message);
  }
};

//Xác minh lịnh hẹn đặt lịch khám bệnh
const handlSaveVerifyAppointment = async (data) => {
  try {
    const { token, doctorId } = data;
    console.log("data: ", data);
    if (!token || !doctorId) {
      return {
        errCode: 1,
        message: "Missing parameter !",
      };
    }
    let appointment = await db.Booking.findOne({
      where: {
        doctorId: +doctorId,
        token,
        statusId: "S1",
      },
      // raw: true,
    });
    console.log("Appointment: ", appointment);
    if (appointment) {
      await appointment.update({
        statusId: "S2",
      });
      return {
        errCode: 0,
        message: "Update the appientment success.",
      };
    } else {
      return {
        errCode: 2,
        messaage: "Appointment schedule has been activated or does not exist",
      };
    }
  } catch (error) {
    console.error("Error verify book appientment !");
  }
};

module.exports = {
  handlSaveBookAppoientment,
  builURLEmail,
  handlSaveVerifyAppointment,
};
//  statusId: patientInfo.statusId,
//  doctorId: patientInfo.doctorId,
//  patientid: patientInfo.patientId,
//  date: patientInfo.date,
//  timeType: patientInfo.timeType,
