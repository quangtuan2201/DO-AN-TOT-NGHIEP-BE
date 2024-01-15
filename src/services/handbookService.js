import db from "../models/index";
require("dotenv").config();
import _, { includes } from "lodash";
const handleCreateNewHanbook = async (formData) => {
  try {
    const { title, image, specialtyId, descriptionHTML, descriptionMarkdown } =
      formData;
    if (
      !title ||
      !image ||
      !specialtyId ||
      !descriptionHTML ||
      !descriptionMarkdown
    ) {
      return {
        errorCode: 1,
        mesage: "Missing parameter !",
      };
    }
    const response = await db.Hanbook.create({
      title,
      specialtyId,
      descriptionHTML,
      descriptionMarkdown,
      image,
    });
    if (response) {
      return {
        errCode: 0,
        data: response,
      };
    } else {
      return {
        errCode: 2,
        mesage: "Create new  handbook fail.",
      };
    }
  } catch (error) {
    throw error;
  }
};
const handleGetAllHandBooks = async () => {
  try {
    const response = await db.Hanbook.findAll({
      raw: true,
    });
    if (_.isEmpty(response)) {
      // Mảng rỗng
      return {
        errCode: 1,
        data: [],
      };
    } else {
      response.forEach((specialty) => {
        if (specialty.image) {
          specialty.image = Buffer.from(specialty?.image, "base64").toString(
            "binary"
          );
        }
      });
      return {
        errCode: 0,
        data: response,
      };
    }
  } catch (error) {
    throw error;
  }
};
//lay chi tiet cam nang
const handlGetDetailHanbook = async (id) => {
  try {
    if (!id) {
      return {
        errCode: 1,
        mesage: `missing id parameter`,
      };
    }
    const response = await db.Hanbook.findOne({
      where: { id },
      raw: true,
    });
    if (!_.isEmpty(response)) {
      if (response.image) {
        response.image = Buffer.from(response?.image, "base64").toString(
          "binary"
        );
      }
      return {
        errCode: 0,
        data: response,
      };
    } else {
      return {
        errCode: 2,
        data: {},
      };
    }
  } catch (error) {
    throw error;
  }
};
module.exports = {
  handleCreateNewHanbook,
  handleGetAllHandBooks,
  handlGetDetailHanbook,
};
