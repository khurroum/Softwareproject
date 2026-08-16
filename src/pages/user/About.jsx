import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiTruck,
  FiShield,
  FiHeart,
} from "react-icons/fi";

export default function About() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">

      {/* =========================
          HERO
      ========================= */}

      <div className="text-center">

        <p className="font-semibold uppercase tracking-wider text-blue-600">
          About Us
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Shopping Made Simple
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
          We make it easy to discover quality products,
          compare your options, and shop with confidence.
        </p>

      </div>


      {/* =========================
          STORY
      ========================= */}

      <div className="mt-16 grid items-center gap-12 md:grid-cols-2">

        <div className="rounded-2xl bg-blue-50 p-8 md:p-10">

          <h2 className="text-3xl font-bold">
            Why We Started
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            Our goal is to create a simple and reliable
            online shopping experience where customers can
            find the products they need without unnecessary
            complexity.
          </p>

          <p className="mt-4 leading-8 text-gray-600">
            From browsing products to placing an order,
            we focus on making every step clear,
            convenient, and enjoyable.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Shop Our Products
          </Link>

        </div>


        <div>

          <h2 className="text-3xl font-bold">
            Built Around Our Customers
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            We believe online shopping should be
            straightforward. That's why our store is
            designed around easy product discovery,
            transparent pricing, secure ordering, and
            dependable service.
          </p>

          <div className="mt-8 space-y-5">

            <div className="flex gap-4">

              <FiCheckCircle
                className="mt-1 shrink-0 text-blue-600"
                size={24}
              />

              <div>
                <h3 className="font-semibold">
                  Quality Products
                </h3>

                <p className="mt-1 text-gray-600">
                  A carefully organized collection of
                  products for everyday needs.
                </p>
              </div>

            </div>


            <div className="flex gap-4">

              <FiShield
                className="mt-1 shrink-0 text-blue-600"
                size={24}
              />

              <div>
                <h3 className="font-semibold">
                  Secure Shopping
                </h3>

                <p className="mt-1 text-gray-600">
                  A simple and secure checkout experience.
                </p>
              </div>

            </div>


            <div className="flex gap-4">

              <FiTruck
                className="mt-1 shrink-0 text-blue-600"
                size={24}
              />

              <div>
                <h3 className="font-semibold">
                  Reliable Delivery
                </h3>

                <p className="mt-1 text-gray-600">
                  Keep track of your orders from purchase
                  through delivery.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          VALUES
      ========================= */}

      <div className="mt-20">

        <div className="text-center">

          <h2 className="text-3xl font-bold">
            What We Value
          </h2>

          <p className="mt-3 text-gray-600">
            The principles behind our store.
          </p>

        </div>


        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border bg-white p-7 shadow-sm">

            <FiHeart
              className="text-red-500"
              size={28}
            />

            <h3 className="mt-5 text-xl font-bold">
              Customer First
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              We want every customer to have a smooth
              and enjoyable shopping experience.
            </p>

          </div>


          <div className="rounded-xl border bg-white p-7 shadow-sm">

            <FiCheckCircle
              className="text-green-600"
              size={28}
            />

            <h3 className="mt-5 text-xl font-bold">
              Simplicity
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Clear products, simple navigation, and an
              easy checkout process.
            </p>

          </div>


          <div className="rounded-xl border bg-white p-7 shadow-sm">

            <FiShield
              className="text-blue-600"
              size={28}
            />

            <h3 className="mt-5 text-xl font-bold">
              Trust
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              We aim to provide a dependable experience
              from the first visit to completed orders.
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          CTA
      ========================= */}

      <div className="mt-20 rounded-2xl bg-gray-900 px-6 py-12 text-center text-white md:px-12">

        <h2 className="text-3xl font-bold">
          Ready to Start Shopping?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-gray-300">
          Explore our collection and find something
          that's right for you.
        </p>

        <Link
          to="/products"
          className="mt-7 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
        >
          Browse Products
        </Link>

      </div>

    </section>
  );
}