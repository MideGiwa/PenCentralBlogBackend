const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/eventController");
const {
  authMiddleware,
  // superAdminMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const upload = require("../utils/multer");

// GET / all event posts of all roles ( i.e, superadmin admin and user)
router.get("/visitors/events", everyEvent);

// GET / a event post by all roles
router.get("/visitors/events/:id", singleEvent);

// GET / all event post by eventTitle of all role
router.get("/visitors/events/title", allVisitorsEventByEventTitle);

// DELETE / a event of all role
router.delete("/visitors/events/:id", deleteVisitorsEvent);

// GET / all event post of a specific user
router.get("/admin/events", authMiddleware, adminMiddleware, allEvents);

// POST /create a event post by an admin
router.post(
  "/admin/events",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "titleImage", maxCount: 1 },
    { name: "eventImages", maxCount: 10 },
  ]),
  createEvent
);

// GET / all event post by eventTitle of an admin
router.get(
  "/admin/events",
  authMiddleware,
  adminMiddleware,
  allEventByEventTitle
);

// GET /a event post by an admin
// router.get("/admin/events/:id", authMiddleware, adminMiddleware, singleEvent);

// GET /an event post by an admin
router.get(
  "/admin/events/:id",
  authMiddleware,
  adminMiddleware,
  singleUserEvent
);

// PATCH /update a event post by an admin
router.put(
  "/admin/events/:id",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "titleImage", maxCount: 1 },
    { name: "eventImages", maxCount: 10 },
  ]),
  updateEvent
);

// DELETE /delete a event post by an admin
router.delete(
  "/admin/events/:id",
  authMiddleware,
  adminMiddleware,
  deleteEvent
);

module.exports = router;
