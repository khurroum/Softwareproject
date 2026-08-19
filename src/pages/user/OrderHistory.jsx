import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET USER ORDERS
  // =========================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your orders.");
          return;
        }

        // IMPORTANT:
        // Backend route is GET /api/orders
        const response = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("My orders:", response.data);

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-center text-lg text-gray-500">
          Loading orders...
        </p>
      </section>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-lg text-red-500">
          {error}
        </p>
      </section>
    );
  }

  // =========================
  // NO ORDERS
  // =========================
  if (orders.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold">
          My Orders
        </h1>

        <p className="mt-4 text-gray-500">
          You haven't placed any orders yet.
        </p>

        <Link
          to="/products"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Start Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          My Orders
        </h1>

        <p className="mt-3 text-gray-600">
          View and track all your orders.
        </p>
      </div>


      {/* =========================
          DESKTOP TABLE
      ========================= */}
      <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">

        <table className="w-full">

          <thead className="bg-gray-50">
            <tr className="border-b text-left">

              <th className="px-6 py-4">
                Order
              </th>

              <th className="px-6 py-4">
                Date
              </th>

              <th className="px-6 py-4">
                Items
              </th>

              <th className="px-6 py-4">
                Total
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Action
              </th>

            </tr>
          </thead>


          <tbody>

            {orders.map((order) => {

              const totalItems =
                order.orderItems?.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                ) || 0;

              const total =
                order.totalPrice ??
                order.orderItems?.reduce(
                  (total, item) =>
                    total +
                    item.price *
                      item.quantity,
                  0
                ) ??
                0;

              const status =
                order.orderStatus ||
                "Pending";

              return (
                <tr
                  key={order._id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >

                  {/* Order ID */}
                  <td className="px-6 py-5">
                    <span className="font-semibold">
                      #{order._id.slice(-8)}
                    </span>
                  </td>


                  {/* Date */}
                  <td className="px-6 py-5 text-gray-600">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>


                  {/* Items */}
                  <td className="px-6 py-5">
                    {totalItems}
                  </td>


                  {/* Total */}
                  <td className="px-6 py-5 font-semibold">
                    ${Number(total).toFixed(2)}
                  </td>


                  {/* Status */}
                  <td className="px-6 py-5">

                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                        status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : status === "Processing"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status}
                    </span>

                  </td>


                  {/* Action */}
                  <td className="px-6 py-5">

                    <Link
                      to={`/orders/${order._id}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      View
                    </Link>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>


      {/* =========================
          MOBILE CARDS
      ========================= */}
      <div className="space-y-5 md:hidden">

        {orders.map((order) => {

          const totalItems =
            order.orderItems?.reduce(
              (total, item) =>
                total + item.quantity,
              0
            ) || 0;

          const total =
            order.totalPrice ??
            order.orderItems?.reduce(
              (total, item) =>
                total +
                item.price *
                  item.quantity,
              0
            ) ??
            0;

          const status =
            order.orderStatus ||
            "Pending";

          return (
            <div
              key={order._id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Order
                  </p>

                  <p className="font-bold">
                    #{order._id.slice(-8)}
                  </p>

                </div>


                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : status === "Shipped"
                      ? "bg-blue-100 text-blue-700"
                      : status === "Processing"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {status}
                </span>

              </div>


              <div className="mt-5 space-y-3">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Date
                  </span>

                  <span>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </span>

                </div>


                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Items
                  </span>

                  <span>
                    {totalItems}
                  </span>

                </div>


                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Total
                  </span>

                  <span className="font-bold">
                    ${Number(total).toFixed(2)}
                  </span>

                </div>

              </div>


              <Link
                to={`/orders/${order._id}`}
                className="mt-5 block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                View Order
              </Link>

            </div>
          );
        })}

      </div>

    </section>
  );
}