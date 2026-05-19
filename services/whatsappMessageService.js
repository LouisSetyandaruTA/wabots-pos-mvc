const { isSpamMessage } = require("./whatsappSpamService");

const {
  getSession,
  setSession,
  clearSession,
  isSessionExpired,
} = require("./whatsappSessionService");

const { processCustomerMessage } = require("./aiService");

const {
  Business,
  Customer,
  ChatSession,
  Order,
  Product,
  ProductVariant,
  ChatMessage,
  OrderItem,
} = require("../models");

const {
  cleanCustomerName,
  isEmptyMessage,
  isMediaMessage,
  isValidCustomerName,
} = require("../utils/chatbotUtils");

const { getOrCreateChatSession, saveMessage } = require("./chatService");

const containsWords = (message, words) => {
  return words.some((word) =>
    message.toLowerCase().includes(word.toLowerCase()),
  );
};

const getCleanPhoneNumber = async (msg) => {
  try {
    const contact = await msg.getContact();

    // =========================
    // NOMOR ASLI WA
    // =========================
    let phone = contact.id.user || "";

    // HAPUS SELAIN ANGKA
    phone = phone.replace(/\D/g, "");

    // NORMALISASI
    if (phone.startsWith("0")) {
      phone = "62" + phone.slice(1);
    }

    return phone;
  } catch (err) {
    console.log("GET PHONE ERROR:", err.message);

    return "";
  }
};
const getWhatsAppProfileName = async (msg) => {
  try {
    const contact = await msg.getContact();

    return contact.pushname || contact.name || msg.notifyName || null;
  } catch (err) {
    return null;
  }
};

exports.handleIncomingMessage = async (msg) => {
  try {
    // =========================
    // FILTER
    // =========================
    if (msg.from.includes("@g.us")) return;
    if (msg.from === "status@broadcast") return;
    if (msg.fromMe) return;

    const phone = await getCleanPhoneNumber(msg);
    if (isSpamMessage(phone)) {
      return await msg.reply(
        "Terlalu banyak pesan dikirim.\nSilakan tunggu beberapa saat.",
      );
    }

    const text = (msg.body || "").trim();
    const lowerText = text.toLowerCase();

    // =========================
    // AMBIL SESSION DULU
    // =========================

    let session = getSession(phone);

    if (session?.expired) {
      clearSession(phone);

      return await msg.reply(
        `Session berakhir karena tidak ada aktivitas.

Silakan mulai percakapan baru 😊`,
      );
    }

    // ====================================
    // HANDLE PILIH VARIANT + JUMLAH
    // ====================================

    console.log("SESSION STEP:", session?.step);

    console.log("USER MESSAGE:", lowerText);

    // =====================================
    // HANDLE PILIH VARIANT
    // =====================================

    if (session && session.step === "waiting_variant") {
      try {
        console.log("SESSION DATA:", session.pendingVariantProduct);

        if (
          !session.pendingVariantProduct ||
          !session.pendingVariantProduct.productId
        ) {
          console.log("PRODUCT SESSION HILANG");

          setSession(phone, {
            ...session,
            step: "chatting",
          });

          return await msg.reply(
            "Session pesanan hilang. Silakan pesan kembali 😊",
          );
        }

        const productId = session.pendingVariantProduct.productId;

        const variants = await ProductVariant.findAll({
          where: {
            productId,
          },
        });

        console.log(
          "VARIANTS:",
          variants.map((v) => v.nama_variant),
        );

        const { matchVariantSelection } = require("./aiService");

        const aiVariant = await matchVariantSelection({
          message: text,

          productName: session.pendingVariantProduct.productName,

          variants,
        });

        console.log("AI VARIANT:", aiVariant);

        if (!aiVariant || !aiVariant.items?.length) {
          return await msg.reply(`Maaf saya belum memahami pilihan Anda 😊`);
        }

        const selectedItems = [];

        for (const aiItem of aiVariant.items) {
          const variant = variants.find(
            (v) =>
              v.nama_variant.toLowerCase() === aiItem.variant.toLowerCase(),
          );

          if (!variant) continue;

          selectedItems.push({
            product_name: session.pendingVariantProduct.productName,

            productId: session.pendingVariantProduct.productId,

            variant: variant.nama_variant,

            variantId: variant.id,

            qty: aiItem.qty || 1,
          });
        }

        if (!selectedItems.length) {
          return await msg.reply("Variant tidak ditemukan");
        }

        if (!selectedItems.length) {
          return await msg.reply(
            `Maaf saya belum memahami pilihan Anda 😊

Silakan pilih:

${variants.map((v, i) => `${i + 1}. ${v.nama_variant}`).join("\n")}`,
          );
        }

        setSession(phone, {
          ...session,
          pendingOrder: selectedItems,
          step: "waiting_order_confirmation",
        });

        console.log("VARIANT DIPILIH:", selectedItems);

        let summary = "Pesanan Anda:\n\n";

        selectedItems.forEach((item) => {
          summary += `${item.qty}x ${item.product_name}

Variant: ${item.variant}

`;
        });

        summary += `
Apakah pesanan sudah benar?

• ya
• batal`;

        return await msg.reply(summary);
      } catch (err) {
        console.log("WAITING VARIANT ERROR:", err);

        return await msg.reply(
          "Maaf terjadi kesalahan saat memproses pesanan.",
        );
      }
    }

    // =========================
    // DETEKSI BUSINESS DARI WA.ME
    // =========================

    const businesses = await Business.findAll();

    let autoBusiness = null;

    for (const business of businesses) {
      const businessKeyword = business.name
        .toLowerCase()
        .replace(/cv\.?/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (lowerText.includes(businessKeyword)) {
        autoBusiness = business;

        break;
      }
    }

    // =========================
    // AMBIL SESSION
    // =========================

    if (
      session?.businessId &&
      autoBusiness &&
      session.businessId !== autoBusiness.id
    ) {
      const oldBusiness = session.businessName;

      clearSession(phone);

      const newSession = {
        businessId: autoBusiness.id,
        businessName: autoBusiness.name,
        customerId: session.customerId,
        customerName: session.customerName,
        step: "chatting",
      };

      setSession(phone, newSession);

      return await msg.reply(
        `Percakapan dengan ${oldBusiness} selesai.

Anda sekarang terhubung ke ${autoBusiness.name} 😊`,
      );
    }

    if (isMediaMessage(msg)) {
      return await msg.reply("Saat ini bot hanya mendukung pesan teks.");
    }

    if (isEmptyMessage(text)) {
      console.log("EMPTY MESSAGE DIABAIKAN");

      return;
    }

    if (text.toLowerCase() === "/reset") {
      const { clearSession } = require("./whatsappSessionService");

      clearSession(phone);

      return await msg.reply(
        "Session berhasil direset. Silakan kirim pesan kembali.",
      );
    }
    if (lowerText === "/help") {
      return await msg.reply(
        `Daftar Command:

/menu  → pilih bisnis ulang
/reset → reset session
/help  → bantuan chatbot`,
      );
    }
    if (lowerText === "/menu") {
      const { clearSession } = require("./whatsappSessionService");

      clearSession(phone);

      const businesses = await Business.findAll();

      let menu = "Silakan pilih bisnis:\n\n";

      businesses.forEach((b, index) => {
        menu += `${index + 1}. ${b.name}\n`;
      });

      setSession(phone, {
        step: "choose_business",
      });

      return await msg.reply(menu);
    }

    // =========================
    // CEK SESSION
    // =========================

    console.log("SESSION:", session);

    if (isSessionExpired(session)) {
      return await msg.reply(
        `Session sebelumnya berakhir otomatis karena tidak ada aktivitas selama 30 menit.

Silakan mulai percakapan kembali 😊`,
      );
    }
    // =========================
    // JIKA BELUM PILIH BUSINESS
    // =========================
    if (!session?.businessId) {
      // =========================
      // JIKA BELUM ADA STEP
      // =========================
      if (!session?.step) {
        if (autoBusiness) {
          const existingCustomer = await Customer.findOne({
            where: {
              phoneNumber: phone,
              businessId: autoBusiness.id,
            },
          });

          if (existingCustomer) {
            const newSession = {
              businessId: autoBusiness.id,

              businessName: autoBusiness.name,

              customerId: existingCustomer.id,

              customerName: existingCustomer.name,

              step: "chatting",
            };

            setSession(phone, newSession);

            // update session variable
            session = newSession;

            return await msg.reply(
              `Selamat datang kembali ${existingCustomer.name}

Anda terhubung ke ${autoBusiness.name}`,
            );
          }

          const profileNameRaw = await getWhatsAppProfileName(msg);

          const profileName = cleanCustomerName(profileNameRaw || "");

          const newSession = {
            businessId: autoBusiness.id,

            businessName: autoBusiness.name,

            profileName,
            step: "confirm_profile_name",
          };

          setSession(phone, newSession);

          session = newSession;

          return await msg.reply(
            `Anda terhubung ke ${autoBusiness.name}

Apakah nama Anda benar:

${profileName}

1. Ya
2. Ganti Nama`,
          );
        }

        // FLOW LAMA
        const businesses = await Business.findAll();

        let menu = "Selamat datang.\n\n";

        menu += "Silakan pilih bisnis:\n\n";

        businesses.forEach((b, index) => {
          menu += `${index + 1}. ${b.name}\n`;
        });

        setSession(phone, {
          step: "choose_business",
        });

        return await msg.reply(menu);
      }

      // =========================
      // HANDLE PILIHAN BUSINESS
      // =========================
      if (session.step === "choose_business") {
        const businesses = await Business.findAll();

        let selectedBusiness = null;

        // =========================
        // PILIH BERDASARKAN ANGKA
        // =========================
        const selectedIndex = parseInt(text) - 1;

        if (!isNaN(selectedIndex) && businesses[selectedIndex]) {
          selectedBusiness = businesses[selectedIndex];
        }

        // =========================
        // PILIH BERDASARKAN NAMA
        // =========================
        if (!selectedBusiness && text.length >= 3) {
          selectedBusiness = businesses.find((b) =>
            b.name.toLowerCase().includes(text.toLowerCase()),
          );
        }

        // =========================
        // JIKA TIDAK DITEMUKAN
        // =========================
        if (!selectedBusiness) {
          let menu = "Pilihan bisnis tidak valid.\n\n";
          menu += "Silakan pilih bisnis berikut:\n\n";

          businesses.forEach((b, index) => {
            menu += `${index + 1}. ${b.name}\n`;
          });

          return await msg.reply(menu);
        }
        const existingCustomer = await Customer.findOne({
          where: {
            phoneNumber: phone,
            businessId: selectedBusiness.id,
          },
        });

        if (existingCustomer) {
          const newSession = {
            businessId: selectedBusiness.id,
            businessName: selectedBusiness.name,
            customerId: existingCustomer.id,
            customerName: existingCustomer.name,
            step: "chatting",
          };

          setSession(phone, newSession);

          session = newSession;

          return await msg.reply(
            `Selamat datang kembali ${existingCustomer.name}.\n\nAnda terhubung ke ${selectedBusiness.name}.`,
          );
        }

        const profileNameRaw = await getWhatsAppProfileName(msg);

        const profileName = cleanCustomerName(profileNameRaw || "");

        const isProfileNameValid = isValidCustomerName(profileName);

        // =========================
        // JIKA NAMA PROFILE VALID
        // =========================
        if (isProfileNameValid) {
          const newSession = {
            businessId: selectedBusiness.id,
            businessName: selectedBusiness.name,
            profileName,
            step: "confirm_profile_name",
          };

          setSession(phone, newSession);

          session = newSession;

          return await msg.reply(
            `Anda terhubung ke ${selectedBusiness.name}.

Apakah nama Anda benar:
${profileName} ?

1. Ya
2. Ganti Nama`,
          );
        }

        // =========================
        // FALLBACK MANUAL INPUT
        // =========================
        setSession(phone, {
          businessId: selectedBusiness.id,
          businessName: selectedBusiness.name,
          step: "waiting_name",
        });

        return await msg.reply(
          `Anda terhubung ke ${selectedBusiness.name}.\n\nSiapa nama Anda?`,
        );
      }
    }
    if (session?.step === "confirm_profile_name") {
      // =========================
      // USER SETUJU
      // =========================
      const confirmWords = [
        "1",
        "ya",
        "iya",
        "betul",
        "benar",
        "oke",
        "ok",
        "yes",
        "sip",
        "sesuai",
        "benar itu",
        "nama benar",
      ];

      const changeNameWords = [
        "2",
        "ganti",
        "ubah",
        "salah",
        "bukan",
        "ganti nama",
        "ubah nama",
        "nama salah",
      ];

      const isConfirm = containsWords(lowerText, confirmWords);

      const isChange = containsWords(lowerText, changeNameWords);

      if (isConfirm) {
        let customer = await Customer.findOne({
          where: {
            phoneNumber: phone,
            businessId: session.businessId,
          },
        });

        if (!customer) {
          customer = await Customer.create({
            name: session.profileName,
            phoneNumber: phone,
            businessId: session.businessId,
          });

          console.log("NEW CUSTOMER CREATED");
        }

        const newSession = {
          ...session,
          customerId: customer.id,
          customerName: customer.name,
          step: "chatting",
        };

        setSession(phone, newSession);

        session = newSession;

        return await msg.reply(
          `Halo ${customer.name},
Anda berhasil terhubung ke ${session.businessName}.

Silakan kirim pesanan Anda.`,
        );
      }

      // =========================
      // USER MAU GANTI NAMA
      // =========================

      if (isChange) {
        setSession(phone, {
          ...session,
          step: "waiting_name",
        });

        return await msg.reply("Silakan masukkan nama Anda.");
      }

      // =========================
      // INPUT TIDAK VALID
      // =========================
      return await msg.reply(
        `Pilihan tidak valid.

1. Ya
2. Ganti Nama`,
      );
    }
    if (session?.step === "waiting_name") {
      const customerName = cleanCustomerName(text);
      if (!isValidCustomerName(customerName)) {
        const retryCount = (session.retryCount || 0) + 1;

        // =========================
        // MAX RETRY
        // =========================
        if (retryCount >= 3) {
          const { clearSession } = require("./whatsappSessionService");

          clearSession(phone);

          return await msg.reply(
            `Terlalu banyak percobaan gagal.

Session direset otomatis.
Silakan mulai kembali.`,
          );
        }

        // =========================
        // UPDATE RETRY
        // =========================
        setSession(phone, {
          ...session,
          retryCount,
        });

        return await msg.reply(
          `Nama tidak valid.

Gunakan nama asli.
Contoh:
- Budi
- Arman Hermasyah

Percobaan: ${retryCount}/3`,
        );
      }

      let customer = await Customer.findOne({
        where: {
          phoneNumber: phone,
          businessId: session.businessId,
        },
      });

      if (!customer) {
        customer = await Customer.create({
          name: customerName,
          phoneNumber: phone,
          businessId: session.businessId,
        });

        console.log("NEW CUSTOMER CREATED");
      } else {
        console.log("CUSTOMER EXIST");
      }

      setSession(phone, {
        ...session,
        retryCount: 0,
        customerId: customer.id,
        customerName: customer.name,
        step: "chatting",
      });

      return await msg.reply(
        `Halo ${customer.name}, Anda berhasil terhubung ke ${session.businessName}.\n\nSilakan kirim pesanan Anda.`,
      );
    }
    if (session?.step === "confirm_finish") {
      const noWords = [
        "2",
        "tidak",
        "ga",
        "gak",
        "nggak",
        "cukup",
        "selesai",
        "udah",
        "sudah",
        "tidak ada",
        "tidak lagi",
        "engga",
        "enggak",
        "makasih cukup",
        "cukup saja",
      ];

      const yesWords = [
        "1",
        "ya",
        "iya",
        "masih",
        "masih ada",
        "mau tanya",
        "ingin tanya",
        "mau bertanya",
      ];

      const isNo = containsWords(lowerText, noWords);

      const isYes = containsWords(lowerText, yesWords);

      if (isNo) {
        setSession(phone, {
          ...session,
          orderFinished: true,
          orderFinishedAt: Date.now(),
          step: "chatting",
        });

        return await msg.reply(
          `Terima kasih telah menghubungi ${session.businessName} 🙌

Sesi percakapan ini akan segera berakhir.

Jika Anda ingin memesan atau bertanya lagi di lain waktu, cukup kirim:

halo ${session.businessName}

Semoga harinya menyenangkan 😊`,
        );
      }

      setSession(phone, {
        ...session,
        step: "chatting",
      });

      return await msg.reply(
        `Baik 😊

Silakan lanjutkan pertanyaan Anda.`,
      );
    }

    // =========================
    // WAITING DELIVERY METHOD
    // =========================
    if (session?.step === "waiting_delivery_method") {
      const order = await Order.findByPk(session.lastOrderId, {
        include: [
          {
            model: Business,
            as: "business",
          },
        ],
      });

      if (!order) {
        return await msg.reply("Order tidak ditemukan");
      }

      const business = await Business.findByPk(order.businessId);

      const pickupWords = [
        "1",
        "pickup",
        "ambil",
        "ambil di toko",
        "ambil toko",
        "ke toko",
        "saya ambil",
        "ambil sendiri",
      ];

      const deliveryWords = [
        "2",
        "kirim",
        "delivery",
        "dikirim",
        "antar",
        "diantar",
        "kirim ke rumah",
        "antar ke rumah",
        "di rumah",
        "kurir",
      ];

      // PICKUP

      if (pickupWords.some((word) => lowerText.includes(word))) {
        await order.update({
          deliveryMethod: "pickup",

          fulfillmentStatus: "ready_pickup",
        });

        setSession(
          phone,

          {
            ...session,

            step: "chatting",
          },
        );

        return await msg.reply(
          `Pesanan akan diambil di toko ✅

Nama Toko:
${business.name}

Alamat:
${business.address}

Pesanan akan segera disiapkan.`,
        );
      }

      // DELIVERY

      if (deliveryWords.some((word) => lowerText.includes(word))) {
        /*
  =================================
  CUSTOMER PILIH DELIVERY
  =================================
  */

        await order.update({
          deliveryMethod: "delivery",

          // masih menunggu alamat customer
          fulfillmentStatus: "delivery",
        });

        setSession(phone, {
          ...session,

          step: "waiting_delivery_address",
        });

        return await msg.reply(
          `Silakan kirim alamat lengkap pengiriman Anda 😊`,
        );
      }

      return await msg.reply(
        `Pilihan tidak dikenali.

Silakan pilih:

1. Ambil di toko
2. Dikirim`,
      );
    }
    /*
   ==================================================
   CUSTOMER MENGIRIM ALAMAT
   ==================================================
   
   */

    if (session?.step === "waiting_delivery_address") {
      const order = await Order.findByPk(session.lastOrderId);

      if (!order) {
        return await msg.reply("Order tidak ditemukan");
      }

      /*
            =========================
            UPDATE ORDER
            =========================
            */

      await order.update({
        deliveryMethod: "delivery",

        deliveryAddress: text,

        // tetap delivery
        fulfillmentStatus: "delivery",
      });

      console.log("DELIVERY BERHASIL:");

      console.log({
        id: order.id,
        deliveryMethod: order.deliveryMethod,
        deliveryAddress: text,
        fulfillmentStatus: "delivery",
      });

      /*
            =========================
            RESET SESSION
            =========================
            */

      setSession(phone, {
        ...session,
        step: "chatting",
      });

      return await msg.reply(
        `Alamat berhasil disimpan ✅

Pesanan sedang diproses.`,
      );
    }

    // =========================
    // WAITING ORDER CONFIRMATION
    // =========================
    if (session?.step === "waiting_order_confirmation") {
      const chatSession = await getOrCreateChatSession({
        customerId: session.customerId,

        businessId: session.businessId,
      });

      await saveMessage({
        sessionId: chatSession.id,

        sender: "CUSTOMER",

        message: text,
      });

      // ==========================================
      // DOKUMENTASI
      // Fungsi:
      // Menambah toleransi jawaban customer
      // supaya customer tidak dipaksa
      // menjawab persis "ya"
      // ==========================================

      const yesWords = [
        "ya",
        "iya",
        "iya betul",
        "betul",
        "benar",
        "yes",
        "ok",
        "oke",
        "sip",
        "setuju",
        "sesuai",
        "y",
      ];

      const cancelWords = [
        "batal",
        "cancel",
        "tidak",
        "engga",
        "enggak",
        "ga",
        "gak",
        "tidak jadi",
        "salah",
      ];

      const isConfirm = containsWords(lowerText, yesWords);

      const isCancel = containsWords(lowerText, cancelWords);

      // =========================
      // CONFIRM
      // =========================
      if (isConfirm) {
        const {
          Order,
          OrderItem,
          Product,
          ProductVariant,
        } = require("../models");

        // =========================
        // AMBIL ITEM DARI SESSION
        // =========================
        const pendingItems = session.pendingOrder || [];

        if (!pendingItems.length) {
          return await msg.reply("Pesanan kosong.");
        }

        let totalPrice = 0;

        const orderItems = [];

        // =========================
        // VALIDASI PRODUK
        // =========================
        for (const item of pendingItems) {
          const product = await Product.findOne({
            where: {
              nama: item.product_name,
              businessId: session.businessId,
              status: "active",
            },
            include: [
              {
                model: ProductVariant,
                as: "variants",
              },
            ],
          });

          if (!product) continue;

          let variant = null;

          // =========================
          // CARI VARIANT
          // =========================
          if (item.variant) {
            variant = product.variants.find(
              (v) =>
                v.nama_variant.toLowerCase() === item.variant.toLowerCase(),
            );
          }

          // =========================
          // VARIANT WAJIB JIKA PRODUK
          // MEMILIKI >1 VARIANT
          // =========================

          if (!variant && product.variants.length > 1) {
            let variantText = `${product.nama} memiliki beberapa pilihan:\n\n`;

            product.variants.forEach((v, index) => {
              variantText += `${index + 1}. ${v.nama_variant}
Rp ${v.harga}\n`;
            });

            variantText += "\nSilakan pilih varian 😊";

            return await msg.reply(variantText);
          }

          // hanya otomatis jika memang
          // produknya cuma 1 variant

          if (!variant) {
            variant = product.variants[0];
          }

          if (!variant) continue;

          // =========================
          // CEK STOK
          // =========================

          const qty = Math.max(1, parseInt(item.qty) || 1);

          if (variant.stok <= 0) {
            return await msg.reply(
              `Maaf, ${product.nama}
(${variant.nama_variant})
sedang habis.

Silakan pilih menu lain 😊`,
            );
          }

          if (qty > variant.stok) {
            return await msg.reply(
              `Stok ${product.nama}
(${variant.nama_variant})
tidak mencukupi.

Stok tersedia:
${variant.stok}`,
            );
          }

          const subtotal = variant.harga * qty;

          totalPrice += subtotal;

          orderItems.push({
            variantId: variant.id,

            quantity: qty,

            unitPrice: variant.harga,

            subtotal,
          });
        }

        // =========================
        // BUAT ORDER
        // =========================
        if (orderItems.length === 0 || totalPrice <= 0) {
          return await msg.reply(
            "Pesanan gagal diproses karena produk tidak tersedia.",
          );
        }

        const order = await Order.create({
          businessId: session.businessId,

          customerId: session.customerId,

          totalPrice,

          status: "pending",
        });

        // =========================
        // BUAT ORDER ITEMS
        // =========================
        for (const item of orderItems) {
          await OrderItem.create({
            orderId: order.id,

            variantId: item.variantId,

            quantity: item.quantity,

            unitPrice: item.unitPrice,

            subtotal: item.subtotal,
          });
        }

        // =========================
        // RESET SESSION
        // =========================
        setSession(phone, {
          ...session,
          pendingOrder: null,
          lastOrderId: order.id,
          step: "chatting",
        });

        let detailPesanan = "";

        for (const item of pendingItems) {
          detailPesanan += `${item.qty}x ${item.product_name}
Variant: ${item.variant}

`;
        }

        const successMessage = `Pesanan berhasil dibuat ✅

Detail Pesanan:

${detailPesanan}

Total:
Rp ${totalPrice}

Pesanan sedang menunggu approval admin.`;

        await saveMessage({
          sessionId: chatSession.id,

          sender: "BOT",

          message: successMessage,
        });

        return await msg.reply(successMessage);
      }

      // =========================
      // CANCEL
      // =========================
      if (isCancel) {
        setSession(phone, {
          ...session,
          pendingOrder: null,
          step: "chatting",
        });

        return await msg.reply("Pesanan dibatalkan.");
      }

      return await msg.reply(
        `Mohon konfirmasi pesanan 😊

Contoh:

• iya
• benar
• setuju
• batal
• tidak`,
      );
    }

    // =========================
    // CUSTOMER SUDAH PILIH BUSINESS
    // =========================

    console.log("================================");
    console.log("BUSINESS:", session.businessName);
    console.log("PHONE:", phone);
    console.log("MESSAGE:", text);
    console.log("================================");

    // =========================
    // CEK CUSTOMER ID
    // =========================

    if (!session.customerId) {
      console.log("SESSION CUSTOMER TIDAK ADA");

      return await msg.reply(
        `Terjadi kesalahan session.

Ketik:
/reset`,
      );
    }

    // =========================
    // GET CHAT SESSION
    // =========================

    const chatSession = await getOrCreateChatSession({
      customerId: session.customerId,

      businessId: session.businessId,
    });
    // =========================
    // SAVE CUSTOMER MESSAGE
    // =========================
    await saveMessage({
      sessionId: chatSession.id,

      sender: "CUSTOMER",

      message: text,
    });

    // =========================
    // JIKA MODE HUMAN
    // =========================
    if (chatSession.mode === "HUMAN") {
      return;
    }
    // =========================
    // AMBIL BUSINESS
    // =========================
    const business = await Business.findByPk(session.businessId);

    // =========================
    // DETEKSI STATUS PESANAN
    // =========================

    const statusWords = [
      "pesanan saya",
      "status pesanan",
      "sudah dikirim",
      "sudah sampai",
      "sudah siap",
      "pesanan saya dimana",
      "order saya",
      "cek pesanan",
    ];

    const isStatusQuestion = statusWords.some((word) =>
      lowerText.includes(word),
    );

    if (isStatusQuestion) {
      const lastOrder = await Order.findOne({
        where: {
          customerId: session.customerId,
        },

        order: [["createdAt", "DESC"]],
      });

      if (lastOrder) {
        let statusText = "Diproses";

        if (lastOrder.fulfillmentStatus === "delivery") {
          statusText = "Sedang dikirim 🚚";
        }

        if (lastOrder.fulfillmentStatus === "ready_pickup") {
          statusText = "Siap diambil 🏪";
        }

        if (lastOrder.fulfillmentStatus === "completed") {
          statusText = "Pesanan selesai ✅";
        }

        return await msg.reply(
          `Status pesanan Anda:

Status:
${statusText}

Metode:
${lastOrder.deliveryMethod || "-"}`,
        );
      }
    }

    // =========================
    // PROCESS AI
    // =========================
    const aiResult = await processCustomerMessage({
      business,
      message: text,
      session,
    });

    console.log("AI RESULT:");
    console.log(aiResult);

    const finishWords = [
      "terima kasih",
      "makasih",
      "thanks",
      "cukup",
      "cukup saja",
      "tidak ada lagi",
      "sudah cukup",
      "selesai saja",
      "itu saja",
      "tidak ada pertanyaan lagi",
    ];

    const isFinishConversation = finishWords.some((word) =>
      lowerText.includes(word),
    );

    if (isFinishConversation) {
      setSession(phone, {
        ...session,
        step: "confirm_finish",
      });

      return await msg.reply(
        `Sama-sama 😊

Apakah masih ada yang ingin ditanyakan?

1. Ya
2. Tidak`,
      );
    }

    // =========================
    // REQUEST HUMAN ADMIN
    // =========================
    const adminKeywords = [
      "admin",
      "cs",
      "customer service",
      "orang asli",
      "manusia",
      "bantuan admin",
      "bicara admin",
      "chat admin",
      "admin langsung",
      "mau admin",
      "mau cs",
      "operator",
      "staff",
      "pegawai",
    ];

    const needHuman = adminKeywords.some((keyword) =>
      lowerText.includes(keyword),
    );

    if (needHuman) {
      // =========================
      // UPDATE SESSION
      // =========================
      await ChatSession.update(
        {
          needAdmin: true,
        },
        {
          where: {
            id: chatSession.id,
          },
        },
      );

      const adminMessage = `Baik, saya akan menghubungkan Anda dengan admin.

Mohon tunggu beberapa saat.`;

      await saveMessage({
        sessionId: chatSession.id,

        sender: "BOT",

        message: adminMessage,
      });

      return await msg.reply(adminMessage);
    }

    // =========================
    // FAQ
    // =========================
    if (aiResult.intent === "faq") {
      await saveMessage({
        sessionId: chatSession.id,

        sender: "BOT",

        message: aiResult.reply,
      });

      return await msg.reply(aiResult.reply);
    }

    // =========================
    // GREETING
    // =========================
    if (aiResult.intent === "greeting") {
      await saveMessage({
        sessionId: chatSession.id,

        sender: "BOT",

        message: aiResult.reply,
      });

      return await msg.reply(aiResult.reply);
    }

    // =========================
    // ORDER
    // =========================
    if (aiResult.intent === "order") {
      if (!aiResult.items?.length) {
        await saveMessage({
          sessionId: chatSession.id,
          sender: "BOT",
          message: "Saya tidak menemukan item pesanan.",
        });

        return await msg.reply("Saya tidak menemukan item pesanan.");
      }

      const { Product, ProductVariant } = require("../models");

      // =========================
      // VALIDASI VARIANT
      // =========================

      for (const item of aiResult.items) {
        const product = await Product.findOne({
          where: {
            nama: item.product_name,
            businessId: session.businessId,
          },

          include: [
            {
              model: ProductVariant,
              as: "variants",
            },
          ],
        });

        if (!product) continue;

        const variants = product.variants || [];

        // jika lebih dari satu variant
        // dan customer belum pilih

        if (variants.length > 1 && !item.variant) {
          let variantText = `${product.nama} memiliki beberapa pilihan:

`;

          variants.forEach((v, index) => {
            variantText += `${index + 1}. ${v.nama_variant}
Rp ${v.harga}

`;
          });

          variantText += "Silakan pilih variant terlebih dahulu 😊";

          // =========================
          // SIMPAN SESSION MENUNGGU VARIANT
          // =========================

          setSession(phone, {
            ...session,

            step: "waiting_variant",

            pendingVariantProduct: {
              productId: product.id,
              productName: product.nama,
              qty: item.qty || 1,
            },
          });

          return await msg.reply(variantText);
        }
      }

      // =========================
      // BUAT RINGKASAN
      // =========================

      let summary = `Pesanan Anda:

`;

      aiResult.items.forEach((item) => {
        summary += `${item.qty}x ${item.product_name}
Variant: ${item.variant}

`;
      });

      summary += `Apakah pesanan sudah benar?

Ketik:
• ya
• batal`;

      setSession(phone, {
        ...session,
        pendingOrder: aiResult.items,
        step: "waiting_order_confirmation",
      });

      await saveMessage({
        sessionId: chatSession.id,
        sender: "BOT",
        message: summary,
      });

      return await msg.reply(summary);
    }

    // =========================
    // CANCEL
    // =========================
    if (aiResult.intent === "cancel_order") {
      setSession(phone, {
        ...session,
        pendingOrder: null,
      });
      await saveMessage({
        sessionId: chatSession.id,

        sender: "BOT",

        message: "Pesanan berhasil dibatalkan.",
      });

      return await msg.reply("Pesanan berhasil dibatalkan.");
    }

    // =========================
    // UNKNOWN
    // =========================
    await saveMessage({
      sessionId: chatSession.id,

      sender: "BOT",

      message: aiResult.reply,
    });
    return await msg.reply(
      aiResult.reply || "Maaf saya tidak memahami pesan Anda.",
    );
  } catch (err) {
    console.error("WHATSAPP MESSAGE SERVICE ERROR:", err);
  }
};
