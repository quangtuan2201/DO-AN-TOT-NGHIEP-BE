import clinicService from "../services/clinicService";
const saveInfoClinic = async (req, res) => {
  try {
    const infoClinicData = req.body;
    const response = await clinicService.handlSaveInfoClinic(infoClinicData);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json(response);
    }
  } catch (error) {
    res.json(500).json({
      errCode: -1,
      message: `Error from server ${error.message}`,
    });
  }
};
//[GET]: /api/get-all-clinic
const getAllClinic = async (req, res) => {
  try {
    const response = await clinicService.handlGetAllClinic();
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.log(`Error form server , ${error.message}`);
    res.status(500).json({
      errCode: -1,
      message: `Error from server , get All info clinic fail. ${error.message}`,
    });
  }
};
//[GET]: /api/get-info-clinic-by-id
const getInfoClinicById = async (req, res) => {
  try {
    const clinicId = req.query.id;
    if (!clinicId)
      res
        .status(404)
        .json({ errCode: 1, message: "Missing clinic id parameter." });
    const response = await clinicService.handlGetInfoClinicById(clinicId);
    if (response) {
      res.status(200).json(response);
    }
  } catch (error) {
    console.log(`Error form server , ${error.message}`);
    res.status(500).json({
      errCode: -1,
      message: `Error from server , get clinic by id fail ${error.message}`,
    });
  }
};
module.exports = {
  saveInfoClinic,
  getAllClinic,
  getInfoClinicById,
};
