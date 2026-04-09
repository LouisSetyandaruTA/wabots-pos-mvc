require("dotenv").config();
const { sequelize, Product, ProductVariant } = require("../models");

(async () => {
  try {
    await sequelize.sync();

    const products = await Product.findAll();

    if (!products.length) {
      throw new Error("Product kosong");
    }

    const variants = [];

    for (const p of products) {
      variants.push(
        {
          productId: p.id,
          nama_variant: "Kecil",
          harga: p.harga * 0.8,
          stok: 20,
          berat: 250
        },
        {
          productId: p.id,
          nama_variant: "Sedang",
          harga: p.harga,
          stok: 30,
          berat: 500
        },
        {
          productId: p.id,
          nama_variant: "Besar",
          harga: p.harga * 1.5,
          stok: 15,
          berat: 1000
        }
      );
    }

    await ProductVariant.bulkCreate(variants);

    console.log("✅ Variants created");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();