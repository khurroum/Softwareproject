const express = require("express");

const {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
} = require("../controllers/paymentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==================================================
// INITIATE SSL COMMERZ PAYMENT
// POST /api/payments/initiate/:orderId
// ==================================================

router.post(
  "/initiate/:orderId",
  protect,
  initiatePayment
);

// ==================================================
// PAYMENT SUCCESS
// POST /api/payments/success
// ==================================================

router.post(
  "/success",
  paymentSuccess
);

// ==================================================
// PAYMENT FAILED
// POST /api/payments/fail
// ==================================================

router.post(
  "/fail",
  paymentFail
);

// ==================================================
// PAYMENT CANCELLED
// POST /api/payments/cancel
// ==================================================

router.post(
  "/cancel",
  paymentCancel
);

// ==================================================
// PAYMENT IPN
// POST /api/payments/ipn
// ==================================================

router.post(
  "/ipn",
  paymentIPN
);

module.exports = router;