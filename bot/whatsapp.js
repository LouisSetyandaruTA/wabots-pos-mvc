const orderService = require("../services/orderService");

client.on("message", async (msg) => {
  try {
    const parsed = JSON.parse(msg.body); // nanti dari DeepSeek

    await orderService.createOrder(parsed);

    msg.reply("Pesanan berhasil");
  } catch (err) {
    msg.reply(err.message);
  }
});