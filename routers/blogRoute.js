const express = require("express");
const router = express.Router();
const {
  allBlog,
  allBlogByLabel,
  allVisitorsBlogByLabel,
  singleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  everyBlog,
} = require("../controllers/blogController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const upload = require("../utils/multer");

// GET / all blog posts of all roles ( i.e, superadmin admin and user)
router.get("/blogs", everyBlog);

// GET / a blog post by all roles
router.get("/visitors/blogs/:id", singleBlog);

// GET / all blog post by label of all role
router.get("/visitors/blogs/label", allVisitorsBlogByLabel);


// GET / all blog post of a specific user
router.get("/blogs/user", authMiddleware, adminMiddleware, allBlog);

// GET / all blog post by label of an admin
router.get("/blogs/label", authMiddleware, adminMiddleware, allBlogByLabel);

// POST /create a blog post by an admin
router.post("/blogs", authMiddleware, adminMiddleware, upload, createBlog);

// GET /a blog post by an admin
router.get("/admin/blogs/:id", authMiddleware, adminMiddleware, singleBlog);

// PATCH /update a blog post by an admin
router.patch("/blogs/:id", authMiddleware, adminMiddleware, upload, updateBlog);

// DELETE /delete a blog post by an admin
router.delete("/blogs/:id", authMiddleware, adminMiddleware, deleteBlog);

module.exports = router;
