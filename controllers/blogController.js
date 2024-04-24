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
      // .sort({ timestamps: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    if (!totalBlog) {
      res.status(404).json({
        status: "Failed",
        message: "Couldn't find any blog",
      });
    } else {
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
    }
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
        message: "Couldn't find any blog",
      });
    } else {
      res.status(200).json({
        status: "OK",
        data: blogs,
      });
    }
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
    if (blogs.length <= 0) {
      res.status(404).json({
        status: "Failed",
        message: "Couldn't find any blog",
      });
    }
    // get blog by category
    let label = req.query.label;
    label = label.toLowerCase();
    console.log(label);
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
    console.log(blog);
    console.log(label);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get all blogs by label
const allVisitorsBlogByLabel = async (req, res) => {
  try {
    const blogs = await blogModel.find();
    if (blogs.length <= 0) {
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
  if (!oneBlog) {
    res.status(404).json({
      message: "Couldn't find blog",
    });
  } else {
    res.status(200).json({
      status: "OK",
      data: oneBlog,
    });
  }
};

// post a blog
const createBlog = async (req, res) => {
  const { label, title, description, content } = req.body;
  const blog = new blogModel({
    label,
    title,
    description,
    content,
    author: req.userId,
    captionImage: req.files.captionImage[0].filename,
  });

  try {
    const newBlog = await blog.save();
    const user = await userModel.findById(req.userId);
    user.blogs.push(newBlog);
    await user.save();
    res.status(201).json({
      status: "OK",
      message: "Your blog has been created.",
      data: newBlog,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// update a blog
const updateBlog = async (req, res) => {
  // const blogs = await blogModel.find({ author: req.userId });
  const blogId = await blogModel.findById(req.params.id);
  try {
    const { label, title, description, content } = req.body;
    const bodyData = {
      label: label || blogId.label,
      title: title || blogId.title,
      description: description || blogId.description,
      content: content || blogId.content,
      author: req.userId,
      captionImage: blogId.captionImage,
    };

    // Check if eventImages are being updated
    if (req.files["captionImage"]) {
      //   track the image file
      const oldCaptionImagesPath = `uploads/${blogId.captionImage}`;
      if (fs.existsSync(oldCaptionImagesPath)) {
        fs.unlinkSync(oldCaptionImagesPath);
      }
      bodyData.captionImage = req.files["captionImage"][0].filename;
    }

    const updatedBlog = await blogModel.findByIdAndUpdate(blogId, bodyData, {
      new: true,
    });

    res.status(200).json({
      status: "OK",
      message: "Updated successfully.",
      data: updatedBlog,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// delete a blog post of a specific user
const deleteBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Blog post not found.",
      });
    }

    if (blog.author.toString() !== req.userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized request.",
      });
    }

    // const oldCaptionImagePath = `uploads/${blog.captionImage}`;
    const oldCaptionImagePath = `uploads/${blog.captionImage}`;
    if (fs.existsSync(oldCaptionImagePath)) {
      fs.unlinkSync(oldCaptionImagePath);
    }
    await blogModel.findByIdAndDelete(blogId);
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

// delete a blog post of visitors
const deleteVisitorsBlog = async (req, res) => {
  try {
    // const blog = await getBlog();
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        message: "Blog post not found.",
      });
    }

    const oldCaptionImagePath = `uploads/${blog.captionImage}`;
    if (fs.existsSync(oldCaptionImagePath)) {
      fs.unlinkSync(oldCaptionImagePath);
    }
    await blogModel.findByIdAndDelete(blogId);
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

module.exports = {
  everyBlog,
  allBlog,
  allBlogByLabel,
  allVisitorsBlogByLabel,
  singleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteVisitorsBlog,
};
