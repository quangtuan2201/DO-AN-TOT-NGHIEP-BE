import { raw } from "body-parser";
import db from "../models/index";
import { result } from "lodash";
const { Op } = require("sequelize");
require("dotenv").config();
const handlCreateNewSpecialy = async (formData) => {
  try {
    const { name, imageBase64, descriptionHTML, descriptionMarkdown } =
      formData;
    if (!name || !imageBase64 || !descriptionHTML || !descriptionMarkdown) {
      return {
        errorCode: 1,
        mesage: "Missing parameter !",
      };
    }
    const response = await db.Specialty.create({
      name,
      descriptionHTML,
      descriptionMarkdown,
      image: imageBase64,
    });
    if (response) {
      return {
        errCode: 0,
        data: response,
      };
    } else {
      return {
        errCode: 2,
        mesage: "Create specialt fail.",
      };
    }
  } catch (error) {
    return new Error(`${error.mesage}`);
  }
};
// Lấy tất cả danh sách chuyên khoa
const handlGetAllSpecialy = async () => {
  try {
    const response = await db.Specialty.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
    });
    if (!response || response.length === 0) {
      return {
        errCode: 1,
        message: "Get all specialty fail!",
      };
    }
    response.forEach((specialty) => {
      if (specialty.image) {
        specialty.image = Buffer.from(specialty.image, "base64").toString(
          "binary"
        );
      }
    });
    return {
      errCode: 0,
      message: "Get all specilty success!",
      data: response,
    };
  } catch (error) {
    console.error(`Error get all specialty , ${error.message}`);
    throw error;
  }
};
//Lay thong tin chi tiet chuyen khoa bang id
const handlGetSpecialtyById = async (specialtyId, location) => {
  try {
    let data = await db.Specialty.findOne({
      where: { id: specialtyId },
      attributes: ["descriptionHTML", "descriptionMarkdown"],
      raw: true,
    });
    if (data) {
      let doctorSpecilty = [];
      if (location === "ALL") {
        doctorSpecilty = await db.Doctor_Info.findAll({
          where: { specialtyId },
          attributes: ["doctorId", "provinceId"],
        });
      } else {
        //find by location
        doctorSpecilty = await db.Doctor_Info.findAll({
          where: { specialtyId, provinceId: location },
          attributes: ["doctorId", "provinceId"],
        });
      }

      data.doctorSpecilty = doctorSpecilty;
      return {
        errCode: 0,
        data,
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

module.exports = {
  handlCreateNewSpecialy,
  handlGetAllSpecialy,
  handlGetSpecialtyById,
};
