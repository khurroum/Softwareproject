import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";

export default function Hero() {
return (
    <section className="bg-gray-50">
    <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-6 py-16 md:flex-row">
        
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            New Collection 2026
        </span>

        <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
            Shop Smarter,
            <br />
            Live Better.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-600">
            Discover premium products at affordable prices.
            Enjoy secure payments, fast delivery,
            and an effortless shopping experience.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
            to="/products"
            className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
            Shop Now
            </Link>

            <Link
            to="/about"
            className="rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold hover:bg-gray-100"
            >
            Learn More
            </Link>
        </div>
        </div>

        {/* Right Image */}
        <div className="flex-1">
        <img
            src={heroImage}
            alt="Shopping"
            className="mx-auto w-full max-w-md"
        />
        </div>

    </div>
    </section>
);
}