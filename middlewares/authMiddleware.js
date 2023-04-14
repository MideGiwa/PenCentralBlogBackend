const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(404).json({
      message: "Missing authorization header",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // get the payload from the decoded token
    req.user = JSON.stringify(decodedToken);
    // get the userId from the decoded token
    req.userId = decodedToken.id;
    // get the role from the decoded token
    req.userRole = decodedToken.role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const superAdminMiddleware = (req, res, next) => {
  if (req.userRole !== "superadmin") {
    return res
      .status(403)
      .json({ message: "Unauthorized, you are not a superadmin" });
  }
  next();
};

const adminMiddleware = (req, res, next) => {
  if (req.userRole !== "admin" && req.userRole !== "superadmin") {
    return res
      .status(403)
      .json({ message: "Unauthorized, meet your superadmin" });
  }
  // if (req.userRole !== "admin") {
  //   return res
  //     .status(403)
  //     .json({ message: "Unauthorized, see the admin" });
  // }
  // next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  superAdminMiddleware,
};
