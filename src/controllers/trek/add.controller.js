const { StatusCodes } = require("http-status-codes");
const slug = require("slugify");
const Trekking = require("../../models/trek.model.js");
const { uploadFile, uploadVideo } = require("../../utils/Cloudinary.js");


const addTrek = async (req, res) => {
  try {
    const {
      name,
      price,
      discount,
      country,
      minDays,
      maxDays,
      location,
      difficulty,
      groupSizeMin,
      groupSizeMax,
      startingPoint,
      endingPoint,
      accommodation,
      meal,
      bestSeason,
      overview,
      trekHighlights,
      itinerary,
      servicesCostIncludes,
      servicesCostExcludes,
      packingList,
      video,
      faq,
      note,
    } = req.body;

    const thumbnail = req.files?.thumbnail;
    const images = req.files?.images;
    const trekPdf = req.files?.trekPdf;
    const routemapimage = req.files?.routemapimage;

    if (
      !name ||
      !price ||
      !discount ||
      !country ||
      !minDays ||
      !maxDays ||
      !location ||
      !difficulty ||
      !groupSizeMin ||
      !groupSizeMax ||
      !startingPoint ||
      !endingPoint ||
      !accommodation ||
      !meal ||
      !bestSeason ||
      !overview
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    if (!["Easy", "Moderate", "Difficult"].includes(difficulty)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid difficulty level",
      });
    }

    if (!["Inclusive", "Exclusive"].includes(meal)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid meal type",
      });
    }

    if (trekHighlights) {
      const highlights = JSON.parse(trekHighlights);
      for (const highlight of highlights) {
        if (highlight.links) {
          for (const link of highlight.links) {
            if (!link.text || !link.url) {
              return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid links in trek highlights",
              });
            }
          }
        }
      }
    }

    let uploadedThumbnail;
    if (thumbnail) {
      const result = await uploadFile(thumbnail[0].path, "trekking/thumbnail");
      if (!result) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Error uploading thumbnail",
        });
      }
      uploadedThumbnail = result.secure_url;
    }

    let uploadedRouteMapImage;
    if (routemapimage) {
      const result = await uploadFile(routemapimage[0].path, "trekking/routemapimage");
      if (!result) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Error uploading route map image",
        });
      }
      uploadedRouteMapImage = result.secure_url;
    }

    const uploadedImages = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const result = await uploadFile(image.path, "trekking/images");
        if (result) {
          uploadedImages.push(result.secure_url);
        }
      }
    }

    let uploadedTrekPdf;
    if (trekPdf) {
      const result = await uploadFile(trekPdf[0].path, "trekking/pdf");
      if (result) {
        uploadedTrekPdf = result.secure_url;
      }
    }

    const nameSlug = slug(name);

    const newTrek = new Trekking({
      name,
      slug: nameSlug,
      price,
      discount,
      country,
      days: { min: minDays, max: maxDays },
      location,
      difficulty,
      groupSize: { min: groupSizeMin, max: groupSizeMax },
      startingPoint,
      endingPoint,
      accommodation: JSON.parse(accommodation),
      meal,
      bestSeason: JSON.parse(bestSeason),
      overview,
      thumbnail: uploadedThumbnail,
      routeMapImage: uploadedRouteMapImage,
      trekHighlights: JSON.parse(trekHighlights) || [],
      itinerary: JSON.parse(itinerary) || [],
      servicesCostIncludes: JSON.parse(servicesCostIncludes) || [],
      servicesCostExcludes: JSON.parse(servicesCostExcludes) || [],
      packingList: JSON.parse(packingList) || {
        general: [],
        clothes: [],
        firstAid: [],
        otherEssentials: [],
      },
      faq: JSON.parse(faq) || [],
      images: uploadedImages,
      video,
      note,
      trekPdf: uploadedTrekPdf,
    });

    const savedTrek = await newTrek.save();

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Trek added successfully",
      data: savedTrek,
    });
  } catch (error) {
    console.error("Error in addTrek:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

module.exports = {addTrek};
