require("dotenv").config();
const bcrypt = require("bcrypt");
const { User, Category, Product, ProductVariant } = require("../models");

(async () => {
  try {
    console.log("Seeding data...");

    // ======================
    // ADMIN
    // ======================
    const password = await bcrypt.hash("123456", 10);

    const admin1 = await User.create({
      username: "admin1",
      password,
      businessName: "Teaholic"
    });

    const admin2 = await User.create({
      username: "admin2",
      password,
      businessName: "Indocom"
    });

    const admin3 = await User.create({
      username: "admin3",
      password,
      businessName: "Warung Maju"
    });

    // ======================
    // CATEGORY
    // ======================
    const cat1 = await Category.create({
      name: "Minuman",
      userId: admin1.id
    });

    const cat2 = await Category.create({
      name: "Elektronik",
      userId: admin2.id
    });

    const cat3 = await Category.create({
      name: "Sembako",
      userId: admin3.id
    });

    // ======================
    // PRODUCTS
    // ======================
    const p1 = await Product.create({
      nama: "Es Teh",
      categoryId: cat1.id,
      userId: admin1.id,
      harga: 5000,
      stok: 0,
      berat: 250,
      satuan: "ml"
    });

    const p2 = await Product.create({
      nama: "Router WiFi",
      categoryId: cat2.id,
      userId: admin2.id,
      harga: 250000,
      stok: 0,
      berat: 1000,
      satuan: "pcs"
    });

    const p3 = await Product.create({
      nama: "Beras 5kg",
      categoryId: cat3.id,
      userId: admin3.id,
      harga: 70000,
      stok: 0,
      berat: 5000,
      satuan: "gram"
    });

    // ======================
    // VARIANTS
    // ======================
    await ProductVariant.bulkCreate([
      {
        productId: p1.id,
        nama_variant: "Es Teh Manis",
        harga: 6000,
        stok: 50,
        berat: 250
      },
      {
        productId: p1.id,
        nama_variant: "Es Teh Tawar",
        harga: 4000,
        stok: 30,
        berat: 250
      },

      {
        productId: p2.id,
        nama_variant: "Router 2 Antena",
        harga: 200000,
        stok: 10,
        berat: 900
      },
      {
        productId: p2.id,
        nama_variant: "Router 4 Antena",
        harga: 300000,
        stok: 5,
        berat: 1100
      },

      {
        productId: p3.id,
        nama_variant: "Beras Premium",
        harga: 75000,
        stok: 20,
        berat: 5000
      },
      {
        productId: p3.id,
        nama_variant: "Beras Medium",
        harga: 65000,
        stok: 25,
        berat: 5000
      }
    ]);

    console.log("Seed berhasil");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();