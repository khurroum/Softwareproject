export default function CheckoutForm() {
  return (
    <div className="rounded-xl border p-8">

      <h2 className="mb-6 text-3xl font-bold">
        Shipping Information
      </h2>

      <div className="grid gap-5">

        <input
          type="text"
          placeholder="Full Name"
          className="rounded-lg border p-3"
        />

        <input
          type="email"
          placeholder="Email"
          className="rounded-lg border p-3"
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="rounded-lg border p-3"
        />

        <input
          type="text"
          placeholder="Address"
          className="rounded-lg border p-3"
        />

        <input
          type="text"
          placeholder="City"
          className="rounded-lg border p-3"
        />

        <input
          type="text"
          placeholder="Postal Code"
          className="rounded-lg border p-3"
        />

      </div>

    </div>
  );
}