require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();




app.use(cors());
app.use(express.json());

const dashboardRoutes = require("./routes/api/dashboardRoutes");
app.use("/api", dashboardRoutes);

const productRoutes = require("./routes/api/productRoutes");
app.use("/api", productRoutes);

app.use("/api", require("./routes/api/orderRoutes"));
app.use("/api/orders", require("./routes/api/orderRoutes"));

const customerRoutes = require("./routes/api/customerRoutes");
app.use("/api/customers", customerRoutes);


app.use(express.urlencoded({ extended: true }));
app.use("/api/variants", require("./routes/api/productVariantRoutes"));

const variantRoutes = require("./routes/api/productVariantRoutes");

app.use("/api/variants", variantRoutes);

// ROUTES
// app.use("/api/products", require("./routes/api/productRoutes"));
// app.use("/api/orders", require("./routes/api/orderRoutes"));
// app.use("/api/auth", require("./routes/api/authRoutes"));



// TEST
app.use((req, res, next) => {
  console.log("Request masuk:", req.url);
  next();
});


app.get("/", (req, res) => {
  res.send("API RUNNING");
});

module.exports = app;