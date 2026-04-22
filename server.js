const app = require("./app");
const sequelize = require("./config/database");

// Load relasi model (WAJIB DIPANGGIL)
require("./models/associations");
// require("./bot/whatsapp");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

   await sequelize.sync();
    console.log("Database synced");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });

  } catch (err) {
    console.error("DB Error:", err);
  }
})();