const axios = require("axios");
const Order = require("../models/Order");

// ==================================================
// SSLCOMMERZ CONFIG
// ==================================================

const isLive =
  process.env.SSLCOMMERZ_IS_LIVE === "true";

const SSL_BASE_URL = isLive
  ? "https://securepay.sslcommerz.com"
  : "https://sandbox.sslcommerz.com";


// ==================================================
// FRONTEND REDIRECT HELPER
// ==================================================

const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:5173";


// ==================================================
// FIND ORDER FROM SSL RESPONSE
// ==================================================

const findOrderFromPayment = async (data) => {
  // SSLCommerz sends our order ID in value_a
  if (data?.value_a) {
    const order = await Order.findById(
      data.value_a
    );

    if (order) {
      return order;
    }
  }

  // Fallback: extract order ID from tran_id
  // Example:
  // ORDER_65abc123..._171234567
  if (data?.tran_id) {
    const tranId = String(data.tran_id);

    const match = tranId.match(
      /^ORDER_([a-fA-F0-9]{24})_/
    );

    if (match) {
      const order = await Order.findById(
        match[1]
      );

      if (order) {
        return order;
      }
    }
  }

  return null;
};


// ==================================================
// VALIDATE PAYMENT WITH SSLCOMMERZ
// ==================================================

const validatePayment = async (valId) => {
  if (!valId) {
    throw new Error(
      "SSLCommerz validation ID is missing."
    );
  }

  const params = new URLSearchParams({
    val_id: valId,

    store_id:
      process.env.SSLCOMMERZ_STORE_ID,

    store_passwd:
      process.env.SSLCOMMERZ_STORE_PASSWORD,

    format: "json",
  });

  const response = await axios.get(
    `${SSL_BASE_URL}/validator/api/validationserverAPI.php?${params.toString()}`,
    {
      timeout: 15000,
    }
  );

  return response.data;
};


// ==================================================
// MARK ORDER AS PAID
// ==================================================

const markOrderAsPaid = async (
  order,
  validationResponse
) => {
  // --------------------------------------------------
  // Check transaction status
  // --------------------------------------------------

  const status =
    String(
      validationResponse?.status || ""
    ).toUpperCase();

  if (
    status !== "VALID" &&
    status !== "VALIDATED"
  ) {
    throw new Error(
      `Payment validation failed. Status: ${status || "UNKNOWN"}`
    );
  }


  // --------------------------------------------------
  // Check transaction ID
  // --------------------------------------------------

  if (
    validationResponse.tran_id &&
    order.paymentTransactionId &&
    validationResponse.tran_id !==
      order.paymentTransactionId
  ) {
    throw new Error(
      "Transaction ID does not match."
    );
  }


  // --------------------------------------------------
  // Check amount
  // --------------------------------------------------

  const gatewayAmount =
    Number(
      validationResponse.amount
    );

  const orderAmount =
    Number(order.totalPrice);

  if (
    !Number.isFinite(gatewayAmount) ||
    Math.abs(
      gatewayAmount - orderAmount
    ) > 0.01
  ) {
    throw new Error(
      `Payment amount mismatch. Expected ${orderAmount}, received ${gatewayAmount}.`
    );
  }


  // --------------------------------------------------
  // Check currency
  // --------------------------------------------------

  if (
    validationResponse.currency &&
    validationResponse.currency !==
      "BDT"
  ) {
    throw new Error(
      "Payment currency mismatch."
    );
  }


  // --------------------------------------------------
  // Already paid
  // --------------------------------------------------

  if (order.paymentStatus === "Paid") {
    return order;
  }


  // --------------------------------------------------
  // SAVE PAYMENT INFORMATION
  // --------------------------------------------------

  order.paymentStatus = "Paid";

  // Only set Processing automatically if
  // the order is still Pending.
  if (
    order.orderStatus === "Pending"
  ) {
    order.orderStatus = "Processing";
  }


  // Save transaction information if your
  // Order schema contains these fields.
  //
  // These assignments are safe even if the
  // fields are not currently declared in
  // Mongoose strict mode only if the schema
  // allows them. We therefore don't rely on
  // them elsewhere.

  if (validationResponse.tran_id) {
    order.paymentTransactionId =
      validationResponse.tran_id;
  }

  if (validationResponse.val_id) {
    order.paymentValidationId =
      validationResponse.val_id;
  }


  await order.save();

  return order;
};


// ==================================================
// INITIATE PAYMENT
// ==================================================

const initiatePayment = async (
  req,
  res
) => {
  try {
    const { orderId } = req.params;

    // --------------------------------------------------
    // CHECK ORDER ID
    // --------------------------------------------------

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }


    // --------------------------------------------------
    // FIND ORDER
    // --------------------------------------------------

    const order =
      await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }


    // --------------------------------------------------
    // CHECK USER
    // --------------------------------------------------

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "User authentication information is missing.",
      });
    }


    // --------------------------------------------------
    // CHECK ORDER OWNER
    // --------------------------------------------------

    const userId =
      req.user._id ||
      req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User authentication information is missing.",
      });
    }

    if (
      order.user.toString() !==
      userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to pay for this order",
      });
    }


    // --------------------------------------------------
    // CHECK PAYMENT STATUS
    // --------------------------------------------------

    if (
      order.paymentStatus === "Paid"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order has already been paid.",
      });
    }


    // --------------------------------------------------
    // CHECK ORDER ITEMS
    // --------------------------------------------------

    if (
      !order.orderItems ||
      order.orderItems.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot process payment for an empty order.",
      });
    }


    // --------------------------------------------------
    // CHECK TOTAL
    // --------------------------------------------------

    const totalAmount =
      Number(order.totalPrice);

    if (
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order total.",
      });
    }


    // --------------------------------------------------
    // TRANSACTION ID
    // --------------------------------------------------

    const tranId =
      `ORDER_${order._id}_${Date.now()}`;


    // --------------------------------------------------
    // CUSTOMER
    // --------------------------------------------------

    const customerName =
      order.shippingAddress?.name ||
      req.user.name ||
      "Customer";

    const customerEmail =
      order.shippingAddress?.email ||
      req.user.email ||
      "customer@example.com";

    const customerPhone =
      order.shippingAddress?.phone ||
      "01700000000";


    // --------------------------------------------------
    // SHIPPING
    // --------------------------------------------------

    const shippingAddress =
      order.shippingAddress?.address ||
      "N/A";

    const city =
      order.shippingAddress?.city ||
      "Dhaka";

    const postalCode =
      order.shippingAddress?.postalCode ||
      "1000";


    // --------------------------------------------------
    // CHECK ENVIRONMENT VARIABLES
    // --------------------------------------------------

    if (
      !process.env.SSLCOMMERZ_STORE_ID ||
      !process.env.SSLCOMMERZ_STORE_PASSWORD
    ) {
      return res.status(500).json({
        success: false,
        message:
          "SSLCommerz store credentials are missing.",
      });
    }

    if (
      !process.env.BACKEND_URL
    ) {
      return res.status(500).json({
        success: false,
        message:
          "BACKEND_URL is missing from .env.",
      });
    }


    // --------------------------------------------------
    // PAYMENT DATA
    // --------------------------------------------------

    const paymentData = {
      store_id:
        process.env.SSLCOMMERZ_STORE_ID,

      store_passwd:
        process.env.SSLCOMMERZ_STORE_PASSWORD,

      total_amount:
        totalAmount.toFixed(2),

      currency: "BDT",

      tran_id: tranId,


      // Callback URLs

      success_url:
        `${process.env.BACKEND_URL}/api/payments/success`,

      fail_url:
        `${process.env.BACKEND_URL}/api/payments/fail`,

      cancel_url:
        `${process.env.BACKEND_URL}/api/payments/cancel`,

      ipn_url:
        `${process.env.BACKEND_URL}/api/payments/ipn`,


      // Customer

      cus_name:
        customerName,

      cus_email:
        customerEmail,

      cus_phone:
        customerPhone,

      cus_add1:
        shippingAddress,

      cus_city:
        city,

      cus_postcode:
        postalCode,

      cus_country:
        "Bangladesh",


      // Shipping

      shipping_method:
        "YES",

      ship_name:
        customerName,

      ship_add1:
        shippingAddress,

      ship_city:
        city,

      ship_postcode:
        postalCode,

      ship_country:
        "Bangladesh",


      // Product

      product_name:
        order.orderItems
          .map(
            (item) => item.name
          )
          .join(", ")
          .substring(0, 255),

      product_category:
        "General",

      product_profile:
        "general",


      // Custom values

      value_a:
        order._id.toString(),

      value_b:
        userId.toString(),
    };


    // --------------------------------------------------
    // INITIALIZE SSL PAYMENT
    // --------------------------------------------------

    console.log(
      "Initializing SSLCOMMERZ payment..."
    );

    const response =
      await axios.post(
        `${SSL_BASE_URL}/gwprocess/v4/api.php`,

        new URLSearchParams(
          paymentData
        ).toString(),

        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          timeout: 15000,
        }
      );


    const sslResponse =
      response.data;

    console.log(
      "SSLCOMMERZ response:",
      sslResponse
    );


    // --------------------------------------------------
    // CHECK GATEWAY URL
    // --------------------------------------------------

    if (
      !sslResponse ||
      !sslResponse.GatewayPageURL
    ) {
      return res.status(400).json({
        success: false,
        message:
          sslResponse?.failedreason ||
          "Unable to initialize payment.",
      });
    }


    // --------------------------------------------------
    // SAVE PAYMENT METHOD
    // --------------------------------------------------

    order.paymentMethod =
      "SSLCOMMERZ";

    await order.save();


    // --------------------------------------------------
    // RETURN URL
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Payment session created successfully.",

      paymentUrl:
        sslResponse.GatewayPageURL,

      tranId,
    });

  } catch (error) {

    console.error(
      "SSLCOMMERZ initialization error:",
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.failedreason ||
        error.message ||
        "Failed to initialize payment.",
    });
  }
};


// ==================================================
// PAYMENT SUCCESS
// ==================================================

const paymentSuccess = async (
  req,
  res
) => {
  try {

    console.log(
      "========== SSLCOMMERZ SUCCESS =========="
    );

    console.log(
      "Payment response:",
      req.body
    );


    // --------------------------------------------------
    // FIND ORDER
    // --------------------------------------------------

    const order =
      await findOrderFromPayment(
        req.body
      );

    if (!order) {
      console.error(
        "Order could not be found from payment response."
      );

      return res.redirect(
        `${frontendUrl}/payment/failed`
      );
    }


    // --------------------------------------------------
    // VALIDATE PAYMENT
    // --------------------------------------------------

    const valId =
      req.body?.val_id;

    if (!valId) {
      console.error(
        "No val_id received from SSLCOMMERZ."
      );

      return res.redirect(
        `${frontendUrl}/payment/failed`
      );
    }


    const validationResponse =
      await validatePayment(
        valId
      );


    console.log(
      "SSLCOMMERZ validation response:",
      validationResponse
    );


    // --------------------------------------------------
    // MARK ORDER PAID
    // --------------------------------------------------

    await markOrderAsPaid(
      order,
      validationResponse
    );


    console.log(
      `Order ${order._id} marked as PAID.`
    );


    // --------------------------------------------------
    // REDIRECT
    // --------------------------------------------------

    return res.redirect(
      `${frontendUrl}/payment/success?orderId=${order._id}`
    );

  } catch (error) {

    console.error(
      "Payment success error:",
      error.response?.data ||
        error.message
    );

    return res.redirect(
      `${frontendUrl}/payment/failed`
    );
  }
};


// ==================================================
// PAYMENT FAILED
// ==================================================

const paymentFail = async (
  req,
  res
) => {
  try {

    console.log(
      "========== SSLCOMMERZ FAILED =========="
    );

    console.log(
      req.body
    );


    const order =
      await findOrderFromPayment(
        req.body
      );


    if (order) {
      order.paymentStatus =
        "Failed";

      await order.save();
    }


    return res.redirect(
      `${frontendUrl}/payment/failed`
    );

  } catch (error) {

    console.error(
      "Payment fail error:",
      error
    );

    return res.redirect(
      `${frontendUrl}/payment/failed`
    );
  }
};


// ==================================================
// PAYMENT CANCELLED
// ==================================================

const paymentCancel = async (
  req,
  res
) => {
  try {

    console.log(
      "========== SSLCOMMERZ CANCELLED =========="
    );

    console.log(
      req.body
    );


    const order =
      await findOrderFromPayment(
        req.body
      );


    if (order) {
      // Keep Pending rather than Failed because
      // the customer cancelled the payment.
      order.paymentStatus =
        "Pending";

      await order.save();
    }


    return res.redirect(
      `${frontendUrl}/payment/cancelled`
    );

  } catch (error) {

    console.error(
      "Payment cancel error:",
      error
    );

    return res.redirect(
      `${frontendUrl}/payment/cancelled`
    );
  }
};


// ==================================================
// PAYMENT IPN
// ==================================================

const paymentIPN = async (
  req,
  res
) => {
  try {

    console.log(
      "========== SSLCOMMERZ IPN =========="
    );

    console.log(
      req.body
    );


    const order =
      await findOrderFromPayment(
        req.body
      );


    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }


    // --------------------------------------------------
    // Don't process already paid orders again
    // --------------------------------------------------

    if (
      order.paymentStatus === "Paid"
    ) {
      return res.status(200).json({
        success: true,
        message:
          "Order is already paid.",
      });
    }


    // --------------------------------------------------
    // Validate IPN payment
    // --------------------------------------------------

    const valId =
      req.body?.val_id;

    if (!valId) {
      return res.status(400).json({
        success: false,
        message:
          "Payment validation ID missing.",
      });
    }


    const validationResponse =
      await validatePayment(
        valId
      );


    // --------------------------------------------------
    // Mark paid
    // --------------------------------------------------

    await markOrderAsPaid(
      order,
      validationResponse
    );


    console.log(
      `IPN: Order ${order._id} marked as PAID.`
    );


    return res.status(200).json({
      success: true,
      message:
        "Payment verified and order marked as paid.",
    });

  } catch (error) {

    console.error(
      "IPN error:",
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "IPN payment verification failed.",
    });
  }
};


// ==================================================
// EXPORT
// ==================================================

module.exports = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
};