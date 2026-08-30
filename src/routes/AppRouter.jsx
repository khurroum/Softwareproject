import { Routes, Route } from "react-router-dom";

import PaymentSuccess from "../pages/user/PaymentSuccess";
import PaymentFailed from "../pages/user/PaymentFailed";
import PaymentCancelled from "../pages/user/PaymentCancelled";
// Route Protection
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";

// =========================
// USER PAGES
// =========================
import Home from "../pages/user/Home";
import Products from "../pages/user/Products";
import ProductDetails from "../pages/user/ProductDetails";
import About from "../pages/user/About";
import Contact from "../pages/user/Contact";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import OrderHistory from "../pages/user/OrderHistory";
import OrderDetails from "../pages/user/OrderDetails";
import Profile from "../pages/user/Profile";
import NotFound from "../pages/user/NotFound";

// =========================
// AUTH PAGES
// =========================
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// =========================
// ADMIN PAGES
// =========================
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import Orders from "../pages/admin/Orders";
import AdminOrderDetails from "../pages/admin/OrderDetails";
import Revenue from "../pages/admin/Revenue";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import Messages from "../pages/admin/Messages";

export default function AppRouter() {
  return (
    <Routes>

      {/* ==================================================
          USER LAYOUT
      ================================================== */}
      <Route element={<UserLayout />}>

      <Route
  path="/payment/success"
  element={<PaymentSuccess />}
/>

<Route
  path="/payment/failed"
  element={<PaymentFailed />}
/>

<Route
  path="/payment/cancelled"
  element={<PaymentCancelled />}
/>


        {/* =========================
            PUBLIC USER ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* =========================
            AUTHENTICATION
        ========================= */}

        <Route element={<AuthLayout />}>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>


        {/* =========================
            PROTECTED USER ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/orders"
            element={<OrderHistory />}
          />

          <Route
            path="/orders/:id"
            element={<OrderDetails />}
          />

        </Route>

      </Route>


      {/* ==================================================
          ADMIN ROUTES
      ================================================== */}

      <Route element={<AdminRoute />}>

        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route
  path="messages"
  element={<Messages />}
/>

          {/* =========================
              ADMIN DASHBOARD
          ========================= */}

          <Route
            index
            element={<Dashboard />}
          />


          {/* =========================
              PRODUCT MANAGEMENT
          ========================= */}

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="products/add"
            element={<AddProduct />}
          />

          <Route
            path="products/edit/:id"
            element={<EditProduct />}
          />


          {/* =========================
              ORDER MANAGEMENT
          ========================= */}

          {/* Admin Orders List */}
          <Route
            path="orders"
            element={<Orders />}
          />

          {/* Admin Order Details */}
          <Route
            path="orders/:id"
            element={<AdminOrderDetails />}
          />


          {/* =========================
              OTHER ADMIN PAGES
          ========================= */}

          <Route
            path="revenue"
            element={<Revenue />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>

      </Route>


      {/* ==================================================
          404 PAGE
      ================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}