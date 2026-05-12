// const { Client } = require("whatsapp-web.js");

// let clientInstance = null;

// exports.setWhatsAppClient = (client) => {
//   clientInstance = client;
// };

// exports.sendWhatsAppMessage = async (
//   phone,
//   message
// ) => {

//   try {

//     if (!clientInstance) {
//       throw new Error(
//         "WhatsApp client belum siap"
//       );
//     }

//     // NORMALISASI NOMOR
//     let formattedPhone =
//       phone
//         .replace(/^0/, "62")
//         .replace(/\+/g, "")
//         .replace(/\s/g, "");

//     const chatId =
//       `${formattedPhone}@c.us`;

//     await clientInstance.sendMessage(
//       chatId,
//       message
//     );

//     console.log(
//       "WA BERHASIL DIKIRIM:",
//       formattedPhone
//     );

//   } catch (err) {

//     console.error(
//       "SEND WA ERROR:",
//       err.message
//     );
//   }
// };
let clientInstance = null;

exports.setWhatsAppClient = (client) => {
  clientInstance = client;
};

exports.sendWhatsAppMessage = async (
  phone,
  message
) => {

  try {

    if (!clientInstance) {

      console.log(
        "CLIENT BELUM READY"
      );

      return;
    }

    // NORMALISASI
    let cleanPhone = phone
      .replace(/\D/g, "");

    // 08 → 628
    if (cleanPhone.startsWith("0")) {

      cleanPhone =
        "62" + cleanPhone.slice(1);
    }
    if (
      cleanPhone.length < 10
    ) {

      console.log(
        "NOMOR INVALID:",
        cleanPhone
      );

      return;
    }

    const chatId =
      `${cleanPhone}@c.us`;

    console.log(
      "KIRIM WA KE:",
      chatId
    );

    console.log(
      "ISI PESAN:",
      message
    );

    await clientInstance.sendMessage(
      chatId,
      message
    );

    console.log(
      "WA BERHASIL TERKIRIM"
    );

  } catch (err) {

    console.error(
      "SEND WA ERROR:"
    );

    console.error(err);
  }
};