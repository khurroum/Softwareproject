import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

export default function Reports() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // GET ALL ORDERS FOR REPORTS
  // ==================================================

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/orders/admin/reports"
        );

        setOrders(
          response.data.orders || []
        );
      } catch (error) {
        console.error(
          "Failed to load reports:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load reports."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // ==================================================
  // ORDER GROUPS
  // ==================================================

  const deliveredOrders = orders.filter(
    (order) =>
      order.orderStatus === "Delivered"
  );

  const cancelledOrders = orders
    .filter(
      (order) =>
        order.orderStatus === "Cancelled"
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

  const pendingOrders = orders.filter(
    (order) =>
      order.orderStatus === "Pending"
  );

  const processingOrders = orders.filter(
    (order) =>
      order.orderStatus === "Processing"
  );

  const shippedOrders = orders.filter(
    (order) =>
      order.orderStatus === "Shipped"
  );

  // ==================================================
  // REVENUE
  // ==================================================

  const totalRevenue =
    deliveredOrders.reduce(
      (total, order) =>
        total +
        Number(order.totalPrice || 0),
      0
    );

  const cancelledValue =
    cancelledOrders.reduce(
      (total, order) =>
        total +
        Number(order.totalPrice || 0),
      0
    );

  const totalOrderValue =
    orders.reduce(
      (total, order) =>
        total +
        Number(order.totalPrice || 0),
      0
    );

  const averageOrderValue =
    deliveredOrders.length > 0
      ? totalRevenue /
        deliveredOrders.length
      : 0;

  // ==================================================
  // TOTAL ITEMS
  // ==================================================

  const totalItemsSold =
    deliveredOrders.reduce(
      (total, order) =>
        total +
        (order.orderItems?.reduce(
          (itemTotal, item) =>
            itemTotal +
            Number(item.quantity || 0),
          0
        ) || 0),
      0
    );

  const totalCancelledItems =
    cancelledOrders.reduce(
      (total, order) =>
        total +
        (order.orderItems?.reduce(
          (itemTotal, item) =>
            itemTotal +
            Number(item.quantity || 0),
          0
        ) || 0),
      0
    );

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="p-6 md:p-10">

        <h1 className="text-4xl font-bold">
          Reports
        </h1>

        <p className="mt-6 text-gray-500">
          Loading reports...
        </p>

      </section>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <section className="p-6 md:p-10">

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <h1 className="text-2xl font-bold text-red-700">
            Reports Error
          </h1>

          <p className="mt-3 text-red-600">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>

        </div>

      </section>
    );
  }

  return (
    <section className="p-6 md:p-10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Reports
        </h1>

        <p className="mt-2 text-gray-600">
          View sales, order performance, revenue,
          and cancelled order records.
        </p>

      </div>


      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL ORDERS */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Total Orders
          </p>

          <p className="mt-2 text-3xl font-bold">
            {orders.length}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            All order records
          </p>

        </div>


        {/* REVENUE */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Total Revenue
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            $
            {totalRevenue.toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            From delivered orders
          </p>

        </div>


        {/* CANCELLED */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Cancelled Orders
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {cancelledOrders.length}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Orders cancelled
          </p>

        </div>


        {/* CANCELLED VALUE */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Cancelled Value
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            $
            {cancelledValue.toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Value of cancelled orders
          </p>

        </div>

      </div>


      {/* ==================================================
          SALES OVERVIEW
      ================================================== */}

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-bold">
          Sales Overview
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* DELIVERED */}

          <div className="rounded-lg bg-green-50 p-5">

            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <p className="mt-1 text-2xl font-bold text-green-700">
              {deliveredOrders.length}
            </p>

          </div>


          {/* PENDING */}

          <div className="rounded-lg bg-yellow-50 p-5">

            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-700">
              {pendingOrders.length}
            </p>

          </div>


          {/* PROCESSING */}

          <div className="rounded-lg bg-blue-50 p-5">

            <p className="text-sm text-gray-500">
              Processing
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-700">
              {processingOrders.length}
            </p>

          </div>


          {/* CANCELLED */}

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


      {/* ==================================================
          REVENUE SUMMARY
      ================================================== */}

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        {/* AVERAGE ORDER */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Average Completed Order
          </p>

          <p className="mt-2 text-3xl font-bold">
            $
            {averageOrderValue.toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Average value of delivered orders
          </p>

        </div>


        {/* ITEMS SOLD */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Items Sold
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {totalItemsSold}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            From delivered orders
          </p>

        </div>


        {/* TOTAL ORDER VALUE */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Total Order Value
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            $
            {totalOrderValue.toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Including all statuses
          </p>

        </div>

      </div>


      {/* ==================================================
          CANCELLED ORDERS
      ================================================== */}

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Cancelled Orders
            </h2>

            <p className="mt-1 text-gray-500">
              Historical records of cancelled orders.
            </p>

          </div>

          <div className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-700">
            {cancelledOrders.length} Cancelled
          </div>

        </div>


        {cancelledOrders.length === 0 ? (

          <div className="mt-6 rounded-lg bg-gray-50 p-6 text-center">

            <p className="text-gray-500">
              No cancelled orders.
            </p>

          </div>

        ) : (

          <>

            {/* CANCELLED SUMMARY */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <div className="rounded-lg bg-red-50 p-5">

                <p className="text-sm text-gray-500">
                  Cancelled Order Value
                </p>

                <p className="mt-1 text-2xl font-bold text-red-700">
                  $
                  {cancelledValue.toFixed(2)}
                </p>

              </div>


              <div className="rounded-lg bg-gray-50 p-5">

                <p className="text-sm text-gray-500">
                  Cancelled Items
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {totalCancelledItems}
                </p>

              </div>

            </div>


            {/* CANCELLED TABLE */}

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
                      Items
                    </th>

                    <th className="px-4 py-3">
                      Order Value
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>

                    <th className="px-4 py-3">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {cancelledOrders.map(
                    (order) => {

                      const itemCount =
                        order.orderItems?.reduce(
                          (total, item) =>
                            total +
                            Number(
                              item.quantity || 0
                            ),
                          0
                        ) || 0;

                      return (
                        <tr
                          key={order._id}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >

                          {/* ORDER */}

                          <td className="px-4 py-4 font-semibold">

                            #
                            {order._id.slice(-8)}

                          </td>


                          {/* CUSTOMER */}

                          <td className="px-4 py-4">

                            <p className="font-medium">
                              {order.user?.name ||
                                order.shippingAddress
                                  ?.name ||
                                "Customer"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {order.user?.email ||
                                order.shippingAddress
                                  ?.email ||
                                ""}
                            </p>

                          </td>


                          {/* DATE */}

                          <td className="px-4 py-4 text-gray-600">

                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleDateString()
                              : "-"}

                          </td>


                          {/* ITEMS */}

                          <td className="px-4 py-4">

                            {itemCount}

                          </td>


                          {/* VALUE */}

                          <td className="px-4 py-4 font-semibold">

                            $
                            {Number(
                              order.totalPrice || 0
                            ).toFixed(2)}

                          </td>


                          {/* STATUS */}

                          <td className="px-4 py-4">

                            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                              Cancelled
                            </span>

                          </td>


                          {/* ACTION */}

                          <td className="px-4 py-4">

                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              View
                            </Link>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </>

        )}

      </div>


      {/* ==================================================
          DELIVERED ORDERS
      ================================================== */}

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Completed Orders
            </h2>

            <p className="mt-1 text-gray-500">
              Orders successfully delivered to customers.
            </p>

          </div>

          <Link
            to="/admin/revenue"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            View Revenue →
          </Link>

        </div>


        {deliveredOrders.length === 0 ? (

          <div className="mt-6 rounded-lg bg-gray-50 p-6 text-center">

            <p className="text-gray-500">
              No completed orders yet.
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

                {deliveredOrders
                  .slice(0, 10)
                  .map((order) => (

                    <tr
                      key={order._id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
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
                          order.totalPrice || 0
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

                  ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ==================================================
          QUICK LINKS
      ================================================== */}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">

        <Link
          to="/admin/orders"
          className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
        >
          Manage Active Orders
        </Link>

        <Link
          to="/admin/revenue"
          className="rounded-lg border px-6 py-3 text-center font-semibold hover:bg-gray-100"
        >
          Revenue Dashboard
        </Link>

      </div>

    </section>
  );
}