import doctorService from "../services/doctorService";
const getTopDoctorHome = async (req, res) => {
  try {
    let limit = req?.query?.limit;
    let roleId = req?.query?.roleId;
    if (!limit) {
      limit = 10;
    }
    let response = await doctorService.getTopDoctorHome(limit, roleId);
    res.status(200).json(response);
  } catch (error) {
    console.error("error in doctorController :", error);
    return res.status(200).json({
      errCode: -1,
      message: "Erroe from server !",
    });
  }
};
module.exports = {
  getTopDoctorHome,
};
