const express = require("express");

const {
  createContactMessage,
  getAllContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} = require("../controllers/contactController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==================================================
// PUBLIC ROUTE
// ==================================================

// Send contact message
router.post(
  "/",
  createContactMessage
);


// ==================================================
// ADMIN ROUTES
// ==================================================

// Get all contact messages
router.get(
  "/",
  protect,
  adminOnly,
  getAllContactMessages
);


// Update message status
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateContactMessageStatus
);


// Delete message
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteContactMessage
);


module.exports = router;