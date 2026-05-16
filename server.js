require("./bot/whatsapp");

const app = require("./app");
const db = require("./models"); 

const PORT = process.env.PORT || 5000;



(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected");

    await db.sequelize.sync();
    console.log("Database synced");

    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });

  } catch (err) {
    console.error("DB Error:", err);
  }
})();
