import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6">

      <div className="text-center">

        <p className="text-8xl font-bold text-blue-600">
          404
        </p>

        <h1 className="mt-6 text-4xl font-bold">
          Page Not Found
        </h1>

        <p className="mt-4 text-gray-600">
          Sorry, the page you are looking for does not
          exist or may have been moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Back to Home
        </Link>

      </div>

    </section>
  );
}