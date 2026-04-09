require("dotenv").config();
const { sequelize, Product } = require("../models");

(async () => {
  try {
    await sequelize.sync();

    await Product.bulkCreate([
      {
        nama: "Minyak Goreng",
        harga: 18000,
        stok: 0,
        kategori: "Sembako",
        satuan: "liter",
        berat: 1000,
        keterangan: "Minyak goreng berkualitas tinggi, cocok untuk berbagai keperluan memasak."
      },
      {
        nama: "Beras Premium",
        harga: 72000,
        stok: 0,
        kategori: "Sembako",
        satuan: "kg",
        berat: 5000,
        keterangan: "Beras premium dengan kualitas terbaik, memberikan rasa dan aroma yang lezat."
      }
    ]);

    console.log("✅ Products created");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();