import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiHeart, FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import ProductCard from "../../components/product/ProductCard";
import { addToCart } from "../../store/features/cart/cartSlice";
import { formatPrice } from "../../utils/currency";
import api from "../../services/api";

export default function ProductDetails() {
  const { id } = useParams();

  const dispatch = useDispatch();

  // ==================================================
  // SETTINGS
  // ==================================================

  const currency = useSelector(
    (state) => state.settings.currency
  );

  // ==================================================
  // STATE
  // ==================================================

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);

  // ==================================================
  // GET PRODUCT
  // ==================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/products/${id}`
        );

        console.log(
          "Product details:",
          response.data
        );

        const currentProduct =
          response.data.product;

        setProduct(currentProduct);

        // ==================================================
        // GET RELATED PRODUCTS
        // ==================================================

        const productsResponse =
          await api.get("/products");

        const allProducts =
          productsResponse.data.products || [];

        const related =
          allProducts.filter(
            (item) =>
              item.category ===
                currentProduct.category &&
              item._id !== currentProduct._id
          );

        setRelatedProducts(related);

      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load product"
        );

      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="py-20 text-center text-2xl text-gray-500">
        Loading product...
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div className="py-20 text-center text-2xl text-red-500">
        {error}
      </div>
    );
  }

  // ==================================================
  // PRODUCT NOT FOUND
  // ==================================================

  if (!product) {
    return (
      <div className="py-20 text-center text-3xl">
        Product Not Found
      </div>
    );
  }

  // ==================================================
  // ADD TO CART
  // ==================================================

  const handleAddToCart = () => {
    if (!product.stock || product.stock <= 0) {
      return;
    }

    dispatch(
      addToCart({
        id: product._id,
        productId: product._id,
        name: product.name,
        category: product.category,
        image: product.image,
        price: product.price,
        oldPrice: product.oldPrice,
        rating: product.rating,
        stock: product.stock,
        quantity,
      })
    );
  };

  // ==================================================
  // INCREASE QUANTITY
  // ==================================================

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // ==================================================
  // DECREASE QUANTITY
  // ==================================================

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      {/* ==================================================
          PRODUCT DETAILS
      ================================================== */}

      <div className="grid gap-12 md:grid-cols-2">

        {/* ==================================================
            PRODUCT IMAGE
        ================================================== */}

        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl shadow-lg"
          />
        </div>


        {/* ==================================================
            PRODUCT INFORMATION
        ================================================== */}

        <div>

          {/* CATEGORY */}

          <p className="text-blue-600">
            {product.category}
          </p>


          {/* PRODUCT NAME */}

          <h1 className="mt-2 text-5xl font-bold">
            {product.name}
          </h1>


          {/* ==================================================
              RATING
          ================================================== */}

          <div className="mt-4 flex items-center gap-2">

            <FiStar
              className="fill-yellow-400 text-yellow-400"
              size={20}
            />

            <span>
              {product.rating || 0}
            </span>

            <span className="text-gray-500">
              ({product.numReviews || 0} reviews)
            </span>

          </div>


          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <p className="mt-6 text-gray-600">
            {product.description}
          </p>


          {/* ==================================================
              PRICE
          ================================================== */}

          <div className="mt-8 flex items-center gap-4">

            <span className="text-4xl font-bold text-blue-600">
              {formatPrice(
                product.price,
                currency
              )}
            </span>


            {product.oldPrice &&
              product.oldPrice > product.price && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(
                    product.oldPrice,
                    currency
                  )}
                </span>
              )}

          </div>


          {/* ==================================================
              STOCK
          ================================================== */}

          {product.stock > 0 ? (

            <p className="mt-4 font-semibold text-green-600">
              In Stock ({product.stock} available)
            </p>

          ) : (

            <p className="mt-4 font-semibold text-red-600">
              Out of Stock
            </p>

          )}


          {/* ==================================================
              QUANTITY
          ================================================== */}

          {product.stock > 0 && (

            <div className="mt-6 flex items-center gap-4">

              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="rounded border px-4 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                -
              </button>


              <span className="text-xl font-bold">
                {quantity}
              </span>


              <button
                type="button"
                onClick={increaseQuantity}
                disabled={
                  quantity >= product.stock
                }
                className="rounded border px-4 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>

            </div>

          )}


          {/* ==================================================
              BUTTONS
          ================================================== */}

          <div className="mt-8 flex gap-4">

            <button
              type="button"
              disabled={
                !product.stock ||
                product.stock <= 0
              }
              onClick={handleAddToCart}
              className="rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Add to Cart
            </button>


            <button
              type="button"
              aria-label="Add to wishlist"
              className="rounded-lg border px-5 py-4 transition hover:bg-gray-100"
            >
              <FiHeart size={22} />
            </button>

          </div>

        </div>

      </div>


      {/* ==================================================
          RELATED PRODUCTS
      ================================================== */}

      {relatedProducts.length > 0 && (

        <div className="mt-20">

          <h2 className="mb-8 text-3xl font-bold">
            Related Products
          </h2>


          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {relatedProducts.map((item) => (

              <ProductCard
                key={item._id}
                id={item._id}
                name={item.name}
                category={item.category}
                price={item.price}
                oldPrice={item.oldPrice}
                rating={item.rating}
                image={item.image}
                stock={item.stock}
              />

            ))}

          </div>

        </div>

      )}

    </section>
  );
}