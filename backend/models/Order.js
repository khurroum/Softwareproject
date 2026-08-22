const mongoose = require("mongoose");

// =========================
// ORDER ITEM SCHEMA
// =========================
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);


// =========================
// ORDER SCHEMA
// =========================
const orderSchema = new mongoose.Schema(
  {
    // =========================
    // CUSTOMER
    // =========================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    // =========================
    // ORDER ITEMS
    // =========================
    orderItems: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: function (items) {
          return items.length > 0;
        },

        message: "Order must contain at least one product.",
      },
    },


    // =========================
    // SHIPPING ADDRESS
    // =========================
    shippingAddress: {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      postalCode: {
        type: String,
        required: true,
      },
    },


    // =========================
    // PRICE
    // =========================
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },


    // =========================
    // PAYMENT
    // =========================
    paymentMethod: {
      type: String,
      enum: [
        "Cash on Delivery",
        "Stripe",
      ],
      default: "Cash on Delivery",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
      ],
      default: "Pending",
    },


    // =========================
    // ORDER STATUS
    // =========================
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },

  {
    timestamps: true,
  }
);


const Order = mongoose.model(
  "Order",
  orderSchema
);

module.exports = Order;