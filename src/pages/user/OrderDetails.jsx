import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        // Check that an ID exists
        if (!id) {
          setError("Invalid order ID");
          return;
        }

        console.log("Order ID from URL:", id);

        const response = await api.get(`/orders/${id}`);

        console.log("Order response:", response.data);

        setOrder(response.data.order);
      } catch (error) {
        console.error("Failed to get order:", error);

        console.error(
          "Backend response:",
          error.response?.data
        );

        setError(
          error.response?.data?.message ||
            "Failed to get order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-center text-lg text-gray-500">
          Loading order...
        </p>
      </section>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <p className="text-lg text-red-500">
            {error}
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Orders
          </Link>
        </div>
      </section>
    );
  }

  // =========================
  // ORDER NOT FOUND
  // =========================
  if (!order) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-center text-2xl text-gray-500">
          Order not found
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">

      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Order Details
        </h1>

        <p className="mt-2 text-gray-500">
          Order ID: {order._id}
        </p>
      </div>

      {/* =========================
          ORDER STATUS
      ========================= */}
      <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Order Status
            </p>

            <p className="mt-1 text-xl font-bold">
              {order.orderStatus}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Payment
            </p>

            <p className="mt-1 font-semibold">
              {order.paymentMethod}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Payment Status
            </p>

            <p className="mt-1 font-semibold">
              {order.paymentStatus}
            </p>
          </div>

        </div>
      </div>

      {/* =========================
          PRODUCTS
      ========================= */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-2xl font-bold">
          Ordered Products
        </h2>

        <div className="space-y-6">

          {order.orderItems?.map((item) => (
            <div
              key={item.product}
              className="flex gap-5 border-b pb-6 last:border-b-0 last:pb-0"
            >

              {/* Product Image */}
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-100">

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />

              </div>

              {/* Product Information */}
              <div className="flex-1">

                <h3 className="text-lg font-semibold">
                  {item.name}
                </h3>

                <p className="mt-1 text-gray-500">
                  Quantity: {item.quantity}
                </p>

                <p className="mt-1 font-semibold text-blue-600">
                  ${item.price}
                </p>

              </div>

              {/* Item Total */}
              <div className="text-right">

                <p className="font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* =========================
          SHIPPING ADDRESS
      ========================= */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-2xl font-bold">
          Shipping Information
        </h2>

        <div className="space-y-2 text-gray-600">

          <p>
            <strong>Name:</strong>{" "}
            {order.shippingAddress?.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {order.shippingAddress?.email}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {order.shippingAddress?.phone}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {order.shippingAddress?.address}
          </p>

          <p>
            <strong>City:</strong>{" "}
            {order.shippingAddress?.city}
          </p>

          <p>
            <strong>Postal Code:</strong>{" "}
            {order.shippingAddress?.postalCode}
          </p>

        </div>

      </div>

      {/* =========================
          TOTAL
      ========================= */}
      <div className="mt-8 rounded-xl border bg-gray-50 p-6">

        <div className="flex justify-between text-2xl font-bold">

          <span>Total</span>

          <span className="text-blue-600">
            ${Number(order.totalPrice).toFixed(2)}
          </span>

        </div>

      </div>

      {/* =========================
          BACK BUTTON
      ========================= */}
      <div className="mt-8">

        <Link
          to="/orders"
          className="inline-block rounded-lg border px-6 py-3 font-semibold hover:bg-gray-100"
        >
          ← Back to Orders
        </Link>

      </div>

    </section>
  );
}