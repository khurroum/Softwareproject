import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("");

  // ==================================================
  // GET ORDER
  // ==================================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Admin Order ID:",
          id
        );

        if (!id) {
          setError("Invalid order ID.");
          return;
        }

        // IMPORTANT:
        // Use /admin/reports because /admin only
        // returns active orders.
        //
        // Delivered and Cancelled orders are excluded
        // from /admin, but reports contains ALL orders.

        const response = await api.get(
          "/orders/admin/reports"
        );

        const allOrders =
          response.data.orders || [];

        const foundOrder =
          allOrders.find(
            (item) =>
              String(item._id) === String(id)
          );

        if (!foundOrder) {
          setError("Order not found.");
          return;
        }

        setOrder(foundOrder);

        setSelectedStatus(
          foundOrder.orderStatus ||
            "Pending"
        );
      } catch (error) {
        console.error(
          "Failed to get admin order:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to get order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // ==================================================
  // UPDATE STATUS
  // ==================================================

  const handleStatusUpdate = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response =
        await api.put(
          `/orders/${id}/status`,
          {
            orderStatus:
              selectedStatus,
          }
        );

      const updatedOrder =
        response.data.order;

      setOrder((currentOrder) => ({
        ...currentOrder,
        ...updatedOrder,
      }));

      setSelectedStatus(
        updatedOrder.orderStatus
      );

      setSuccess(
        "Order status updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update order:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="p-6 md:p-10">

        <p className="text-center text-lg text-gray-500">
          Loading order...
        </p>

      </section>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error && !order) {
    return (
      <section className="p-6 md:p-10">

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <h1 className="text-2xl font-bold text-red-700">
            Unable to Load Order
          </h1>

          <p className="mt-3 text-red-600">
            {error}
          </p>

          <Link
            to="/admin/orders"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Orders
          </Link>

        </div>

      </section>
    );
  }

  if (!order) {
    return null;
  }

  // ==================================================
  // ITEM COUNT
  // ==================================================

  const totalItems =
    order.orderItems?.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    ) || 0;

  // ==================================================
  // STATUS CLASS
  // ==================================================

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

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <section className="p-6 md:p-10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Order Details
          </h1>

          <p className="mt-2 text-gray-500">
            Order #{order._id}
          </p>

        </div>

        <Link
          to="/admin/orders"
          className="rounded-lg border px-5 py-3 text-center font-semibold hover:bg-gray-100"
        >
          Back to Orders
        </Link>

      </div>


      {/* ==================================================
          MESSAGES
      ================================================== */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">

          <p className="text-red-600">
            {error}
          </p>

        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">

          <p className="text-green-600">
            {success}
          </p>

        </div>
      )}


      {/* ==================================================
          STATUS MANAGEMENT
      ================================================== */}

      <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-bold">
          Order Status
        </h2>

        <p className="mt-2 text-gray-500">
          Change the current status of this order.
        </p>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">

          <div className="flex-1">

            <label
              htmlFor="orderStatus"
              className="mb-2 block font-semibold"
            >
              Status
            </label>

            <select
              id="orderStatus"
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value
                )
              }
              className={`w-full rounded-lg border px-4 py-3 font-semibold outline-none focus:border-blue-500 ${getStatusClass(
                selectedStatus
              )}`}
            >

              {ORDER_STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}

            </select>

          </div>


          <button
            type="button"
            onClick={handleStatusUpdate}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {saving
              ? "Updating..."
              : "Update Status"}
          </button>

        </div>

      </div>


      {/* ==================================================
          ORDER SUMMARY
      ================================================== */}

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {/* STATUS */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Order Status
          </p>

          <p
            className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-bold ${getStatusClass(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </p>

        </div>


        {/* PAYMENT STATUS */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Payment Status
          </p>

          <p className="mt-2 text-xl font-bold">
            {order.paymentStatus || "-"}
          </p>

        </div>


        {/* PAYMENT METHOD */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Payment Method
          </p>

          <p className="mt-2 text-xl font-bold">
            {order.paymentMethod || "-"}
          </p>

        </div>


        {/* TOTAL ITEMS */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Items
          </p>

          <p className="mt-2 text-xl font-bold">
            {totalItems}
          </p>

        </div>

      </div>


      {/* ==================================================
          CUSTOMER + SHIPPING
      ================================================== */}

      <div className="grid gap-8 md:grid-cols-2">

        {/* CUSTOMER */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold">
            Customer Information
          </h2>

          <div className="mt-5 space-y-3">

            <p>

              <span className="font-semibold">
                Name:
              </span>{" "}

              {order.user?.name ||
                order.shippingAddress
                  ?.name ||
                "Customer"}

            </p>


            <p>

              <span className="font-semibold">
                Email:
              </span>{" "}

              {order.user?.email ||
                order.shippingAddress
                  ?.email ||
                "-"}

            </p>


            <p>

              <span className="font-semibold">
                Phone:
              </span>{" "}

              {order.shippingAddress
                ?.phone || "-"}

            </p>

          </div>

        </div>


        {/* SHIPPING */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold">
            Shipping Address
          </h2>

          <div className="mt-5 space-y-3">

            <p>
              {order.shippingAddress
                ?.address || "-"}
            </p>

            <p>
              {order.shippingAddress
                ?.city || "-"}
            </p>

            <p>
              {order.shippingAddress
                ?.postalCode || "-"}
            </p>

          </div>

        </div>

      </div>


      {/* ==================================================
          ORDER ITEMS
      ================================================== */}

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-bold">
          Order Items
        </h2>

        <div className="mt-6 space-y-5">

          {order.orderItems?.map(
            (item, index) => (

              <div
                key={`${item.product?._id || item.product || "item"}-${index}`}
                className="flex flex-col gap-4 border-b pb-5 last:border-b-0 sm:flex-row sm:items-center"
              >

                {/* IMAGE */}

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                    No Image
                  </div>
                )}


                {/* PRODUCT */}

                <div className="flex-1">

                  <h3 className="text-lg font-semibold">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-gray-500">
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                  <p className="mt-1 text-gray-500">
                    Price: $
                    {Number(
                      item.price || 0
                    ).toFixed(2)}
                  </p>

                </div>


                {/* ITEM TOTAL */}

                <div className="text-lg font-bold">

                  $
                  {(
                    Number(
                      item.price || 0
                    ) *
                    Number(
                      item.quantity || 0
                    )
                  ).toFixed(2)}

                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* ==================================================
          ORDER TOTAL
      ================================================== */}

      <div className="mt-8 rounded-xl border bg-gray-50 p-6">

        <div className="flex justify-between text-2xl font-bold">

          <span>
            Order Total
          </span>

          <span className="text-blue-600">

            $
            {Number(
              order.totalPrice || 0
            ).toFixed(2)}

          </span>

        </div>

      </div>

    </section>
  );
}