import { raw } from "body-parser";
import db from "../models/index";
import markdown from "../models/markdown";
// import dotenv from "dotenv";
require("dotenv").config();
import schedule from "../models/schedule";
import _, { includes } from "lodash";
import emailService from "./emailService";

// const max_number_schedule = dotenv.config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const getTopDoctorHome = async (limit, roleId = "R2") => {
  try {
    let users = await db.User.findAll({
      limit,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
      where: {
        roleId,
      },
      include: [
        {
          model: db.Allcode,
          as: "positionData",
          attributes: ["valueEn", "valueVn"],
        },
        {
          model: db.Allcode,
          as: "genderData",
          attributes: ["valueEn", "valueVn"],
        },
        {
          model: db.Doctor_Info,
          include: [
            {
              model: db.Specialty,
              as: "specialtyData",
              attributes: {
                exclude: ["image"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      raw: true,
      nest: true,
    });
    return {
      errCode: 0,
      data: users.reverse(),
    };
  } catch (error) {
    console.error(`Get top doctor fail, ${error.message}`);
    throw error;
  }
};
// handle get All doctors
const handlGetAllDoctors = async () => {
  try {
    const response = await db.User.findAll({
      order: [["createdAt", "ASC"]],
      attributes: {
        exclude: ["password", "image"],
      },
      where: {
        roleId: "R2",
      },
      include: [
        {
          model: db.Markdown,
          attributes: [
            "doctorId",
            "description",
            "contentHTML",
            "contentMarkdown",
          ],
        },
        {
          model: db.Doctor_Info,
          attributes: [
            "doctorId",
            "count",
            "priceId",
            "provinceId",
            "paymentId",
            "addressClinic",
            "nameClinic",
            "specialtyId",
            "clinicId",
            "note",
          ],
        },
        // {
        //   model: db.Allcode,
        //   as: "provinceData",
        //   attributes: ["valueEn", "valueVn"],
        // },
      ],
      raw: true,
      nest: true,
    });
    if (response && response.length > 0) {
      return {
        errCode: 0,
        data: response,
      };
    } else {
      return {
        errCode: 1,
        data: [],
      };
    }
    // if(response && response)
  } catch (error) {
    console.error(
      `Fail call API get ALL doctor in doctorService ${error.message}`
    );
    throw error;
  }
};
// Handle save info doctor
const handleSaveInfoDoctor = async (infoDoctor) => {
  try {
    if (
      !infoDoctor.doctorId ||
      !infoDoctor.contentMarkdown ||
      !infoDoctor.action
    ) {
      return {
        errCode: 1,
        message: "Missing parameter !",
      };
    } else {
      if (infoDoctor.action === "CREATE") {
        // console.log("CREATE !");
        const create_markdown = db.Markdown.create(
          {
            doctorId: infoDoctor?.doctorId,
            specialtyId: infoDoctor?.specialtyId,
            contentHTML: infoDoctor?.contentHTML,
            contentMarkdown: infoDoctor?.contentMarkdown,
            description: infoDoctor?.description,
          },
          {
            raw: true, // Thêm thuộc tính raw để trả về dữ liệu dưới dạng mảng thô
          }
        );
        const create_InfoDoctor = db.Doctor_Info.create(
          {
            doctorId: infoDoctor?.doctorId,
            priceId: infoDoctor?.priceId,
            provinceId: infoDoctor?.provinceId,
            paymentId: infoDoctor?.paymentId,
            addressClinic: infoDoctor?.addressClinic,
            nameClinic: infoDoctor?.nameClinic,
            note: infoDoctor?.note,
            clinicId: infoDoctor?.clinicId,
            specialtyId: infoDoctor?.specialtyId,
          },
          {
            raw: true,
          }
        );
        const [res_markdown, res_InfoDoctor] = await Promise.all([
          create_markdown,
          create_InfoDoctor,
        ]);
        return {
          errCode: 0,
          data: { ...res_markdown.dataValues, ...res_InfoDoctor.dataValues },
        };
      } else if (infoDoctor.action === "EDIT") {
        let doctorMarkdown = await db.Markdown.findOne({
          where: { doctorId: +infoDoctor?.doctorId },
          // raw: true,
        });
        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: +infoDoctor?.doctorId },
        });
        if (doctorMarkdown) {
          doctorMarkdown.doctorId = infoDoctor?.doctorId;
          doctorMarkdown.clinicId = infoDoctor?.clinicId;
          doctorMarkdown.contentHTML = infoDoctor?.contentHTML;
          doctorMarkdown.contentMarkdown = infoDoctor?.contentMarkdown;
          doctorMarkdown.description = infoDoctor?.description;
          await doctorMarkdown.save();
        }
        if (doctorInfo) {
          doctorInfo.doctorId = infoDoctor?.doctorId;
          doctorInfo.priceId = infoDoctor?.priceId;
          doctorInfo.paymentId = infoDoctor?.paymentId;
          doctorInfo.provinceId = infoDoctor?.provinceId;
          doctorInfo.addressClinic = infoDoctor?.addressClinic;
          doctorInfo.nameClinic = infoDoctor?.nameClinic;
          doctorInfo.count = infoDoctor?.count;
          doctorInfo.specialtyId = infoDoctor?.specialtyId;
          doctorInfo.clinicId = infoDoctor?.clinicId;
          doctorInfo.note = infoDoctor?.note;
          await doctorInfo.save();
        }
        return {
          errCode: 0,
          data: { ...doctorMarkdown.dataValues, ...doctorInfo.dataValues },
        };
      }
    }
    return infoDoctor;
  } catch (error) {
    console.error("Fail Create info doctor or update: ", error.message);
    throw error;
  }
};
//handle get detail doctor by id
const handleGetDetailDoctorById = async (doctorId) => {
  try {
    const response = await db.User.findOne({
      where: {
        id: doctorId,
      },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: db.Markdown,
          attributes: ["description", "contentHTML", "contentMarkdown"],
        },
        {
          model: db.Allcode,
          as: "positionData",
          attributes: ["valueEn", "valueVn"],
        },
      ],
      raw: true,
      nest: true,
    });
    if (response.image) {
      response.image = Buffer.from(response.image, "base64").toString("binary");
    }
    return {
      data: response,
      errCode: 0,
    };
  } catch (error) {
    console.error("Error get detail doctor :", error.message);
    throw error;
  }
};
//handle get allcode schedule houra
const handleAllcodeScheduleHours = async () => {
  try {
    const response = await db.Allcode.findAll({
      where: { type: "TIME" },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
    });
    if (response) {
      return response;
    }
  } catch (error) {
    console.error(`Error get alldata schedule hours ${error.message}`);
    throw error;
  }
};
//handl bulk create Schedule
const handlbulkCreateSchedule = async (data) => {
  try {
    const { doctorCode, bookingDate, bookingInfoList } = data;
    if (!doctorCode || !bookingDate || !bookingInfoList) {
      return {
        errCode: -1,
        message: "Mising required param!",
      };
    }
    if (bookingInfoList.length > 0) {
      bookingInfoList.map((item) => {
        item.maxNumber = +MAX_NUMBER_SCHEDULE;
        return item;
      });
    }
    //tìm kiếm tất cả bản ghi schedule dk doctorId và date
    let existing = await db.Schedule.findAll({
      where: { doctorId: doctorCode, date: bookingDate },
      attributes: ["timeType", "date", "doctorId", "maxNumber"],
      raw: true,
    });

    //so sanh dư liệu gửi từ client với dữ liệu tìm trên db check xem có bị trùng
    let toCreate = _.differenceWith(bookingInfoList, existing, (a, b) => {
      return a.timeType === b.timeType && +a.date === +b.date;
    });
    // console.log("---toCreate: ", toCreate);
    if (toCreate && toCreate.length > 0) {
      const response = await db.Schedule.bulkCreate(toCreate);
      return {
        errCode: 0,
        data: response,
        message: "OK",
      };
    } else {
      return {
        errCode: 1,
        message: "Fail! create schedule !",
      };
    }
  } catch (error) {
    console.error("Error create bulk schedule");
    throw error;
  }
};
//Tìm kiếm lịch khám
const handlefindScheduleByDate = async (doctorId, date) => {
  try {
    if (!doctorId || !date) {
      return {
        errCode: 1,
        message: "Mising required param!",
      };
    }
    const response = await db.Schedule.findAll({
      where: {
        doctorId,
        date,
      },
      include: [
        {
          model: db.Allcode,
          as: "timeTypeData",
          attributes: ["valueEn", "valueVn"],
        },
        {
          model: db.User,
          as: "doctorData",
          attributes: ["firstName", "lastName"],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
      nest: true,
    });
    if (!response) {
      return {
        errCode: 1,
        data: [],
      };
    } else {
      return {
        errCode: 0,
        data: response,
      };
    }
  } catch (error) {
    console.error("Fail get schedule doctor by date: ", error.message);
  }
};

//Lấy thông tin địa chỉ phòng khám
const handlGetInfoAddressClinic = async (doctorId) => {
  try {
    if (!doctorId) {
      throw new Error("The id parameter is required");
    }
    const response = await db.Doctor_Info.findOne({
      where: { doctorId },
      attributes: {
        exclude: ["id", "doctorId", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Allcode,
          as: "provinceData",
          attributes: ["valueEn", "valueVn"],
        },
        {
          model: db.Allcode,
          as: "paymentData",
          attributes: ["valueEn", "valueVn"],
        },
        {
          model: db.Allcode,
          as: "priceData",
          attributes: ["valueEn", "valueVn"],
        },
      ],
      raw: true,
      nest: true,
    });
    if (response) {
      return {
        errCode: 0,
        data: response,
      };
    } else {
      return {
        errCode: 1,
        message: "Id does not exist or for some reason",
      };
    }
  } catch (error) {
    console.error(`Get address info doctor fail ${error.message}`);
  }
};

// Lấy thông tin riêng tư của bác sĩ
const handleGetProfileDoctorById = async (doctorId) => {
  try {
    if (!doctorId) {
      return {
        errCode: 1,
        message: "Mising required param!",
      };
    }
    const response = await db.User.findOne({
      where: {
        id: +doctorId,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Allcode,
          as: "positionData",
          attributes: ["valueEn", "valueVn"],
        },
        {
          model: db.Markdown,
          attributes: ["description", "contentHTML", "contentMarkdown"],
        },
        {
          model: db.Doctor_Info,
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "paymentData",
              attributes: ["valueEn", "valueVn"],
            },
            {
              model: db.Allcode,
              as: "priceData",
              attributes: ["valueEn", "valueVn"],
            },
          ],
        },
      ],

      raw: true,
      nest: true,
    });
    if (response && response.image) {
      response.image = Buffer.from(response.image, "base64").toString("binary");
    }
    if (!response) {
      return {
        errCode: 1,
        data: [],
      };
    } else {
      return {
        errCode: 0,
        data: response,
      };
    }
  } catch (error) {
    console.error("Fail get profile doctor by id: ", error.message);
    throw error();
  }
};
// Send remedy
// const handlSendRemedy = async (data) => {
//   try {
//     console.log("form dat:a, ", data);
//     const { email, doctorId, patientId, timeType, status } = data;
//     if (!email || !doctorId || !patientId || !timeType || !status) {
//       return {
//         errCode: 1,
//         message: "Missing parameter.",
//       };
//     } else {
//       let appointment = await db.Booking.findOne({
//         where: { doctorId, patientId, timeType, statusId: "S2" },
//         raw: false,
//       });
//       if (appointment) {
//         if (status === "CONFIRM") {
//           appointment.statusId = "S3";
//           await appointment.save();
//           await emailService.sendAttachment(data);
//         } else if (status === "CANCEL") {
//           appointment.statusId = "S4";
//           await appointment.save();
//           await emailService.sendEmailCancel(data);
//         }
//       }
//       return {
//         errCode: 0,
//         message: "Confirm success",
//         data: appointment,
//       };

//       // else {
//       //   return {
//       //     errCode: 2,
//       //     message: "Confirm fail.",
//       //   };
//       // }
//     }
//   } catch (error) {
//     console.log(`Error:${error.message} `);
//     throw error;
//   }
// };
const handlSendRemedy = async (data) => {
  try {
    console.log("Thông tin xác nhận lịch hẹn : ", data);
    const { email, doctorId, patientId, timeType, status } = data;
    if (!email || !doctorId || !patientId || !timeType || !status) {
      return {
        errCode: 1,
        message: "Missing parameter.",
      };
    }

    const statusActions = {
      CONFIRM: {
        newStatus: "S3",
        emailFunction: emailService.sendAttachment,
      },
      CANCEL: {
        newStatus: "S4",
        emailFunction: emailService.sendEmailCancel,
      },
    };

    const appointment = await db.Booking.findOne({
      where: { doctorId, patientId, timeType, statusId: "S2" },
      raw: false,
    });

    if (appointment && statusActions[status]) {
      const action = statusActions[status];
      appointment.statusId = action.newStatus;
      await appointment.save();
      await db.History.create({
        doctorId: data.doctorId,
        patientId: data.patientId,
        description: data.description,
        files: data.imageBase64,
      });
      await action.emailFunction(data);
    }

    return {
      errCode: 0,
      message: "Confirm success",
      data: appointment,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getTopDoctorHome,
  handlGetAllDoctors,
  handleSaveInfoDoctor,
  handleGetDetailDoctorById,
  handleAllcodeScheduleHours,
  handlbulkCreateSchedule,
  handlefindScheduleByDate,
  handlGetInfoAddressClinic,
  handleGetProfileDoctorById,
  handlSendRemedy,
};
