const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// ==================================================
// CREATE ORDER
// ==================================================
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
    } = req.body;
    const allowedPaymentMethods = [
  "Cash on Delivery",
  "SSLCOMMERZ",
];

if (
  !allowedPaymentMethods.includes(
    paymentMethod
  )
) {
  return res.status(400).json({
    message: "Invalid payment method.",
  });
}

    // =========================
    // CHECK ORDER ITEMS
    // =========================
    if (
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0
    ) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    // =========================
    // CHECK SHIPPING ADDRESS
    // =========================
    if (
      !shippingAddress?.name ||
      !shippingAddress?.email ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.postalCode
    ) {
      return res.status(400).json({
        message:
          "Please provide complete shipping information.",
      });
    }

    // =========================
    // PREPARE ORDER ITEMS
    // =========================
    const finalOrderItems = [];

    let totalPrice = 0;

    for (const item of orderItems) {
      const productId = item.product || item.id;

      // Validate product ID
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          message: `Invalid product ID: ${productId}`,
        });
      }

      // Find product
      const product =
        await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${
            item.name || productId
          }`,
        });
      }

      // =========================
      // CHECK QUANTITY
      // =========================
      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}`,
        });
      }

      // =========================
      // CHECK STOCK
      // =========================
      if (product.stock < quantity) {
        return res.status(400).json({
          message:
            `Not enough stock for ${product.name}. ` +
            `Only ${product.stock} available.`,
        });
      }

      // =========================
      // CALCULATE PRICE
      // =========================
      const itemTotal =
        product.price * quantity;

      totalPrice += itemTotal;

      // =========================
      // SAVE ORDER ITEM
      // =========================
      finalOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      });
    }

    // =========================
    // CREATE ORDER
    // =========================
    const order = await Order.create({
      user: req.user.id,

      orderItems: finalOrderItems,

      shippingAddress: {
        name: shippingAddress.name,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode:
          shippingAddress.postalCode,
      },

      totalPrice,

      paymentMethod:
        paymentMethod ||
        "Cash on Delivery",

      paymentStatus: "Pending",

      orderStatus: "Pending",
    });

    // =========================
    // REDUCE STOCK
    // =========================
    for (const item of finalOrderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    // =========================
    // RESPONSE
    // =========================
    res.status(201).json({
      message:
        "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};


// ==================================================
// GET MY ORDERS
// ==================================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("user", "name email")
      .populate(
        "orderItems.product",
        "name image price category stock"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    res.status(500).json({
      message: "Failed to get orders",
      error: error.message,
    });
  }
};


// ==================================================
// GET SINGLE MY ORDER
// ==================================================
const getMyOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    console.log(
      "========== GET CUSTOMER ORDER =========="
    );

    console.log(
      "Order ID:",
      orderId
    );

    console.log(
      "Logged-in User ID:",
      req.user.id
    );

    // =========================
    // CHECK ORDER ID
    // =========================
    if (
      !mongoose.Types.ObjectId.isValid(
        orderId
      )
    ) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    // =========================
    // FIND CUSTOMER ORDER
    // =========================
    const order =
      await Order.findOne({
        _id: orderId,
        user: req.user.id,
      })
        .populate(
          "user",
          "name email"
        )
        .populate(
          "orderItems.product",
          "name image price category stock"
        );

    // =========================
    // ORDER NOT FOUND
    // =========================
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // =========================
    // RESPONSE
    // =========================
    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error(
      "Get customer order error:",
      error
    );

    res.status(500).json({
      message: "Failed to get order",
      error: error.message,
    });
  }
};


// ==================================================
// ADMIN: GET ACTIVE ORDERS
// ==================================================
const getAllOrders = async (req, res) => {
  try {
    const orders =
      await Order.find({
        orderStatus: {
          $nin: [
            "Delivered",
            "Cancelled",
          ],
        },
      })
        .populate(
          "user",
          "name email"
        )
        .populate(
          "orderItems.product",
          "name image price category stock"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error(
      "Get active orders error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to get active orders",
      error: error.message,
    });
  }
};


// ==================================================
// ADMIN: GET ALL ORDERS FOR REPORTS
// ==================================================
const getAllOrdersForReports =
  async (req, res) => {
    try {
      const orders =
        await Order.find()
          .populate(
            "user",
            "name email"
          )
          .populate(
            "orderItems.product",
            "name image price category stock"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        orders,
      });
    } catch (error) {
      console.error(
        "Get report orders error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to get report orders",
        error: error.message,
      });
    }
  };


// ==================================================
// ADMIN: GET SINGLE ORDER
// ==================================================
const getAdminOrderById =
  async (req, res) => {
    try {
      const orderId =
        req.params.id;

      console.log(
        "========== GET ADMIN ORDER =========="
      );

      console.log(
        "Order ID:",
        orderId
      );

      console.log(
        "Admin User ID:",
        req.user.id
      );

      // =========================
      // CHECK ORDER ID
      // =========================
      if (
        !mongoose.Types.ObjectId.isValid(
          orderId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid order ID",
        });
      }

      // =========================
      // FIND ANY ORDER
      // =========================
      const order =
        await Order.findById(
          orderId
        )
          .populate(
            "user",
            "name email"
          )
          .populate(
            "orderItems.product",
            "name image price category stock"
          );

      // =========================
      // ORDER NOT FOUND
      // =========================
      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      // =========================
      // RESPONSE
      // =========================
      res.status(200).json({
        order,
      });
    } catch (error) {
      console.error(
        "Get admin order error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to get order",
        error: error.message,
      });
    }
  };


// ==================================================
// ADMIN: UPDATE ORDER STATUS
// ==================================================
const updateOrderStatus =
  async (req, res) => {
    try {
      const {
        orderStatus,
      } = req.body;

      const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (
        !allowedStatuses.includes(
          orderStatus
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid order status",
        });
      }

      // =========================
      // VALIDATE ID
      // =========================
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid order ID",
        });
      }

      // =========================
      // UPDATE ORDER
      // =========================
      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            orderStatus,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      res.status(200).json({
        message:
          "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update order status",
        error: error.message,
      });
    }
  };


// ==================================================
// EXPORT
// ==================================================
module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getAllOrdersForReports,
  getAdminOrderById,
  updateOrderStatus,
};