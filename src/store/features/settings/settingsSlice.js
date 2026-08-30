import { createSlice } from "@reduxjs/toolkit";

// ==================================================
// DEFAULT SETTINGS
// ==================================================

const DEFAULT_SETTINGS = {
  storeName: "ShopEase",
  storeEmail: "admin@example.com",
  currency: "USD",
  notifications: true,
  lowStockAlerts: true,
};


// ==================================================
// LOAD SETTINGS FROM LOCAL STORAGE
// ==================================================

const getSavedSettings = () => {
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
// SAVE SETTINGS TO LOCAL STORAGE
// ==================================================

const saveSettings = (settings) => {
  try {
    localStorage.setItem(
      "storeSettings",
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error(
      "Failed to save store settings:",
      error
    );
  }
};


// ==================================================
// INITIAL STATE
// ==================================================

const initialState = getSavedSettings();


// ==================================================
// SETTINGS SLICE
// ==================================================

const settingsSlice = createSlice({
  name: "settings",

  initialState,

  reducers: {

    // ==================================================
    // SET ALL SETTINGS
    // ==================================================

    setSettings: (state, action) => {
      const settings =
        action.payload || {};

      state.storeName =
        settings.storeName?.trim() ||
        DEFAULT_SETTINGS.storeName;

      state.storeEmail =
        settings.storeEmail?.trim() ||
        DEFAULT_SETTINGS.storeEmail;

      state.currency =
        settings.currency ||
        DEFAULT_SETTINGS.currency;

      state.notifications =
        settings.notifications ??
        DEFAULT_SETTINGS.notifications;

      state.lowStockAlerts =
        settings.lowStockAlerts ??
        DEFAULT_SETTINGS.lowStockAlerts;

      saveSettings({
        storeName: state.storeName,
        storeEmail: state.storeEmail,
        currency: state.currency,
        notifications:
          state.notifications,
        lowStockAlerts:
          state.lowStockAlerts,
      });
    },


    // ==================================================
    // UPDATE STORE NAME
    // ==================================================

    updateStoreName: (state, action) => {
      state.storeName =
        action.payload?.trim() ||
        DEFAULT_SETTINGS.storeName;

      saveSettings({
        storeName: state.storeName,
        storeEmail: state.storeEmail,
        currency: state.currency,
        notifications:
          state.notifications,
        lowStockAlerts:
          state.lowStockAlerts,
      });
    },


    // ==================================================
    // UPDATE STORE EMAIL
    // ==================================================

    updateStoreEmail: (state, action) => {
      state.storeEmail =
        action.payload?.trim() ||
        DEFAULT_SETTINGS.storeEmail;

      saveSettings({
        storeName: state.storeName,
        storeEmail: state.storeEmail,
        currency: state.currency,
        notifications:
          state.notifications,
        lowStockAlerts:
          state.lowStockAlerts,
      });
    },


    // ==================================================
    // UPDATE CURRENCY
    // ==================================================

    updateCurrency: (state, action) => {
      state.currency =
        action.payload ||
        DEFAULT_SETTINGS.currency;

      saveSettings({
        storeName: state.storeName,
        storeEmail: state.storeEmail,
        currency: state.currency,
        notifications:
          state.notifications,
        lowStockAlerts:
          state.lowStockAlerts,
      });
    },


    // ==================================================
    // UPDATE NOTIFICATIONS
    // ==================================================

    updateNotifications: (
      state,
      action
    ) => {
      state.notifications =
        Boolean(action.payload);

      saveSettings({
        storeName: state.storeName,
        storeEmail: state.storeEmail,
        currency: state.currency,
        notifications:
          state.notifications,
        lowStockAlerts:
          state.lowStockAlerts,
      });
    },


    // ==================================================
    // UPDATE LOW STOCK ALERTS
    // ==================================================

    updateLowStockAlerts: (
      state,
      action
    ) => {
      state.lowStockAlerts =
        Boolean(action.payload);

      saveSettings({
        storeName: state.storeName,
        storeEmail: state.storeEmail,
        currency: state.currency,
        notifications:
          state.notifications,
        lowStockAlerts:
          state.lowStockAlerts,
      });
    },


    // ==================================================
    // RESET SETTINGS
    // ==================================================

    resetSettings: (state) => {
      state.storeName =
        DEFAULT_SETTINGS.storeName;

      state.storeEmail =
        DEFAULT_SETTINGS.storeEmail;

      state.currency =
        DEFAULT_SETTINGS.currency;

      state.notifications =
        DEFAULT_SETTINGS.notifications;

      state.lowStockAlerts =
        DEFAULT_SETTINGS.lowStockAlerts;

      saveSettings({
        ...DEFAULT_SETTINGS,
      });
    },
  },
});


// ==================================================
// EXPORT ACTIONS
// ==================================================

export const {
  setSettings,
  updateStoreName,
  updateStoreEmail,
  updateCurrency,
  updateNotifications,
  updateLowStockAlerts,
  resetSettings,
} = settingsSlice.actions;


// ==================================================
// EXPORT REDUCER
// ==================================================

export default settingsSlice.reducer;