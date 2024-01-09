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
    if (
      !patientInfo.email ||
      !patientInfo.doctorId ||
      !patientInfo.timeType ||
      !patientInfo.date ||
      !patientInfo.fullName ||
      !patientInfo.gender ||
      !patientInfo.address
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
      //upsert patient
      const isUser = await db.User.findOrCreate({
        where: {
          email: patientInfo.email,
        },
        attributes: { exclude: ["password", "image"] },

        defaults: {
          email: patientInfo.email,
          roleId: "R3",
          gender: patientInfo.gender,
          phoneNumber: patientInfo.phoneNumber,
          firstName: patientInfo.fullName,
          address: patientInfo.address,
        },
        // raw: true,
      });
      //create a booking record
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
    throw error;
  }
};

//Xác minh lịnh hẹn đặt lịch khám bệnh
const handlSaveVerifyAppointment = async (data) => {
  try {
    const { token, doctorId } = data;
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
        message: "Appointment schedule has been activated or does not exist",
      };
    }
  } catch (error) {
    console.error("Error verify book appientment !" + error.message);
    throw error;
  }
};
//lay thong tin benh nhan theo id va date
const handlGetListPatientForDoctor = async (doctorId, date) => {
  try {
    const response = await db.Booking.findAll({
      where: {
        statusId: "S2",
        doctorId,
        date,
      },
      include: [
        {
          model: db.User,
          as: "patientData",
          attributes: ["firstName", "email", "address", "phoneNumber"],
          include: [
            {
              model: db.Allcode,
              as: "genderData",
              attributes: ["valueVn", "valueEn"],
            },
          ],
        },
        {
          model: db.Allcode,
          as: "patientTimeType",
          attributes: ["valueVn", "valueEn"],
        },
      ],
      // raw: true,
      nest: true,
    });
    if (response && response.length > 0) {
      return {
        errCode: 0,
        data: response,
      };
    } else {
      return {
        errCode: 2,
        data: [],
      };
    }
  } catch (error) {
    console.log(`Error get list patient doctor, ${error.message}`);
    throw error;
  }
};

module.exports = {
  handlSaveBookAppoientment,
  builURLEmail,
  handlSaveVerifyAppointment,
  handlGetListPatientForDoctor,
};
//  statusId: patientInfo.statusId,
//  doctorId: patientInfo.doctorId,
//  patientid: patientInfo.patientId,
//  date: patientInfo.date,
//  timeType: patientInfo.timeType,
