const Product = require('../models/Product');

exports.listProducts = async (req, res) => {
  const products = await Product.findAll();
  res.render('products/index', { products });
};

exports.showCreateForm = (req, res) => {
  res.render('products/create');
};

exports.createProduct = async (req, res) => {
  const { nama, kategori, satuan, berat, harga, keterangan, stok } = req.body;
  await Product.create({ nama, kategori, satuan, berat, harga, keterangan, stok });
  res.redirect('/products');
};

exports.showEditForm = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).send('Product not found');
  res.render('products/edit', { product });
};

exports.updateProduct = async (req, res) => {
  const { nama, kategori, satuan, berat, harga, keterangan, stok } = req.body;
  await Product.update(
    { nama, kategori, satuan, berat, harga, keterangan, stok },
    { where: { id: req.params.id } }
  );
  res.redirect('/products');
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.redirect('/products');
  } catch (err) {
    res.status(500).send(err.message);
  }
};