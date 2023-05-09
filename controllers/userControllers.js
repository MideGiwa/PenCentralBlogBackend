const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// array to store the token when removed from the header
const blacklist = [];

// sign up user
const signUp = async (req, res, next) => {
  try {
    // if (req.userRole !== "superadmin") {
    //   return res.status(401).json({ message: "Unauthorized request." });
    // }
    const { username, email, password, role } = req.body;
    const checkUser = await userModel.findOne({ email });
    if (checkUser) {
      res.status(200).json({
        message: `user with this email: ${checkUser.email} already exist.`,
      });
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const raw = {
        username,
        email,
        password: hashedPassword,
        role,
      };
      const user = await userModel.create(raw);
      if (!user) {
        res.status(400).json({
          message: "Can not create user.",
        });
      } else {
        res.status(201).json({
          status: "success",
          data: user,
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// user login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!email) {
      res.status(200).json({
        message: "user does not exist.",
      });
    }
    const checkPasswordMatch = await bcrypt.compare(password, user.password);
    if (!checkPasswordMatch) {
      res.status(400).json({
        message: "wrong password.",
      });
    }
    // generate a token for logged in user
    const token = generateToken(user);

    res.status(200).json({
      message: " You are logged in successfully.",
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// sign out user
const signOut = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    blacklist.push(token);
    // res.redirect('/users/login');
    res.status(200).json({
      status: "Success",
      message: "Logged out successfully.",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// function that generates a token
const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "2h" }
  );
  return token;
};

// show all users except the superuser
const getUsers = async (req, res) => {
  try {
    const users = await userModel
      // .find();
      .find({ role: { $in: ["admin", "user"] } })
      .populate("blogs");
    if (users.length < 1) {
      res.status(404).json({
        message: "No users found",
      });
    }
    res.status(200).json({
      status: "OK",
      data: users,
      numberOfUsers: users.length,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// single user
const getOneUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({
        status: "OK",
        message: `User with id: ${userId} is not found.`,
      });
    }
    res.status(200).json({
      status: "OK",
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// update user
const updateUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const userId = req.params.userId;
    saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedRaw = {
      username,
      email,
      password: hashedPassword,
      role,
    };
    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedRaw, {
      new: true,
    });
    // console.log(updatedUser);
    res.status(200).json({
      message: "Updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    await userModel.findByIdAndDelete(userId);
    res.status(200).json({
      status: "OK",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  signUp,
  login,
  signOut,
  getUsers,
  getOneUser,
  updateUser,
  deleteUser,
};
