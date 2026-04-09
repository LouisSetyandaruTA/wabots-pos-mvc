require("dotenv").config();
const { sequelize, Customer } = require("../models");

(async () => {
  try {
    await sequelize.sync();

    await Customer.bulkCreate([
      { name: "Budi Santoso", phoneNumber: "081234567890" },
      { name: "Siti Aminah", phoneNumber: "089876543210" },
      { name: "John Doe", phoneNumber: "082233445566" }
    ]);

    console.log("✅ Customers created");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();