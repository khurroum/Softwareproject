import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

export default function EditProduct() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageError, setImageError] = useState(false);

  // ==================================================
  // GET PRODUCT
  // ==================================================
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("========== EDIT PRODUCT ==========");
        console.log("Product ID:", id);

        const response = await api.get(`/products/${id}`);

        console.log("Product response:", response.data);

        const product = response.data?.product;

        if (!product) {
          setError("Product not found.");
          return;
        }

        setFormData({
          name: product.name || "",
          description: product.description || "",
          category: product.category || "",
          price: product.price ?? "",
          oldPrice: product.oldPrice ?? "",
          image: product.image || "",
          stock: product.stock ?? "",
          rating: product.rating ?? "",
          numReviews: product.numReviews ?? "",
        });

        setImageError(false);
      } catch (error) {
        console.error("Failed to get product:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ==================================================
  // HANDLE INPUT
  // ==================================================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "image") {
      setImageError(false);
    }
  };

  // ==================================================
  // UPDATE PRODUCT
  // ==================================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ==================================================
    // BASIC VALIDATION
    // ==================================================
    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Product category is required.");
      return;
    }

    if (formData.price === "") {
      setError("Product price is required.");
      return;
    }

    if (!formData.image.trim()) {
      setError("Product image URL is required.");
      return;
    }

    // ==================================================
    // CONVERT NUMBERS
    // ==================================================
    const price = Number(formData.price);
    const oldPrice =
      formData.oldPrice === ""
        ? 0
        : Number(formData.oldPrice);

    const stock =
      formData.stock === ""
        ? 0
        : Number(formData.stock);

    const rating =
      formData.rating === ""
        ? 0
        : Number(formData.rating);

    const numReviews =
      formData.numReviews === ""
        ? 0
        : Number(formData.numReviews);

    // ==================================================
    // NUMBER VALIDATION
    // ==================================================
    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!Number.isFinite(oldPrice) || oldPrice < 0) {
      setError("Please enter a valid old price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a whole number of 0 or greater.");
      return;
    }

    if (
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      setError("Rating must be between 0 and 5.");
      return;
    }

    if (
      !Number.isInteger(numReviews) ||
      numReviews < 0
    ) {
      setError(
        "Number of reviews must be a whole number of 0 or greater."
      );
      return;
    }

    // ==================================================
    // PREPARE DATA
    // ==================================================
    const productData = {
      name: formData.name.trim(),

      description: formData.description.trim(),

      category: formData.category.trim(),

      price,

      oldPrice,

      image: formData.image.trim(),

      stock,

      rating,

      numReviews,
    };

    try {
      setSaving(true);

      console.log("========== UPDATE PRODUCT ==========");
      console.log("Product ID:", id);
      console.log("Product data:", productData);

      const response = await api.put(
        `/products/${id}`,
        productData
      );

      console.log(
        "Product updated successfully:",
        response.data
      );

      setSuccess("Product updated successfully!");

      // Give the user a moment to see success message.
      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update product."
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
        <div className="mx-auto max-w-5xl">

          <h1 className="text-4xl font-bold">
            Edit Product
          </h1>

          <p className="mt-6 text-gray-500">
            Loading product...
          </p>

        </div>
      </section>
    );
  }

  // ==================================================
  // PRODUCT LOAD ERROR
  // ==================================================
  if (error && !formData.name) {
    return (
      <section className="p-6 md:p-10">
        <div className="mx-auto max-w-5xl">

          <div className="rounded-xl border border-red-200 bg-red-50 p-6">

            <h1 className="text-2xl font-bold text-red-700">
              Unable to Load Product
            </h1>

            <p className="mt-3 text-red-600">
              {error}
            </p>

            <Link
              to="/admin/products"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Back to Products
            </Link>

          </div>

        </div>
      </section>
    );
  }

  return (
    <section className="p-6 md:p-10">

      <div className="mx-auto max-w-5xl">

        {/* ==================================================
            HEADER
        ================================================== */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Edit Product
            </h1>

            <p className="mt-2 text-gray-600">
              Update your product information.
            </p>
          </div>

          <Link
            to="/admin/products"
            className="rounded-lg border px-5 py-3 text-center font-semibold hover:bg-gray-100"
          >
            Back to Products
          </Link>

        </div>


        {/* ==================================================
            FORM
        ================================================== */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-white p-6 shadow-sm md:p-8"
        >

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


          <div className="grid gap-6 md:grid-cols-2">

            {/* ==================================================
                PRODUCT NAME
            ================================================== */}
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
                placeholder="Enter product name"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* ==================================================
                CATEGORY
            ================================================== */}
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
                placeholder="e.g. Electronics"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* ==================================================
                PRICE
            ================================================== */}
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
                placeholder="0.00"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* ==================================================
                OLD PRICE
            ================================================== */}
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
                placeholder="0.00"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* ==================================================
                STOCK
            ================================================== */}
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
                step="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* ==================================================
                IMAGE URL
            ================================================== */}
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


              {/* ==================================================
                  IMAGE PREVIEW
              ================================================== */}
              {formData.image && !imageError && (
                <div className="mt-4">

                  <p className="mb-2 text-sm font-medium text-gray-600">
                    Image Preview
                  </p>

                  <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg border bg-gray-50">

                    <img
                      src={formData.image}
                      alt={formData.name || "Product preview"}
                      className="h-full w-full object-cover"
                      onError={() => {
                        setImageError(true);
                      }}
                    />

                  </div>

                </div>
              )}

              {formData.image && imageError && (
                <p className="mt-3 text-sm text-red-500">
                  Unable to preview this image URL.
                </p>
              )}

            </div>


            {/* ==================================================
                RATING
            ================================================== */}
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
                placeholder="0"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* ==================================================
                REVIEWS
            ================================================== */}
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
                step="1"
                value={formData.numReviews}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* ==================================================
                DESCRIPTION
            ================================================== */}
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
                placeholder="Enter product description"
                className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

          </div>


          {/* ==================================================
              BUTTONS
          ================================================== */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

            <Link
              to="/admin/products"
              className="rounded-lg border px-8 py-3 text-center font-semibold hover:bg-gray-100"
            >
              Cancel
            </Link>

          </div>

        </form>

      </div>

    </section>
  );
}