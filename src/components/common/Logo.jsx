import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Logo() {
  const storeName = useSelector(
    (state) => state.settings.storeName
  );

  return (
    <Link
      to="/"
      className="text-2xl font-bold text-blue-600 transition-colors hover:text-blue-700"
    >
      {storeName || "ShopEase"}
    </Link>
  );
}