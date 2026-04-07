require("dotenv").config();
const sequelize = require("../config/database");
const { Product, ProductVariant } = require("../models");

const seedVariants = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync();

    // 🔥 ambil semua product
    const products = await Product.findAll();

    if (products.length === 0) {
      console.log("❌ Tidak ada product, isi product dulu");
      return;
    }

    // 🔥 hapus variant lama (opsional)
    await ProductVariant.destroy({ where: {} });

    const variants = [];

    for (const product of products) {
      variants.push(
        {
          productId: product.id,
          nama_variant: "Kecil",
          harga: product.harga * 0.8,
          stok: 20,
          berat: 250,
        },
        {
          productId: product.id,
          nama_variant: "Sedang",
          harga: product.harga,
          stok: 30,
          berat: 500,
        },
        {
          productId: product.id,
          nama_variant: "Besar",
          harga: product.harga * 1.5,
          stok: 15,
          berat: 1000,
        }
      );
    }

    await ProductVariant.bulkCreate(variants);

    console.log("✅ Product variants berhasil dibuat");
    process.exit();

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit();
  }
};

seedVariants();