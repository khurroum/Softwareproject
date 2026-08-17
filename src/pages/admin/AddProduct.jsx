import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

export default function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    oldPrice: "",
    image: "",
    stock: "",
    rating: "",
    numReviews: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Basic validation
      if (
        !formData.name.trim() ||
        !formData.description.trim() ||
        !formData.category.trim() ||
        !formData.price ||
        !formData.image.trim()
      ) {
        setError(
          "Please fill in name, description, category, price, and image."
        );

        return;
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        oldPrice: formData.oldPrice
          ? Number(formData.oldPrice)
          : undefined,
        image: formData.image.trim(),
        stock: formData.stock
          ? Number(formData.stock)
          : 0,
        rating: formData.rating
          ? Number(formData.rating)
          : 0,
        numReviews: formData.numReviews
          ? Number(formData.numReviews)
          : 0,
      };

      const response = await api.post(
        "/products",
        productData
      );

      console.log(
        "Product created:",
        response.data
      );

      setSuccess(
        "Product created successfully!"
      );

      // Redirect to product management
      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (error) {
      console.error(
        "Failed to create product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 md:p-10">

      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Add Product
          </h1>

          <p className="mt-2 text-gray-600">
            Add a new product to your store.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="rounded-lg border px-5 py-3 text-center font-semibold hover:bg-gray-100"
        >
          Back to Products
        </Link>

      </div>


      {/* =========================
          FORM
      ========================= */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl rounded-xl border bg-white p-6 shadow-sm md:p-8"
      >

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-600">
              {error}
            </p>
          </div>
        )}


        {/* =========================
            SUCCESS
        ========================= */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-green-600">
              {success}
            </p>
          </div>
        )}


        <div className="grid gap-6 md:grid-cols-2">

          {/* =========================
              NAME
          ========================= */}
          <div className="md:col-span-2">

            <label
              htmlFor="name"
              className="mb-2 block font-semibold"
            >
              Product Name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Wireless Headphones"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* =========================
              CATEGORY
          ========================= */}
          <div>

            <label
              htmlFor="category"
              className="mb-2 block font-semibold"
            >
              Category *
            </label>

            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="Electronics"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* =========================
              PRICE
          ========================= */}
          <div>

            <label
              htmlFor="price"
              className="mb-2 block font-semibold"
            >
              Price *
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="99.99"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* =========================
              OLD PRICE
          ========================= */}
          <div>

            <label
              htmlFor="oldPrice"
              className="mb-2 block font-semibold"
            >
              Old Price
            </label>

            <input
              id="oldPrice"
              name="oldPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.oldPrice}
              onChange={handleChange}
              placeholder="129.99"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* =========================
              STOCK
          ========================= */}
          <div>

            <label
              htmlFor="stock"
              className="mb-2 block font-semibold"
            >
              Stock
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="20"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* =========================
              IMAGE URL
          ========================= */}
          <div className="md:col-span-2">

            <label
              htmlFor="image"
              className="mb-2 block font-semibold"
            >
              Image URL *
            </label>

            <input
              id="image"
              name="image"
              type="text"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <p className="mt-2 text-sm text-gray-500">
              Enter the direct URL of the product image.
            </p>

          </div>


          {/* =========================
              RATING
          ========================= */}
          <div>

            <label
              htmlFor="rating"
              className="mb-2 block font-semibold"
            >
              Rating
            </label>

            <input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              placeholder="4.5"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* =========================
              REVIEWS
          ========================= */}
          <div>

            <label
              htmlFor="numReviews"
              className="mb-2 block font-semibold"
            >
              Number of Reviews
            </label>

            <input
              id="numReviews"
              name="numReviews"
              type="number"
              min="0"
              value={formData.numReviews}
              onChange={handleChange}
              placeholder="10"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* =========================
              DESCRIPTION
          ========================= */}
          <div className="md:col-span-2">

            <label
              htmlFor="description"
              className="mb-2 block font-semibold"
            >
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

        </div>


        {/* =========================
            BUTTONS
        ========================= */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Creating Product..."
              : "Create Product"}
          </button>

          <Link
            to="/admin/products"
            className="rounded-lg border px-8 py-3 text-center font-semibold hover:bg-gray-100"
          >
            Cancel
          </Link>

        </div>

      </form>

    </section>
  );
}