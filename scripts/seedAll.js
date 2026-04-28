const db = require("../models");
const bcrypt = require("bcryptjs");

async function seed() {
  await db.sequelize.sync({ force: true });

  console.log("DB RESET SUCCESS");

  // ======================
  // BUSINESS
  // ======================
  const businesses = await db.Business.bulkCreate([
    { id: "b-indocom", name: "Indocom Citra Makmur" },
    { id: "b-teaholic", name: "TeaHolic" },
    { id: "b-mansips", name: "ManSips" }
  ]);

  // ======================
  // USERS (ADMIN)
  // ======================
  const password = await bcrypt.hash("123456", 10);

  await db.User.bulkCreate([
    {
      username: "admin_indocom",
      password,
      role: "admin",
      businessId: "b-indocom"
    },
    {
      username: "admin_teaholic",
      password,
      role: "admin",
      businessId: "b-teaholic"
    },
    {
      username: "admin_mansips",
      password,
      role: "admin",
      businessId: "b-mansips"
    }
  ]);

  // ======================
  // CATEGORY
  // ======================
  const categories = await db.Category.bulkCreate([
    // INDOCOM
    { name: "CCTV", businessId: "b-indocom" },
    { name: "Aksesoris CCTV", businessId: "b-indocom" },

    // TEAHOLIC
    { name: "Tea Series", businessId: "b-teaholic" },
    { name: "Snack", businessId: "b-teaholic" },

    // MANSIPS
    { name: "Milk Series", businessId: "b-mansips" },
    { name: "Topping", businessId: "b-mansips" }
  ]);

  // ======================
  // CUSTOMER
  // ======================
  await db.Customer.bulkCreate([
    // INDOCOM
    { name: "PT Surya Abadi", phoneNumber: "0811111111", businessId: "b-indocom" },
    { name: "CV Jaya Teknik", phoneNumber: "0822222222", businessId: "b-indocom" },
    { name: "Budi CCTV", phoneNumber: "0833333333", businessId: "b-indocom" },

    // TEAHOLIC
    { name: "Andi", phoneNumber: "0812345678", businessId: "b-teaholic" },
    { name: "Siti", phoneNumber: "0812345679", businessId: "b-teaholic" },
    { name: "Rina", phoneNumber: "0812345680", businessId: "b-teaholic" },

    // MANSIPS
    { name: "Kevin", phoneNumber: "0819999999", businessId: "b-mansips" },
    { name: "Dewi", phoneNumber: "0828888888", businessId: "b-mansips" },
    { name: "Rizky", phoneNumber: "0837777777", businessId: "b-mansips" }
  ]);

  // ======================
  // PRODUCTS + VARIANTS
  // ======================

  // ---------- INDOCOM ----------
  const indocomProducts = await db.Product.bulkCreate([
    {
      nama: "CCTV Hikvision",
      categoryId: categories[0].id,
      businessId: "b-indocom",
      satuan: "unit",
      berat: 1000
    },
    {
      nama: "DVR Recorder",
      categoryId: categories[0].id,
      businessId: "b-indocom",
      satuan: "unit",
      berat: 1500
    },
    {
      nama: "Kabel CCTV",
      categoryId: categories[1].id,
      businessId: "b-indocom",
      satuan: "meter",
      berat: 200
    }
  ]);

  await db.ProductVariant.bulkCreate([
    // CCTV (multi variant)
    {
      productId: indocomProducts[0].id,
      businessId: "b-indocom",
      nama_variant: "2MP",
      harga: 500000,
      stok: 20,
      berat: 800
    },
    {
      productId: indocomProducts[0].id,
      businessId: "b-indocom",
      nama_variant: "5MP",
      harga: 850000,
      stok: 15,
      berat: 900
    },

    // DVR (single variant)
    {
      productId: indocomProducts[1].id,
      businessId: "b-indocom",
      nama_variant: "Default",
      harga: 1200000,
      stok: 10,
      berat: 1500
    },

    // Kabel
    {
      productId: indocomProducts[2].id,
      businessId: "b-indocom",
      nama_variant: "Per Meter",
      harga: 5000,
      stok: 500,
      berat: 200
    }
  ]);

  // ---------- TEAHOLIC ----------
  const teaProducts = await db.Product.bulkCreate([
    {
      nama: "Thai Tea",
      categoryId: categories[2].id,
      businessId: "b-teaholic",
      satuan: "cup",
      berat: 300
    },
    {
      nama: "Green Tea",
      categoryId: categories[2].id,
      businessId: "b-teaholic",
      satuan: "cup",
      berat: 300
    },
    {
      nama: "French Fries",
      categoryId: categories[3].id,
      businessId: "b-teaholic",
      satuan: "pcs",
      berat: 200
    }
  ]);

  await db.ProductVariant.bulkCreate([
    {
      productId: teaProducts[0].id,
      businessId: "b-teaholic",
      nama_variant: "Small",
      harga: 8000,
      stok: 50,
      berat: 250
    },
    {
      productId: teaProducts[0].id,
      businessId: "b-teaholic",
      nama_variant: "Large",
      harga: 12000,
      stok: 40,
      berat: 350
    },
    {
      productId: teaProducts[1].id,
      businessId: "b-teaholic",
      nama_variant: "Default",
      harga: 10000,
      stok: 30,
      berat: 300
    },
    {
      productId: teaProducts[2].id,
      businessId: "b-teaholic",
      nama_variant: "Default",
      harga: 15000,
      stok: 25,
      berat: 200
    }
  ]);

  // ---------- MANSIPS ----------
  const milkProducts = await db.Product.bulkCreate([
    {
      nama: "Chocolate Milk",
      categoryId: categories[4].id,
      businessId: "b-mansips",
      satuan: "cup",
      berat: 300
    },
    {
      nama: "Strawberry Milk",
      categoryId: categories[4].id,
      businessId: "b-mansips",
      satuan: "cup",
      berat: 300
    },
    {
      nama: "Boba Topping",
      categoryId: categories[5].id,
      businessId: "b-mansips",
      satuan: "cup",
      berat: 100
    }
  ]);

  await db.ProductVariant.bulkCreate([
    {
      productId: milkProducts[0].id,
      businessId: "b-mansips",
      nama_variant: "Regular",
      harga: 12000,
      stok: 60,
      berat: 300
    },
    {
      productId: milkProducts[0].id,
      businessId: "b-mansips",
      nama_variant: "Large",
      harga: 15000,
      stok: 40,
      berat: 400
    },
    {
      productId: milkProducts[1].id,
      businessId: "b-mansips",
      nama_variant: "Default",
      harga: 13000,
      stok: 50,
      berat: 300
    },
    {
      productId: milkProducts[2].id,
      businessId: "b-mansips",
      nama_variant: "Extra Boba",
      harga: 5000,
      stok: 100,
      berat: 100
    }
  ]);

  console.log("SEED SUCCESS 🚀");
}

seed();