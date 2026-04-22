// const orderService = require("../services/orderService");

// client.on("message", async (msg) => {
//   try {
//     const parsed = JSON.parse(msg.body); // nanti dari DeepSeek

//     await orderService.createOrder(parsed);

//     msg.reply("Pesanan berhasil");
//   } catch (err) {
//     msg.reply(err.message);
//   }
// });
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp Bot Ready");
});

// 🔥 INI UNTUK MENERIMA PESAN (kalau perlu)
client.on("message", async (msg) => {
  console.log("Pesan masuk:", msg.body);
});

// 🔥 START CLIENT
client.initialize();

// 🔥 EXPORT FUNCTION (INI YANG DIPAKAI SERVICE)
const sendMessage = async (phone, message) => {
  const chatId = phone.includes("@c.us")
    ? phone
    : phone + "@c.us";

  await client.sendMessage(chatId, message);
};

module.exports = { client, sendMessage };