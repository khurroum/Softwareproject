import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiArrowUpRight } from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/features/cart/cartSlice";

export default function ProductCard({
  id,
  name,
  category,
  price,
  oldPrice,
  rating,
  image,
  stock,
}) {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const isInCart = cartItems.some(
    (item) => item.productId === id || item._id === id,
  );

  const handleAddToCart = () => {
    if (!stock || stock <= 0) {
      return;
    }

    dispatch(
      addToCart({
        productId: id,
        name,
        price,
        image,
        quantity: 1,
      }),
    );
  };

  const discount =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
      {/* =========================
          IMAGE
      ========================= */}

      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
        />

        {/* Image gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Out of stock */}
        {(!stock || stock <= 0) && (
          <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-gray-900 hover:text-white"
        >
          <FiHeart size={18} />
        </button>

        {/* Quick view */}
        <Link
          to={`/products/${id}`}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-4 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-gray-900 hover:text-white"
        >
          Quick view
          <FiArrowUpRight size={16} />
        </Link>
      </div>

      {/* =========================
          CONTENT
      ========================= */}

      <div className="flex flex-1 flex-col p-5">
        {/* Category */}
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          {category}
        </p>

        {/* Product name */}
        <Link
          to={`/products/${id}`}
          className="line-clamp-2 min-h-[48px] text-lg font-semibold leading-6 text-gray-900 transition hover:text-blue-600"
        >
          {name}
        </Link>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm text-yellow-500">★</span>

            <span className="text-sm font-medium text-gray-700">
              {rating ?? "N/A"}
            </span>
          </div>

          <span className="text-gray-300">|</span>

          <span className="text-xs text-gray-500">
            {stock > 0 ? `${stock} available` : "Unavailable"}
          </span>
        </div>

        {/* Price */}
        <div className="mt-5 flex items-end gap-3">
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            ${Number(price).toFixed(2)}
          </span>

          {oldPrice && oldPrice > price && (
            <span className="pb-0.5 text-sm text-gray-400 line-through">
              ${Number(oldPrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!stock || stock <= 0 || isInCart}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
              !stock || stock <= 0
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : isInCart
                  ? "cursor-not-allowed bg-gray-100 text-gray-500"
                  : "bg-gray-900 text-white hover:bg-blue-600 active:scale-[0.98]"
            }`}
          >
            <FiShoppingCart size={17} />

            {!stock || stock <= 0
              ? "Out of Stock"
              : isInCart
                ? "In Cart"
                : "Add to Cart"}
          </button>

          <Link
            to={`/products/${id}`}
            className="flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-900 hover:bg-gray-50"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
