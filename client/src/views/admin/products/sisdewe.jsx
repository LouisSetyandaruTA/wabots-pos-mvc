// // // module.exports = (db) => {
// // //   const {
// // //     User,
// // //     Order,
// // //     OrderItem,
// // //     Customer,
// // //     Product,
// // //     ProductVariant,
// // //     Category,
// // //     Business,
// // //     Payment
// // //   } = db;

// // //   // ======================
// // //   // BUSINESS RELATIONS
// // //   // ======================
// // //   Business.hasMany(User, { foreignKey: "businessId" });
// // //   User.belongsTo(Business, { foreignKey: "businessId" });

// // //   Business.hasMany(Product, { foreignKey: "businessId" });
// // //   Product.belongsTo(Business, { foreignKey: "businessId" });

// // //   Business.hasMany(Category, { foreignKey: "businessId" });
// // //   Category.belongsTo(Business, { foreignKey: "businessId" });

// // //   Business.hasMany(Customer, { foreignKey: "businessId" });
// // //   Customer.belongsTo(Business, { foreignKey: "businessId" });

// // //   Business.hasMany(Order, { foreignKey: "businessId" });
// // //   Order.belongsTo(Business, { foreignKey: "businessId" });

// // //   // ======================
// // //   // PRODUCT & CATEGORY
// // //   // ======================
// // //   Category.hasMany(Product, { foreignKey: "categoryId" });
// // //   Product.belongsTo(Category, { foreignKey: "categoryId", as: "Category" });

// // //   Product.hasMany(ProductVariant, {
// // //     foreignKey: "productId",
// // //     as: "variants"
// // //   });
// // //  ProductVariant.belongsTo(Product, {
// // //   foreignKey: "productId",
// // //   as: "Product" 
// // // });

// // //   // ======================
// // //   // ORDER SYSTEM
// // //   // ======================
// // //   Customer.hasMany(Order, { foreignKey: "customerId" });
// // //   Order.belongsTo(Customer, {
// // //     foreignKey: "customerId",
// // //     as: "customer"
// // //   });

// // //   Order.hasMany(OrderItem, {
// // //     foreignKey: "orderId",
// // //     as: "items"
// // //   });

// // //   OrderItem.belongsTo(Order, {
// // //     foreignKey: "orderId",
// // //     as: "order"
// // //   });

// // //   OrderItem.belongsTo(ProductVariant, {
// // //     foreignKey: "variantId",
// // //     as: "variant"
// // //   });

// // //   ProductVariant.hasMany(OrderItem, {
// // //     foreignKey: "variantId"
// // //   });

// // //   Order.hasOne(Payment, { foreignKey: "orderId" });
// // // Payment.belongsTo(Order, { foreignKey: "orderId" });

// // // Business.hasMany(Payment, { foreignKey: "businessId" });
// // // Payment.belongsTo(Business, { foreignKey: "businessId" });
// // // };

// // // berikut isi dari models/Product.js:
// // // const { DataTypes } = require("sequelize");
// // // const sequelize = require("../config/database");

// // // const Product = sequelize.define("Product", {
// // //   id: {
// // //     type: DataTypes.INTEGER,
// // //     autoIncrement: true,
// // //     primaryKey: true
// // //   },
// // //   nama: { type: DataTypes.STRING, allowNull: false },
// // //   categoryId: {
// // //     type: DataTypes.INTEGER,
// // //     allowNull: false
// // //   },
// // // businessId: {
// // //   type: DataTypes.UUID,
// // //   allowNull: false
// // // },
// // //   satuan: { type: DataTypes.STRING, allowNull: false },
// // //   berat: { type: DataTypes.FLOAT, allowNull: false },
// // //   keterangan: { type: DataTypes.TEXT, allowNull: true }
// // // }, {
// // //   tableName: 'products',
// // //   freezeTableName: true
// // // });

// // // module.exports = Product;

// // // Berikut isi dari models.ProductVariant.js:
// // // const { DataTypes } = require("sequelize");
// // // const sequelize = require("../config/database");

// // // const ProductVariant = sequelize.define("ProductVariant", {
// // //   id: {
// // //     type: DataTypes.INTEGER,
// // //     autoIncrement: true,
// // //     primaryKey: true
// // //   },
// // //   productId: {
// // //     type: DataTypes.INTEGER,
// // //     allowNull: false
// // //   },
// // //   businessId: {
// // //   type: DataTypes.UUID,
// // //   allowNull: false
// // // },
// // //   nama_variant: {
// // //     type: DataTypes.STRING,
// // //     allowNull: false
// // //   },
// // //   harga: {
// // //     type: DataTypes.FLOAT,
// // //     allowNull: false
// // //   },
// // //   stok: {
// // //     type: DataTypes.INTEGER,
// // //     allowNull: false
// // //   },
// // //   berat: {
// // //     type: DataTypes.FLOAT,
// // //     allowNull: false
// // //   },
// // // }, {
// // //   tableName: "product_variants",
// // //   freezeTableName: true
// // // });

// // // module.exports = ProductVariant;

// // // Berikut isi dari ProductController.js:
// // // const productService = require("../services/productService");

// // // //Get Product
// // // exports.getProducts = async (req, res) => {
// // //   try {
// // //     console.log("BUSINESS ID:", req.user.businessId); 
// // //     const data = await productService.getAll(req.user.businessId);
// // //     res.json(data);
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };


// // // // CREATE
// // // exports.createProduct = async (req, res) => {
// // //   const data = await productService.createProduct({
// // //     ...req.body,
// // //     businessId: req.user.businessId
// // //   });

// // //   res.json(data);
// // // };

// // // // UPDATE
// // // exports.updateProduct = async (req, res) => {
// // //   try {
// // //    await productService.update(req.params.id, req.body, req.user.businessId);
// // //     res.json({ success: true });
// // //   } catch (err) {
// // //     res.status(400).json({ message: err.message });
// // //   }
// // // };

// // // // DELETE
// // // exports.deleteProduct = async (req, res) => {
// // //   try {
// // //     await productService.delete(req.params.id, req.user.businessId);
// // //     res.json({ success: true });
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // berikut isi dari ProductVariantController.js:
// // // const service = require("../services/productVariantService");

// // // exports.getVariants = async (req, res) => {
// // //   const data = await service.getByProduct(
// // //     req.params.productId,
// // //     req.user.businessId
// // //   );
// // //   res.json(data);
// // // };

// // // exports.createVariant = async (req, res) => {
// // //   const data = await service.create(req.body, req.user.businessId);
// // //   res.json(data);
// // // };

// // // exports.deleteVariant = async (req, res) => {
// // //   await service.delete(req.params.id);
// // //   res.json({ success: true });
// // // };

// // // exports.updateVariant = async (req, res) => {
// // //   try {
// // //     const data = await service.update(req.params.id, req.body);
// // //     res.json(data);
// // //   } catch (err) {
// // //     res.status(400).json({ message: err.message });
// // //   }
// // // };

// // // Berikut isi dari productRoutes.js:
// // // const express = require("express");
// // // const router = express.Router();
// // // const productController = require("../../controllers/ProductController");
// // // const authMiddleware = require("../../middlewares/authMiddleware");

// // // router.use(authMiddleware);

// // // router.get("/", productController.getProducts);
// // // router.post("/", productController.createProduct);
// // // router.put("/:id", productController.updateProduct);
// // // router.delete("/:id", productController.deleteProduct);

// // // module.exports = router;

// // // Berikut isi dari productVariantRoutes.js:
// // // const express = require("express");
// // // const router = express.Router();
// // // const controller = require("../../controllers/ProductVariantController");
// // // const authMiddleware = require("../../middlewares/authMiddleware");

// // // router.use(authMiddleware);

// // // router.get("/:productId", controller.getVariants);
// // // router.post("/", controller.createVariant);
// // // router.delete("/:id", controller.deleteVariant);
// // // router.put("/:id", controller.updateVariant);

// // // module.exports = router;

// // // Berikut isi dari productService.js:
// // // const { Product, ProductVariant, Category, Business } = require("../models");


// // // exports.getAll = async (businessId) => {
// // //   const products = await Product.findAll({
// // //     where: { businessId },
// // //     include: [
// // //       {
// // //         model: ProductVariant,
// // //         as: "variants"
// // //       },
// // //       {
// // //         model: Category,
// // //         as: "Category", 
// // //         attributes: ["id", "name"]
// // //       }
// // //     ]
// // //   });

// // //   return products.map(p => {
// // //     const variants = p.variants || [];

// // //     let totalStock = 0;

// // //     if (variants.length > 0) {
// // //       totalStock = variants.reduce((sum, v) => sum + (v.stok || 0), 0);
// // //     } else {
// // //       totalStock = p.stok || 0;
// // //     }

// // //     return {
// // //       ...p.toJSON(),
// // //       stok: totalStock
// // //     };
// // //   });
// // // };

// // // // 🔥 VALIDATION FUNCTION
// // // const validateProduct = (data) => {
// // //   if (
// // //   !data.nama ||
// // //   !data.categoryId ||
// // //   !data.satuan ||
// // //   !data.berat ||
// // //   !data.harga ||
// // //   data.stok === undefined
// // // ) {
// // //   throw new Error("Semua field wajib diisi");
// // // }

// // //   if (data.harga <= 0) {
// // //     throw new Error("Harga harus lebih dari 0");
// // //   }

// // //   if (data.stok < 0) {
// // //     throw new Error("Stok tidak boleh negatif");
// // //   }

// // //   if (data.berat <= 0) {
// // //     throw new Error("Berat harus lebih dari 0");
// // //   }
// // // };

// // // // CREATE
// // // exports.create = async (data, businessId) => {
// // //   validateProduct(data);

// // //   return await Product.create({
// // //     ...data,
// // //     businessId
// // //   });
// // // };

// // // exports.createProduct = async (data) => {
// // //   const product = await Product.create(data);

// // //   // AUTO DEFAULT VARIANT
// // //   await ProductVariant.create({
// // //     productId: product.id,
// // //     nama_variant: "Default",
// // //     harga: data.harga || 0,
// // //     stok: data.stok || 0,
// // //     berat: data.berat || 0,
// // //     businessId: data.businessId
// // //   });

// // //   return product;
// // // };

// // // exports.update = async (id, data, businessId) => {
// // //   await Product.update(data, {
// // //     where: { id, businessId }
// // //   });
// // // };

// // // exports.delete = async (id, businessId) => {
// // //   await Product.destroy({
// // //     where: { id, businessId }
// // //   });
// // // };

// // // Berikut isi dari productVariantService.js:
// // // const { ProductVariant, Product } = require("../models");

// // // exports.getByProduct = async (productId, businessId) => {
// // //   return await ProductVariant.findAll({
// // //     where: { productId },
// // //     include: [
// // //       {
// // //         model: Product,
// // //         as: "Product",
// // //         where: { businessId }
// // //       }
// // //     ]
// // //   });
// // // };

// // // exports.create = async (data, businessId) => {
// // //   const product = await Product.findOne({
// // //     where: {
// // //       id: data.productId,
// // //       businessId
// // //     }
// // //   });

// // //   if (!product) throw new Error("Produk tidak valid");

// // //   return await ProductVariant.create(data);
// // // };

// // // exports.delete = async (id) => {
// // //   await ProductVariant.destroy({ where: { id } });
// // // };

// // // exports.update = async (id, data) => {
// // //   const variant = await ProductVariant.findByPk(id);
// // //   if (!variant) throw new Error("Variant tidak ditemukan");

// // //   if (data.harga <= 0) throw new Error("Harga tidak valid");
// // //   if (data.stok < 0) throw new Error("Stok tidak valid");
// // //   if (data.berat <= 0) throw new Error("Berat tidak valid");

// // //   await variant.update({
// // //     harga: data.harga,
// // //     stok: data.stok,
// // //     berat: data.berat
// // //   });

// // //   return variant;
// // // };

// // // Berikut isi dari app.js:
// // // require("dotenv").config();
// // // const express = require("express");
// // // const cors = require("cors");

// // // const app = express();

// // // app.use(cors());
// // // app.use(express.json());
// // // const dashboardRoutes = require("./routes/api/dashboardRoutes");
// // // const productRoutes = require("./routes/api/productRoutes");
// // // const customerRoutes = require("./routes/api/customerRoutes");
// // // const variantRoutes = require("./routes/api/productVariantRoutes");
// // // const reportRoutes = require("./routes/api/reportRoutes");
// // // const paymentRoutes = require("./routes/api/paymentRoutes");
// // // const authRoutes = require("./routes/api/authRoutes");
// // // const categoryRoutes = require("./routes/api/categoryRoutes");

// // // app.use("/api/auth", authRoutes); // PUBLIC

// // // app.use("/api/products", productRoutes);
// // // app.use("/api/orders", require("./routes/api/orderRoutes"));
// // // app.use("/api/customers", customerRoutes);
// // // app.use("/api/dashboard", dashboardRoutes);
// // // app.use("/api/categories", categoryRoutes);
// // // app.use("/api/variants", variantRoutes);
// // // app.use("/api/payment", paymentRoutes);
// // // app.use("/api/reports", reportRoutes);


// // // // TEST
// // // app.use((req, res, next) => {
// // //   console.log("Request masuk:", req.url);
// // //   next();
// // // });


// // // app.get("/", (req, res) => {
// // //   res.send("API RUNNING");
// // // });

// // // module.exports = app;

// // // berikut isi dari Product.jsx:
// // // import Card from "components/card";
// // // import React, { useEffect, useState } from "react";
// // // import axios from "../../../utils/axiosInstance";

// // // export default function Products() {
// // // // ================= STATE =================
// // // const [products, setProducts] = useState([]);
// // // const [categories, setCategories] = useState([]);

// // // const [form, setForm] = useState({
// // // nama: "",
// // // categoryId: "",
// // // satuan: "",
// // // berat: "",
// // // harga: "",
// // // stok: ""
// // // });

// // // const [customCategory, setCustomCategory] = useState("");
// // // const [errors, setErrors] = useState({});
// // // const [errorMsg, setErrorMsg] = useState("");

// // // const [loading, setLoading] = useState(false);
// // // const [loadingProducts, setLoadingProducts] = useState(false);

// // // const [editId, setEditId] = useState(null);

// // // const satuanOptions = ["pcs", "liter", "kg", "gram", "botol", "kotak", "sachet"];

// // // // ================= FETCH =================
// // // useEffect(() => {
// // // fetchProducts();
// // // fetchCategories();
// // // }, []);

// // // const fetchProducts = async () => {
// // // setLoadingProducts(true);
// // // try {
// // // const res = await axios.get("/products");
// // // setProducts(res.data);
// // // } catch (err) {
// // //   console.error("ERROR PRODUCTS:", err.response?.data || err.message);
// // //   setErrorMsg(err.response?.data?.message || "Gagal load produk");
// // // } finally {
// // // setLoadingProducts(false);
// // // }
// // // };

// // // const fetchCategories = async () => {
// // // try {
// // // const res = await axios.get("/categories");
// // // setCategories(res.data);
// // // } catch (err) {
// // //   console.error("ERROR CATEGORIES:", err.response?.data || err.message);
// // //   setErrorMsg(err.response?.data?.message || "Gagal load kategori");
// // // }
// // // };

// // // // ================= VALIDATION =================
// // // const validate = () => {
// // // let newErrors = {};

// // // if (!form.nama) newErrors.nama = "Nama wajib diisi";
// // // if (!form.categoryId) newErrors.categoryId = "Kategori wajib dipilih";
// // // if (!form.satuan) newErrors.satuan = "Satuan wajib";
// // // if (!form.berat || form.berat <= 0) newErrors.berat = "Berat tidak valid";
// // // if (!form.harga || form.harga <= 0) newErrors.harga = "Harga tidak valid";
// // // if (form.stok < 0) newErrors.stok = "Stok tidak boleh negatif";

// // // return newErrors;

// // // };

// // // // ================= HANDLER =================
// // // const handleChange = (e) => {
// // // setForm({
// // // ...form,
// // // [e.target.name]: e.target.value
// // // });
// // // };

// // // const handleCategoryChange = (e) => {
// // // setForm({
// // // ...form,
// // // categoryId: e.target.value
// // // });
// // // };

// // // // ================= CREATE CATEGORY =================
// // // const handleCreateCategory = async () => {
// // // if (!customCategory) return;

// // // try {
// // //   const res = await axios.post("/categories", {
// // //     name: customCategory
// // //   });

// // //   setCategories([...categories, res.data]);

// // //   setForm({
// // //     ...form,
// // //     categoryId: res.data.id
// // //   });

// // //   setCustomCategory("");
// // // } catch (err) {
// // //   setErrorMsg("Gagal tambah kategori");
// // // }

// // // };

// // // // ================= SUBMIT =================
// // // const handleSubmit = async () => {
// // // const validationErrors = validate();

// // // if (Object.keys(validationErrors).length > 0) {
// // //   setErrors(validationErrors);
// // //   return;
// // // }

// // // setErrors({});
// // // setLoading(true);

// // // try {
// // //   if (editId) {
// // //     await axios.put(`/products/${editId}`, form);
// // //   } else {
// // //     await axios.post("/products", form);
// // //   }

// // //   resetForm();
// // //   fetchProducts();
// // // } catch (err) {
// // //   setErrorMsg(err.response?.data?.message || "Terjadi error");
// // // } finally {
// // //   setLoading(false);
// // // }

// // // };

// // // // ================= EDIT =================
// // // const handleEdit = (p) => {
// // // setEditId(p.id);

// // // setForm({
// // //   nama: p.nama,
// // //   categoryId: p.categoryId,
// // //   satuan: p.satuan,
// // //   berat: p.berat,
// // //   harga: p.harga,
// // //   stok: p.stok
// // // });

// // // };

// // // // ================= DELETE =================
// // // const handleDelete = async (id) => {
// // // if (!window.confirm("Yakin hapus produk?")) return;


// // // try {
// // //   await axios.delete(`/products/${id}`);
// // //   fetchProducts();
// // // } catch (err) {
// // //   setErrorMsg("Gagal hapus produk");
// // // }


// // // };

// // // // ================= RESET =================
// // // const resetForm = () => {
// // // setForm({
// // // nama: "",
// // // categoryId: "",
// // // satuan: "",
// // // berat: "",
// // // harga: "",
// // // stok: ""
// // // });

// // // setEditId(null);
// // // setErrors({});

// // // };
// // // //============tamabahn Variant ========
// // // const [variants, setVariants] = useState({});
// // // const [selectedProduct, setSelectedProduct] = useState(null);

// // // const fetchVariants = async (productId) => {
// // //   try {
// // //     const res = await axios.get(`/variants/${productId}`);
// // //     setVariants(prev => ({
// // //       ...prev,
// // //       [productId]: res.data
// // //     }));
// // //   } catch (err) {
// // //     console.error("ERROR VARIANTS:", err);
// // //   }
// // // };


// // // useEffect(() => {
// // //   if (selectedProduct) {
// // //     fetchVariants(selectedProduct);
// // //   }
// // // }, [selectedProduct]);


// // // // ================= UI =================
// // // return ( <div className="mt-5 grid gap-5">

// // //   {/* ERROR GLOBAL */}
// // //   {errorMsg && (
// // //     <div className="bg-red-100 text-red-600 p-3 rounded">
// // //       {errorMsg}
// // //     </div>
// // //   )}

// // //   {/* FORM */}
// // //   <Card extra="p-4">
// // //     <h2 className="text-xl font-bold mb-4">
// // //       {editId ? "Edit Produk" : "Tambah Produk"}
// // //     </h2>

// // //     <div className="grid grid-cols-3 gap-4">

// // //       <input
// // //         name="nama"
// // //         placeholder="Nama Produk"
// // //         value={form.nama}
// // //         onChange={handleChange}
// // //         className="border p-2 rounded"
// // //       />
// // //       {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}

// // //       <input
// // //         name="harga"
// // //         type="number"
// // //         placeholder="Harga"
// // //         value={form.harga}
// // //         onChange={handleChange}
// // //         className="border p-2 rounded"
// // //       />
// // //       {errors.harga && <p className="text-red-500 text-sm">{errors.harga}</p>}

// // //       <input
// // //         name="stok"
// // //         type="number"
// // //         placeholder="Stok"
// // //         value={form.stok}
// // //         onChange={handleChange}
// // //         className="border p-2 rounded"
// // //       />
// // //       {errors.stok && <p className="text-red-500 text-sm">{errors.stok}</p>}

// // //       {/* CATEGORY */}
// // //       <div className="flex gap-2">
// // //         <select
// // //           value={form.categoryId}
// // //           onChange={handleCategoryChange}
// // //           className="border p-2 rounded w-full"
// // //         >
// // //           <option value="">Pilih Kategori</option>
// // //           {categories.map(c => (
// // //             <option key={c.id} value={c.id}>
// // //               {c.name}
// // //             </option>
// // //           ))}
// // //         </select>

// // //         <input
// // //           placeholder="Tambah"
// // //           value={customCategory}
// // //           onChange={(e) => setCustomCategory(e.target.value)}
// // //           className="border p-2 rounded"
// // //         />

// // //         <button
// // //           onClick={handleCreateCategory}
// // //           className="bg-green-500 text-white px-2 rounded"
// // //         >
// // //           +
// // //         </button>
// // //       </div>
// // //       {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}

// // //       <select
// // //         name="satuan"
// // //         value={form.satuan}
// // //         onChange={handleChange}
// // //         className="border p-2 rounded"
// // //       >
// // //         <option value="">Pilih Satuan</option>
// // //         {satuanOptions.map((s, i) => (
// // //           <option key={i} value={s}>{s}</option>
// // //         ))}
// // //       </select>

// // //       <input
// // //         name="berat"
// // //         type="number"
// // //         placeholder="Berat"
// // //         value={form.berat}
// // //         onChange={handleChange}
// // //         className="border p-2 rounded"
// // //       />
// // //     </div>

// // //     <div className="mt-4 flex gap-2">
// // //       <button
// // //         onClick={handleSubmit}
// // //         disabled={loading}
// // //         className="bg-blue-500 text-white px-4 py-2 rounded"
// // //       >
// // //         {loading ? "Loading..." : (editId ? "Update" : "Tambah")}
// // //       </button>

// // //       {editId && (
// // //         <button
// // //           onClick={resetForm}
// // //           className="bg-gray-400 text-white px-4 py-2 rounded"
// // //         >
// // //           Batal
// // //         </button>
// // //       )}
// // //     </div>
// // //   </Card>

// // //   {/* TABLE */}
// // //   <Card extra="p-4">
// // //     <h2 className="text-xl font-bold mb-4">Daftar Produk</h2>

// // //     {loadingProducts ? (
// // //       <p>Loading...</p>
// // //     ) : (
// // //       <table className="w-full">
// // //         <thead>
// // //           <tr>
// // //             <th>Nama</th>
// // //             <th>Kategori</th>
// // //             <th>Harga</th>
// // //             <th>Stok</th>
// // //             <th>Aksi</th>
// // //           </tr>
// // //         </thead>

// // //         <tbody>
// // //           {products.map(p => (
// // //   <React.Fragment key={p.id}>

// // //     {/* ROW PRODUCT */}
// // //     <tr>
// // //       <td>{p.nama}</td>
// // //       <td>{p.Category?.name}</td>
// // //       <td>{p.harga}</td>
// // //       <td>{p.stok}</td>
// // //       <td className="flex gap-2">
// // //         <button onClick={() => handleEdit(p)}>Edit</button>
// // //         <button onClick={() => handleDelete(p.id)}>Delete</button>

// // //         <button
// // //           onClick={() => {
// // //             setSelectedProduct(
// // //               selectedProduct === p.id ? null : p.id
// // //             );
// // //           }}
// // //           className="bg-green-500 text-white px-2 py-1 rounded"
// // //         >
// // //           Variant
// // //         </button>
// // //       </td>
// // //     </tr>

// // //     {/* ROW VARIANT */}
// // //     {selectedProduct === p.id && (
// // //       <tr>
// // //         <td colSpan="5">

// // //           <div className="bg-gray-100 p-3 rounded mt-2">

// // //             {/* FORM TAMBAH VARIANT */}
// // //             <div className="flex gap-2 mb-3">
// // //               <input
// // //                 placeholder="Nama Variant"
// // //                 onChange={(e) =>
// // //                   setVariantForm({
// // //                     ...variantForm,
// // //                     nama_variant: e.target.value
// // //                   })
// // //                 }
// // //                 className="border p-1"
// // //               />
// // //               <input
// // //                 placeholder="Harga"
// // //                 type="number"
// // //                 onChange={(e) =>
// // //                   setVariantForm({
// // //                     ...variantForm,
// // //                     harga: e.target.value
// // //                   })
// // //                 }
// // //                 className="border p-1"
// // //               />
// // //               <input
// // //                 placeholder="Stok"
// // //                 type="number"
// // //                 onChange={(e) =>
// // //                   setVariantForm({
// // //                     ...variantForm,
// // //                     stok: e.target.value
// // //                   })
// // //                 }
// // //                 className="border p-1"
// // //               />

// // //               <button
// // //                 onClick={async () => {
// // //                   await axios.post("/variants", {
// // //                     ...variantForm,
// // //                     productId: p.id
// // //                   });

// // //                   fetchVariants(p.id);
// // //                 }}
// // //                 className="bg-blue-500 text-white px-2"
// // //               >
// // //                 +
// // //               </button>
// // //             </div>

// // //             {/* LIST VARIANT */}
// // //             {(variants[p.id] || []).length > 0 ? (
// // //               variants[p.id].map(v => (
// // //                 <div
// // //                   key={v.id}
// // //                   className="flex justify-between border-b py-1 text-sm"
// // //                 >
// // //                   <span>
// // //                     {v.nama_variant} | Rp {v.harga} | stok {v.stok}
// // //                   </span>

// // //                   <button
// // //                     onClick={async () => {
// // //                       await axios.delete(`/variants/${v.id}`);
// // //                       fetchVariants(p.id);
// // //                     }}
// // //                     className="text-red-500"
// // //                   >
// // //                     Hapus
// // //                   </button>
// // //                 </div>
// // //               ))
// // //             ) : (
// // //               <p className="text-gray-400 text-sm">
// // //                 Belum ada variant
// // //               </p>
// // //             )}

// // //           </div>

// // //         </td>
// // //       </tr>
// // //     )}

// // //   </React.Fragment>
// // // ))}
// // //         </tbody>
// // //       </table>
// // //     )}
// // //   </Card>

// // // </div>

// // // );
// // // }


// // // berikut isi dari Order.jsx:
// // // import React, { useEffect, useState } from "react";
// // // import axios from "../../../utils/axiosInstance";
// // // import { useNavigate } from "react-router-dom";

// // // export default function Orders() {
// // //   const [orders, setOrders] = useState([]);

// // //   const fetchOrders = async () => {
// // //    try {
// // //   const res = await axios.get("/orders");
// // //   setOrders(res.data.data);
// // // } catch (err) {
// // //   console.error("ORDERS ERROR:", err.response?.data || err.message);
// // // }
// // //   };
// // //   const approve = async (id) => {
// // //     try {
// // //       await axios.put(`/orders/${id}/approve`);
// // //       fetchOrders();
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert(JSON.stringify(err?.response?.data || err.message));
// // //     }
// // //   };

// // //   // const pay = async (id) => {
// // //   //   try {
// // //   //     await axios.put(`/orders/${id}/payment`);
// // //   //     fetchOrders();
// // //   //   } catch (err) {
// // //   //     console.error(err);
// // //   //    alert(JSON.stringify(err?.response?.data || err.message));
// // //   //   }
// // //   // };

// // //   const formatDate = (date) => {
// // //     return new Date(date).toLocaleString("id-ID");
// // //   };

// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     fetchOrders();
// // //     const interval = setInterval(fetchOrders, 3000);

// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   return (
// // //     <div className="p-6">
// // //       <h2 className="text-xl font-bold mb-4">Order Management</h2>

// // //       <div className="bg-white rounded-xl shadow p-4">
// // //         <table className="w-full text-sm text-left">

// // //           <thead className="border-b">
// // //             <tr>
// // //               <th className="py-2">ID</th>
// // //               <th>Waktu</th>
// // //               <th>Customer</th>
// // //               <th>Total</th>
// // //               <th>Status</th>
// // //               <th>Aksi</th>
// // //             </tr>
// // //           </thead>

// // //           <tbody>
// // //             {orders.map((order) => (
// // //               <React.Fragment key={order.id}>

// // //                 {/* ROW UTAMA */}
// // //                 <tr className="border-b hover:bg-gray-50">
// // //                   <td className="py-2">{order.id.slice(0, 8)}...</td>
// // //                   <td>{formatDate(order.createdAt)}</td>
// // //                   <td>
// // //                     <div>
// // //                       <div className="font-semibold">
// // //                         {order.customer?.name || "-"}
// // //                       </div>
// // //                       <div className="text-gray-500 text-sm">
// // //                         {order.customer?.phoneNumber || "-"}
// // //                       </div>
// // //                     </div>
// // //                   </td>
// // //                   <td>Rp {order.totalPrice}</td>
// // //                   <td>
// // //                     <span
// // //                       className={`px-2 py-1 rounded text-xs font-semibold ${order.status === "pending"
// // //                           ? "bg-yellow-100 text-yellow-700"
// // //                           : order.status === "approved"
// // //                             ? "bg-blue-100 text-blue-700"
// // //                             : "bg-green-100 text-green-700"
// // //                         }`}
// // //                     >
// // //                       {order.status}
// // //                     </span>
// // //                   </td>

// // //                   <td className="space-x-2">
// // //                     {order.status === "pending" && (
// // //                       <button
// // //                         onClick={() => approve(order.id)}
// // //                         className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
// // //                       >
// // //                         Approve
// // //                       </button>
// // //                     )}

// // //                     {order.status === "approved" && (
// // //                       <button
// // //                         // onClick={() => pay(order.id)}
// // //                         onClick={() => navigate(`/admin/payment/${order.id}`)}
// // //                         className="bg-green-500 text-white px-3 py-1 rounded text-xs"
// // //                       >
// // //                         Bayar
// // //                       </button>
// // //                     )}

// // //                     {order.status === "paid" && (
// // //                       <span className="text-green-600 font-semibold text-xs">
// // //                         ✔ Selesai
// // //                       </span>
// // //                     )}
// // //                   </td>
// // //                 </tr>

// // //                 {/* DETAIL */}
// // //                 <tr className="bg-gray-50">
// // //                   <td colSpan="5" className="p-2">
// // //                     {order.items?.length > 0 ? (
// // //                       order.items.map((item) => (
// // //                         <div key={item.id} className="text-xs">
// // //                           • {item.variant?.nama_variant} | qty: {item.quantity} | Rp {item.unitPrice}
// // //                         </div>
// // //                       ))
// // //                     ) : (
// // //                       <span className="text-gray-400 text-xs">
// // //                         Tidak ada item
// // //                       </span>
// // //                     )}
// // //                   </td>
// // //                 </tr>

// // //               </React.Fragment>
// // //             ))}
// // //           </tbody>

// // //         </table>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // berikut isi dari CreateOrder.jsx:
// // // import React, { useEffect, useState } from "react";
// // // import axios from "../../../utils/axiosInstance";

// // // export default function CreateOrder() {
// // //   const [customers, setCustomers] = useState([]);
// // //   const [variants, setVariants] = useState([]);
// // //   const [selectedCustomer, setSelectedCustomer] = useState("");
// // //   const [cart, setCart] = useState([]);
// // //   const [selectedVariant, setSelectedVariant] = useState("");
// // //   const [qty, setQty] = useState(1);

// // //   // 🔥 FETCH DATA
// // //   useEffect(() => {
// // //     fetchCustomers();
// // //     fetchProducts();
// // //   }, []);

// // //   const fetchCustomers = async () => {
// // //     const res = await axios.get("/customers");
// // //     setCustomers(res.data);
// // //   };

// // //   const fetchProducts = async () => {
// // //     const res = await axios.get("/products");

// // //     // flatten variants
// // //     const allVariants = [];
// // //     res.data.forEach((p) => {
// // //       (p.variants || []).forEach((v) => {
// // //         allVariants.push({
// // //           ...v,
// // //           productName: p.nama
// // //         });
// // //       });
// // //     });

// // //     setVariants(allVariants);
// // //   };

// // //   // 🔥 ADD TO CART
// // //   const addToCart = () => {
// // //     if (!selectedVariant || qty <= 0) return;

// // //     const variant = variants.find(v => v.id == selectedVariant);

// // //     setCart([
// // //       ...cart,
// // //       {
// // //         variantId: variant.id,
// // //         name: `${variant.productName} - ${variant.nama_variant}`,
// // //         price: variant.harga,
// // //         quantity: qty
// // //       }
// // //     ]);
// // //   };

// // //   // 🔥 SUBMIT ORDER
// // //   const submitOrder = async () => {
// // //     try {
// // //       await axios.post("/orders", {
// // //         customerId: selectedCustomer,
// // //         items: cart.map(item => ({
// // //           variantId: item.variantId,
// // //           quantity: item.quantity
// // //         }))
// // //       });

// // //       alert("Order berhasil dibuat");
// // //       setCart([]);
// // //     } catch (err) {
// // //       alert(err?.response?.data?.message || "Gagal create order");
// // //     }
// // //   };

// // //   return (
// // //     <div className="p-6">
// // //       <h2 className="text-xl font-bold mb-4">Create Order</h2>

// // //       <div className="bg-white p-4 rounded-xl shadow space-y-4">

// // //         {/* CUSTOMER */}
// // //         <div>
// // //           <label>Customer</label>
// // //           <select
// // //             className="w-full border p-2 rounded"
// // //             onChange={(e) => setSelectedCustomer(e.target.value)}
// // //           >
// // //             <option value="">Pilih Customer</option>
// // //             {customers.map(c => (
// // //               <option key={c.id} value={c.id}>{c.name}</option>
// // //             ))}
// // //           </select>
// // //         </div>

// // //         {/* VARIANT */}
// // //         <div>
// // //           <label>Produk Variant</label>
// // //           <select
// // //             className="w-full border p-2 rounded"
// // //             onChange={(e) => setSelectedVariant(e.target.value)}
// // //           >
// // //             <option value="">Pilih Produk</option>
// // //             {variants.map(v => (
// // //               <option key={v.id} value={v.id}>
// // //                 {v.productName} - {v.nama_variant} (stok: {v.stok})
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>

// // //         {/* QTY */}
// // //         <div>
// // //           <label>Quantity</label>
// // //           <input
// // //             type="number"
// // //             className="w-full border p-2 rounded"
// // //             value={qty}
// // //             onChange={(e) => setQty(e.target.value)}
// // //           />
// // //         </div>

// // //         {/* ADD */}
// // //         <button
// // //           onClick={addToCart}
// // //           className="bg-blue-500 text-white px-4 py-2 rounded"
// // //         >
// // //           Tambah ke Cart
// // //         </button>

// // //         {/* CART */}
// // //         <div className="border p-3 rounded">
// // //           <h3 className="font-bold mb-2">Cart</h3>

// // //           {cart.map((item, index) => (
// // //             <div key={index}>
// // //               {item.name} | qty: {item.quantity}
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* SUBMIT */}
// // //         <button
// // //           onClick={submitOrder}
// // //           className="bg-green-500 text-white px-4 py-2 rounded"
// // //         >
// // //           Buat Order
// // //         </button>

// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // berikut isi dari Dashboard.jsx:
// // // import React, { useEffect, useState } from "react";
// // // import axios from "../../../utils/axiosInstance";
// // // import {
// // //     LineChart,
// // //     Line,
// // //     XAxis,
// // //     YAxis,
// // //     Tooltip,
// // //     CartesianGrid,
// // //     ResponsiveContainer,
// // //     BarChart,
// // //     Bar,
// // // } from "recharts";

// // // import { formatRupiah } from "../../../utils/format";

// // // export default function Dashboard() {
// // //     const [data, setData] = useState(null);

// // //     useEffect(() => {
// // //         fetchDashboard();
// // //     }, []);
// // //     const formatChartData = () => {
// // //         if (!data?.salesPerDay) return [];

// // //         return data.salesPerDay.map(item => {
// // //             const dateObj = new Date(item.date);

// // //             return {
// // //                 date: dateObj.toLocaleDateString("id-ID", {
// // //                     day: "2-digit",
// // //                     month: "short"
// // //                 }), 
// // //                 total: Number(item.total)
// // //             };
// // //         });
// // //     };
// // //     const formatTopProducts = () => {
// // //         console.log("RAW TOP PRODUCTS:", data?.topProducts); 

// // //         if (!data?.topProducts) return [];

// // //         const result = data.topProducts.map((p) => ({
// // //             name: `${p?.variant?.Product?.nama || "Unknown"} - ${p?.variant?.nama_variant || ""}`,
// // //             total: Number(p?.totalSold || 0),
// // //         }));

// // //         console.log("FORMATTED TOP PRODUCTS:", result); 

// // //         return result;
// // //     };

// // //     const fetchDashboard = async () => {
// // //         try {
// // //             const res = await axios.get("/dashboard");

// // //             console.log("API RESPONSE:", res.data.data); 

// // //             setData(res.data.data);
// // //         } catch (err) {
// // //             console.error(err);
// // //         }
// // //     };

// // //     return (
// // //         <div className="p-6">
// // //             <h2 className="text-xl font-bold mb-6">Dashboard Analytics</h2>

// // //             {/* CARD METRICS */}
// // //             <div className="grid grid-cols-3 gap-4 mb-6">

// // //                 <div className="bg-white p-4 rounded-xl shadow">
// // //                     <p className="text-gray-500">Total Revenue</p>
// // //                     <h3 className="text-2xl font-bold">
// // //                         {formatRupiah(data?.totalRevenue)}
// // //                     </h3>
// // //                 </div>

// // //                 <div className="bg-white p-4 rounded-xl shadow">
// // //                     <p className="text-gray-500">Total Orders</p>
// // //                     <h3 className="text-2xl font-bold">
// // //                         {data?.totalOrders || 0}
// // //                     </h3>
// // //                 </div>

// // //                 <div className="bg-white p-4 rounded-xl shadow">
// // //                     <p className="text-gray-500">Pending Orders</p>
// // //                     <h3 className="text-2xl font-bold">
// // //                         {data?.pendingOrders || 0}
// // //                     </h3>
// // //                 </div>

// // //             </div>

// // //             {/* CHART AREA (NEXT STEP) */}
// // //             <div className="bg-white p-4 rounded-xl shadow">
// // //                 <h3 className="font-bold mb-4">Sales Chart</h3>
// // //                 <div className="bg-white p-4 rounded-xl shadow">
// // //                     <h3 className="font-bold mb-4">Sales Per Day</h3>

// // //                     <ResponsiveContainer width="100%" height={300}>
// // //                         <LineChart data={formatChartData()}>
// // //                             <CartesianGrid strokeDasharray="3 3" />
// // //                             <XAxis dataKey="date" />
// // //                             <YAxis tickFormatter={(value) => formatRupiah(value)} />
// // //                             <Tooltip
// // //   formatter={(value) => formatRupiah(value)}
// // // />
// // //                             <Line type="monotone" dataKey="total" stroke="#4F46E5" />
// // //                         </LineChart>
// // //                     </ResponsiveContainer>
// // //                 </div>
// // //             </div>

// // //             <div className="bg-white p-4 rounded-xl shadow mt-6">
// // //                 <h3 className="font-bold mb-4">Top Products</h3>

// // //                 <ResponsiveContainer width="100%" height={300}>
// // //                     <BarChart data={formatTopProducts()}>
// // //                         <CartesianGrid strokeDasharray="3 3" />
// // //                         <XAxis dataKey="name" />
// // //                         <YAxis />
// // //                         <Tooltip />
// // //                         <Bar dataKey="total" fill="#22C55E" />
// // //                     </BarChart>
// // //                 </ResponsiveContainer>
// // //             </div>

// // //         </div>
// // //     );
// // // }

// // // berikut isi dari client\src\views\admin\default\index.jsx :
// // // import MiniCalendar from "components/calendar/MiniCalendar";
// // // import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
// // // import TotalSpent from "views/admin/default/components/TotalSpent";
// // // import PieChartCard from "views/admin/default/components/PieChartCard";
// // // import { IoMdHome } from "react-icons/io";
// // // import { IoDocuments } from "react-icons/io5";
// // // import { MdBarChart, MdDashboard } from "react-icons/md";

// // // import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

// // // import Widget from "components/widget/Widget";
// // // import CheckTable from "views/admin/default/components/CheckTable";
// // // import ComplexTable from "views/admin/default/components/ComplexTable";
// // // import DailyTraffic from "views/admin/default/components/DailyTraffic";
// // // import TaskCard from "views/admin/default/components/TaskCard";
// // // import tableDataCheck from "./variables/tableDataCheck.json";
// // // import tableDataComplex from "./variables/tableDataComplex.json";
// // // import { useEffect, useState } from "react";
// // // import axios from "../../../utils/axiosInstance";

// // // const Dashboard = () => {
// // // const [data, setData] = useState(null);

// // // useEffect(() => {
// // //   fetchDashboard();
// // // }, []);

// // // const fetchDashboard = async () => {
// // //   const res = await axios.get("/dashboard");
// // //   setData(res.data.data);
// // // };

// // // // useEffect(() => {
// // // //   axios.get("/dashboard")
// // // //     .then(res => {
// // // //       console.log(res.data); 
// // // //       setData(res.data);
// // // //     })
// // // //     .catch(err => console.error(err));
// // // // }, []);

// // //   return (
// // //     <div>
// // //       {/* Card widget */}

// // //       <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
// // //         <Widget
// // //           title={"Total Orders"}
// // //           subtitle={data.totalOrders || "Loading..."}
// // //         />

// // //         <Widget
// // //           title={"Total Products"}
// // //           subtitle={data.totalProducts || "Loading..."}
// // //         />
// // //         {/* <Widget
// // //           title={"Total Revenue"}
// // //           subtitle={dashboardData?.totalRevenue || "Loading..."}
// // //         />

// // //         <Widget
// // //           title={"Total Orders"}
// // //           subtitle={dashboardData?.totalOrders || "Loading..."}
// // //         />

// // //         <Widget
// // //           title={"Pending Orders"}
// // //           subtitle={dashboardData?.pendingOrders || "Loading..."}
// // //         />

// // //         <Widget
// // //           title={"Products"}
// // //           subtitle={dashboardData?.totalProducts || "Loading..."}
// // //         /> */}
// // //       </div>

// // //       {/* Charts */}

// // //       <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
// // //         <TotalSpent />
// // //         <WeeklyRevenue />
// // //       </div>

// // //       {/* Tables & Charts */}

// // //       <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
// // //         {/* Check Table */}
// // //         <div>
// // //           <CheckTable
// // //             columnsData={columnsDataCheck}
// // //             tableData={tableDataCheck}
// // //           />
// // //         </div>

// // //         {/* Traffic chart & Pie Chart */}

// // //         <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
// // //           <DailyTraffic />
// // //           <PieChartCard />
// // //         </div>

// // //         {/* Complex Table , Task & Calendar */}

// // //         <ComplexTable
// // //           columnsData={columnsDataComplex}
// // //           tableData={tableDataComplex}
// // //         />

// // //         {/* Task chart & Calendar */}

// // //         <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
// // //           <TaskCard />
// // //           <div className="grid grid-cols-1 rounded-[20px]">
// // //             <MiniCalendar />
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // // berikut isi dari client\src\views\admin\reports\Reports.jsx:
// // // import React, { useEffect, useState, useRef } from "react";
// // // import axios from "../../../utils/axiosInstance";

// // // import SummaryCards from "./components/SummaryCards";
// // // import SalesChart from "./components/SalesChart";
// // // import TopProducts from "./components/TopProducts";
// // // import Filter from "./components/Filter";
// // // import TransactionTable from "./components/TransactionTable";
// // // import { exportReportPDF } from "../../../utils/exportReportPDF";

// // // export default function Reports() {
// // //     const reportRef = useRef();
// // //     const [data, setData] = useState(null);
// // //     const [filter, setFilter] = useState({
// // //         startDate: "",
// // //         endDate: "",
// // //         groupBy: "day"
// // //     });

// // //     const fetchData = async (params) => {
// // //         try {
// // //             const res = await axios.get("http://localhost:5000/api/reports", { params });

// // //             console.log("DATA:", res.data);
// // //             setData(res.data);
// // //         } catch (err) {
// // //             console.error("API ERROR:", err);
// // //         }
// // //     };

// // //     useEffect(() => {
// // //         const today = new Date();
// // //         const last7Days = new Date();
// // //         last7Days.setDate(today.getDate() - 7);


// // //         const defaultFilter = {
// // //             startDate: last7Days.toISOString().split("T")[0],
// // //             endDate: today.toISOString().split("T")[0],
// // //             groupBy: "day"
// // //         };

// // //         setFilter(defaultFilter);
// // //         fetchData(defaultFilter);
// // //     }, []);

// // //     if (!data) return <div>Loading...</div>;

// // //     if (!data.summary) return <div>No data available</div>;

// // //     const isEmpty =
// // //         data.summary.totalOrders === 0 &&
// // //         data.trends.length === 0 &&
// // //         data.topProducts.length === 0;

// // //     if (isEmpty) {
// // //         return <div>Tidak ada data dalam rentang tanggal</div>;
// // //     }
// // //     return (

// // //         <div className="p-6" ref={reportRef}>

// // //             <Filter onFilterChange={(f) => {
// // //                 setFilter(f);
// // //                 fetchData(f);
// // //             }} />
// // //             <button
// // //                 onClick={() => exportReportPDF(data, filter)}
// // //                 className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
// // //             >
// // //                 Export PDF
// // //             </button>

// // //             <SummaryCards data={data.summary} />

// // //             <SalesChart data={data.trends} />

// // //             <TopProducts data={data.topProducts} />

// // //             <TransactionTable data={data.transactions} />

// // //         </div>

// // //     );
// // // }

// // // Tolong dari semua kode yang saya kirim ini periksakan dan juga tuliskan ulang kode mana yang harus dieprbaiki dna juga daganti dengan adanya perubahan dari product ke productvariant dari segi stok dan juga harganya




// // Beriktut isi dari orderService.js :
// // const sequelize = require("../config/database");
// // const { Order, OrderItem, ProductVariant, Customer , Business } = require("../models");

// // exports.getAllOrders = async (businessId) => {
// //   const orders = await Order.findAll({
// //     where: { businessId },
// //     include: [
// //       {
// //         model: Customer,
// //         as: "customer",
// //         attributes: ["id", "name", "phoneNumber"]
// //       },
// //       {
// //         model: OrderItem,
// //         as: "items",
// //         include: [
// //           {
// //             model: ProductVariant,
// //             as: "variant"
// //           }
// //         ]
// //       }
// //     ],
// //     order: [["createdAt", "DESC"]]
// //   });

// //   return orders;
// // };

// // exports.createOrder = async (payload) => {
// //   const t = await sequelize.transaction();

// //   try {
// //     const { customerId, items, businessId } = payload;

// //     if (!customerId || !items || items.length === 0) {
// //       throw new Error("Data order tidak valid");
// //     }

// //     let totalPrice = 0; 

// //     const order = await Order.create({
// //       customerId,
// //       businessId,
// //       totalPrice: 0,
// //       status: "pending"
// //     }, { transaction: t });

// //     for (const item of items) {
// //       const variant = await ProductVariant.findByPk(item.variantId, { transaction: t });

// //       if (!variant) throw new Error("Variant tidak ditemukan");

// //       if (variant.stok < item.quantity) {
// //         throw new Error("Stok tidak cukup");
// //       }

// //       const subtotal = variant.harga * item.quantity;
// //       totalPrice += subtotal;

// //       await OrderItem.create({
// //         orderId: order.id,
// //         variantId: variant.id,
// //         quantity: item.quantity,
// //         unitPrice: variant.harga,
// //         subtotal
// //       }, { transaction: t });
// //     }

// //     await order.update({ totalPrice }, { transaction: t });

// //     await t.commit();

// //     return order;

// //   } catch (err) {
// //     await t.rollback();
// //     throw err;
// //   }
// // };

// // exports.approveOrder = async (orderId) => {
// //   const order = await Order.findByPk(orderId);

// //   if (!order) throw new Error("Order tidak ditemukan");

// //   if (order.status !== "pending") {
// //     throw new Error("Order hanya bisa di-approve dari status pending");
// //   }

// //   order.status = "approved";
// //   await order.save();

// //   return order;
// // };

// // exports.completePayment = async (orderId) => {
// //   const t = await sequelize.transaction();

// //   try {
// //    const order = await Order.findByPk(orderId, {
// //   include: [
// //     {
// //       model: OrderItem,
// //       as: "items",
// //       include: [
// //         {
// //           model: ProductVariant,
// //           as: "variant"
// //         }
// //       ]
// //     }
// //   ],
// //   transaction: t
// // });

// //     if (!order) throw new Error("Order tidak ditemukan");

// //     if (order.status !== "approved") {
// //       throw new Error("Order belum di-approve");
// //     }

// //     if (order.status === "paid") {
// //       throw new Error("Order sudah dibayar");
// //     }

// //     for (const item of order.items) {
// //       const variant = await ProductVariant.findByPk(item.variantId, {
// //         transaction: t,
// //         lock: t.LOCK.UPDATE
// //       });

// //       if (!variant) throw new Error("Variant tidak ditemukan");

// //       if (variant.stok < item.quantity) {
// //         throw new Error("Stok tidak cukup saat pembayaran");
// //       }

// //       //POTONG STOK DI SINI
// //       await ProductVariant.update(
// //         {
// //           stok: sequelize.literal(`stok - ${item.quantity}`)
// //         },
// //         {
// //           where: { id: variant.id },
// //           transaction: t
// //         }
// //       );
// //     }

// //     order.status = "paid";
// //     await order.save({ transaction: t });

// //     await t.commit();

// //     return order;

// //   } catch (err) {
// //     await t.rollback();
// //     throw err;
// //   }
// // };

// // berikut isi dari paymentService.js :
// // const midtransClient = require("midtrans-client");
// // const { Order } = require("../models");

// // const snap = new midtransClient.Snap({
// //   isProduction: false,
// //   serverKey: process.env.MIDTRANS_SERVER_KEY,
// //   clientKey: process.env.MIDTRANS_CLIENT_KEY
// // });

// // exports.createPayment = async (orderId) => {
// //   console.log("ORDER ID MASUK:", orderId); // 🔥

// //   const order = await Order.findByPk(orderId);

// //   console.log("ORDER DATA:", order); // 🔥

// //   if (!order) throw new Error("Order tidak ditemukan");

// //   const parameter = {
// //     transaction_details: {
// //       order_id: order.id,
// //       gross_amount: Number(order.totalPrice) // 🔥 WAJIB NUMBER
// //     }
// //   };

// //   console.log("MIDTRANS PARAM:", parameter); // 🔥

// //   const transaction = await snap.createTransaction(parameter);
// //   console.log("SERVER KEY:", process.env.MIDTRANS_SERVER_KEY);
// //   console.log("MIDTRANS RESPONSE:", transaction); // 🔥

// //   order.paymentToken = transaction.token;
// //   order.paymentUrl = transaction.redirect_url;
// //   await order.save();

// //   return transaction;
// // };

// // exports.handleWebhook = async (notification) => {
// //   const { order_id, transaction_status } = notification;

// //   const order = await Order.findByPk(order_id);

// //   if (!order) throw new Error("Order tidak ditemukan");

// //   if (transaction_status === "settlement") {
// //     order.status = "paid";
// //     await order.save();
// //   }

// //   if (transaction_status === "pending") {
// //     order.status = "pending";
// //     await order.save();
// //   }

// //   if (transaction_status === "cancel") {
// //     order.status = "cancelled";
// //     await order.save();
// //   }
// // };

// // exports.savePayment = async (order, midtransData) => {
// //   return await Payment.create({
// //     orderId: order.id,
// //     businessId: order.businessId,

// //     customerName: order.customer.name,
// //     customerPhone: order.customer.phoneNumber,

// //     totalPrice: order.totalPrice,
// //     paidAmount: order.totalPrice,

// //     method: midtransData.payment_type,
// //     status: midtransData.transaction_status,

// //     midtransResponse: midtransData
// //   });
// // };

// // exports.handleMidtransWebhook = async (req, res) => {
// //   const data = req.body;

// //   if (data.transaction_status === "settlement") {

// //     const order = await Order.findByPk(data.order_id, {
// //       include: ["customer", "items"]
// //     });

// //     await orderService.completePayment(order.id);

// //     await paymentService.savePayment(order, data);
// //   }

// //   res.json({ success: true });
// // };

// // Tolong dari semua ini yang kode saya sebelumnya saya kirim tolong ubah semua nya agar bisa dijalan kan fitur" dengan normal. dan juga berikan srcitpt/seedAll.js yang baru karena ada perubahan models nya juga buatkan ulang dengan data yang sudah di ubah sebelumnya.

// // lalu untuk bagiana service pada product bagaimana untuk edit productnya apakah ada perubahaan karena sekarang harga dan juga stok menggakan data di varaint ?



// // tolong betulkan semau mengnai payment agar fitur payment ini dapat berjalan mulus dengan meangganakan fitur yang diberikan MdOutlineTransgender, saya ini juga sudah menggunakn ngrox dan sduah saya jalankan beriktu isi ss nya pada file yang saya lampirkan DiAtlassian.DiAtlassian
// // sekarang berikut isi kode dari client\src\views\admin\payment\PaymentPage.jsx :
// // import React, { useEffect } from "react";
// // import axios from "../../../utils/axiosInstance";
// // import { useParams, useNavigate } from "react-router-dom";

// // export default function PaymentPage() {
// //   const { orderId } = useParams();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     loadSnap();
// //     createPayment();

// //     // 🔥 polling tiap 3 detik
// //     const interval = setInterval(checkPaymentStatus, 3000);

// //     return () => clearInterval(interval);
// //   }, []);

// //   const loadSnap = () => {
// //     const script = document.createElement("script");
// //     script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
// //     script.setAttribute(
// //       "data-client-key",
// //       process.env.REACT_APP_MIDTRANS_CLIENT_KEY
// //     );
// //     script.async = true;

// //     document.body.appendChild(script);
// //   };

// //   const createPayment = async () => {
// //     const res = await axios.post(
// //       `/payment/create/${orderId}`
// //     );

// //     window.snap.pay(res.data.token);
// //   };

// //   const checkPaymentStatus = async () => {
// //     try {
// //       const res = await axios.get(
// //         `/orders/${orderId}`
// //       );

// //       if (res.data.data.status === "paid") {
// //         alert("Pembayaran berhasil!");

// //         navigate("/admin/orders"); // balik ke orders
// //       }
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   useEffect(() => {
// //   if (!orderId) return;

// //   // tunggu 5 detik seolah user bayar
// //   const timer = setTimeout(async () => {
// //     try {
// //       await axios.post("/payment/webhook", {
// //         order_id: orderId,
// //         transaction_status: "settlement"
// //       });

// //       alert("Pembayaran berhasil (simulasi)");

// //       // redirect atau refresh
// //       window.location.href = "/admin/orders";

// //     } catch (err) {
// //       console.error(err);
// //     }
// //   }, 5000);

// //   return () => clearTimeout(timer);
// // }, [orderId]);

// //   return (
// //     <div className="p-6">
// //       <h2 className="text-xl font-bold">Menunggu Pembayaran...</h2>
// //       <p>Silakan scan QRIS</p>
// //     </div>
// //   );
// // }

// // beriktu isi kode dari PaymentController.js :
// // const orderService = require("../services/orderService");
// // const paymentService = require("../services/paymentService");

// // exports.midtransWebhook = async (req, res) => {
// //   try {
// //     const data = req.body;

// //     const { order_id, transaction_status } = data;

// //     const order = await Order.findByPk(order_id, {
// //       include: ["customer", "items"]
// //     });

// //     if (!order) return res.status(404).json({ message: "Order not found" });

// //     // =========================
// //     // STATUS HANDLING
// //     // =========================

// //     if (transaction_status === "settlement") {

// //       // 🔥 update order + potong stok
// //       await orderService.completePayment(order.id);

// //       // 🔥 simpan ke payment table
// //       await paymentService.savePayment(order, data);

// //     }

// //     if (transaction_status === "pending") {
// //       order.status = "pending";
// //       await order.save();
// //     }

// //     if (transaction_status === "cancel") {
// //       order.status = "cancelled";
// //       await order.save();
// //     }

// //     res.json({ success: true });

// //   } catch (err) {
// //     console.error("WEBHOOK ERROR:", err);
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // berikut isi dari kode IoLogoModelS.association.js:
// // module.exports = (db) => {
// //     const {
// //         User,
// //         Order,
// //         OrderItem,
// //         Customer,
// //         Product,
// //         ProductVariant,
// //         Category,
// //         Business,
// //         Payment
// //     } = db;

// //     // ======================
// //     // BUSINESS RELATIONS
// //     // ======================
// //     Business.hasMany(User, { foreignKey: "businessId" });
// //     User.belongsTo(Business, { foreignKey: "businessId" });

// //     Business.hasMany(Product, { foreignKey: "businessId" });
// //     Product.belongsTo(Business, { foreignKey: "businessId" });

// //     Business.hasMany(Category, { foreignKey: "businessId" });
// //     Category.belongsTo(Business, { foreignKey: "businessId" });

// //     Business.hasMany(Customer, { foreignKey: "businessId" });
// //     Customer.belongsTo(Business, { foreignKey: "businessId" });

// //     Business.hasMany(Order, { foreignKey: "businessId" });
// //     Order.belongsTo(Business, { foreignKey: "businessId" });

// //     // ======================
// //     // PRODUCT & CATEGORY
// //     // ======================
// //     Category.hasMany(Product, { foreignKey: "categoryId" });
// //     Product.belongsTo(Category, { foreignKey: "categoryId", as: "Category" });

// //     Product.hasMany(ProductVariant, {
// //         foreignKey: "productId",
// //         as: "variants"
// //     });
// //     ProductVariant.belongsTo(Product, {
// //         foreignKey: "productId",
// //         as: "Product"
// //     });

// //     // ======================
// //     // ORDER SYSTEM
// //     // ======================
// //     Customer.hasMany(Order, { foreignKey: "customerId" });
// //     Order.belongsTo(Customer, {
// //         foreignKey: "customerId",
// //         as: "customer"
// //     });

// //     Order.hasMany(OrderItem, {
// //         foreignKey: "orderId",
// //         as: "items"
// //     });

// //     OrderItem.belongsTo(Order, {
// //         foreignKey: "orderId",
// //         as: "order"
// //     });

// //     OrderItem.belongsTo(ProductVariant, {
// //         foreignKey: "variantId",
// //         as: "variant"
// //     });

// //     ProductVariant.hasMany(OrderItem, {
// //         foreignKey: "variantId"
// //     });

// //     Order.hasOne(Payment, { foreignKey: "orderId" });
// //     Payment.belongsTo(Order, { foreignKey: "orderId" });

// //     Business.hasMany(Payment, { foreignKey: "businessId" });
// //     Payment.belongsTo(Business, { foreignKey: "businessId" });
// // };

// // Berikut isi dari file models/Payment.js : 
// // const { DataTypes } = require("sequelize");
// // const sequelize = require("../config/database");

// // const Payment = sequelize.define("Payment", {
// //   id: {
// //     type: DataTypes.INTEGER,
// //     autoIncrement: true,
// //     primaryKey: true
// //   },

// //   orderId: {
// //     type: DataTypes.UUID,
// //     allowNull: false
// //   },

// //   businessId: {
// //     type: DataTypes.UUID,
// //     allowNull: false
// //   },

// //   customerName: DataTypes.STRING,
// //   customerPhone: DataTypes.STRING,

// //   totalPrice: DataTypes.FLOAT,
// //   paidAmount: DataTypes.FLOAT,

// //   method: DataTypes.STRING,
// //   status: DataTypes.STRING,

// //   midtransResponse: DataTypes.JSON

// // }, {
// //   tableName: "payments",
// //   freezeTableName: true
// // });

// // module.exports = Payment;

// // Berikut isi file dari paymentRoutes.js :
// // const express = require("express");
// // const router = express.Router();
// // const paymentController = require("../../controllers/PaymentController");
// // const authMiddleware = require("../../middlewares/authMiddleware");

// // router.use(authMiddleware);

// // router.post("/create/:orderId", paymentController.createPayment);
// // router.post("/webhook", paymentController.midtransWebhook);

// // module.exports = router;

// // Berikut isi dari file paymentService.js :
// // const midtransClient = require("midtrans-client");
// // const { Order, Payment, Customer, OrderItem, ProductVariant } = require("../models");
// // const orderService = require("./orderService");

// // const snap = new midtransClient.Snap({
// //   isProduction: false,
// //   serverKey: process.env.MIDTRANS_SERVER_KEY,
// //   clientKey: process.env.MIDTRANS_CLIENT_KEY
// // });

// // exports.createPayment = async (orderId) => {
// //   const order = await Order.findByPk(orderId);

// //   if (!order) throw new Error("Order tidak ditemukan");

// //   const transaction = await snap.createTransaction({
// //     transaction_details: {
// //       order_id: order.id,
// //       gross_amount: Number(order.totalPrice)
// //     }
// //   });

// //   await order.update({
// //     paymentToken: transaction.token,
// //     paymentUrl: transaction.redirect_url
// //   });

// //   return transaction;
// // };

// // exports.handleWebhook = async (req, res) => {
// //   const data = req.body;

// //   const order = await Order.findByPk(data.order_id, {
// //     include: [
// //       { model: Customer, as: "customer" },
// //       {
// //         model: OrderItem,
// //         as: "items",
// //         include: [{ model: ProductVariant, as: "variant" }]
// //       }
// //     ]
// //   });

// //   if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

// //   if (data.transaction_status === "settlement") {

// //     // potong stok & update status
// //     await orderService.completePayment(order.id);

// //     // simpan ke payment table
// //     await Payment.create({
// //       orderId: order.id,
// //       businessId: order.businessId,

// //       customerName: order.customer.name,
// //       customerPhone: order.customer.phoneNumber,

// //       totalPrice: order.totalPrice,
// //       paidAmount: order.totalPrice,

// //       method: data.payment_type,
// //       status: data.transaction_status,

// //       midtransResponse: data
// //     });
// //   }

// //   res.json({ success: true });
// // };

// // exports.savePayment = async (order, midtransData) => {
// //   return await Payment.create({
// //     orderId: order.id,
// //     businessId: order.businessId,

// //     customerName: order.customer.name,
// //     customerPhone: order.customer.phoneNumber,

// //     totalPrice: order.totalPrice,
// //     paidAmount: order.totalPrice,

// //     method: midtransData.payment_type,
// //     status: midtransData.transaction_status,

// //     midtransResponse: midtransData
// //   });
// // };

// // exports.handleMidtransWebhook = async (req, res) => {
// //   const data = req.body;

// //   if (data.transaction_status === "settlement") {

// //     const order = await Order.findByPk(data.order_id, {
// //       include: ["customer", "items"]
// //     });

// //     await orderService.completePayment(order.id);

// //     await paymentService.savePayment(order, data);
// //   }

// //   res.json({ success: true });
// // };

// // Berikut isi file dari App.js :
// // require("dotenv").config();
// // const express = require("express");
// // const cors = require("cors");

// // const app = express();

// // app.use(cors());
// // app.use(express.json());


// // const dashboardRoutes = require("./routes/api/dashboardRoutes");
// // const productRoutes = require("./routes/api/productRoutes");
// // const customerRoutes = require("./routes/api/customerRoutes");
// // const variantRoutes = require("./routes/api/productVariantRoutes");
// // const reportRoutes = require("./routes/api/reportRoutes");
// // const paymentRoutes = require("./routes/api/paymentRoutes");
// // const authRoutes = require("./routes/api/authRoutes");
// // const categoryRoutes = require("./routes/api/categoryRoutes");

// // app.use("/api/auth", authRoutes); // PUBLIC

// // app.use("/api/products", productRoutes);
// // app.use("/api/orders", require("./routes/api/orderRoutes"));
// // app.use("/api/customers", customerRoutes);
// // app.use("/api/dashboard", dashboardRoutes);
// // app.use("/api/categories", categoryRoutes);
// // app.use("/api/variants", variantRoutes);
// // app.use("/api/payment", paymentRoutes);
// // app.use("/api/reports", reportRoutes);


// // // TEST
// // app.use((req, res, next) => {
// //   console.log("Request masuk:", req.url);
// //   next();
// // });


// // app.get("/", (req, res) => {
// //   res.send("API RUNNING");
// // });

// // module.exports = app;




// import React, { useEffect } from "react";
// import axios from "../../../utils/axiosInstance";
// import { useParams, useNavigate } from "react-router-dom";

// export default function PaymentPage() {
//   const { orderId } = useParams();
//   const navigate = useNavigate();

// useEffect(() => {
//   loadSnap();
//   createPayment();
// }, []);

//   const loadSnap = () => {
//     const script = document.createElement("script");
//     script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
//     script.setAttribute(
//       "data-client-key",
//       process.env.REACT_APP_MIDTRANS_CLIENT_KEY
//     );
//     script.async = true;

//     document.body.appendChild(script);
//   };

// const createPayment = async () => {
//   try {
//     const res = await axios.post(`/payment/create/${orderId}`);

//     if (!res.data.token) {
//       alert("Token tidak ditemukan");
//       return;
//     }

//     window.snap.pay(res.data.token, {
//       onSuccess: function () {
//         alert("Pembayaran berhasil");
//         navigate("/admin/orders");
//       },
//       onPending: function () {
//         alert("Menunggu pembayaran");
//       },
//       onError: function () {
//         alert("Pembayaran gagal");
//       }
//     });

//   } catch (err) {
//     console.error("ERROR PAYMENT:", err.response?.data || err.message);
//     alert("Gagal memulai pembayaran");
//   }
// };
//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold">Menunggu Pembayaran...</h2>
//       <p>Silakan scan QRIS</p>
//     </div>
//   );
// }

// berikut isi dari PaymentController.js:
// const { or } = require("sequelize");
// const { Order } = require("../models");
// const orderService = require("../services/orderService");
// const paymentService = require("../services/paymentService");

// exports.createPayment = async (req, res) => {
//   try {
//     const transaction = await paymentService.createPayment(req.params.orderId);
//     res.json(transaction); 
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.midtransWebhook = async (req, res) => {
//   try {
//     const data = req.body;

//     console.log("MIDTRANS WEBHOOK:", data);

//     const order = await Order.findByPk(data.order_id, {
//       include: ["customer", "items"]
//     });

//     if (!order) {
//       return res.status(404).json({ message: "Order tidak ditemukan" });
//     }

//     // =========================
//     // HANDLE STATUS
//     // =========================

//     if (data.transaction_status === "settlement") {

//       // 🔥 update order + stok
//       await orderService.completePayment(order.id);

//       // 🔥 save payment
//       await paymentService.savePayment(order, data);
//     }else if (data.transaction_status === "pending" && order.status !== "paid") {
//       order.status = "pending";
//       await order.save();
//     }
//       else if (data.transaction_status === "cancel" ) {
//       order.status = "cancelled";
//       await order.save();
//     }


//     if (data.transaction_status === "pending") {
//       order.status = "pending";
//       await order.save();
//     }

//     if (data.transaction_status === "cancel") {
//       order.status = "cancelled";
//       await order.save();
//     }

//     res.json({ success: true });

//   } catch (err) {
//     console.error("WEBHOOK ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// berikut isi dari OrderController.js:
// const orderService = require("../services/orderService");
// const paymentService = require("../services/paymentService");

// // CREATE
// exports.createOrder = async (req, res) => {
//   try {
//     const payload = {
//       ...req.body,
//       userId: req.user.id,
//       businessId: req.user.businessId
//     };

//     const data = await orderService.createOrder(payload);

//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// // APPROVE
// exports.approveOrder = async (req, res) => {
//   try {
//     const data = await orderService.approveOrder(req.params.id);
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// // PAYMENT SUCCESS (SIMULASI)
// exports.completePayment = async (req, res) => {
//   try {
//     const data = await orderService.completePayment(req.params.id);
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };


// exports.getOrders = async (req, res) => {
//   try {
//     const data = await orderService.getAllOrders(req.user.businessId);
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.createPayment = async (req, res) => {
//   try {
//     const url = await paymentService.createPayment(req.params.id);

//     res.json({
//       success: true,
//       paymentUrl: url
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findByPk(req.params.id);

//     res.json({
//       success: true,
//       data: order
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// berikut isi dari orderRoutes.js:
// const router = require("express").Router();
// const orderController = require("../../controllers/OrderController");
// const authMiddleware = require("../../middlewares/authMiddleware");

// router.get("/", authMiddleware, orderController.getOrders);
// router.post("/", authMiddleware, orderController.createOrder);
// router.put("/:id/approve", authMiddleware, orderController.approveOrder);
// router.put("/:id/payment", authMiddleware, orderController.completePayment);
// router.post("/:id/pay", authMiddleware, orderController.createPayment);
// router.get("/:id", authMiddleware, orderController.getOrderById);

// module.exports = router;

// berikut isi dari paymentRoutes.js:
// const express = require("express");
// const router = express.Router();
// const paymentController = require("../../controllers/PaymentController");
// const authMiddleware = require("../../middlewares/authMiddleware");

// router.post("/webhook", paymentController.midtransWebhook); 

// router.use(authMiddleware);

// router.post("/create/:orderId", paymentController.createPayment);

// module.exports = router;

// berikut isi dari orderService.js:
// const sequelize = require("../config/database");
// const { Order, OrderItem, ProductVariant, Customer , Business } = require("../models");

// exports.getAllOrders = async (businessId) => {
//   const orders = await Order.findAll({
//     where: { businessId },
//     include: [
//       {
//         model: Customer,
//         as: "customer",
//         attributes: ["id", "name", "phoneNumber"]
//       },
//       {
//         model: OrderItem,
//         as: "items",
//         include: [
//           {
//             model: ProductVariant,
//             as: "variant"
//           }
//         ]
//       }
//     ],
//     order: [["createdAt", "DESC"]]
//   });

//   return orders;
// };

// const validateVariant = (variant, qty) => {
//   if (!variant) throw new Error("Variant tidak ditemukan");
//   if (variant.stok < qty) throw new Error("Stok tidak cukup");
// };

// exports.createOrder = async (payload) => {
//   const t = await sequelize.transaction();

//   try {
//     const { customerId, items, businessId } = payload;

//     if (!customerId || !items?.length) {
//       throw new Error("Data order tidak valid");
//     }

//     let totalPrice = 0;

//     const order = await Order.create({
//       customerId,
//       businessId,
//       totalPrice: 0,
//       status: "pending"
//     }, { transaction: t });

//     for (const item of items) {
//       const variant = await ProductVariant.findByPk(item.variantId, { transaction: t });

//       validateVariant(variant, item.quantity);

//       const subtotal = variant.harga * item.quantity;
//       totalPrice += subtotal;

//       await OrderItem.create({
//         orderId: order.id,
//         variantId: variant.id,
//         quantity: item.quantity,
//         unitPrice: variant.harga,
//         subtotal
//       }, { transaction: t });
//     }

//     await order.update({ totalPrice }, { transaction: t });

//     await t.commit();
//     return order;

//   } catch (err) {
//     await t.rollback();
//     throw err;
//   }
// };

// exports.approveOrder = async (orderId) => {
//   const order = await Order.findByPk(orderId);

//   if (!order) throw new Error("Order tidak ditemukan");

//   if (order.status !== "pending") {
//     throw new Error("Order hanya bisa di-approve dari status pending");
//   }

//   order.status = "approved";
//   await order.save();

//   return order;
// };

// exports.completePayment = async (orderId) => {
//   const t = await sequelize.transaction();

//   try {
//     const order = await Order.findByPk(orderId, {
//       include: [
//         {
//           model: OrderItem,
//           as: "items"
//         }
//       ],
//       transaction: t,
//       lock: t.LOCK.UPDATE
//     });

//     if (!order) throw new Error("Order tidak ditemukan");
//     if (order.status === "paid") return order;
//     if (order.status !== "approved") throw new Error("Order belum di-approve");

//     for (const item of order.items) {
//       const variant = await ProductVariant.findByPk(item.variantId, {
//         transaction: t,
//         lock: t.LOCK.UPDATE
//       });

//       validateVariant(variant, item.quantity);

//       await variant.update({
//         stok: variant.stok - item.quantity
//       }, { transaction: t });
//     }

//     order.status = "paid";
//     await order.save({ transaction: t });

//     await t.commit();
//     return order;

//   } catch (err) {
//     await t.rollback();
//     throw err;
//   }
// };

// berikut isi dari paymentService.js:
// const sequelize = require("../config/database");
// const { Order, OrderItem, ProductVariant, Customer , Business } = require("../models");

// exports.getAllOrders = async (businessId) => {
//   const orders = await Order.findAll({
//     where: { businessId },
//     include: [
//       {
//         model: Customer,
//         as: "customer",
//         attributes: ["id", "name", "phoneNumber"]
//       },
//       {
//         model: OrderItem,
//         as: "items",
//         include: [
//           {
//             model: ProductVariant,
//             as: "variant"
//           }
//         ]
//       }
//     ],
//     order: [["createdAt", "DESC"]]
//   });

//   return orders;
// };

// const validateVariant = (variant, qty) => {
//   if (!variant) throw new Error("Variant tidak ditemukan");
//   if (variant.stok < qty) throw new Error("Stok tidak cukup");
// };

// exports.createOrder = async (payload) => {
//   const t = await sequelize.transaction();

//   try {
//     const { customerId, items, businessId } = payload;

//     if (!customerId || !items?.length) {
//       throw new Error("Data order tidak valid");
//     }

//     let totalPrice = 0;

//     const order = await Order.create({
//       customerId,
//       businessId,
//       totalPrice: 0,
//       status: "pending"
//     }, { transaction: t });

//     for (const item of items) {
//       const variant = await ProductVariant.findByPk(item.variantId, { transaction: t });

//       validateVariant(variant, item.quantity);

//       const subtotal = variant.harga * item.quantity;
//       totalPrice += subtotal;

//       await OrderItem.create({
//         orderId: order.id,
//         variantId: variant.id,
//         quantity: item.quantity,
//         unitPrice: variant.harga,
//         subtotal
//       }, { transaction: t });
//     }

//     await order.update({ totalPrice }, { transaction: t });

//     await t.commit();
//     return order;

//   } catch (err) {
//     await t.rollback();
//     throw err;
//   }
// };

// exports.approveOrder = async (orderId) => {
//   const order = await Order.findByPk(orderId);

//   if (!order) throw new Error("Order tidak ditemukan");

//   if (order.status !== "pending") {
//     throw new Error("Order hanya bisa di-approve dari status pending");
//   }

//   order.status = "approved";
//   await order.save();

//   return order;
// };

// exports.completePayment = async (orderId) => {
//   const t = await sequelize.transaction();

//   try {
//     const order = await Order.findByPk(orderId, {
//       include: [
//         {
//           model: OrderItem,
//           as: "items"
//         }
//       ],
//       transaction: t,
//       lock: t.LOCK.UPDATE
//     });

//     if (!order) throw new Error("Order tidak ditemukan");
//     if (order.status === "paid") return order;
//     if (order.status !== "approved") throw new Error("Order belum di-approve");

//     for (const item of order.items) {
//       const variant = await ProductVariant.findByPk(item.variantId, {
//         transaction: t,
//         lock: t.LOCK.UPDATE
//       });

//       validateVariant(variant, item.quantity);

//       await variant.update({
//         stok: variant.stok - item.quantity
//       }, { transaction: t });
//     }

//     order.status = "paid";
//     await order.save({ transaction: t });

//     await t.commit();
//     return order;

//   } catch (err) {
//     await t.rollback();
//     throw err;
//   }
// };

// dari semua is file ini tolong check mana yang salah dan perlu diperbaiki agar setelah melkukan pembayaran dapat berubahs stastutmenjadi padi dan masuk kedatabase payment


Berikut isi dari PaymentController.js :
const { or } = require("sequelize");
const { Customer, Order, OrderItem } = require("../models");
const orderService = require("../services/orderService");
const paymentService = require("../services/paymentService");

exports.createPayment = async (req, res) => {
  try {
    console.log("CREATE PAYMENT ORDER:", req.params.orderId);

    const transaction = await paymentService.createPayment(req.params.orderId);

    console.log("MIDTRANS RESPONSE:", transaction);

    res.json(transaction);

  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.midtransWebhook = async (req, res) => {
  try {
    const data = req.body;

    console.log("🔥 WEBHOOK:", data.transaction_status);

 const order = await Order.findByPk(data.order_id, {
  include: [
    {
      model: Customer,
      as: "customer"
    },
    {
      model: OrderItem,
      as: "items"
    }
  ]
});

    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

    // 🔥 JANGAN PROSES ULANG
    if (order.status === "paid") {
      console.log("⛔ SUDAH PAID, SKIP");
      return res.json({ success: true });
    }

    // 🔥 HANDLE SUCCESS
    if (["settlement", "capture"].includes(data.transaction_status)) {

      await orderService.completePayment(order.id);

      await paymentService.savePayment(order, data);

      console.log("✅ SET PAID");
    }

    // 🔥 HANDLE PENDING (TAPI JANGAN TIMPA PAID)
    else if (data.transaction_status === "pending" && order.status !== "paid") {
      order.status = "pending";
      await order.save();
    }

    // 🔥 HANDLE CANCEL
    else if (["cancel", "expire"].includes(data.transaction_status)) {
      order.status = "cancelled";
      await order.save();
    }

    res.json({ success: true });

  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    res.status(200).json({ success: true }); // 🔥 PENTING!
  }
};


Berikut isi dari paymentService.js :
const midtransClient = require("midtrans-client");
const { Order, Payment, Customer, OrderItem, ProductVariant } = require("../models");
const orderService = require("./orderService");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.createPayment = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      { model: Customer, as: "customer" },
      {
        model: OrderItem,
        as: "items",
        include: [{ model: ProductVariant, as: "variant" }]
      }
    ]
  });

  if (!order) throw new Error("Order tidak ditemukan");

  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: order.id,
      gross_amount: Number(order.totalPrice)
    },

    customer_details: {
      first_name: order.customer?.name || "Customer",
      phone: order.customer?.phoneNumber || "08123456789"
    },

    item_details: order.items.map(item => ({
      id: item.variantId,
      price: item.unitPrice,
      quantity: item.quantity,
      name: item.variant?.nama_variant || "Item"
    })),

    callbacks: {
      finish: `http://localhost:3000/admin/orders`
    }
  });

  await order.update({
    paymentToken: transaction.token,
    paymentUrl: transaction.redirect_url
  });

  return transaction;
};


exports.savePayment = async (order, midtransData) => {
  return await Payment.create({
    orderId: order.id,
    businessId: order.businessId,

    customerName: order.customer?.name || "-",
    customerPhone: order.customer?.phoneNumber || "-",

    totalPrice: order.totalPrice,
    paidAmount: order.totalPrice,

    method: midtransData.payment_type,
    status: midtransData.transaction_status,

    midtransResponse: midtransData
  });
};

Berikut isi dari OrderController.js :
const orderService = require("../services/orderService");
const paymentService = require("../services/paymentService");

// CREATE
exports.createOrder = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.id,
      businessId: req.user.businessId
    };

    const data = await orderService.createOrder(payload);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// APPROVE
exports.approveOrder = async (req, res) => {
  try {
    const data = await orderService.approveOrder(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PAYMENT SUCCESS (SIMULASI)
exports.completePayment = async (req, res) => {
  try {
    const data = await orderService.completePayment(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const data = await orderService.getAllOrders(req.user.businessId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const url = await paymentService.createPayment(req.params.id);

    res.json({
      success: true,
      paymentUrl: url
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

Berikut isi dari OrderService.js :
const sequelize = require("../config/database");
const { Order, OrderItem, ProductVariant, Customer , Business } = require("../models");

exports.getAllOrders = async (businessId) => {
  const orders = await Order.findAll({
    where: { businessId },
    include: [
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "name", "phoneNumber"]
      },
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: ProductVariant,
            as: "variant"
          }
        ]
      }
    ],
    order: [["createdAt", "DESC"]]
  });

  return orders;
};

const validateVariant = (variant, qty) => {
  if (!variant) throw new Error("Variant tidak ditemukan");
  if (variant.stok < qty) throw new Error("Stok tidak cukup");
};

exports.createOrder = async (payload) => {
  const t = await sequelize.transaction();

  try {
    const { customerId, items, businessId } = payload;

    if (!customerId || !items?.length) {
      throw new Error("Data order tidak valid");
    }

    let totalPrice = 0;

    const order = await Order.create({
      customerId,
      businessId,
      totalPrice: 0,
      status: "pending"
    }, { transaction: t });

    for (const item of items) {
      const variant = await ProductVariant.findByPk(item.variantId, { transaction: t });

      validateVariant(variant, item.quantity);

      const subtotal = variant.harga * item.quantity;
      totalPrice += subtotal;

      await OrderItem.create({
        orderId: order.id,
        variantId: variant.id,
        quantity: item.quantity,
        unitPrice: variant.harga,
        subtotal
      }, { transaction: t });
    }

    await order.update({ totalPrice }, { transaction: t });

    await t.commit();
    return order;

  } catch (err) {
    await t.rollback();
    throw err;
  }
};

exports.approveOrder = async (orderId) => {
  const order = await Order.findByPk(orderId);

  if (!order) throw new Error("Order tidak ditemukan");

  if (order.status !== "pending") {
    throw new Error("Order hanya bisa di-approve dari status pending");
  }

  order.status = "approved";
  await order.save();

  return order;
};

exports.completePayment = async (orderId) => {
  const t = await sequelize.transaction();

  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: "items"
        }
      ],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!order) throw new Error("Order tidak ditemukan");
    if (order.status === "paid") return order;
    if (order.status !== "approved") throw new Error("Order belum di-approve");

    for (const item of order.items) {
      const variant = await ProductVariant.findByPk(item.variantId, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      validateVariant(variant, item.quantity);

      await variant.update({
        stok: variant.stok - item.quantity
      }, { transaction: t });
    }

    order.status = "paid";
    await order.save({ transaction: t });

    await t.commit();
    return order;

  } catch (err) {
    await t.rollback();
    throw err;
  }
};

berikut isi dari paymentRoutes.js:
const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/PaymentController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.post("/webhook", paymentController.midtransWebhook); 

router.use(authMiddleware);

router.post("/create/:orderId", paymentController.createPayment);

module.exports = router;

berikut isi dari orderRoutes.js:
const router = require("express").Router();
const orderController = require("../../controllers/OrderController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.get("/", authMiddleware, orderController.getOrders);
router.post("/", authMiddleware, orderController.createOrder);
router.put("/:id/approve", authMiddleware, orderController.approveOrder);
router.put("/:id/payment", authMiddleware, orderController.completePayment);
router.post("/:id/pay", authMiddleware, orderController.createPayment);
router.get("/:id", authMiddleware, orderController.getOrderById);

module.exports = router;

beriktu isi dari PaymentPage.js:
import React, { useEffect } from "react";
import axios from "../../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

useEffect(() => {
  loadSnap();
  createPayment();
}, []);

  const loadSnap = () => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.REACT_APP_MIDTRANS_CLIENT_KEY
    );
    script.async = true;

    document.body.appendChild(script);
  };

const createPayment = async () => {
  try {
    const res = await axios.post(`/payment/create/${orderId}`);

    if (!res.data.token) {
      alert("Token tidak ditemukan");
      return;
    }
    

    window.snap.pay(res.data.token, {
      onSuccess: function () {
        alert("Pembayaran berhasil");
        navigate("/admin/orders");
      },
      onPending: function () {
        alert("Menunggu pembayaran");
      },
      onError: function () {
        alert("Pembayaran gagal");
      }
    });

  } catch (err) {
    console.error("ERROR PAYMENT:", err.response?.data || err.message);
    alert("Gagal memulai pembayaran");
  }
};
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Menunggu Pembayaran...</h2>
      <p>Silakan scan QRIS</p>
    </div>
  );
}

tolong check setiap kode yang saya kirim ini yang berhubungan dengan payment dan juga webhook pakah bermasalaha.
