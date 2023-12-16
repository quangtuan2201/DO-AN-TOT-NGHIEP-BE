import doctorService from "../services/doctorService";
const getTopDoctorHome = async (req, res) => {
  try {
    let limit = req?.query?.limit;
    let roleId = req?.query?.roleId;
    if (!limit) {
      limit = 10;
    }
    // if(limit =='AllDoctor'){

    // }
    let response = await doctorService.getTopDoctorHome(+limit, roleId);
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      message: `Error from server ${error.message} !`,
    });
  }
};
//[GET] /api/get-all-doctors
const getAllDoctors = async (req, res) => {
  try {
    let response = await doctorService.handlAllDoctors();
    if (response && response.errCode === 0) {
      res.status(200).json(response);
    } else {
      res.status(204).json(response);
    }
  } catch (error) {
    res.status(400).jso({
      errCode: -1,
      message: `Error from server ${error.message} !`,
    });
  }
};
//[POST /api/save-info-doctor
const saveInfoDoctor = async (req, res) => {
  try {
    let newInfoDoctor = req.body;
    // console.log("new Info doctor: ", newInfoDoctor);
    if (newInfoDoctor) {
      const response = await doctorService.handleSaveInfoDoctor(newInfoDoctor);
      // console.log("data res controller: ", response);
      return response.data && response.errCode === 0
        ? res.status(201).json(response)
        : res.status(400).json(response);
    }
  } catch (error) {
    res.status(404).json({
      errCode: -1,
      message: `Error from server ${error.message} !`,
    });
  }
};
//[GET] /api/get-detail-doctor-by-id
const getDetailDoctorById = async (req, res) => {
  try {
    const doctorId = req.query.id;
    // console.log("Doctor ID: ", doctorId);
    if (!doctorId) {
      res
        .status(400)
        .json({ errCode: 1, message: "Missing requeid prsmeter!" });
    }
    const info = await doctorService.handleGetDetailDoctorById(doctorId);
    // console.log("InFo detail doctor: ", info);
    if (info.data && info.errCode === 0) {
      res.status(200).json({
        errCode: 0,
        data: info.data,
      });
    } else {
      res.status(202).json({
        errCode: 1,
        data: null,
      });
    }
  } catch (error) {
    return res.status(404).json({
      error: -1,
      message: `Error from server : ${error.message}`,
    });
  }
};
// [GET] /api/allcode-schedule-hours
const allCodeScheduleHours = async (req, res) => {
  try {
    const response = await doctorService.handleAllcodeScheduleHours();
    res.status(200).json({
      errCode: 0,
      data: response,
    });
    // if (response && response.data) {

    // }
  } catch (error) {
    res.status(400).json({
      errCode: -1,
      message: `Error from server !${error.message}`,
    });
  }
};
//[POST] /api/balk-create-schedule
const bukkCreateSchedule = async (req, res) => {
  try {
    let info = await doctorService.handlbulkCreateSchedule(req?.body);
    res.status(200).json({
      data: info.data,
      errCode: 0,
    });
  } catch (error) {
    res.status(400).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
//[GET] /api/get-schedule-doctor-by-date
const getScheduleDoctorByDate = async (req, res) => {
  try {
    const doctorId = req?.query?.doctorId;
    const date = req.query?.date;
    const response = await doctorService.handlefindScheduleByDate(
      doctorId,
      date
    );
    if (response) {
      res.status(200).json({
        errCode: 0,
        data: response.data,
      });
    } else {
      res.status(404).json({
        errCode: 1,
        message: "",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      errCode: -1,
      message: `Error form server !: ${error.message}`,
    });
  }
};
module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  saveInfoDoctor,
  getDetailDoctorById,
  allCodeScheduleHours,
  bukkCreateSchedule,
  getScheduleDoctorByDate,
};
