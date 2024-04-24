require("dotenv").config();
require("../config/db");
const express = require("express");
const cors = require("cors");
const userRoute = require("../routers/userRoute");
const blogRoute = require("../routers/blogRoute");
const eventRoute = require("../routers/eventRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    message: "API for PenCentral blog",
  });
});

app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1", eventRoute);

module.exports = app;
