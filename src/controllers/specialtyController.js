import specialtyService from "../services/specialtyService";
const createNewSpecialty = async (req, res) => {
  try {
    const formData = req.body;
    const response = await specialtyService.handlCreateNewSpecialy(formData);
    if (response) {
      res.status(202).json(response);
    } else {
      res.status(404).json(response);
    }
  } catch (error) {
    res.status(404).json({
      errCode: -1,
      message: "Error form server.",
    });
  }
};
// Get all specialty
const getAllSpecialty = async (req, res) => {
  try {
    const response = await specialtyService.handlGetAllSpecialy();
    if (response) {
      res.status(202).json(response);
    } else {
      res.status(404).json(response);
    }
  } catch (error) {
    console.error(`Error form server, ${error.message}`);
    res.status(404).json({
      errCode: -1,
      message: `Error form server, ${error.message}`,
    });
  }
};
module.exports = {
  createNewSpecialty,
  getAllSpecialty,
};

// {
//      errCode: 0,
//      message: "Create specialty success.",
//      data: response,
//    }
