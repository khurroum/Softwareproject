import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  // =========================
  // GET ALL ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/orders/admin"
      );

      setOrders(
        response.data.orders || []
      );
    } catch (error) {
      console.error(
        "Failed to get admin orders:",
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

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const handleStatusChange = async (
    orderId,
    orderStatus
  ) => {
    try {
      setUpdatingId(orderId);

      const response = await api.put(
        `/orders/${orderId}/status`,
        {
          orderStatus,
        }
      );

      const updatedOrder =
        response.data.order;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...updatedOrder,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="p-6 md:p-10">

        <h1 className="text-4xl font-bold">
          Orders
        </h1>

        <p className="mt-6 text-gray-500">
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
      <section className="p-6 md:p-10">

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <h1 className="text-2xl font-bold text-red-700">
            Unable to Load Orders
          </h1>

          <p className="mt-3 text-red-600">
            {error}
          </p>

          <button
            onClick={fetchOrders}
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

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Orders
          </h1>

          <p className="mt-2 text-gray-600">
            Manage customer orders and update
            their status.
          </p>

        </div>

        <div className="rounded-lg bg-gray-100 px-4 py-3">

          <span className="font-semibold">
            Total Orders:
          </span>{" "}

          {orders.length}

        </div>

      </div>


      {/* =========================
          NO ORDERS
      ========================= */}

      {orders.length === 0 ? (

        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">

          <h2 className="text-2xl font-bold">
            No Orders Yet
          </h2>

          <p className="mt-3 text-gray-500">
            Customer orders will appear here.
          </p>

        </div>

      ) : (

        <>

          {/* =========================
              DESKTOP TABLE
          ========================= */}

          <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr className="border-b text-left">

                    <th className="px-5 py-4">
                      Order
                    </th>

                    <th className="px-5 py-4">
                      Customer
                    </th>

                    <th className="px-5 py-4">
                      Date
                    </th>

                    <th className="px-5 py-4">
                      Items
                    </th>

                    <th className="px-5 py-4">
                      Total
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {orders.map((order) => {

                    const itemCount =
                      order.orderItems?.reduce(
                        (total, item) =>
                          total +
                          Number(
                            item.quantity || 0
                          ),
                        0
                      ) || 0;

                    const status =
                      order.orderStatus ||
                      "Pending";

                    return (
                      <tr
                        key={order._id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >

                        {/* ORDER */}

                        <td className="px-5 py-5">

                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="font-semibold text-blue-600 hover:text-blue-700"
                          >
                            #
                            {order._id.slice(-8)}
                          </Link>

                        </td>


                        {/* CUSTOMER */}

                        <td className="px-5 py-5">

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

                        <td className="px-5 py-5 text-gray-600">

                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString()
                            : "-"}

                        </td>


                        {/* ITEMS */}

                        <td className="px-5 py-5">

                          {itemCount}

                        </td>


                        {/* TOTAL */}

                        <td className="px-5 py-5 font-semibold">

                          $
                          {Number(
                            order.totalPrice || 0
                          ).toFixed(2)}

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-5">

                          <select
                            value={status}
                            disabled={
                              updatingId ===
                              order._id
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                order._id,
                                event.target.value
                              )
                            }
                            className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none ${getStatusClass(
                              status
                            )}`}
                          >

                            {ORDER_STATUSES.map(
                              (statusOption) => (

                                <option
                                  key={
                                    statusOption
                                  }
                                  value={
                                    statusOption
                                  }
                                >
                                  {statusOption}
                                </option>

                              )
                            )}

                          </select>

                          {updatingId ===
                            order._id && (
                            <p className="mt-1 text-xs text-gray-500">
                              Updating...
                            </p>
                          )}

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-5">

                          <Link
                            to={`/admin/orders/${order._id}`}
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

          </div>


          {/* =========================
              MOBILE CARDS
          ========================= */}

          <div className="space-y-5 md:hidden">

            {orders.map((order) => {

              const itemCount =
                order.orderItems?.reduce(
                  (total, item) =>
                    total +
                    Number(
                      item.quantity || 0
                    ),
                  0
                ) || 0;

              const status =
                order.orderStatus ||
                "Pending";

              return (
                <div
                  key={order._id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-sm text-gray-500">
                        Order
                      </p>

                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="font-bold text-blue-600"
                      >
                        #{order._id.slice(-8)}
                      </Link>

                    </div>


                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>

                  </div>


                  <div className="mt-5 space-y-3">

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Customer
                      </span>

                      <span className="font-medium">
                        {order.user?.name ||
                          order.shippingAddress
                            ?.name ||
                          "Customer"}
                      </span>

                    </div>


                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Date
                      </span>

                      <span>
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </span>

                    </div>


                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Items
                      </span>

                      <span>
                        {itemCount}
                      </span>

                    </div>


                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Total
                      </span>

                      <span className="font-bold">
                        $
                        {Number(
                          order.totalPrice || 0
                        ).toFixed(2)}
                      </span>

                    </div>

                  </div>


                  {/* MOBILE STATUS */}

                  <div className="mt-5">

                    <label className="mb-2 block text-sm font-semibold">
                      Update Status
                    </label>

                    <select
                      value={status}
                      disabled={
                        updatingId ===
                        order._id
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          order._id,
                          event.target.value
                        )
                      }
                      className={`w-full rounded-lg border px-3 py-3 font-semibold outline-none ${getStatusClass(
                        status
                      )}`}
                    >

                      {ORDER_STATUSES.map(
                        (statusOption) => (

                          <option
                            key={statusOption}
                            value={statusOption}
                          >
                            {statusOption}
                          </option>

                        )
                      )}

                    </select>

                  </div>


                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="mt-4 block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                  >
                    View Order
                  </Link>

                </div>
              );
            })}

          </div>

        </>

      )}

    </section>
  );
}