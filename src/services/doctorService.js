import db from "../models/index";

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
    console.log("Doctor: ", users);
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
    console.log("response all doc: ", response);
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
    const response = await db.Markdown.create(
      {
        doctorId: infoDoctor?.doctorId,
        clinicId: infoDoctor?.clinicId,
        specialtyId: infoDoctor?.specialtyId,
        contentHTML: infoDoctor?.contentHTML,
        contentMarkdown: infoDoctor?.contentMarkdown,
        description: infoDoctor?.description,
      },
      {
        raw: true, // Thêm thuộc tính raw để trả về dữ liệu dưới dạng mảng thô
      }
    );
    console.log("response: ", response);
    if (response) {
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
  } catch (error) {
    throw error.message;
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
module.exports = {
  getTopDoctorHome,
  handlAllDoctors,
  handleSaveInfoDoctor,
  handleGetDetailDoctorById,
};
