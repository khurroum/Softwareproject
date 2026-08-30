import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";
import { clearCart } from "../../store/features/cart/cartSlice";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ==================================================
  // REDUX DATA
  // ==================================================

  const cartItems = useSelector(
    (state) => state.cart.items || []
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  const token = useSelector(
    (state) => state.auth.token
  );

  // ==================================================
  // FORM DATA
  // ==================================================

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // ==================================================
  // PAYMENT METHOD
  // ==================================================

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  // ==================================================
  // UI STATE
  // ==================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==================================================
  // CALCULATE SUBTOTAL
  // ==================================================

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // ==================================================
  // TOTAL ITEMS
  // ==================================================

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==================================================
  // GET PRODUCT ID SAFELY
  // ==================================================

  const getProductId = (item) => {
    // Normal cart format
    if (item?.id) {
      return item.id;
    }

    // MongoDB format
    if (item?._id) {
      return item._id;
    }

    // Sometimes product may be nested
    if (item?.product?.id) {
      return item.product.id;
    }

    if (item?.product?._id) {
      return item.product._id;
    }

    return null;
  };

  // ==================================================
  // CHECK MONGODB OBJECT ID
  // ==================================================

  const isValidMongoId = (id) => {
    if (!id) {
      return false;
    }

    const idString = String(id);

    return /^[a-fA-F0-9]{24}$/.test(idString);
  };

  // ==================================================
  // PLACE ORDER
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // ==================================================
      // CHECK LOGIN
      // ==================================================

      const savedToken =
        token || localStorage.getItem("token");

      if (!savedToken) {
        setError(
          "You are not logged in. Please login again."
        );

        navigate("/login");

        return;
      }

      // ==================================================
      // CHECK CART
      // ==================================================

      if (!cartItems || cartItems.length === 0) {
        setError(
          "Your cart is empty. Please add products first."
        );

        return;
      }

      // ==================================================
      // VALIDATE PRODUCT IDs
      // ==================================================

      const invalidItem = cartItems.find((item) => {
        const productId = getProductId(item);

        return !isValidMongoId(productId);
      });

      if (invalidItem) {
        const productName =
          invalidItem?.name ||
          invalidItem?.product?.name ||
          "Unknown product";

        setError(
          `Invalid product ID for "${productName}". Please remove this product from the cart and add it again.`
        );

        console.error(
          "Invalid cart item:",
          invalidItem
        );

        return;
      }

      // ==================================================
      // CREATE ORDER ITEMS
      // ==================================================

      const orderItems = cartItems.map((item) => {
        const productId = getProductId(item);

        return {
          product: String(productId),

          name:
            item.name ||
            item.product?.name ||
            "Product",

          image:
            item.image ||
            item.product?.image ||
            "",

          price: Number(item.price || 0),

          quantity: Number(
            item.quantity || 1
          ),
        };
      });

      // ==================================================
      // DEBUG
      // ==================================================

      console.log(
        "Submitting order items:",
        orderItems
      );

      // ==================================================
      // CREATE ORDER
      // ==================================================

      const response = await api.post(
        "/orders",
        {
          orderItems,

          shippingAddress: {
            name: formData.name.trim(),

            email: formData.email.trim(),

            phone: formData.phone.trim(),

            address: formData.address.trim(),

            city: formData.city.trim(),

            postalCode:
              formData.postalCode.trim(),
          },

          paymentMethod,
        },
        {
          headers: {
            Authorization:
              `Bearer ${savedToken}`,
          },
        }
      );

      console.log(
        "Order created:",
        response.data
      );

      // ==================================================
      // GET CREATED ORDER
      // ==================================================

      const createdOrder =
        response.data?.order;

      if (!createdOrder) {
        throw new Error(
          "Order was created but order information was not returned."
        );
      }

      if (!createdOrder._id) {
        throw new Error(
          "Order ID was not returned by the server."
        );
      }

      // ==================================================
      // CASH ON DELIVERY
      // ==================================================

      if (
        paymentMethod ===
        "Cash on Delivery"
      ) {
        dispatch(clearCart());

        // Remove old general cart if it exists
        localStorage.removeItem("cart");

        navigate(
          `/orders/${createdOrder._id}`
        );

        return;
      }

      // ==================================================
      // SSL COMMERZ
      // ==================================================

      if (
        paymentMethod ===
        "SSLCOMMERZ"
      ) {
        console.log(
          "Starting SSLCommerz payment..."
        );

        const paymentResponse =
          await api.post(
            `/payments/initiate/${createdOrder._id}`,
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${savedToken}`,
              },
            }
          );

        console.log(
          "Payment response:",
          paymentResponse.data
        );

        const paymentUrl =
          paymentResponse.data?.paymentUrl;

        if (!paymentUrl) {
          throw new Error(
            "Payment gateway URL was not returned."
          );
        }

        // ==================================================
        // CLEAR CART
        // ==================================================

        dispatch(clearCart());

        localStorage.removeItem("cart");

        // ==================================================
        // REDIRECT TO SSLCOMMERZ
        // ==================================================

        window.location.href =
          paymentUrl;

        return;
      }

    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // EMPTY CART
  // ==================================================

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">

        <div className="mx-auto max-w-lg rounded-3xl border bg-white p-10 shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add some products before going to
            checkout.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>

        </div>

      </section>
    );
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-10">

        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Secure Checkout
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Checkout
        </h1>

        <p className="mt-3 max-w-2xl text-gray-500">
          Enter your delivery information and
          choose your preferred payment method.
        </p>

      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">

          <div className="flex gap-3">

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
              !
            </div>

            <div>
              <p className="font-semibold text-red-700">
                Checkout Error
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

          </div>

        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">

        {/* ==================================================
            CUSTOMER INFORMATION
        ================================================== */}

        <div className="lg:col-span-2">

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600">
                1
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Delivery Information
                </h2>

                <p className="text-sm text-gray-500">
                  Where should we deliver your order?
                </p>
              </div>

            </div>

            {/* ==================================================
                FORM FIELDS
            ================================================== */}

            <div className="mt-8 grid gap-6 sm:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* CITY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* POSTAL CODE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  placeholder="Enter postal code"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* ADDRESS */}

              <div className="sm:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="House/Road, Area, District..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />

              </div>

            </div>

            {/* ==================================================
                PAYMENT
            ================================================== */}

            <div className="mt-10 border-t pt-10">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600">
                  2
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Payment Method
                  </h2>

                  <p className="text-sm text-gray-500">
                    Choose how you want to pay.
                  </p>
                </div>

              </div>

              <div className="mt-6 space-y-4">

                {/* CASH */}

                <label
                  className={`flex cursor-pointer gap-4 rounded-2xl border p-5 transition ${
                    paymentMethod ===
                    "Cash on Delivery"
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={
                      paymentMethod ===
                      "Cash on Delivery"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    className="mt-1 h-5 w-5 accent-blue-600"
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Pay when your order is delivered.
                    </p>
                  </div>

                </label>

                {/* SSL COMMERZ */}

                <label
                  className={`flex cursor-pointer gap-4 rounded-2xl border p-5 transition ${
                    paymentMethod ===
                    "SSLCOMMERZ"
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="SSLCOMMERZ"
                    checked={
                      paymentMethod ===
                      "SSLCOMMERZ"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    className="mt-1 h-5 w-5 accent-blue-600"
                  />

                  <div>

                    <p className="font-semibold text-gray-900">
                      Online Payment
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Pay securely using SSLCOMMERZ.
                    </p>

                    <p className="mt-2 text-xs font-semibold text-blue-600">
                      Visa • Mastercard • Mobile Banking • Other supported methods
                    </p>

                  </div>

                </label>

              </div>

            </div>

            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="mt-10 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >

              {loading
                ? paymentMethod ===
                  "SSLCOMMERZ"
                  ? "Connecting to Payment Gateway..."
                  : "Placing Order..."
                : paymentMethod ===
                  "SSLCOMMERZ"
                ? "Continue to Online Payment"
                : "Place Order"}

            </button>

          </form>

        </div>

        {/* ==================================================
            ORDER SUMMARY
        ================================================== */}

        <div>

          <div className="sticky top-24 rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm sm:p-8">

            <h2 className="text-2xl font-bold text-gray-900">
              Order Summary
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {totalItems} item
              {totalItems !== 1 ? "s" : ""}
            </p>

            {/* ITEMS */}

            <div className="mt-6 max-h-[420px] space-y-4 overflow-y-auto">

              {cartItems.map((item, index) => (

                <div
                  key={
                    getProductId(item) ||
                    index
                  }
                  className="flex gap-4 border-b border-gray-200 pb-4"
                >

                  <img
                    src={
                      item.image ||
                      item.product?.image ||
                      ""
                    }
                    alt={
                      item.name ||
                      item.product?.name ||
                      "Product"
                    }
                    className="h-16 w-16 rounded-xl bg-white object-cover"
                  />

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate font-semibold text-gray-900">
                      {item.name ||
                        item.product?.name ||
                        "Product"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      $
                      {(
                        Number(
                          item.price || 0
                        ) *
                        Number(
                          item.quantity || 0
                        )
                      ).toFixed(2)}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* TOTAL */}

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span>
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>

                <span className="font-semibold text-green-600">
                  Free
                </span>
              </div>

              <div className="border-t pt-4">

                <div className="flex justify-between text-xl font-bold text-gray-900">

                  <span>Total</span>

                  <span className="text-blue-600">
                    ${subtotal.toFixed(2)}
                  </span>

                </div>

              </div>

            </div>

            {/* SECURITY */}

            <div className="mt-6 rounded-2xl bg-white p-4">

              <div className="flex gap-3">

                <div className="text-lg">
                  🔒
                </div>

                <div>

                  <p className="text-sm font-semibold text-gray-800">
                    Secure Checkout
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Your payment information is
                    securely processed.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}