const userModel = require("../models/userModel");
const eventModel = require("../models/eventModel");
const fs = require("fs");

// All events
const everyEvent = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const skip = (parseInt(page) - 1) * limit;
  const totalEvent = eventModel.length;
  try {
    const events = await eventModel
      .find()
      .sort({ timestamps: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    if (!totalEvent) {
      res.status(404).json({
        status: "Failed",
        message: "Couldn't find any event",
      });
    } else {
      const count = await eventModel.countDocuments();
      res.status(200).json({
        status: "OK",
        data: events,
        totalEvent,
        page,
        limit,
        count,
        totalPages: Math.ceil(count / limit),
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get all events of a specific user
const allEvents = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized request." });
    }

    // get all event
    const events = await eventModel.find({ author: req.userId });
    if (events.length <= 0) {
      res.status(404).json({
        status: "Failed",
        message: "Couldn't find any event",
      });
    } else {
      res.status(200).json({
        status: "OK",
        data: events,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get all events of a specific user by eventTitle
const allEventByEventTitle = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized request." });
    }
    // const events = await eventModel.find({ author: req.userId });
    const events = await eventModel.find({ author: req.userId });
    console.log(events);
    if (events.length == 0) {
      return res.status(200).json({
        status: "OK",
        message: "No events available",
        data: [],
      });
    }

    const title = req.query.eventTitle;

    if (!title) {
      return res.status(400).json({
        status: "Failed",
        message: "No eventTitle provided.",
      });
    }

    const filteredEvents = events.filter(
      (event) => event.eventTitle.toLowerCase() === title.toLowerCase()
    );

    if (filteredEvents.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No event with such eventTitle.",
      });
    }

    res.status(200).json({
      status: "OK",
      data: filteredEvents,
    });

    //     const event = await eventModel.findOne({
    //       author: req.userId,
    //       eventTitle: { $regex: new RegExp(title, "i") },
    //     });

    //     if (!event) {
    //       return res.status(404).json({
    //         status: "Failed",
    //         message: "No event with such eventTitle.",
    //       });
    //     }

    //     res.status(200).json({
    //       status: "OK",
    //       data: event,
    //     });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get all blogs by label
const allVisitorsEventByEventTitle = async (req, res) => {
  try {
    const events = await blogModel.find();
    if (events.length <= 0) {
      res.status(404).json({
        status: "Failed",
        message: "Couldn't find any event",
      });
    }
    // get event by eventTitle
    let eventTitle = req.query.eventTitle;
    eventTitle = eventTitle.toLowerCase();
    if (eventTitle) {
      const filteredPosts = events.filter(
        (post) => post.eventTitle === eventTitle
      );

      res.status(200).json({
        status: "OK",
        data: filteredPosts,
      });
    } else {
      res.status(404).json({
        status: "Failed",
        message: "No blog with such eventTitle.",
      });
    }
    // console.log(event);
    // console.log(eventTitle);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get a specific event post
const singleEvent = async (req, res) => {
  const oneEvent = await eventModel.findById(req.params.id);
  res.status(200).json({
    status: "OK",
    data: oneEvent,
  });
};

// get a specific event post
const singleUserEvent = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized request." });
  }
  const oneEvent = await eventModel.findById(req.params.id);
  if (!oneEvent) {
    return res.status(404).json({
      message: "No event found.",
    });
  } else {
    res.status(200).json({
      status: "OK",
      data: oneEvent,
    });
  }
};

// post an event
const createEvent = async (req, res) => {
  const { eventTitle, eventContent } = req.body;
  const event = new eventModel({
    eventTitle,
    titleImage: req.files["titleImage"][0].filename,
    eventContent,
    eventImages: req.files["eventImages"].map((file) => file.filename),
    author: req.userId,
  });
  try {
    const savedEvent = await event.save();
    const user = await userModel.findById(req.userId);
    user.events.push(savedEvent);
    await user.save();
    res.status(201).json({
      status: "OK",
      message: "An event has been created.",
      data: savedEvent,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// delete a event post of a specific user
const deleteEvent = async (req, res) => {
  const eventId = req.params.id; // Assuming the event ID is passed as a parameter

  try {
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.author.toString() !== req.userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized request.",
      });
    }

    // Delete event images from the upload folder
    const imageFilenames = [...event.eventImages, event.titleImage];

    imageFilenames.forEach((filename) => {
      fs.unlink(`uploads/${filename}`, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });

    // Delete the document from the database
    await eventModel.findByIdAndDelete(eventId);

    res.status(200).json({
      status: "OK",
      message: "Event deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// delete a event post of visitors
const deleteVisitorsEvent = async (req, res) => {
  const eventId = req.params.id; // Assuming the event ID is passed as a parameter

  try {
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Delete event images from the upload folder
    const imageFilenames = [...event.eventImages, event.titleImage];

    imageFilenames.forEach((filename) => {
      fs.unlink(`uploads/${filename}`, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });

    // Delete the document from the database
    await eventModel.findByIdAndDelete(eventId);

    res.status(200).json({
      status: "OK",
      message: "Event deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// update a event
const updateEvent = async (req, res) => {
  const eventId = await eventModel.find({ author: req.userId });

  try {
    const { eventTitle, eventContent } = req.body;
    const updateFields = {
      eventTitle,
      eventContent,
    };

    // Check if titleImage is being updated
    if (req.files["titleImage"]) {
      updateFields.titleImage = req.files["titleImage"][0].filename;
    }

    // Check if eventImages are being updated
    if (req.files["eventImages"]) {
      updateFields.eventImages = req.files["eventImages"].map(
        (file) => file.filename
      );
    }

    const event = await eventModel.findByIdAndUpdate(eventId, updateFields, {
      new: true,
    });

    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  everyEvent,
  allEvents,
  allEventByEventTitle,
  allVisitorsEventByEventTitle,
  singleEvent,
  singleUserEvent,
  createEvent,
  deleteEvent,
  deleteVisitorsEvent,
  updateEvent,
};
