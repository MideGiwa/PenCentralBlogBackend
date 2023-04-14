const express = require("express");
const router = express.Router();
const {
  allBlog,
  allBlogByLabel,
  singleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const upload = require("../utils/multer");

// GET / all blog post
router.get("/blogs", authMiddleware, adminMiddleware, allBlog);

// GET / all blog post
router.get("/blogs/label", authMiddleware, adminMiddleware, allBlogByLabel);

// POST /create a blog post
router.post("/blogs", authMiddleware, adminMiddleware, upload, createBlog);

// GET /a blog post
router.get("/blogs/:id", authMiddleware, adminMiddleware, singleBlog);

// PATCH /update a blog post
router.patch("/blogs/:id", authMiddleware, adminMiddleware, upload, updateBlog);

// DELETE /delete a blog post
router.delete("/blogs/:id", authMiddleware, adminMiddleware, deleteBlog);

module.exports = router;
