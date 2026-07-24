import { useEffect, useState } from "react";
import ProductCard from "../product/ProductCard";
import api from "../../services/api";

export default function FeaturedProducts() {
  console.log("🔥 FeaturedProducts component is running");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");

        console.log(
          "Featured products:",
          response.data
        );

        const allProducts = response.data.products || [];

        // Show the latest 4 products
        setProducts(allProducts.slice(0, 4));
      } catch (error) {
        console.error(
          "Failed to fetch featured products:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load featured products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Featured Products
          </h2>

          <p className="mt-3 text-gray-600">
            Discover our best-selling products.
          </p>
        </div>

        <p className="text-center text-gray-500">
          Loading products...
        </p>
      </section>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Featured Products
          </h2>

          <p className="mt-3 text-gray-600">
            Discover our best-selling products.
          </p>
        </div>

        <p className="text-center text-red-500">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      {/* Heading */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold">
          Featured Products
        </h2>

        <p className="mt-3 text-gray-600">
          Discover our best-selling products.
        </p>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              category={product.category}
              price={product.price}
              oldPrice={product.oldPrice}
              rating={product.rating}
              image={product.image}
              stock={product.stock}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No featured products available.
        </p>
      )}

    </section>
  );
}