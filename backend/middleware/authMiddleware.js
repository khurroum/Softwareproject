const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // ==========================================
    // GET AUTHORIZATION HEADER
    // ==========================================

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message:
          "Not authorized. Please login again.",
      });
    }

    // ==========================================
    // GET TOKEN
    // ==========================================

    const token = authHeader
      .split(" ")[1]
      ?.trim();

    if (!token) {
      return res.status(401).json({
        message:
          "Authentication token is missing.",
      });
    }

    // ==========================================
    // VERIFY TOKEN
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "Authenticated JWT:",
      decoded
    );

    // ==========================================
    // NORMALIZE USER ID
    // ==========================================

    /*
      Different login implementations may store
      the user ID as either:

        decoded.id
        decoded._id
        decoded.userId

      We normalize them here so the rest of the
      backend can consistently use req.user._id.
    */

    const userId =
      decoded._id ||
      decoded.id ||
      decoded.userId;

    if (!userId) {
      console.error(
        "JWT does not contain a user ID:",
        decoded
      );

      return res.status(401).json({
        message:
          "User authentication information is missing.",
      });
    }

    // ==========================================
    // CREATE NORMALIZED USER OBJECT
    // ==========================================

    req.user = {
      ...decoded,

      _id: userId,
      id: userId,
    };

    // ==========================================
    // CONTINUE
    // ==========================================

    next();

  } catch (error) {

    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired token. Please login again.",
    });
  }
};


// ==================================================
// ADMIN ONLY
// ==================================================

const adminOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message:
        "Not authorized. Please login again.",
    });
  }

  if (!req.user._id) {
    return res.status(401).json({
      message:
        "User authentication information is missing.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message:
        "Access denied. Admin only.",
    });
  }

  next();
};


// ==================================================
// EXPORT
// ==================================================

module.exports = {
  protect,
  adminOnly,
};