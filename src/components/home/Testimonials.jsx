import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    id: 1,
    name: "John Smith",
    review:
      "Excellent products and very fast delivery. Highly recommended!",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    review:
      "Amazing customer service and great product quality.",
  },
  {
    id: 3,
    name: "Michael Brown",
    review:
      "Shopping was easy and secure. I will definitely buy again.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            What Our Customers Say
          </h2>

          <p className="mt-3 text-gray-600">
            Trusted by thousands of happy customers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-white p-8 shadow-md transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-4 flex text-yellow-500">
                <FiStar />
                <FiStar />
                <FiStar />
                <FiStar />
                <FiStar />
              </div>

              <p className="text-gray-600 italic">
                "{item.review}"
              </p>

              <h3 className="mt-6 text-lg font-semibold">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}