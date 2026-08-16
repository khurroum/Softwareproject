import { useState } from "react";
import api from "../../services/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT FORM
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await api.post(
        "/contact",
        formData
      );

      setSuccess(
        response.data.message ||
          "Your message has been sent successfully."
      );

      // Clear form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Failed to send contact message:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-12 text-center">

          <h1 className="text-5xl font-bold">
            Contact Us
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Have a question or need help?
            Send us a message and our team
            will get back to you.
          </p>

        </div>


        {/* =========================
            CONTENT
        ========================= */}

        <div className="grid gap-10 lg:grid-cols-2">

          {/* =========================
              CONTACT INFORMATION
          ========================= */}

          <div className="rounded-2xl bg-white p-8 shadow-sm">

            <h2 className="text-2xl font-bold">
              Get in Touch
            </h2>

            <p className="mt-3 text-gray-600">
              We are here to help with questions
              about products, orders, delivery,
              and anything else you need.
            </p>


            <div className="mt-8 space-y-6">

              {/* Email */}

              <div>
                <h3 className="font-semibold">
                  Email
                </h3>

                <p className="mt-1 text-gray-600">
                  parvez@example.com
                </p>
              </div>


              {/* Phone */}

              <div>
                <h3 className="font-semibold">
                  Phone
                </h3>

                <p className="mt-1 text-gray-600">
                  +088 014014014
                </p>
              </div>


              {/* Address */}

              <div>
                <h3 className="font-semibold">
                  Address
                </h3>

                <p className="mt-1 text-gray-600">
                  4 Embankment Drive Road,Sector-10 
                  <br />
                  Uttara Model Town, Dhaka-1230, Bangladesh.
                </p>
              </div>


              {/* Hours */}

              <div>
                <h3 className="font-semibold">
                  Business Hours
                </h3>

                <p className="mt-1 text-gray-600">
                  Monday - Friday
                  <br />
                  9:00 AM - 6:00 PM
                </p>
              </div>

            </div>

          </div>


          {/* =========================
              CONTACT FORM
          ========================= */}

          <div className="rounded-2xl bg-white p-8 shadow-sm">

            <h2 className="text-2xl font-bold">
              Send Us a Message
            </h2>


            {/* SUCCESS */}

            {success && (
              <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                {success}
              </div>
            )}


            {/* ERROR */}

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              {/* Name */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block font-medium"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block font-medium"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Subject */}

              <div>

                <label
                  htmlFor="subject"
                  className="mb-2 block font-medium"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Message */}

              <div>

                <label
                  htmlFor="message"
                  className="mb-2 block font-medium"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows="6"
                  required
                  className="w-full resize-none rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Sending..."
                  : "Send Message"}
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}