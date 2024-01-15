import handbookService from "../services/handbookService";

const createNewHanbook = async (req, res) => {
  try {
    const response = await handbookService.handleCreateNewHanbook(req.body);
    if (response) {
      res.status(202).json(response);
    } else {
      res.status(404).json(response);
    }
  } catch (error) {
    res.status(404).json({
      errCode: -1,
      message: `Error from server ${error.message}`,
    });
  }
};

const getAllHandBooks = async (req, res) => {
  try {
    const response = await handbookService.handleGetAllHandBooks();
    if (response) {
      res.status(202).json(response);
    } else {
      res.status(404).json(response);
    }
  } catch (error) {
    res.status(404).json({
      errCode: -1,
      message: `Error from server ${error.message}`,
    });
  }
};
const getDetailHanbook = async (req, res) => {
  try {
    const response = await handbookService.handlGetDetailHanbook(req.query.id);
    if (response) {
      res.status(202).json(response);
    } else {
      res.status(404).json(response);
    }
  } catch (error) {
    res.status(404).json({
      errCode: -1,
      message: `Error from server ${error.message}`,
    });
  }
};
//[GET]: /api/get-detail-hanbook
module.exports = {
  createNewHanbook,
  getAllHandBooks,
  getDetailHanbook,
};
