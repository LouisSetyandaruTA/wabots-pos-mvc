const {
    isSpamMessage
} = require("./whatsappSpamService");

const {
    getSession,
    setSession
} = require("./whatsappSessionService");

const {
    processCustomerMessage
} = require("./aiService");

const {
    Business,
    Customer
} = require("../models");

const {
    cleanCustomerName,
    isEmptyMessage,
    isMediaMessage,
    isValidCustomerName
} = require("../utils/chatbotUtils");

const getCleanPhoneNumber = async (msg) => {

    try {

        const contact =
            await msg.getContact();

        // =========================
        // NOMOR ASLI WA
        // =========================
        let phone =
            contact.id.user || "";

        // HAPUS SELAIN ANGKA
        phone =
            phone.replace(/\D/g, "");

        // NORMALISASI
        if (
            phone.startsWith("0")
        ) {

            phone =
                "62" + phone.slice(1);
        }

        return phone;

    } catch (err) {

        console.log(
            "GET PHONE ERROR:",
            err.message
        );

        return "";
    }
};
const getWhatsAppProfileName = async (msg) => {

    try {

        const contact = await msg.getContact();

        return (
            contact.pushname ||
            contact.name ||
            msg.notifyName ||
            null
        );

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

        // const phone = msg.from.replace("@c.us", "");
        const phone = await getCleanPhoneNumber(msg);
        if (isSpamMessage(phone)) {

            return await msg.reply(
                "Terlalu banyak pesan dikirim.\nSilakan tunggu beberapa saat."
            );
        }

        const text = msg.body || "";
        const lowerText = text.toLowerCase();

        if (isMediaMessage(msg)) {

            return await msg.reply(
                "Saat ini bot hanya mendukung pesan teks."
            );
        }

        if (isEmptyMessage(text)) {

            return await msg.reply(
                "Pesan tidak boleh kosong."
            );
        }


        if (text.toLowerCase() === "/reset") {

            const { clearSession } = require("./whatsappSessionService");

            clearSession(phone);

            return await msg.reply(
                "Session berhasil direset. Silakan kirim pesan kembali."
            );
        }
        if (lowerText === "/help") {

            return await msg.reply(
                `Daftar Command:

/menu  → pilih bisnis ulang
/reset → reset session
/help  → bantuan chatbot`
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
                step: "choose_business"
            });

            return await msg.reply(menu);
        }

        // =========================
        // CEK SESSION
        // =========================
        const session = getSession(phone);
        console.log("SESSION:", session);

        // =========================
        // JIKA BELUM PILIH BUSINESS
        // =========================
        if (!session?.businessId) {

            // =========================
            // JIKA BELUM ADA STEP
            // =========================
            if (!session?.step) {

                const businesses = await Business.findAll();

                let menu = "Selamat datang.\n\n";
                menu += "Silakan pilih bisnis:\n\n";

                businesses.forEach((b, index) => {
                    menu += `${index + 1}. ${b.name}\n`;
                });

                setSession(phone, {
                    step: "choose_business"
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
                        b.name.toLowerCase().includes(text.toLowerCase())
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
                        businessId: selectedBusiness.id
                    }
                });

                if (existingCustomer) {

                    setSession(phone, {
                        businessId: selectedBusiness.id,
                        businessName: selectedBusiness.name,
                        customerId: existingCustomer.id,
                        customerName: existingCustomer.name,
                        step: "chatting"
                    });

                    return await msg.reply(
                        `Selamat datang kembali ${existingCustomer.name}.\n\nAnda terhubung ke ${selectedBusiness.name}.`
                    );
                }

                const profileNameRaw = await getWhatsAppProfileName(msg);

                const profileName = cleanCustomerName(profileNameRaw || "");

                const isProfileNameValid =
                    isValidCustomerName(profileName);

                // =========================
                // JIKA NAMA PROFILE VALID
                // =========================
                if (isProfileNameValid) {

                    setSession(phone, {
                        businessId: selectedBusiness.id,
                        businessName: selectedBusiness.name,
                        profileName,
                        step: "confirm_profile_name"
                    });

                    return await msg.reply(
                        `Anda terhubung ke ${selectedBusiness.name}.

Apakah nama Anda benar:
${profileName} ?

1. Ya
2. Ganti Nama`
                    );
                }

                // =========================
                // FALLBACK MANUAL INPUT
                // =========================
                setSession(phone, {
                    businessId: selectedBusiness.id,
                    businessName: selectedBusiness.name,
                    step: "waiting_name"
                });

                return await msg.reply(
                    `Anda terhubung ke ${selectedBusiness.name}.\n\nSiapa nama Anda?`
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
    "y",
    "yes",
    "benar",
    "betul",
    "ok",
    "oke"
];

if (confirmWords.includes(lowerText))  {

        let customer = await Customer.findOne({
            where: {
                phoneNumber: phone,
                businessId: session.businessId
            }
        });

        if (!customer) {

            customer = await Customer.create({
                name: session.profileName,
                phoneNumber: phone,
                businessId: session.businessId
            });

            console.log("NEW CUSTOMER CREATED");
        }

        setSession(phone, {
            ...session,
            customerId: customer.id,
            customerName: customer.name,
            step: "chatting"
        });

        return await msg.reply(
`Halo ${customer.name},
Anda berhasil terhubung ke ${session.businessName}.

Silakan kirim pesanan Anda.`
        );
    }

    // =========================
    // USER MAU GANTI NAMA
    // =========================
    const changeNameWords = [
    "2",
    "ganti",
    "ubah",
    "ubah nama",
    "ganti nama",
    "salah"
];

if (changeNameWords.includes(lowerText)) {

        setSession(phone, {
            ...session,
            step: "waiting_name"
        });

        return await msg.reply(
            "Silakan masukkan nama Anda."
        );
    }

    // =========================
    // INPUT TIDAK VALID
    // =========================
    return await msg.reply(
`Pilihan tidak valid.

1. Ya
2. Ganti Nama`
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
Silakan mulai kembali.`
                    );
                }

                // =========================
                // UPDATE RETRY
                // =========================
                setSession(phone, {
                    ...session,
                    retryCount
                });

                return await msg.reply(
                    `Nama tidak valid.

Gunakan nama asli.
Contoh:
- Budi
- Arman Hermasyah

Percobaan: ${retryCount}/3`
                );
            }

            let customer = await Customer.findOne({
                where: {
                    phoneNumber: phone,
                    businessId: session.businessId
                }
            });

            if (!customer) {

                customer = await Customer.create({
                    name: customerName,
                    phoneNumber: phone,
                    businessId: session.businessId
                });

                console.log("NEW CUSTOMER CREATED");
            }
            else {

                console.log("CUSTOMER EXIST");
            }

            setSession(phone, {
                ...session,
                retryCount: 0,
                customerId: customer.id,
                customerName: customer.name,
                step: "chatting"
            });

            return await msg.reply(
                `Halo ${customer.name}, Anda berhasil terhubung ke ${session.businessName}.\n\nSilakan kirim pesanan Anda.`
            );
        }

        // =========================
// WAITING ORDER CONFIRMATION
// =========================
if (
    session?.step ===
    "waiting_order_confirmation"
) {

    const yesWords = [
        "ya",
        "iya",
        "yes",
        "benar",
        "ok",
        "oke"
    ];

    const cancelWords = [
        "batal",
        "cancel"
    ];

    // =========================
    // CONFIRM
    // =========================
  if (
    yesWords.includes(lowerText)
) {

    const {
        Order,
        OrderItem,
        Product,
        ProductVariant
    } = require("../models");

    // =========================
    // AMBIL ITEM DARI SESSION
    // =========================
    const pendingItems =
        session.pendingOrder || [];

    if (!pendingItems.length) {

        return await msg.reply(
            "Pesanan kosong."
        );
    }

    let totalPrice = 0;

    const orderItems = [];

    // =========================
    // VALIDASI PRODUK
    // =========================
    for (const item of pendingItems) {

        const product =
            await Product.findOne({
                where: {
                    nama: item.product_name,
                    businessId:
                        session.businessId,
                    status: "active"
                },
                include: [
                    {
                        model: ProductVariant,
                        as: "variants"
                    }
                ]
            });

        if (!product) continue;

        let variant = null;

        // =========================
        // CARI VARIANT
        // =========================
        if (item.variant) {

            variant =
                product.variants.find(
                    v =>
                    v.nama_variant
                    .toLowerCase()
                    ===
                    item.variant
                    .toLowerCase()
                );
        }

        // =========================
        // DEFAULT VARIANT
        // =========================
        if (!variant) {

            variant =
                product.variants[0];
        }

        if (!variant) continue;

        // =========================
        // CEK STOK
        // =========================
        if (
            variant.stok <
            item.qty
        ) {

            return await msg.reply(
`${product.nama} stok tidak cukup.`
            );
        }

        const subtotal =
            variant.harga *
            item.qty;

        totalPrice += subtotal;

        console.log("MATCHED VARIANT:");
console.log(variant);

        orderItems.push({
            variantId: variant.id,
            quantity: item.qty,
            unitPrice: variant.harga,
            subtotal
        });
    }

    // =========================
    // BUAT ORDER
    // =========================
    const order =
        await Order.create({

            businessId:
                session.businessId,

            customerId:
                session.customerId,

            totalPrice,

            status: "pending"
        });

  // =========================
// BUAT ORDER ITEMS
// =========================
for (const item of orderItems) {

    await OrderItem.create({

        orderId: order.id,

        variantId:
            item.variantId,

        quantity:
            item.quantity,

        unitPrice:
            item.unitPrice,

        subtotal:
            item.subtotal
    });
}

    // =========================
    // RESET SESSION
    // =========================
    setSession(phone, {
        ...session,
        pendingOrder: null,
        step: "chatting"
    });

    return await msg.reply(
`Pesanan berhasil dibuat.

Total:
Rp ${totalPrice}

Pesanan sedang menunggu approval admin.`
    );
}

    // =========================
    // CANCEL
    // =========================
    if (
        cancelWords.includes(lowerText)
    ) {

        setSession(phone, {
            ...session,
            pendingOrder: null,
            step: "chatting"
        });

        return await msg.reply(
            "Pesanan dibatalkan."
        );
    }

    return await msg.reply(
`Ketik:
- ya
- batal`
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
        // SEMENTARA AUTO REPLY
        // =========================
      // =========================
// AMBIL BUSINESS
// =========================
const business = await Business.findByPk(
    session.businessId
);

// =========================
// PROCESS AI
// =========================
const aiResult =
    await processCustomerMessage({
        business,
        message: text,
        session
    });

console.log("AI RESULT:");
console.log(aiResult);

// =========================
// FAQ
// =========================
if (aiResult.intent === "faq") {

    return await msg.reply(
        aiResult.reply
    );
}

// =========================
// GREETING
// =========================
if (aiResult.intent === "greeting") {

    return await msg.reply(
        aiResult.reply
    );
}

// =========================
// ORDER
// =========================
if (aiResult.intent === "order") {

    if (!aiResult.items?.length) {

        return await msg.reply(
            "Saya tidak menemukan item pesanan."
        );
    }

    let summary = "Pesanan Anda:\n\n";

    aiResult.items.forEach((item) => {

        summary +=
`${item.qty}x ${item.product_name}
Variant: ${item.variant || "-"}
\n`;
    });

    summary +=
`\nApakah pesanan sudah benar?

Ketik:
- ya
- batal`;

    setSession(phone, {
        ...session,
        pendingOrder: aiResult.items,
        step: "waiting_order_confirmation"
    });

    return await msg.reply(summary);
}

// =========================
// CANCEL
// =========================
if (
    aiResult.intent === "cancel_order"
) {

    setSession(phone, {
        ...session,
        pendingOrder: null
    });

    return await msg.reply(
        "Pesanan berhasil dibatalkan."
    );
}

// =========================
// UNKNOWN
// =========================
return await msg.reply(
    aiResult.reply ||
    "Maaf saya tidak memahami pesan Anda."
);

    } catch (err) {
        console.error("WHATSAPP MESSAGE SERVICE ERROR:", err);
    }
};