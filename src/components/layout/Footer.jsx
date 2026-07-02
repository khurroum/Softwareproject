import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-20 bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold">Your Store</h2>

            <p className="mt-4 leading-7 text-gray-400">
              Discover quality products, great prices, and a simple shopping
              experience.
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-full bg-gray-800 p-3 transition hover:bg-blue-600"
              >
                <FiFacebook size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="rounded-full bg-gray-800 p-3 transition hover:bg-pink-600"
              >
                <FiInstagram size={18} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="rounded-full bg-gray-800 p-3 transition hover:bg-sky-500"
              >
                <FiTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/"
                className="text-gray-400 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="text-gray-400 transition hover:text-white"
              >
                Products
              </Link>

              <Link
                to="/about"
                className="text-gray-400 transition hover:text-white"
              >
                About Us
              </Link>

              <Link
                to="/contact"
                className="text-gray-400 transition hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold">Customer Service</h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/orders"
                className="text-gray-400 transition hover:text-white"
              >
                My Orders
              </Link>

              <Link
                to="/profile"
                className="text-gray-400 transition hover:text-white"
              >
                My Profile
              </Link>

              <Link
                to="/cart"
                className="text-gray-400 transition hover:text-white"
              >
                Shopping Cart
              </Link>

              <Link
                to="/contact"
                className="text-gray-400 transition hover:text-white"
              >
                Help & Support
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>

            <div className="mt-5 space-y-4 text-gray-400">
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-1 shrink-0" size={18} />

                <span>
                  4 Embankment Drive Road,Sector-10
                  <br />
                  Uttara Model Town, Dhaka-1230, Bangladesh.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiPhone size={18} />

                <span>+088 014014014</span>
              </div>

              <div className="flex items-center gap-3">
                <FiMail size={18} />

                <span>parvez@example.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-center text-sm text-gray-400 md:flex-row md:items-center md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} Your Store. All rights reserved.</p>

          <div className="flex justify-center gap-5">
            <span>Privacy Policy</span>

            <span>Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
