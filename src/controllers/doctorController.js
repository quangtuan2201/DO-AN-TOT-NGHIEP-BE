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
    let response = await doctorService.handlGetAllDoctors();
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
    if (newInfoDoctor) {
      const response = await doctorService.handleSaveInfoDoctor(newInfoDoctor);
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
    if (!doctorId) {
      res
        .status(400)
        .json({ errCode: 1, message: "Missing requeid prsmeter!" });
    }
    const info = await doctorService.handleGetDetailDoctorById(doctorId);
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
        message: "Get shcedule hours success",
        data: response.data,
      });
    } else {
      res.status(404).json({
        errCode: 1,
        message: "Get schedule hours fail",
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
//[GET] /api/get-info-address-clinic
const getInfoAddressClinic = async (req, res) => {
  try {
    const doctorId = req?.query?.id;
    const response = await doctorService.handlGetInfoAddressClinic(doctorId);
    if (response.data && response.errCode === 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json(response);
    }
  } catch (error) {
    res.status(404).json({
      errCode: -1,
      message: `Error form server ${error.message}`,
    });
  }
};
//[GET] /api/get-profile-doctor-by-id
const getProfileDoctorById = async (req, res) => {
  try {
    const doctorId = req?.query?.doctorId;
    const response = await doctorService.handleGetProfileDoctorById(doctorId);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json(response);
    }
  } catch (error) {
    res.status(404).json({
      errCode: -1,
      message: `Error form server !: ${error.message}`,
    });
  }
};
//
const sendRemedy = async (req, res) => {
  try {
    const dataForm = req.body;

    const response = await doctorService.handlSendRemedy(dataForm);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json(response);
    }
  } catch (error) {
    console.error(`Error form server , send remmedy fail ${error.message}`);
    res.status(500).json({
      errCode: -1,
      message: `Error form server , send remmedy fail ${error.message}`,
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
  getInfoAddressClinic,
  getProfileDoctorById,
  sendRemedy,
};
