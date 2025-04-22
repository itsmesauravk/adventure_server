
const { StatusCodes } = require("http-status-codes");
const Trekking = require("../../models/trek.model");

// Getting single treks

const getSingleTrek = async (req, res) => {
  try {
    const id = req.params.id;
    const trek = await Trekking.findById(id);

    if (!trek) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No trek found",
      });
    }

    if (trek) {
      trek.viewsCount += 1;
      await trek.save();
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Trek found",
      data: trek,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {getSingleTrek};
