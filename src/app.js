const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");


//routes
const { trekRoute } = require("./routes/trek.route");




const app = express();

// Load environment variables
dotenv.config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://gna-admin-panel.vercel.app",
      "https://admin-goingnepaladventure.vercel.app",
      "http://localhost:3000",
      "https://www.goingnepaladventure.com",
    ],
    credentials: true,
  })
);
app.use(cookieParser());



// Routes

app.use("/api/v1/trekking", trekRoute);
// app.use("/api/v1/tour", tourRouter);
// app.use("/api/v1/wellness", wellnessRouter);
// app.use("/api/v1/blogs", blogRouter);
// app.use("/api/v1/plan-trip", planTripRouter);
// app.use("/api/v1/home", homeRouter);
// app.use("/api/v1/trips-and-tours", tripsAndToursRouter);
// app.use("/api/v1/activities", activitiesRouter);
// app.use("/api/v1/users", useDetailsRoutes);
// app.use("/api/v1/quote-and-customize", quoteAndCustomize);
// app.use("/api/v1/admin", adminRouter);
// app.use("/api/v1/booking", bookingRouter);

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GOING NEPAL ADVENTURE",
  });
});
//health check
app.get("/health", (req, res) => {
    res.status(200).json({
      status: "UP",
      message: "Service is running smoothly",
      timestamp: new Date().toISOString(),
    });
  });
  

  

// Global search route
// app.get("/api/v1/search", globalSearch);

module.exports = app;
