const { ProductVariant } = require("../models");

exports.getByProduct = async (productId) => {
  return await ProductVariant.findAll({
    where: { productId }
  });
};

exports.create = async (data) => {
  if (
    !data.productId ||
    !data.nama_variant ||
    !data.harga ||
    !data.stok
  ) {
    throw new Error("Data variant tidak lengkap");
  }

  return await ProductVariant.create(data);
};

exports.delete = async (id) => {
  await ProductVariant.destroy({ where: { id } });
};

exports.update = async (id, data) => {
  const variant = await ProductVariant.findByPk(id);
  if (!variant) throw new Error("Variant tidak ditemukan");

  if (data.harga <= 0) throw new Error("Harga tidak valid");
  if (data.stok < 0) throw new Error("Stok tidak valid");
  if (data.berat <= 0) throw new Error("Berat tidak valid");

  await variant.update({
    harga: data.harga,
    stok: data.stok,
    berat: data.berat
  });

  return variant;
};