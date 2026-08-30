// ==================================================
// CURRENCY CONFIGURATION
// ==================================================

const currencyConfig = {
  USD: {
    symbol: "$",
    locale: "en-US",
    currency: "USD",
  },

  BDT: {
    symbol: "৳",
    locale: "en-BD",
    currency: "BDT",
  },

  EUR: {
    symbol: "€",
    locale: "de-DE",
    currency: "EUR",
  },

  GBP: {
    symbol: "£",
    locale: "en-GB",
    currency: "GBP",
  },

  INR: {
    symbol: "₹",
    locale: "en-IN",
    currency: "INR",
  },
};


// ==================================================
// FORMAT PRICE
// ==================================================

export const formatPrice = (
  amount,
  currency = "USD"
) => {
  const config =
    currencyConfig[currency] ||
    currencyConfig.USD;

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `${config.symbol}0.00`;
  }

  return new Intl.NumberFormat(
    config.locale,
    {
      style: "currency",
      currency: config.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(numericAmount);
};


// ==================================================
// GET CURRENCY SYMBOL
// ==================================================

export const getCurrencySymbol = (
  currency = "USD"
) => {
  return (
    currencyConfig[currency]?.symbol ||
    currencyConfig.USD.symbol
  );
};


// ==================================================
// GET CURRENCY CONFIG
// ==================================================

export const getCurrencyConfig = (
  currency = "USD"
) => {
  return (
    currencyConfig[currency] ||
    currencyConfig.USD
  );
};


// ==================================================
// EXPORT CONFIG
// ==================================================

export default currencyConfig;