import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

export default function CategoryCard({ title, image }) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(title)}`}
      className="group relative block overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
        />

        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />

        {/* Arrow */}
        <div className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white/90 text-gray-900 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <FiArrowUpRight size={20} />
        </div>

        {/* Text */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            Explore
          </p>

          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">{title}</h3>

            <span className="translate-x-2 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              Shop now
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
