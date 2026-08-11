export default function PaymentMethod() {
  return (
    <div className="rounded-xl border p-8">

      <h2 className="mb-6 text-3xl font-bold">
        Payment Method
      </h2>

      <div className="space-y-4">

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="payment"
            defaultChecked
          />
          Cash on Delivery
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="payment"
          />
          Stripe Card
        </label>

      </div>

    </div>
  );
}