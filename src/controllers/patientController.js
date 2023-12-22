import patientService from "../services/patientService";
const saveBookAppointment = async (req, res) => {
  try {
    const patientInfo = req?.body;

    const response = await patientService.handlSaveBookAppoientment(
      patientInfo
    );
    if (response) {
      res.status(200).json(response);
    } else {
      res.json(404).json(response);
    }
  } catch (error) {
    console.error("Error from server: ", error.message);
    res.json(404).json({
      errorCode: -1,
      message: `Error from server ${error.message}`,
    });
  }
};
// [POST]: /api/verify-book-appointment
const saveVerifiyBookAppointment = async (req, res) => {
  try {
    const info = await patientService.handlSaveVerifyAppointment(req.body);
    if (info) {
      res.status(200).json(info);
    } else {
      res.status(400).json(info);
    }
  } catch (error) {
    res.status(404).json({
      errorCode: -1,
      message: `Error from server ${error.message}`,
    });
  }
};
module.exports = {
  saveBookAppointment,
  saveVerifiyBookAppointment,
};
