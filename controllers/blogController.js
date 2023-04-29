const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");
const fs = require("fs");

// All blogs
const everyBlog = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const skip = (parseInt(page) - 1) * limit;
  const totalBlog = blogModel.length;
  try {
    const blogs = await blogModel
      .find()
      .sort({ timestamps: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    if (!blogs) {
      res.status(404).json({
        status: "Failed",
        message: "Couldn't find a blog",
      });
    }
    const count = await blogModel.countDocuments();
    res.status(200).json({
      status: "OK",
      data: blogs,
      totalBlog,
      page,
      limit,
      count,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get all blogs of a specific user
const allBlog = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized request." });
    }

    // get all blog
    const blogs = await blogModel.find({ author: req.userId });
    if (!blogs) {
      res.status(404).json({
        status: "Failed",
        message: "Couldn't find a blog",
      });
    }
    res.status(200).json({
      status: "OK",
      data: blogs,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get all blogs of a specific user by label
const allBlogByLabel = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized request." });
    }
    // get blog by label
    // get all blog
    const blogs = await blogModel.find({ author: req.userId });
    if (!blogs) {
      res.status(404).json({
        status: "Failed",
        message: "Couldn't find a blog",
      });
    }
    // get blog by category
    let label = req.query.label;
    label = label.toLowerCase();
    if (label) {
      const filteredPosts = blogs.filter((post) => post.label === label);

      res.status(200).json({
        status: "OK",
        data: filteredPosts,
      });
    } else {
      res.status(404).json({
        status: "Failed",
        message: "No blog with such label.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get a specific blog post
const singleBlog = async (req, res) => {
  const oneBlog = await blogModel.findById(req.params.id);
  res.status(200).json({
    status: "OK",
    data: oneBlog,
  });
};

// post a blog
const createBlog = async (req, res) => {
  const blog = new blogModel({
    label: req.body.label,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    author: req.userId,
    captionImage: req.file.path,
  });

  try {
    const newBlog = await blog.save();
    const user = await userModel.findById(req.userId);
    user.blogs.push(newBlog);
    await user.save();
    res.status(200).json({
      status: "OK",
      message: "Your blog has been created.",
      data: newBlog,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// update a blog
const updateBlog = async (req, res) => {
  const blogs = await blogModel.find({ author: req.userId });
  // console.log(blogs);

  // check for existing file
  if (req.file) {
    await fs.unlinkSync(blogs[0].captionImage);
  }

  try {
    const raw = {
      label: req.body.label,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.userId,
      captionImage: req.file.path,
    };

    const updatedBlog = await blogModel.findByIdAndUpdate(blogs, raw, {
      new: true,
    });

    // console.log(updatedBlog);

    res.status(200).json({
      status: "OK",
      message: "Updated successfully.",
      data: updatedBlog,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// delete a blog post
const deleteBlog = async (req, res) => {
  try {
    // const blog = await getBlog();
    const blog = await blogModel.findById(req.params.id);
    if (blog == null) {
      return res.status(404).json({
        message: "Blog post not found.",
      });
    }

    if (blog.author.toString() !== req.userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized request.",
      });
    }
    // remove the blog post
    await fs.unlinkSync(blog.captionImage);
    await blog.remove();
    console.log(blog);
    res.status(200).json({
      status: "Ok",
      message: "Blog post deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// middleware to get a specific blog post by ID
const getBlog = async (req, res, next) => {
  try {
    const blog = await blogModel.findById(req.params.id);
    if (blog == null) {
      return res.status(404).json({
        message: "Blog post not found.",
      });
    }

    if (blog.author.toString() !== req.userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized request.",
      });
    }

    res.blog = blog;
    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};


module.exports = {
  everyBlog,
  allBlog,
  allBlogByLabel,
  singleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
