const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const contactRoutes = require("./routes/contactRoutes");


// =========================
// CONNECT DATABASE
// =========================

connectDB();


// =========================
// CREATE APP
// =========================

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.send("API Running...");
});


// =========================
// API ROUTES
// =========================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);
app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);


// =========================
// EXPORT APP
// =========================

module.exports = app;