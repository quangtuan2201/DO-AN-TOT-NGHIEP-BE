import db from "../models/index";
import markdown from "../models/markdown";
// import dotenv from "dotenv";
require("dotenv").config();
import schedule from "../models/schedule";
import _ from "lodash";

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
      ],
      raw: true,
      nest: true,
    });
    return {
      errCode: 0,
      data: users.reverse(),
    };
  } catch (error) {
    return {
      errCode: 1,
      error: error.message,
    };
  }
};
// handle get All doctors
const handlAllDoctors = async () => {
  try {
    const response = await db.User.findAll({
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["password", "image"],
      },
      where: {
        roleId: "R2",
      },
      include: [
        {
          model: db.Markdown,
          attributes: ["description", "contentHTML", "contentMarkdown"],
        },
      ],
      // raw: true,
      // nest: true,
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
    console.log(
      `Fail call API get ALL doctor in doctorService ${error.message}`
    );
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
        const response = await db.Markdown.create(
          {
            doctorId: infoDoctor?.doctorId,
            clinicId: infoDoctor?.clinicId,
            specialtyId: infoDoctor?.specialtyId,
            contentHTML: infoDoctor?.contentHTML,
            contentMarkdown: infoDoctor?.contentMarkdown,
            description: infoDoctor?.description,
          }
          // {
          //   raw: true, // Thêm thuộc tính raw để trả về dữ liệu dưới dạng mảng thô
          // }
        );
        return {
          errCode: 0,
          data: response,
        };
      } else if (infoDoctor.action === "EDIT") {
        let doctorMarkdown = await db.Markdown.findOne({
          where: { doctorId: +infoDoctor?.doctorId },
          // raw: true,
        });
        if (doctorMarkdown) {
          doctorMarkdown.doctorId = infoDoctor?.doctorId;
          doctorMarkdown.clinicId = infoDoctor?.clinicId;
          doctorMarkdown.specialtyId = infoDoctor?.specialtyId;
          doctorMarkdown.contentHTML = infoDoctor?.contentHTML;
          doctorMarkdown.contentMarkdown = infoDoctor?.contentMarkdown;
          doctorMarkdown.description = infoDoctor?.description;
          await doctorMarkdown.save();
        }
        return {
          errCode: 0,
          data: doctorMarkdown,
        };
      }
    }
  } catch (error) {
    return {
      errCode: -1,
      message: `Fail create info doctor or update ${error.message}`,
    };
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
      response.image = new Buffer(response.image, "base64").toString("binary");
    }
    return {
      data: response,
      errCode: 0,
    };
  } catch (error) {
    console.error("Error get detail doctor :", error.message);
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
    // console.log("-----bookingInfoList:", bookingInfoList);
    // console.log(
    //   " doctorId: +doctorCode, date: bookingDate ",
    //   +doctorCode,
    //   ",,,",
    //   bookingDate
    // );
    //tìm kiếm tất cả bản ghi schedule dk doctorId và date
    let existing = await db.Schedule.findAll({
      where: { doctorId: +doctorCode, date: bookingDate },
      attributes: ["timeType", "date", "doctorId", "maxNumber"],
      raw: true,
    });
    // console.log("---existing:", existing);
    //convert type date từ datetime sang
    // if (existing && existing.length > 0) {
    //   existing = existing.map((item) => {
    //     item.date = new Date(item.date).getTime();
    //     return item;
    //   });
    // }
    //so sanh dư liệu gửi từ client với dữ liệu tìm trên db check xem có bị trùng
    let toCreate = _.differenceWith(bookingInfoList, existing, (a, b) => {
      return a.timeType === b.timeType && +a.date === +b.date;
    });
    console.log("---toCreate: ", toCreate);
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
        message: "FAIL! create schedule !",
      };
    }
  } catch (error) {
    return {
      errCode: -1,
      message: `${error}`,
    };
  }
};
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
      ],
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
module.exports = {
  getTopDoctorHome,
  handlAllDoctors,
  handleSaveInfoDoctor,
  handleGetDetailDoctorById,
  handleAllcodeScheduleHours,
  handlbulkCreateSchedule,
  handlefindScheduleByDate,
};
