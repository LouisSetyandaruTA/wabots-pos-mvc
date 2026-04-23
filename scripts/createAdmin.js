require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../models");

const seedAdmin = async () => {
  try {
    await db.sequelize.authenticate();

    const password = await bcrypt.hash("123456", 10);

    await db.User.create({
      username: "admin1",
      password: password,
      role: "admin",
      businessName: "Teaholic"
    });

    await db.User.create({
      username: "admin2",
      password: password,
      role: "admin",
      businessName: "Indocom"
    });

    await db.User.create({
      username: "admin3",
      password: password,
      role: "admin",
      businessName: "Warung Maju"
    });

    console.log("✅ Admin berhasil dibuat");
    process.exit();
  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
};

seedAdmin();

// const bcrypt = require('bcryptjs');
// const sequelize = require('../config/database');
// const { DataTypes } = require('sequelize');

// const Admin = sequelize.define('Admin', {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   }
// }, {
//   tableName: 'admins',
//   timestamps: false 
// });

// async function createAdmin() {
//   try {
//     await sequelize.authenticate();
//     console.log('DB connected');

//     const hashedPassword = await bcrypt.hash('admin123', 10);
//     const admin = await Admin.create({
//       username: 'admin',
//       password: hashedPassword
//     });

//     console.log('✅ Admin berhasil dibuat:', admin.username);
//   } catch (err) {
//     console.error('❌ Gagal membuat admin:', err.message);
//   } finally {
//     await sequelize.close();
//   }
// }

// createAdmin();