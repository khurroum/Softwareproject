import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

export default function Revenue() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET ORDERS
  // =========================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
  await api.get("/orders/admin/reports");

        setOrders(
          response.data.orders || []
        );
      } catch (error) {
        console.error(
          "Failed to load revenue:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load revenue."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // =========================
  // REVENUE CALCULATIONS
  // =========================

  const completedOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "Delivered"
    );

  const pendingOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "Pending"
    );

  const processingOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "Processing"
    );

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "Cancelled"
    );

  const totalRevenue =
    completedOrders.reduce(
      (total, order) =>
        total +
        Number(
          order.totalPrice || 0
        ),
      0
    );

  const allOrderValue =
    orders.reduce(
      (total, order) =>
        total +
        Number(
          order.totalPrice || 0
        ),
      0
    );

  const averageOrderValue =
    completedOrders.length > 0
      ? totalRevenue /
        completedOrders.length
      : 0;

  // =========================
  // RECENT COMPLETED ORDERS
  // =========================

  const recentRevenueOrders =
    [...completedOrders]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 10);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="p-6 md:p-10">

        <h1 className="text-4xl font-bold">
          Revenue
        </h1>

        <p className="mt-6 text-gray-500">
          Loading revenue...
        </p>

      </section>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <section className="p-6 md:p-10">

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <h1 className="text-2xl font-bold text-red-700">
            Revenue Error
          </h1>

          <p className="mt-3 text-red-600">
            {error}
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="p-6 md:p-10">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Revenue
        </h1>

        <p className="mt-2 text-gray-600">
          Track your store's completed sales
          and revenue.
        </p>

      </div>


      {/* =========================
          REVENUE CARDS
      ========================= */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL REVENUE */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Completed Revenue
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            $
            {totalRevenue.toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Delivered orders
          </p>

        </div>


        {/* AVERAGE */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Average Order
          </p>

          <p className="mt-2 text-3xl font-bold">
            $
            {averageOrderValue.toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Per completed order
          </p>

        </div>


        {/* COMPLETED */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Completed Orders
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {completedOrders.length}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Delivered successfully
          </p>

        </div>


        {/* ALL ORDER VALUE */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Total Order Value
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            $
            {allOrderValue.toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Including active orders
          </p>

        </div>

      </div>


      {/* =========================
          ORDER STATUS SUMMARY
      ========================= */}

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-bold">
          Sales Overview
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-lg bg-green-50 p-5">

            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <p className="mt-1 text-2xl font-bold text-green-700">
              {completedOrders.length}
            </p>

          </div>


          <div className="rounded-lg bg-yellow-50 p-5">

            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-700">
              {pendingOrders.length}
            </p>

          </div>


          <div className="rounded-lg bg-blue-50 p-5">

            <p className="text-sm text-gray-500">
              Processing
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-700">
              {processingOrders.length}
            </p>

          </div>


          <div className="rounded-lg bg-red-50 p-5">

            <p className="text-sm text-gray-500">
              Cancelled
            </p>

            <p className="mt-1 text-2xl font-bold text-red-700">
              {cancelledOrders.length}
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          COMPLETED ORDERS
      ========================= */}

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <h2 className="text-2xl font-bold">
            Recent Revenue
          </h2>

          <Link
            to="/admin/orders"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            View All Orders →
          </Link>

        </div>


        {recentRevenueOrders.length ===
        0 ? (

          <div className="mt-6 rounded-lg bg-gray-50 p-6 text-center">

            <p className="text-gray-500">
              No completed orders yet.
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Revenue will appear here when
              orders are marked as Delivered.
            </p>

          </div>

        ) : (

          <div className="mt-6 overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b text-left">

                  <th className="px-4 py-3">
                    Order
                  </th>

                  <th className="px-4 py-3">
                    Customer
                  </th>

                  <th className="px-4 py-3">
                    Date
                  </th>

                  <th className="px-4 py-3">
                    Revenue
                  </th>

                  <th className="px-4 py-3">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentRevenueOrders.map(
                  (order) => (

                    <tr
                      key={order._id}
                      className="border-b last:border-b-0"
                    >

                      <td className="px-4 py-4 font-semibold">

                        #
                        {order._id.slice(-8)}

                      </td>


                      <td className="px-4 py-4">

                        {order.user?.name ||
                          order.shippingAddress
                            ?.name ||
                          "Customer"}

                      </td>


                      <td className="px-4 py-4 text-gray-600">

                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : "-"}

                      </td>


                      <td className="px-4 py-4 font-bold text-green-600">

                        $
                        {Number(
                          order.totalPrice ||
                            0
                        ).toFixed(2)}

                      </td>


                      <td className="px-4 py-4">

                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                          View
                        </Link>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </section>
  );
}