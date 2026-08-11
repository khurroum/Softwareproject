import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";
import { clearCart } from "../../store/features/cart/cartSlice";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =========================
  // REDUX DATA
  // =========================
  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  const token = useSelector(
    (state) => state.auth.token
  );

  // =========================
  // FORM DATA
  // =========================
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // =========================
  // UI STATE
  // =========================
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // CALCULATE TOTAL
  // =========================
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // PLACE ORDER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // =========================
      // CHECK TOKEN
      // =========================
      const savedToken =
        token || localStorage.getItem("token");

      if (!savedToken) {
        setError(
          "You are not logged in. Please login again."
        );

        navigate("/login");
        return;
      }

      // =========================
      // PREPARE ORDER ITEMS
      // =========================
      const orderItems = cartItems.map(
        (item) => ({
          product: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })
      );

      // =========================
      // SEND ORDER TO BACKEND
      // =========================
      const response = await api.post(
        "/orders",
        {
          orderItems,

          shippingAddress: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
          },

          paymentMethod:
            "Cash on Delivery",
        },
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        }
      );

      console.log(
        "Order created:",
        response.data
      );

      // =========================
      // CLEAR CART
      // =========================
      dispatch(clearCart());

      // =========================
      // GO TO ORDER DETAILS
      // =========================
      const createdOrder =
        response.data.order;

      navigate(
        `/orders/${createdOrder._id}`
      );
    } catch (error) {
      console.error(
        "Failed to create order:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EMPTY CART
  // =========================
  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">

        <h1 className="text-4xl font-bold">
          Your Cart is Empty
        </h1>

        <p className="mt-4 text-gray-500">
          Add some products before going to checkout.
        </p>

        <Link
          to="/products"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Continue Shopping
        </Link>

      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      {/* =========================
          PAGE HEADING
      ========================= */}
      <div className="mb-12">

        <h1 className="text-5xl font-bold">
          Checkout
        </h1>

        <p className="mt-3 text-gray-600">
          Enter your delivery information.
        </p>

      </div>


      {/* =========================
          ERROR MESSAGE
      ========================= */}
      {error && (
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}


      <div className="grid gap-10 lg:grid-cols-3">

        {/* ==================================================
            CUSTOMER INFORMATION
        ================================================== */}
        <div className="lg:col-span-2">

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border bg-white p-8 shadow-sm"
          >

            <h2 className="text-2xl font-bold">
              Delivery Information
            </h2>


            <div className="mt-8 grid gap-6 sm:grid-cols-2">

              {/* =========================
                  NAME
              ========================= */}
              <div>

                <label className="mb-2 block font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* =========================
                  EMAIL
              ========================= */}
              <div>

                <label className="mb-2 block font-medium">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* =========================
                  PHONE
              ========================= */}
              <div>

                <label className="mb-2 block font-medium">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* =========================
                  CITY
              ========================= */}
              <div>

                <label className="mb-2 block font-medium">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* =========================
                  POSTAL CODE
              ========================= */}
              <div>

                <label className="mb-2 block font-medium">
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  placeholder="Enter postal code"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* =========================
                  ADDRESS
              ========================= */}
              <div className="sm:col-span-2">

                <label className="mb-2 block font-medium">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter your complete delivery address"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-600"
                />

              </div>

            </div>


            {/* =========================
                PLACE ORDER BUTTON
            ========================= */}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-lg bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </form>

        </div>


        {/* ==================================================
            ORDER SUMMARY
        ================================================== */}
        <div>

          <div className="rounded-xl border bg-gray-50 p-8">

            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>


            {/* =========================
                CART ITEMS
            ========================= */}
            <div className="mt-6 space-y-4">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-4"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />


                  <div className="flex-1">

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 font-semibold">
                      $
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </p>

                  </div>

                </div>

              ))}

            </div>


            {/* =========================
                TOTAL
            ========================= */}
            <div className="mt-6 space-y-4">

              <div className="flex justify-between">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>


              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ${subtotal.toFixed(2)}
                </span>
              </div>


              <div className="flex justify-between">
                <span>Shipping</span>

                <span className="text-green-600">
                  Free
                </span>
              </div>


              <hr />


              <div className="flex justify-between text-xl font-bold">

                <span>
                  Total
                </span>

                <span>
                  ${subtotal.toFixed(2)}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}