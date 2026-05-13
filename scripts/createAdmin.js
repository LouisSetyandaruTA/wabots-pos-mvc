const db = require("../models");
const bcrypt = require("bcryptjs");

async function seedAdmin() {
  try {

    // =========================
    // SYNC DATABASE
    // =========================
    await db.sequelize.sync();

    console.log("DATABASE CONNECTED");

    // =========================
    // CREATE BUSINESS
    // =========================

    const indocom = await db.Business.create({
      name: "CV. Indocom Citra Makmur",
      description: "Telecommunication Service Provider",
      address: "Surabaya",
      phone: "081234567890",
      openHours: "08:00 - 17:00"
    });

    const teaholic = await db.Business.create({
      name: "TeaHolic",
      description: "Minuman dan Snack",
      address: "Surabaya",
      phone: "081234567891",
      openHours: "10:00 - 22:00"
    });

    const mansips = await db.Business.create({
      name: "ManSips",
      description: "Milk Beverage Store",
      address: "Surabaya",
      phone: "081234567892",
      openHours: "10:00 - 22:00"
    });

    // =========================
    // HASH PASSWORD
    // =========================

    const passwordIndocom = await bcrypt.hash(
      "Indocom@2026",
      10
    );

    const passwordTeaHolic = await bcrypt.hash(
      "TeaHolic#2026",
      10
    );

    const passwordManSips = await bcrypt.hash(
      "ManSips!2026",
      10
    );

    // =========================
    // CREATE ADMIN USER
    // =========================

    await db.User.create({
      username: "admin_indocom",
      password: passwordIndocom,
      role: "admin",
      businessId: indocom.id
    });

    await db.User.create({
      username: "admin_teaholic",
      password: passwordTeaHolic,
      role: "admin",
      businessId: teaholic.id
    });

    await db.User.create({
      username: "admin_mansips",
      password: passwordManSips,
      role: "admin",
      businessId: mansips.id
    });

    console.log("ADMIN SEED SUCCESS");
    process.exit();

  } catch (error) {

    console.error(error);
    process.exit(1);

  }
}

seedAdmin();