import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../../components/product/ProductCard";
import ProductFilters from "../../components/product/ProductFilters";

import api from "../../services/api";

import {
  setProducts,
  setProductLoading,
  setProductError,
} from "../../store/features/product/productSlice";

export default function Products() {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const { products, loading, error } = useSelector((state) => state.product);

  // =========================
  // GET CATEGORY FROM URL
  // =========================

  const categoryFromUrl = searchParams.get("category") || "All";

  const searchFromUrl = searchParams.get("search") || "";

  // =========================
  // FILTER STATES
  // =========================

  const [search, setSearch] = useState(searchFromUrl);
  const [category, setCategory] = useState(categoryFromUrl);
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState("All");

  useEffect(() => {
    setSearch(searchFromUrl);
  }, [searchFromUrl]);
  // =========================
  // UPDATE CATEGORY WHEN URL
  // CHANGES
  // =========================

  useEffect(() => {
    setCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  // =========================
  // GET PRODUCTS
  // =========================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(setProductLoading(true));
        dispatch(setProductError(""));

        const response = await api.get("/products");

        console.log("Products from backend:", response.data);

        dispatch(setProducts(response.data.products || []));
      } catch (error) {
        console.error("Failed to fetch products:", error);

        dispatch(
          setProductError(
            error.response?.data?.message || "Failed to load products",
          ),
        );
      }
    };

    fetchProducts();
  }, [dispatch]);

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = products
    .filter((product) => {
      // -------------------------
      // SEARCH
      // -------------------------

      const productName = product.name?.toLowerCase() || "";

      const productCategory = product.category?.toLowerCase() || "";

      const searchText = search.toLowerCase().trim();

      const matchSearch =
        productName.includes(searchText) ||
        productCategory.includes(searchText);

      // -------------------------
      // CATEGORY
      // -------------------------

      const matchCategory =
        category === "All" || productCategory === category.toLowerCase();

      // -------------------------
      // PRICE RANGE
      // -------------------------

      const price = Number(product.price) || 0;

      let matchPrice = true;

      if (priceRange === "under50") {
        matchPrice = price < 50;
      }

      if (priceRange === "50to100") {
        matchPrice = price >= 50 && price <= 100;
      }

      if (priceRange === "100to200") {
        matchPrice = price > 100 && price <= 200;
      }

      if (priceRange === "above200") {
        matchPrice = price > 200;
      }

      return matchSearch && matchCategory && matchPrice;
    })
    .sort((a, b) => {
      if (sort === "low") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "high") {
        return Number(b.price) - Number(a.price);
      }

      if (sort === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }

      return 0;
    });

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-center text-lg text-gray-500">Loading products...</p>
      </section>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-center text-lg text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      {/* =========================
          HEADING
      ========================= */}

      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold">Our Products</h1>

        <p className="mt-4 text-gray-600">Browse our latest collection.</p>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <ProductFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {/* =========================
          ACTIVE CATEGORY
      ========================= */}

      {category !== "All" && (
        <div className="mb-8 rounded-lg bg-blue-50 p-4">
          <p className="font-semibold text-blue-700">
            Showing products in: {category}
          </p>
        </div>
      )}

      {/* =========================
          PRODUCTS
      ========================= */}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((product) => (
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

      {/* =========================
          NO PRODUCTS
      ========================= */}

      {filteredProducts.length === 0 && (
        <p className="mt-10 text-center text-lg text-gray-500">
          No products found.
        </p>
      )}
    </section>
  );
}
