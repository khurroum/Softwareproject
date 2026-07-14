import { Link } from "react-router-dom";
import CategoryCard from "../common/CategoryCard";

import electronics from "../../assets/categories/electronics.jpg";
import fashion from "../../assets/categories/fashion.jpg";
import grocery from "../../assets/categories/grocery.jpg";
import furniture from "../../assets/categories/furniture.jpg";
import sports from "../../assets/categories/sports.jpg";
import beauty from "../../assets/categories/beauty.jpg";

const categories = [
  {
    title: "Electronics",
    image: electronics,
  },
  {
    title: "Fashion",
    image: fashion,
  },
  {
    title: "Grocery",
    image: grocery,
  },
  {
    title: "Furniture",
    image: furniture,
  },
  {
    title: "Sports",
    image: sports,
  },
  {
    title: "Beauty",
    image: beauty,
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      {/* =========================
          HEADING
      ========================= */}

      <div className="mb-10 text-center">

        <h2 className="text-4xl font-bold">
          Shop by Category
        </h2>

        <p className="mt-3 text-gray-600">
          Browse products from your favorite categories.
        </p>

      </div>


      {/* =========================
          CATEGORY CARDS
      ========================= */}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {categories.map((category) => (
          <Link
            key={category.title}
            to={`/products?category=${encodeURIComponent(
              category.title
            )}`}
            className="block transition duration-200 hover:-translate-y-1"
          >
            <CategoryCard
              title={category.title}
              image={category.image}
            />
          </Link>
        ))}

      </div>

    </section>
  );
}