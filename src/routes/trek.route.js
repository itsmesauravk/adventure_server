const express = require("express");

const uploader = require("../utils/Multer.js");
const { addTrek } = require("../controllers/trek/add.controller.js");
const { deleteTrek } = require("../controllers/trek/delete.controller.js");
const { editTrek } = require("../controllers/trek/edit.controller.js");
const { editTrekVisibility } = require("../controllers/trek/editVisibility.controller.js");
const { getSingleTrek } = require("../controllers/trek/getSingle.controller.js");
const { getTrek } = require("../controllers/trek/get.controller.js");

// Add these type definitions (converted to JS format)
const trekRoute = express.Router();

const uploadFields = [
  { name: "thumbnail", maxCount: 1 },
  { name: "routemapimage", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "video", maxCount: 1 },
  { name: "trekPdf", maxCount: 1 },
];

// Add trek
trekRoute.post(
  "/add-trek",
  uploader.fields(uploadFields),
  addTrek
);

// Get all trek + filter + pagination + sorting
trekRoute.get("/treks",  getTrek);

// Get single trek
trekRoute.get("/trek/:id", getSingleTrek);

// Get trek by slug
// trekRoute.get("/get-trek/:slug", async (req, res, next) => {
//   try {
//     await getTrekBySlug(req, res);
//   } catch (error) {
//     next(error);
//   }
// });

// Delete trek
trekRoute.delete("/delete-trek/:trekId", deleteTrek);

// Edit trek visibility
trekRoute.patch("/edit-trek-visibility/:trekId",editTrekVisibility);

// Get trek locations
// trekRoute.get("/get-trek-location", async (req, res, next) => {
//   try {
//     await getTrekLocation(req, res);
//   } catch (error) {
//     next(error);
//   }
// });

// Secure - Routes

// Edit trek
trekRoute.put(
  "/edit-trek",
  uploader.fields(uploadFields),
  editTrek
);

// Export the trekRoute
module.exports = {trekRoute};
