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