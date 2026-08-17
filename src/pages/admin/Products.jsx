import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // GET PRODUCTS
  // ==================================================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      console.log("Admin products:", response.data);

      setProducts(response.data.products || []);
    } catch (error) {
      console.error(
        "Failed to get products:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // LOAD PRODUCTS
  // ==================================================
  useEffect(() => {
    fetchProducts();
  }, []);

  // ==================================================
  // DELETE PRODUCT
  // ==================================================
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await api.delete(`/products/${id}`);

      // Remove product immediately from UI
      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== id
        )
      );

      setSuccess(
        `"${name}" deleted successfully.`
      );

      // Remove success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================
  if (loading) {
    return (
      <section className="p-6 md:p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Products
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your products.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-xl border bg-white p-10 text-center">
          <p className="text-lg text-gray-500">
            Loading products...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 md:p-10">

      {/* ==================================================
          HEADER
      ================================================== */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Products
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your store products.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
        >
          + Add Product
        </Link>

      </div>


      {/* ==================================================
          ERROR MESSAGE
      ================================================== */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-600">
            {error}
          </p>
        </div>
      )}


      {/* ==================================================
          SUCCESS MESSAGE
      ================================================== */}
      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="font-medium text-green-600">
            {success}
          </p>
        </div>
      )}


      {/* ==================================================
          NO PRODUCTS
      ================================================== */}
      {products.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">

          <h2 className="text-2xl font-bold">
            No Products Found
          </h2>

          <p className="mt-3 text-gray-500">
            You haven't added any products yet.
          </p>

          <Link
            to="/admin/products/add"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Add Your First Product
          </Link>

        </div>
      ) : (
        <>
          {/* ==================================================
              DESKTOP TABLE
          ================================================== */}
          <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr className="border-b text-left">

                  <th className="px-6 py-4">
                    Product
                  </th>

                  <th className="px-6 py-4">
                    Category
                  </th>

                  <th className="px-6 py-4">
                    Price
                  </th>

                  <th className="px-6 py-4">
                    Stock
                  </th>

                  <th className="px-6 py-4">
                    Rating
                  </th>

                  <th className="px-6 py-4">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {products.map((product) => (

                  <tr
                    key={product._id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >

                    {/* PRODUCT */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 rounded-lg border object-cover"
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://placehold.co/100x100?text=No+Image";
                          }}
                        />

                        <div>
                          <p className="font-semibold">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            ID: {product._id}
                          </p>
                        </div>

                      </div>

                    </td>


                    {/* CATEGORY */}
                    <td className="px-6 py-5 text-gray-600">
                      {product.category || "-"}
                    </td>


                    {/* PRICE */}
                    <td className="px-6 py-5 font-semibold">

                      ${Number(product.price || 0).toFixed(2)}

                    </td>


                    {/* STOCK */}
                    <td className="px-6 py-5">

                      <span
                        className={
                          product.stock <= 0
                            ? "font-semibold text-red-600"
                            : product.stock <= 5
                            ? "font-semibold text-yellow-600"
                            : "text-green-600"
                        }
                      >
                        {product.stock ?? 0}
                      </span>

                    </td>


                    {/* RATING */}
                    <td className="px-6 py-5">

                      <span>
                        ⭐{" "}
                        {Number(
                          product.rating || 0
                        ).toFixed(1)}
                      </span>

                      <span className="ml-2 text-sm text-gray-500">
                        ({product.numReviews || 0})
                      </span>

                    </td>


                    {/* ACTIONS */}
                    <td className="px-6 py-5">

                      <div className="flex flex-wrap gap-2">

                        {/* EDIT */}
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="rounded-lg border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </Link>


                        {/* DELETE */}
                        <button
                          type="button"
                          disabled={
                            deletingId === product._id
                          }
                          onClick={() =>
                            handleDelete(
                              product._id,
                              product.name
                            )
                          }
                          className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === product._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* ==================================================
              MOBILE CARDS
          ================================================== */}
          <div className="space-y-5 md:hidden">

            {products.map((product) => (

              <div
                key={product._id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >

                {/* PRODUCT HEADER */}
                <div className="flex gap-4">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 rounded-lg border object-cover"
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://placehold.co/100x100?text=No+Image";
                    }}
                  />

                  <div className="flex-1">

                    <h2 className="font-bold">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {product.category || "No category"}
                    </p>

                  </div>

                </div>


                {/* PRODUCT INFO */}
                <div className="mt-5 space-y-3">

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Price
                    </span>

                    <span className="font-semibold">
                      $
                      {Number(
                        product.price || 0
                      ).toFixed(2)}
                    </span>

                  </div>


                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Stock
                    </span>

                    <span className="font-semibold">
                      {product.stock ?? 0}
                    </span>

                  </div>


                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Rating
                    </span>

                    <span>
                      ⭐{" "}
                      {Number(
                        product.rating || 0
                      ).toFixed(1)}
                    </span>

                  </div>

                </div>


                {/* ACTIONS */}
                <div className="mt-5 flex gap-3">

                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="flex-1 rounded-lg border border-blue-500 px-4 py-3 text-center font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </Link>


                  <button
                    type="button"
                    disabled={
                      deletingId === product._id
                    }
                    onClick={() =>
                      handleDelete(
                        product._id,
                        product.name
                      )
                    }
                    className="flex-1 rounded-lg border border-red-500 px-4 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === product._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            ))}

          </div>
        </>
      )}

    </section>
  );
}