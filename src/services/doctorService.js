import db from "../models/index";

const getTopDoctorHome = async (formLimit, roleId = "R2") => {
  try {
    let users = await db.User.findAll({
      limit: parseInt(formLimit),
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password", "image"] },
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

module.exports = {
  getTopDoctorHome,
};
