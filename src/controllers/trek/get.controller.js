
const { StatusCodes } = require("http-status-codes");
const Trekking = require("../../models/trek.model");

// Getting all treks with all the filtration, sorting and pagination
const getTrek = async (req, res) => {
  try {
    const {
      country,
      search,
      updatedAt,
      difficulty,
      sort,
      visibility,
      excludeId,
      maxDays,
      location,
    } = req.query;

    const queryObject = {};

    if (country) {
      queryObject.country = country;
    }

    if (search) {
      queryObject.name = { $regex: search, $options: "i" };
    }

    if (difficulty && difficulty !== "all") {
      queryObject.difficulty = difficulty;
    }

    if (visibility === "all") {
      // No additional filter, admin wants to see all treks
    } else if (
      visibility === "isActivated" ||
      visibility === "isPopular" ||
      visibility === "isNewItem" ||
      visibility === "isFeatured"
    ) {
      queryObject[visibility] = "true";
    } else if (visibility === "notActivated") {
      queryObject.isActivated = "false";
    } else if (visibility === "notPopular") {
      queryObject.isPopular = "false";
    } else if (visibility === "notNewItem") {
      queryObject.isNewItem = "false";
    } else if (visibility === "notFeatured") {
      queryObject.isFeatured = "false";
    } else {
      // default: only show activated treks
      queryObject.isActivated = "true";
    }

    if (excludeId) {
      queryObject._id = { $ne: excludeId };
    }
    if (location) {
      queryObject.location = location;
    }

    let apiData = Trekking.find(queryObject);

    // Sorting
    let sorting = "";

    if (typeof sort === "string" && sort.trim().length > 0) {
      const validFields = [
        "name",
        "difficulty",
        "updatedAt",
        "createdAt",
        "price",
        "days.max",
        "days.min",
      ];
      const sortFields = sort
        .split(",")
        .filter((field) => validFields.includes(field.replace("-", "")));

      sorting = sortFields.join(" ");
      if (sorting) {
        apiData = apiData.sort(sorting);
      }
    } else {
      apiData = apiData.sort("-createdAt");
    }

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let skip = (page - 1) * limit;

    apiData = apiData.skip(skip).limit(limit);

    const totalTrekCount = await Trekking.countDocuments(queryObject);

    // Calculate total pages
    const totalPages = Math.ceil(totalTrekCount / limit);

    const trek = await apiData;

    if (!trek) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No trek found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Trek found",
      data: trek,
      totalPages,
      nbhits: trek.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {getTrek};
