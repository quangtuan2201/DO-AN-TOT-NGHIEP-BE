import { raw } from "body-parser";
import db from "../models/index";
require("dotenv").config();

const handlSaveInfoClinic = (infoClinic) => {
  try {
    // console.log("Form data info clinic: ", infoClinic);
    const response = db.Clinic.create(
      {
        address: infoClinic?.address,
        name: infoClinic?.name,
        image: infoClinic?.imageBase64,
        descriptionMarkdown: infoClinic?.descriptionMarkdown,
        descriptionHTML: infoClinic?.descriptionHTML,
      },
      {
        raw: true, // Thêm thuộc tính raw để trả về dữ liệu dưới dạng mảng thô
      }
    );
    console.log("Save info clinic : ", response);
    return {
      errCode: 0,
      data: response,
    };
    //     if (response) {
    //       return response;
    //     }
  } catch (error) {
    console.error(`error from server ${error.message}`);
    throw error;
  }
};
//Lay danh dach phòng khám
const handlGetAllClinic = async () => {
  try {
    const response = await db.Clinic.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
    });

    if (response && response.length > 0) {
      // Kiểm tra phản hồi có hợp lệ trước khi xử lý

      let listClinic = response.map((item) => {
        if (item.image) {
          // Kiểm tra xem item.image có phải là chuỗi base64 không
          item.image = Buffer.from(item.image, "base64").toString("binary");
        }
        console.log("Item image: ", item.image);
        return item; // Trả về item đã được sửa đổi
      });

      console.log("listClinic: ", listClinic);

      return {
        errCode: 0,
        message: "Lấy thông tin tất cả phòng khám thành công.",
        data: listClinic, // Trả về mảng đã được sửa đổi
      };
    } else {
      console.log("Không tìm thấy phòng khám.");
      return {
        errCode: 1,
        message: "Không tìm thấy phòng khám.",
        data: null,
      };
    }
  } catch (error) {
    console.log("Lỗi khi lấy thông tin tất cả phòng khám.");
    throw error;
  }
};

//lay thong tin phong kham bang id
const handlGetInfoClinicById = async (clinicId) => {
  try {
    const response = await db.Clinic.findOne({
      where: { id: clinicId },
      raw: true,
    });
    console.log("response: ", response);
    if (response) {
      // Kiểm tra response trước khi thực hiện xử lý image
      if (response.image) {
        response.image = Buffer.from(response.image, "base64").toString(
          "binary"
        );
      }

      return {
        errCode: 0,
        message: "Get info clinic by id success.",
        data: response,
      };
    } else {
      return {
        errCode: 1,
        message: "Clinic not found.",
        data: null,
      };
    }
  } catch (error) {
    console.log("Get clinic by id failed: " + error.message);
    throw error;
  }
};

module.exports = {
  handlSaveInfoClinic,
  handlGetAllClinic,
  handlGetInfoClinicById,
};
