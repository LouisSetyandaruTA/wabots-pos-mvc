const { Product, ProductVariant, Category, Business } = require("../models");


exports.getAll = async (businessId) => {
  const products = await Product.findAll({
    where: { businessId },
    include: [
      {
        model: ProductVariant,
        as: "variants"
      },
      {
        model: Category,
        as: "Category",
        attributes: ["id", "name"]
      }
    ]
  });

  return products.map(p => {
    const variants = p.variants || [];

    const totalStock = variants.reduce(
      (sum, v) => sum + (v.stok || 0),
      0
    );

    const minPrice =
      variants.length > 0
        ? Math.min(...variants.map(v => v.harga))
        : 0;

    return {
      ...p.toJSON(),
      stok: totalStock,
      harga: minPrice 
    };
  });
};

// VALIDATION FUNCTION
const validateProduct = (data) => {
  if (
    !data.nama ||
    !data.categoryId ||
    !data.satuan ||
    !data.berat
  ) {
    throw new Error("Field product tidak lengkap");
  }

  if (data.berat <= 0) {
    throw new Error("Berat harus lebih dari 0");
  }
};

// CREATE
exports.create = async (data, businessId) => {
  validateProduct(data);

  return await Product.create({
    ...data,
    businessId
  });
};

exports.createProduct = async (data) => {
  const product = await Product.create(data);

  await ProductVariant.create({
    productId: product.id,
    businessId: data.businessId,
    nama_variant: "Default",
    harga: data.harga || 0,
    stok: data.stok || 0,
    berat: data.berat || 0
  });

  return product;
};

exports.update = async (id, data, businessId) => {
  await Product.update(
    {
      nama: data.nama,
      categoryId: data.categoryId,
      satuan: data.satuan,
      berat: data.berat
    },
    {
      where: { id, businessId }
    }
  );
};

exports.delete = async (id, businessId) => {
  await ProductVariant.destroy({
    where: { productId: id }
  });

  await Product.destroy({
    where: { id, businessId }
  });
};