import { raw } from "body-parser";
import db from "../models/index";
import markdown from "../models/markdown";
// import dotenv from "dotenv";
require("dotenv").config();
import schedule from "../models/schedule";
import _, { includes } from "lodash";

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
    console.error(`Get top doctor fail, ${error.message}`);
    throw error;
  }
};
// handle get All doctors
const handlGetAllDoctors = async () => {
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
      // console.log("response: ", response);
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
  // console.log("SaveInfoDoctor: ", infoDoctor);
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
        console.log("CREATE !");
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
            specialtyId: specialtyId,
          },
          {
            raw: true,
          }
        );
        const [res_markdown, res_InfoDoctor] = await Promise.all([
          create_markdown,
          create_InfoDoctor,
        ]);
        // console.log("====>> Res_markdown: ", res_markdown.dataValues);
        // console.log("----------------------");
        // console.log("====>> Res_InfoDoctor: ", res_InfoDoctor.dataValues);
        // console.log("---------------------");
        return {
          errCode: 0,
          data: { ...res_markdown.dataValues, ...res_InfoDoctor.dataValues },
        };
      } else if (infoDoctor.action === "EDIT") {
        console.log("EDIT !");
        let doctorMarkdown = await db.Markdown.findOne({
          where: { doctorId: +infoDoctor?.doctorId },
          // raw: true,
        });
        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: +infoDoctor?.doctorId },
        });
        // let [res_markdown , res_InfoDoctor] = await Promise.all([doctorMarkdown , doctorInfo ])
        // console.log("---res_markdown: ", doctorMarkdown);
        // console.log("----res_InfoDoctor: ", doctorInfo);
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
        message: "FAIL! create schedule !",
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
      // console.log("response : ", response);
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
    console.log(`Get address info doctor fail ${error.message}`);
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
      response.image = Buffer.from(specialty.image, "base64").toString(
        "binary"
      );
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
};
