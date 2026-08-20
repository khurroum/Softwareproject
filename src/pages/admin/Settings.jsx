import { useState } from "react";

export default function Settings() {
  const [storeName, setStoreName] = useState(
    "My Store"
  );

  const [storeEmail, setStoreEmail] = useState(
    "admin@example.com"
  );

  const [currency, setCurrency] =
    useState("USD");

  const [notifications, setNotifications] =
    useState(true);

  const [lowStockAlerts, setLowStockAlerts] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // =========================
  // SAVE SETTINGS
  // =========================

  const handleSubmit = (event) => {
    event.preventDefault();

    setSaving(true);
    setSuccess("");

    // Save locally for now.
    // Later this can be connected to
    // a backend settings API.

    localStorage.setItem(
      "storeSettings",
      JSON.stringify({
        storeName,
        storeEmail,
        currency,
        notifications,
        lowStockAlerts,
      })
    );

    setTimeout(() => {
      setSaving(false);
      setSuccess(
        "Settings saved successfully."
      );
    }, 500);
  };

  return (
    <section className="p-6 md:p-10">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your store settings and
          preferences.
        </p>

      </div>


      {/* =========================
          SETTINGS FORM
      ========================= */}

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-8"
      >

        {/* =========================
            STORE INFORMATION
        ========================= */}

        <div className="rounded-xl border bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-bold">
            Store Information
          </h2>

          <p className="mt-1 text-gray-500">
            Basic information about your store.
          </p>


          <div className="mt-6 space-y-5">

            {/* STORE NAME */}

            <div>

              <label
                htmlFor="storeName"
                className="mb-2 block font-semibold"
              >
                Store Name
              </label>

              <input
                id="storeName"
                type="text"
                value={storeName}
                onChange={(event) =>
                  setStoreName(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* EMAIL */}

            <div>

              <label
                htmlFor="storeEmail"
                className="mb-2 block font-semibold"
              >
                Store Email
              </label>

              <input
                id="storeEmail"
                type="email"
                value={storeEmail}
                onChange={(event) =>
                  setStoreEmail(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* CURRENCY */}

            <div>

              <label
                htmlFor="currency"
                className="mb-2 block font-semibold"
              >
                Currency
              </label>

              <select
                id="currency"
                value={currency}
                onChange={(event) =>
                  setCurrency(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              >

                <option value="BDT">
                  BDT - Bangladesh Taka
                </option>

                <option value="USD">
                  USD - US Dollar
                </option>

                <option value="EUR">
                  EUR - Euro
                </option>

                <option value="GBP">
                  GBP - British Pound
                </option>

                <option value="INR">
                  INR - Indian Rupee
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <div className="rounded-xl border bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-bold">
            Notifications
          </h2>

          <p className="mt-1 text-gray-500">
            Control your store notifications.
          </p>


          <div className="mt-6 space-y-5">

            {/* GENERAL NOTIFICATIONS */}

            <label className="flex cursor-pointer items-center justify-between gap-5 rounded-lg border p-4">

              <div>

                <p className="font-semibold">
                  Order Notifications
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Receive notifications when
                  customers place orders.
                </p>

              </div>

              <input
                type="checkbox"
                checked={notifications}
                onChange={(event) =>
                  setNotifications(
                    event.target.checked
                  )
                }
                className="h-5 w-5"
              />

            </label>


            {/* LOW STOCK */}

            <label className="flex cursor-pointer items-center justify-between gap-5 rounded-lg border p-4">

              <div>

                <p className="font-semibold">
                  Low Stock Alerts
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Get notified when products
                  have low inventory.
                </p>

              </div>

              <input
                type="checkbox"
                checked={lowStockAlerts}
                onChange={(event) =>
                  setLowStockAlerts(
                    event.target.checked
                  )
                }
                className="h-5 w-5"
              />

            </label>

          </div>

        </div>


        {/* =========================
            SAVE
        ========================= */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="font-medium text-green-700">
                {success}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row">

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Saving..."
                : "Save Settings"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStoreName("My Store");
                setStoreEmail(
                  "admin@example.com"
                );
                setCurrency("USD");
                setNotifications(true);
                setLowStockAlerts(true);
                setSuccess("");
              }}
              className="rounded-lg border px-8 py-3 font-semibold hover:bg-gray-100"
            >
              Reset
            </button>

          </div>

        </div>

      </form>

    </section>
  );
}