import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  setSettings,
  resetSettings,
} from "../../store/features/settings/settingsSlice";

export default function Settings() {
  const dispatch = useDispatch();

  // ==================================================
  // DEFAULT SETTINGS
  // ==================================================

  const defaultSettings = {
    storeName: "ShopEase",
    storeEmail: "admin@example.com",
    currency: "USD",
    notifications: true,
    lowStockAlerts: true,
  };

  // ==================================================
  // STATE
  // ==================================================

  const [storeName, setStoreName] = useState(
    defaultSettings.storeName
  );

  const [storeEmail, setStoreEmail] = useState(
    defaultSettings.storeEmail
  );

  const [currency, setCurrency] = useState(
    defaultSettings.currency
  );

  const [notifications, setNotifications] =
    useState(defaultSettings.notifications);

  const [lowStockAlerts, setLowStockAlerts] =
    useState(defaultSettings.lowStockAlerts);

  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  // ==================================================
  // LOAD SAVED SETTINGS
  // ==================================================

  useEffect(() => {
    try {
      const savedSettings =
        localStorage.getItem("storeSettings");

      if (!savedSettings) {
        return;
      }

      const settings = JSON.parse(savedSettings);

      setStoreName(
        settings.storeName ||
          defaultSettings.storeName
      );

      setStoreEmail(
        settings.storeEmail ||
          defaultSettings.storeEmail
      );

      setCurrency(
        settings.currency ||
          defaultSettings.currency
      );

      setNotifications(
        settings.notifications ??
          defaultSettings.notifications
      );

      setLowStockAlerts(
        settings.lowStockAlerts ??
          defaultSettings.lowStockAlerts
      );
    } catch (error) {
      console.error(
        "Failed to load store settings:",
        error
      );

      setError(
        "Failed to load store settings."
      );
    }
  }, []);

  // ==================================================
  // SAVE SETTINGS
  // ==================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setSuccess("");
      setError("");

      // ==================================================
      // PREPARE SETTINGS
      // ==================================================

      const settings = {
        storeName:
          storeName.trim() ||
          defaultSettings.storeName,

        storeEmail:
          storeEmail.trim() ||
          defaultSettings.storeEmail,

        currency:
          currency || defaultSettings.currency,

        notifications,

        lowStockAlerts,
      };

      // ==================================================
      // UPDATE REDUX
      // ==================================================

      dispatch(setSettings(settings));

      // ==================================================
      // LOCAL STORAGE
      // ==================================================

      localStorage.setItem(
        "storeSettings",
        JSON.stringify(settings)
      );

      // ==================================================
      // BACKWARD COMPATIBILITY EVENT
      // ==================================================

      window.dispatchEvent(
        new Event("storeSettingsUpdated")
      );

      // ==================================================
      // SUCCESS
      // ==================================================

      setSuccess(
        "Settings saved successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );

      setError(
        "Failed to save settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // RESET SETTINGS
  // ==================================================

  const handleReset = () => {
    try {
      const settings = {
        ...defaultSettings,
      };

      // Update local state
      setStoreName(
        defaultSettings.storeName
      );

      setStoreEmail(
        defaultSettings.storeEmail
      );

      setCurrency(
        defaultSettings.currency
      );

      setNotifications(
        defaultSettings.notifications
      );

      setLowStockAlerts(
        defaultSettings.lowStockAlerts
      );

      // Update Redux
      dispatch(resetSettings());

      // Update localStorage
      localStorage.setItem(
        "storeSettings",
        JSON.stringify(settings)
      );

      // Notify existing components
      window.dispatchEvent(
        new Event("storeSettingsUpdated")
      );

      setSuccess(
        "Settings reset successfully."
      );

      setError("");
    } catch (error) {
      console.error(
        "Failed to reset settings:",
        error
      );

      setError(
        "Failed to reset settings."
      );
    }
  };

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <section className="p-6 md:p-10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your store settings and
          preferences.
        </p>

      </div>

      {/* ==================================================
          SETTINGS FORM
      ================================================== */}

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-8"
      >

        {/* ==================================================
            STORE INFORMATION
        ================================================== */}

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
                required
                className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* STORE EMAIL */}

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
                required
                className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

              <p className="mt-2 text-sm text-gray-500">
                Product prices will be displayed
                using this currency.
              </p>

            </div>

          </div>

        </div>

        {/* ==================================================
            NOTIFICATIONS
        ================================================== */}

        <div className="rounded-xl border bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-bold">
            Notifications
          </h2>

          <p className="mt-1 text-gray-500">
            Control your store notifications.
          </p>

          <div className="mt-6 space-y-5">

            {/* ORDER NOTIFICATIONS */}

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

        {/* ==================================================
            SAVE SECTION
        ================================================== */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          {/* SUCCESS */}

          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4">

              <p className="font-medium text-green-700">
                {success}
              </p>

            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">

              <p className="font-medium text-red-700">
                {error}
              </p>

            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row">

            {/* SAVE */}

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Saving..."
                : "Save Settings"}
            </button>

            {/* RESET */}

            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="rounded-lg border px-8 py-3 font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>

          </div>

        </div>

      </form>

    </section>
  );
}