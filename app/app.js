require("dotenv").config();
require("../config/db");
const express = require("express");
const cors = require("cors");
const userRoute = require("../routers/userRoute");
const blogRoute = require("../routers/blogRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    message: "API for ChamsAccess blog",
  });
});

app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);

module.exports = app;
