const sequelize = require("../config/database");

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database reset sukses");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();