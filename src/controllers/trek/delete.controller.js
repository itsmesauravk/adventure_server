const { StatusCodes } = require("http-status-codes");

const { deleteImage } = require("../../utils/Cloudinary.js");
const Trekking = require("../../models/trek.model.js");


// Deleting single trek
const deleteTrek = async (req, res) => {
  try {
    const id = req.params.trekId;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid Request",
      });
    }

    const trek = await Trekking.findById(id);

    if (trek?.thumbnail) {
      await deleteImage(trek.thumbnail);
    }

    if (trek && trek.images && trek.images.length > 0) {
      // Using Promise.all to ensure all deletions complete
      await Promise.all(trek.images.map(async (image) => {
        await deleteImage(image);
      }));
    }

    const trekDelete = await Trekking.findByIdAndDelete(id);

    if (!trekDelete) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No trek found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Trek deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { deleteTrek };