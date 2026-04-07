const { Product, ProductVariant } = require("../models");

exports.getAll = async () => {
  const products = await Product.findAll({
    include: [
      {
        model: ProductVariant,
        as: "variants" // ⚠️ pastikan sama dengan associations
      }
    ]
  });

  return products.map(p => {
    const variants = p.variants || [];

    let totalStock = p.stok;

    if (variants.length > 0) {
      totalStock = variants.reduce((sum, v) => sum + (v.stok || 0), 0);
    }

    return {
      ...p.toJSON(),
      stok: totalStock
    };
  });
};

// 🔥 VALIDATION FUNCTION
const validateProduct = (data) => {
  if (
    data.nama === "" ||
    data.kategori === "" ||
    data.satuan === "" ||
    data.berat === "" ||
    data.harga === "" ||
    data.stok === ""
  ) {
    throw new Error("Semua field wajib diisi");
  }

  if (data.harga <= 0) {
    throw new Error("Harga harus lebih dari 0");
  }

  if (data.stok < 0) {
    throw new Error("Stok tidak boleh negatif");
  }

  if (data.berat <= 0) {
    throw new Error("Berat harus lebih dari 0");
  }
};

// CREATE
exports.create = async (data) => {
  validateProduct(data); // ✅ VALIDASI DI SINI
  return await Product.create(data);
};

// UPDATE
exports.update = async (id, data) => {
  validateProduct(data); // ✅ VALIDASI JUGA DI UPDATE
  await Product.update(data, { where: { id } });
};

// DELETE
exports.delete = async (id) => {
  await Product.destroy({ where: { id } });
};