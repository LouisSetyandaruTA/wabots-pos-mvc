const { ProductVariant, Product } = require("../models");
const { Op } = require("sequelize");

exports.getByProduct = async (productId, businessId) => {
  return await ProductVariant.findAll({
    where: {
      productId,
      status: {
        [Op.ne]: "inactive",
      },
    },
    include: [
      {
        model: Product,
        as: "Product",
        where: { businessId },
      },
    ],
  });
};

exports.create = async (data, businessId) => {
  const product = await Product.findOne({
    where: {
      id: data.productId,
      businessId,
    },
  });

  if (!product) throw new Error("Produk tidak valid");

  return await ProductVariant.create({
    ...data,
    businessId,
  });
};

exports.delete = async (id) => {
  await ProductVariant.update(
    {
      status: "inactive",
    },
    {
      where: { id },
    },
  );
};

exports.update = async (id, data) => {
  const variant = await ProductVariant.findByPk(id);
  if (!variant) throw new Error("Variant tidak ditemukan");

  if (data.harga !== undefined && data.harga <= 0) {
    throw new Error("Harga tidak valid");
  }

  if (data.stok !== undefined && data.stok < 0) {
    throw new Error("Stok tidak valid");
  }

  if (data.berat !== undefined && data.berat <= 0) {
    throw new Error("Berat tidak valid");
  }

  await variant.update(data);

  return variant;
};
