import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD DASHBOARD DATA
  // =========================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, ordersResponse] =
          await Promise.all([
            api.get("/products"),
            api.get("/orders/admin"),
          ]);

        setProducts(
          productsResponse.data.products || []
        );

        setOrders(
          ordersResponse.data.orders || []
        );
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =========================
  // CALCULATIONS
  // =========================

  const totalProducts = products.length;

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (total, order) =>
      total +
      Number(order.totalPrice || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) =>
      order.orderStatus === "Pending"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      order.orderStatus === "Processing"
  ).length;

  const shippedOrders = orders.filter(
    (order) =>
      order.orderStatus === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.orderStatus === "Delivered"
  ).length;

  // =========================
  // LOW STOCK
  // =========================

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.stock || 0) <= 5
    );

  // =========================
  // RECENT ORDERS
  // =========================

  const recentOrders =
    [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5);

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
          Admin Dashboard
        </h1>

        <p className="mt-6 text-gray-500">
          Loading dashboard...
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
            Dashboard Error
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
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Overview of your store.
        </p>

      </div>


      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* PRODUCTS */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Total Products
          </p>

          <p className="mt-2 text-3xl font-bold">
            {totalProducts}
          </p>

          <Link
            to="/admin/products"
            className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Manage Products →
          </Link>

        </div>


        {/* ORDERS */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Total Orders
          </p>

          <p className="mt-2 text-3xl font-bold">
            {totalOrders}
          </p>

          <Link
            to="/admin/orders"
            className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Manage Orders →
          </Link>

        </div>


        {/* REVENUE */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Total Revenue
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            ${totalRevenue.toFixed(2)}
          </p>

          <Link
            to="/admin/revenue"
            className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View Revenue →
          </Link>

        </div>


        {/* PENDING */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Pending Orders
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingOrders}
          </p>

          <Link
            to="/admin/orders"
            className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View Orders →
          </Link>

        </div>

      </div>


      {/* =========================
          ORDER STATUS SUMMARY
      ========================= */}

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-bold">
          Order Status
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-lg bg-yellow-50 p-5">

            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-700">
              {pendingOrders}
            </p>

          </div>


          <div className="rounded-lg bg-blue-50 p-5">

            <p className="text-sm text-gray-500">
              Processing
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-700">
              {processingOrders}
            </p>

          </div>


          <div className="rounded-lg bg-purple-50 p-5">

            <p className="text-sm text-gray-500">
              Shipped
            </p>

            <p className="mt-1 text-2xl font-bold text-purple-700">
              {shippedOrders}
            </p>

          </div>


          <div className="rounded-lg bg-green-50 p-5">

            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <p className="mt-1 text-2xl font-bold text-green-700">
              {deliveredOrders}
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          RECENT ORDERS
      ========================= */}

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <h2 className="text-2xl font-bold">
            Recent Orders
          </h2>

          <Link
            to="/admin/orders"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>

        </div>


        {recentOrders.length === 0 ? (

          <p className="mt-6 text-gray-500">
            No orders yet.
          </p>

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
                    Total
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

                {recentOrders.map(
                  (order) => {

                    const status =
                      order.orderStatus ||
                      "Pending";

                    return (
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


                        <td className="px-4 py-4 font-semibold">

                          $
                          {Number(
                            order.totalPrice ||
                              0
                          ).toFixed(2)}

                        </td>


                        <td className="px-4 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>

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
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =========================
          LOW STOCK
      ========================= */}

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <h2 className="text-2xl font-bold">
            Low Stock Products
          </h2>

          <Link
            to="/admin/products"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Manage Products
          </Link>

        </div>


        {lowStockProducts.length === 0 ? (

          <p className="mt-6 text-green-600">
            All products have healthy stock levels.
          </p>

        ) : (

          <div className="mt-6 space-y-3">

            {lowStockProducts
              .slice(0, 5)
              .map((product) => (

                <div
                  key={product._id}
                  className="flex items-center justify-between rounded-lg bg-red-50 p-4"
                >

                  <div>

                    <p className="font-semibold">
                      {product.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {product.category}
                    </p>

                  </div>


                  <span className="font-bold text-red-600">

                    {Number(
                      product.stock || 0
                    )}{" "}
                    left

                  </span>

                </div>

              ))}

          </div>

        )}

      </div>

    </section>
  );
}