const {
    Product,
    ProductVariant,
    Category
} = require("../models");

const {
    askDeepSeek
} = require("./openrouterService");

exports.processCustomerMessage = async ({
    business,
    message,
    session
}) => {

    // =========================
    // AMBIL PRODUCT
    // =========================
    const products = await Product.findAll({
        where: {
            businessId: business.id,
            status: "active"
        },
        include: [
            {
                model: ProductVariant,
                as: "variants"
            },
            {
                model: Category,
                as: "Category"
            }
        ]
    });

    // =========================
    // FORMAT PRODUCT LIST
    // =========================
    let productText = "";

    products.forEach((p) => {

        productText += `
Product: ${p.nama}
Kategori: ${p.Category?.name || "-"}
Keterangan: ${p.keterangan || "-"}
`;

        (p.variants || []).forEach((v) => {

            productText += `
- Variant: ${v.nama_variant}
  Harga: ${v.harga}
  Stok: ${v.stok}
`;
        });

        productText += "\n";
    });

    // =========================
    // AI PROMPT
    // =========================
    const prompt = `
Anda adalah AI customer service WhatsApp.

Tugas Anda:
- memahami intent customer
- menjawab pertanyaan toko
- memahami pesanan
- memahami pembatalan
- memahami konfirmasi

================================
DATA TOKO
================================
Nama bisnis:
${business.name}

Deskripsi:
${business.description || "-"}

Alamat:
${business.address || "-"}

Nomor Telepon:
${business.phone || "-"}

Jam Operasional:
${business.openHours || "-"}

FAQ:
${business.faq || "-"}

================================
PRODUCT TERSEDIA
================================

${productText}

================================
RULES
================================

Intent yang VALID:

1. faq
2. order
3. cancel_order
4. confirm_order
5. greeting
6. unknown

================================
JIKA ORDER
================================

Extract item.

================================
FORMAT JSON WAJIB
================================

{
  "intent": "",
  "reply": "",
  "items": [
    {
      "product_name": "",
      "variant": "",
      "qty": 0
    }
  ]
}

================================
CUSTOMER MESSAGE
================================

${message}
`;

    const aiRaw = await askDeepSeek(prompt);

    if (!aiRaw) {

        return {
            intent: "unknown",
            reply: "Maaf sistem sedang error."
        };
    }

    try {

        const clean =
            aiRaw
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

        return JSON.parse(clean);

    } catch (err) {

        console.error("AI PARSE ERROR:", err);

        return {
            intent: "unknown",
            reply: "Maaf saya tidak memahami pesan Anda."
        };
    }
};