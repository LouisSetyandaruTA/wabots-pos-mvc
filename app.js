require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// const dashboardRoutes = require("./routes/api/dashboardRoutes");
// app.use("/api/dashboard", dashboardRoutes);

// const productRoutes = require("./routes/api/productRoutes");
// app.use("/api", productRoutes);

// app.use("/api/orders", require("./routes/api/orderRoutes"));

// const customerRoutes = require("./routes/api/customerRoutes");
// app.use("/api/customers", customerRoutes);

// app.use(express.urlencoded({ extended: true }));
// app.use("/api/variants", require("./routes/api/productVariantRoutes"));

// const variantRoutes = require("./routes/api/productVariantRoutes");

// app.use("/api/variants", variantRoutes);

// const reportRoutes = require("./routes/api/reportRoutes");
// app.use("/api/reports", reportRoutes);

// const paymentRoutes = require("./routes/api/paymentRoutes");
// app.use("/api/payment", paymentRoutes);

// const authRoutes = require("./routes/api/authRoutes");
// app.use("/api/auth", authRoutes);

// const categoryRoutes = require("./routes/api/categoryRoutes");
// app.use("/api/categories", categoryRoutes);

//========================================

const dashboardRoutes = require("./routes/api/dashboardRoutes");
const productRoutes = require("./routes/api/productRoutes");
const customerRoutes = require("./routes/api/customerRoutes");
const variantRoutes = require("./routes/api/productVariantRoutes");
const reportRoutes = require("./routes/api/reportRoutes");
const paymentRoutes = require("./routes/api/paymentRoutes");
const authRoutes = require("./routes/api/authRoutes");
const categoryRoutes = require("./routes/api/categoryRoutes");

app.use("/api/auth", authRoutes); // PUBLIC

app.use("/api/products", productRoutes);
app.use("/api/orders", require("./routes/api/orderRoutes"));
app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reports", reportRoutes);


// TEST
app.use((req, res, next) => {
  console.log("Request masuk:", req.url);
  next();
});


app.get("/", (req, res) => {
  res.send("API RUNNING");
});

module.exports = app;