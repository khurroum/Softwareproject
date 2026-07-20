import {
  FiTruck,
  FiShield,
  FiAward,
  FiHeadphones,
} from "react-icons/fi";

const features = [
  {
    icon: <FiTruck size={40} />,
    title: "Fast Delivery",
    description: "Get your orders delivered quickly and safely.",
  },
  {
    icon: <FiShield size={40} />,
    title: "Secure Payment",
    description: "Your payment information is always protected.",
  },
  {
    icon: <FiAward size={40} />,
    title: "Premium Quality",
    description: "We provide only high-quality products.",
  },
  {
    icon: <FiHeadphones size={40} />,
    title: "24/7 Support",
    description: "Our support team is available anytime.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Why Choose Us
          </h2>

          <p className="mt-3 text-gray-600">
            We provide the best shopping experience.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl bg-white p-8 text-center shadow-md transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-5 flex justify-center text-blue-600">
                {feature.icon}
              </div>

              <h3 className="mb-3 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}