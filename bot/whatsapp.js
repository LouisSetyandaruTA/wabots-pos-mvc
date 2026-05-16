const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { handleIncomingMessage } = require("../services/whatsappMessageService");
const {setWhatsAppClient} = require("../services/whatsappService");

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "pos-bot"
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox"]
  }
});

setWhatsAppClient(client);

// QR
client.on("qr", (qr) => {
  console.log("Scan QR WhatsApp:");
  qrcode.generate(qr, { small: true });
});

// READY
client.on("ready", () => {
  console.log("WhatsApp Bot Connected");
});

// AUTHENTICATED
client.on("authenticated", () => {
  console.log("WhatsApp Authenticated");
});

// AUTH FAILURE
client.on("auth_failure", (msg) => {
  console.log("Auth Failure:", msg);
});

// DISCONNECTED
client.on("disconnected", (reason) => {
  console.log("WhatsApp Disconnected:", reason);
});

// RECEIVE MESSAGE
client.on("message", handleIncomingMessage);


client.initialize();

module.exports = client;