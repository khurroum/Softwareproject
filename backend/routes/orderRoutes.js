const express = require("express");

const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getAllOrdersForReports,
  getAdminOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==================================================
// CUSTOMER ROUTES
// ==================================================

// Create new order
router.post(
  "/",
  protect,
  createOrder
);


// Get logged-in user's orders
router.get(
  "/",
  protect,
  getMyOrders
);


// ==================================================
// ADMIN ROUTES
// IMPORTANT:
// These MUST come BEFORE /:id
// ==================================================


// Get active orders for admin
router.get(
  "/admin",
  protect,
  adminOnly,
  getAllOrders
);


// Get ALL orders for reports
router.get(
  "/admin/reports",
  protect,
  adminOnly,
  getAllOrdersForReports
);


// Get SINGLE order for admin
//
// This is important because admin needs
// to view Delivered and Cancelled orders
// too.
router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getAdminOrderById
);


// Update order status
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);


// ==================================================
// CUSTOMER SINGLE ORDER
// IMPORTANT:
// This MUST come AFTER /admin routes
// ==================================================

router.get(
  "/:id",
  protect,
  getMyOrderById
);


module.exports = router;