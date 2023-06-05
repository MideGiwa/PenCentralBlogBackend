const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    eventTitle: {
      type: String,
      required: true,
    },
    titleImage: {
      type: String,
      required: true,
    },
    eventContent: {
      type: String,
      required: true,
    },
    eventImages: [
      {
        type: String,
        required: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const eventModel = mongoose.model("Event", eventSchema);
module.exports = eventModel;

