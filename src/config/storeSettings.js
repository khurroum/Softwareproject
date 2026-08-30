// ==================================================
// STORE SETTINGS
// ==================================================

const DEFAULT_SETTINGS = {
  storeName: "My Store",
  storeEmail: "admin@example.com",
  currency: "USD",
  notifications: true,
  lowStockAlerts: true,
};


// ==================================================
// GET SETTINGS
// ==================================================

export const getStoreSettings = () => {
  try {
    const savedSettings =
      localStorage.getItem("storeSettings");

    if (!savedSettings) {
      return DEFAULT_SETTINGS;
    }

    const parsedSettings =
      JSON.parse(savedSettings);

    return {
      ...DEFAULT_SETTINGS,
      ...parsedSettings,
    };
  } catch (error) {
    console.error(
      "Failed to load store settings:",
      error
    );

    return DEFAULT_SETTINGS;
  }
};


// ==================================================
// SAVE SETTINGS
// ==================================================

export const saveStoreSettings = (settings) => {
  const finalSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
  };

  localStorage.setItem(
    "storeSettings",
    JSON.stringify(finalSettings)
  );

  // Tell the rest of the application that
  // settings have changed.
  window.dispatchEvent(
    new CustomEvent("storeSettingsChanged", {
      detail: finalSettings,
    })
  );

  return finalSettings;
};


// ==================================================
// CURRENCY INFORMATION
// ==================================================

export const CURRENCY_CONFIG = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 1,
  },

  BDT: {
    code: "BDT",
    symbol: "৳",
    name: "Bangladesh Taka",
    rate: 122,
  },

  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.85,
  },

  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    rate: 0.73,
  },

  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    rate: 89,
  },
};


// ==================================================
// FORMAT PRICE
//
// Product prices in your database are treated as USD.
// The selected currency is used only for display.
// ==================================================

export const formatPrice = (
  amount,
  currency
) => {
  const numericAmount =
    Number(amount) || 0;

  const config =
    CURRENCY_CONFIG[currency] ||
    CURRENCY_CONFIG.USD;

  const convertedAmount =
    numericAmount * config.rate;

  return new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(convertedAmount);
};


// ==================================================
// PRICE WITH CURRENCY SYMBOL
// ==================================================

export const formatCurrency = (
  amount,
  currency
) => {
  const config =
    CURRENCY_CONFIG[currency] ||
    CURRENCY_CONFIG.USD;

  return `${config.symbol}${formatPrice(
    amount,
    currency
  )}`;
};


// ==================================================
// CURRENCY CODE
// ==================================================

export const getCurrencyCode = (
  currency
) => {
  return (
    CURRENCY_CONFIG[currency]?.code ||
    "USD"
  );
};