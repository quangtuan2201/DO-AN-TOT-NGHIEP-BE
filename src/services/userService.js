import db from "../models/index";
const { Op } = require("sequelize");
import { hashPassword } from "../utils/passwordUtils";

const checkEmail = async (userEmail) => {
  try {
    let result = await db.User.findOne({
      attributes: ["id", "email", "roleId", "firstName", "lastName"],
      where: { email: userEmail },
      raw: true,
    });
    return result;
  } catch (err) {
    // res.status(500).json({ success: false, error: `Internal Server Error"${err}"` });
    throw `error "${err}"`;
  }
};
const getAllUsers = async (userId) => {
  try {
    let option = userId
      ? {
          where: { id: userId },
          attributes: { exclude: ["password"] },
          // raw: true,
        }
      : {
          attributes: { exclude: ["password"] },
        };
    let users = await db.User.findAll(option);
    return users;
  } catch (error) {
    console.error("Loi khi lay nguoi dung ");
    throw error;
  }
};
const deleteUser = async (userId) => {
  try {
    const action = await db.User.destroy({
      where: { id: userId },
    });
    return action;
  } catch (error) {
    throw error;
  }
};
const editUser = async (newUser) => {
  try {
    let user = await db.User.findOne({
      where: { id: newUser.id },
      attributes: { exclude: ["password"] },
      raw: false,
    });
    if (user) {
      user.email = newUser.email;
      user.firstName = newUser.firstName;
      user.lastName = newUser.lastName;
      user.address = newUser.address;
      user.phoneNumber = newUser.phoneNumber;
      user.gender = newUser.gender;
      user.image = newUser.image;
      user.roleId = newUser.roleId;
      user.positionId = newUser.positionId;
      user.createdAt = newUser.createdAt;
      user.updatedAt = new Date();
      let result = await user.save();
      return result;
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    throw error;
  }
};
const createUser = async (newUser) => {
  try {
    let hasPass = await hashPassword(newUser.password);
    newUser.password = hasPass;
    const response = await db.User.create(
      {
        email: newUser.email,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        address: newUser.address,
        phoneNumber: newUser.phoneNumber,
        // gender: newUser.gender === "M"
        gender:
          newUser.gender === "M"
            ? "M"
            : newUser?.gender === "F"
            ? "F"
            : newUser?.gender === "O"
            ? "O"
            : "",
        // raw: true,
        image: newUser.image,
        roleId: newUser.roleId,
        positionId: newUser.positionId,
      },
      {
        attributes: { exclude: ["password"] }, // Loại bỏ trường password từ kết quả trả về
      }
    );
    return response;
  } catch (err) {
    return `User creation failed :${err}`;
  }
};
const getAllCodeService = async (typeField) => {
  try {
    const type = typeField.type;
    const value = typeField.value;
    if (!typeField) {
      return {};
    }
    const response = await db.Allcode.findAll({
      where: { [type]: value },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
const updateUser = async (updateField) => {
  try {
    const existingUser = await db.User.findOne({
      where: { id: updateField.id },
      attributes: { exclude: ["password"] },
      // raw: true,
    });
    if (!existingUser) {
      throw new Error("User does not exist");
    }
    Object.keys(updateField).forEach((field) => {
      existingUser[field] = updateField[field];
    });
    existingUser.updatedAt = new Date();
    const updateUser = await existingUser.save();
    return updateUser;
  } catch (error) {
    throw error;
  }
};
//Lay thong tin chi tiet chuyen khoa bang id
const handlGetSearchResult = async (keyword) => {
  try {
    let results = [];
    const resultSpecialty = await db.Specialty.findAll({
      where: {
        name: {
          [Op.like]: `%${keyword}%`, // Tìm kiếm không phân biệt chữ hoa chữ thường
        },
      },
      // exclude: ["image", "createdAt", "updatedAt"],
      attributes: ["id", "name"],
      raw: true,
    });
    const resultClinic = await db.Clinic.findAll({
      where: {
        name: {
          [Op.like]: `%${keyword}%`, // Tìm kiếm không phân biệt chữ hoa chữ thường
        },
      },
      // exclude: ["image", "createdAt", "updatedAt"],
      attributes: ["id", "name"],
      raw: true,
    });
    const resultDoctor = await db.User.findAll({
      where: {
        roleId: "R2",
        [Op.or]: [
          {
            firstName: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            lastName: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      include: [
        {
          model: db.Allcode,
          as: "positionData",
          attributes: ["valueEn", "valueVn"],
        },
      ],
      attributes: ["id", "firstName", "lastName"],
      raw: true,
      nest: true,
    });

    if (Array.isArray(resultClinic) && resultClinic.length > 0) {
      let clinic = resultClinic.map((item) => {
        return {
          ...item,
        };
      });
      results.push({
        type: "clinic",
        result: clinic,
      });
    }
    if (Array.isArray(resultSpecialty) && resultSpecialty.length > 0) {
      let specialty = resultSpecialty.map((item) => {
        return {
          ...item,
        };
      });
      results.push({
        type: "specialty",
        result: specialty,
      });
    }
    if (Array.isArray(resultDoctor) && resultDoctor.length > 0) {
      let doctor = resultDoctor.map((item) => {
        return {
          ...item,
        };
      });
      results.push({
        type: "doctor",
        result: doctor,
      });
    }
    // const results = [...resultClinic, ...resultSpecialty];
    if (Array.isArray(results) && results.length > 0) {
      return {
        errCode: 0,
        message: "Specialty search success.",
        data: results,
      };
    } else {
      return {
        errCode: 1,
        message: "Specialty search fail.",
      };
    }
  } catch (error) {
    console.error("", error.message);
    return {
      errCode: 500,
      message: "Internal Server Error",
      error: error.message,
    };
  }
};
//Lay data thông ke ng dung dat lẹnh kham
// const handlGetStatisticsByDate = async ({
//   doctorId,
//   startDateTime,
//   endDateTime,
// }) => {
//   const STATUS_KEYS = ["S1", "S2", "S3", "S4"];
//   try {
//     console.log("FormDataa: ", { doctorId, startDateTime, endDateTime });
//     if (!doctorId || !startDateTime || !endDateTime) {
//       return {
//         errCode: -1,
//         message: `Missing param !`,
//       };
//     }
//     // let doctor = await db.Booking.findAll({
//     //   attributes: ["doctorId", "patientId", "statusId", "timeType", "date"],
//     //   where: {
//     //     doctorId: formData.doctorId,
//     //     statusId: "S3",
//     //     date: {
//     //       [Op.between]: [formData.startDateTime, formData.endDateTime],
//     //     },
//     //   },
//     //   raw: true,
//     // });
//     const isDoctors = doctorId==='ALL'?(
//       console.log()
//     )
//   : await db.Booking.findOne({ where: { doctorId } });
//     console.log("IsDoctor: ", isDoctor);

//     if (isDoctor) {
//       const getStatusCount = async (statusId) => {
//         return await db.Booking.count({
//           where: {
//             statusId,
//             date: { [Op.between]: [startDateTime, endDateTime] },
//           },
//           raw: true,
//         });
//       };

//       const successfulBookings = await getStatusCount("S3");
//       const confirmBookings = await getStatusCount("S2");
//       const canceledBookings = await getStatusCount("S4");
//       const unconfirmedBookings = await getStatusCount("S1");

//       return {
//         errCode: 0,
//         data: {
//           successfulBookings,
//           confirmBookings,
//           canceledBookings,
//           unconfirmedBookings,
//         },
//       };
//     } else {
//       return {
//         errCode: 1,
//         message: "Bác sĩ không có lịch đặt khám.",
//       };
//     }
//   } catch (error) {
//     throw error;
//   }
// };
const handlGetStatisticsByDate = async ({
  doctorId,
  startDateTime,
  endDateTime,
}) => {
  const STATUS_KEYS = ["S1", "S2", "S3", "S4"];
  try {
    if (!startDateTime || !endDateTime) {
      return {
        errCode: -1,
        message: "Missing startDateTime or endDateTime!",
      };
    }

    if (doctorId === "ALL") {
      const getStatusCount = async (statusId) => {
        return await db.Booking.count({
          where: {
            statusId,
            date: { [Op.between]: [startDateTime, endDateTime] },
          },
          raw: true,
        });
      };

      const statistics = {};

      for (const statusId of STATUS_KEYS) {
        statistics[statusId] = await getStatusCount(statusId);
      }

      return {
        errCode: 0,
        data: statistics,
      };
    } else {
      const isDoctor = await db.Booking.findOne({ where: { doctorId } });

      if (isDoctor) {
        const getStatusCount = async (statusId) => {
          return await db.Booking.count({
            where: {
              doctorId,
              statusId,
              date: { [Op.between]: [startDateTime, endDateTime] },
            },
            raw: true,
          });
        };

        const successfulBookings = await getStatusCount("S3");
        const confirmBookings = await getStatusCount("S2");
        const canceledBookings = await getStatusCount("S4");
        const unconfirmedBookings = await getStatusCount("S1");

        return {
          errCode: 0,
          data: {
            S1: unconfirmedBookings,
            S2: confirmBookings,
            S3: successfulBookings,
            S4: canceledBookings,
          },
        };
      } else {
        return {
          errCode: 1,
          message: "Bác sĩ không có lịch đặt khám.",
        };
      }
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  checkEmail,
  getAllUsers,
  editUser,
  updateUser,
  deleteUser,
  createUser,
  getAllCodeService,
  handlGetSearchResult,
  handlGetStatisticsByDate,
};
