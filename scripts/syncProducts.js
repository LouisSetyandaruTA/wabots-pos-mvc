const sequelize = require('../config/database');
const Product = require('../models/Product');

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Tabel products berhasil dibuat ulang.");
    process.exit();
  } catch (err) {
    console.error("Sync error:", err);
  }
})();