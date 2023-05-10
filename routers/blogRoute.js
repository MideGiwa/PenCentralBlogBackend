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
  deleteVisitorsBlog,
  everyBlog,
} = require("../controllers/blogController");
const {
  authMiddleware,
  // superAdminMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const upload = require("../utils/multer");

// GET / all blog posts of all roles ( i.e, superadmin admin and user)
router.get("/visitors/blogs", everyBlog);

// GET / a blog post by all roles
router.get("/visitors/blogs/:id", singleBlog);

// GET / all blog post by label of all role
router.get("/visitors/blogs/label", allVisitorsBlogByLabel);

// DELETE / a blog of all role
router.delete("/visitors/blogs/:id", deleteVisitorsBlog);

// GET / all blog post of a specific user
router.get("/admin/blogs", authMiddleware, adminMiddleware, allBlog);

// POST /create a blog post by an admin
router.post(
  "/admin/blogs",
  authMiddleware,
  adminMiddleware,
  upload,
  createBlog
);

// GET / all blog post by label of an admin
router.get(
  "admin/blogs/label",
  authMiddleware,
  adminMiddleware,
  allBlogByLabel
);

// GET /a blog post by an admin
router.get("/admin/blogs/:id", authMiddleware, adminMiddleware, singleBlog);

// PATCH /update a blog post by an admin
router.patch(
  "/admin/blogs/:id",
  authMiddleware,
  adminMiddleware,
  upload,
  updateBlog
);

// DELETE /delete a blog post by an admin
router.delete("/admin/blogs/:id", authMiddleware, adminMiddleware, deleteBlog);

module.exports = router;
