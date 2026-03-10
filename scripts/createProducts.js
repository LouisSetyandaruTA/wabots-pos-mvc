const sequelize = require('../config/database');
const Product = require('../models/Product');

async function insertDummyProducts() {
  await Product.bulkCreate([
    {
    nama: 'Sabun Cair Antiseptik',
    harga: 15000,
    stok: 30,
    kategori: 'Kebersihan',
    satuan: 'pcs',
    berat: 250,
    keterangan: 'Sabun cair antibakteri dengan aroma lemon',
  },
  {
    nama: 'Minyak Goreng 1L',
    harga: 18000,
    stok: 50,
    kategori: 'Sembako',
    satuan: 'liter',
    berat: 1000,
    keterangan: 'Minyak goreng kelapa sawit murni',
  },
  {
    nama: 'Beras Premium 5kg',
    harga: 72000,
    stok: 20,
    kategori: 'Sembako',
    satuan: 'karung',
    berat: 5000,
    keterangan: 'Beras pulen kualitas super',
  },
  {
    nama: 'Mi Instan Rasa Ayam',
    harga: 3000,
    stok: 100,
    kategori: 'Makanan Ringan',
    satuan: 'pcs',
    berat: 80,
    keterangan: 'Mi instan cepat saji rasa ayam bawang',
  },
  {
    nama: 'Teh Celup 25 pcs',
    harga: 10000,
    stok: 40,
    kategori: 'Minuman',
    satuan: 'kotak',
    berat: 125,
    keterangan: 'Teh hitam celup aromatik',
  },
  {
    nama: 'Air Mineral 600ml',
    harga: 3500,
    stok: 60,
    kategori: 'Minuman',
    satuan: 'botol',
    berat: 600,
    keterangan: 'Air mineral pegunungan',
  },
  {
    nama: 'Tisu Gulung 2 Ply',
    harga: 11000,
    stok: 25,
    kategori: 'Kebersihan',
    satuan: 'roll',
    berat: 300,
    keterangan: 'Tisu toilet lembut dan kuat',
  },
  {
    nama: 'Susu UHT 1L',
    harga: 16000,
    stok: 35,
    kategori: 'Minuman',
    satuan: 'kotak',
    berat: 1000,
    keterangan: 'Susu segar dengan rasa cokelat',
  },
  {
    nama: 'Kopi Instan Sachet',
    harga: 1200,
    stok: 80,
    kategori: 'Minuman',
    satuan: 'sachet',
    berat: 20,
    keterangan: 'Kopi instan rasa original',
  },
  {
    nama: 'Detergen Bubuk 900gr',
    harga: 22000,
    stok: 18,
    kategori: 'Kebersihan',
    satuan: 'pack',
    berat: 900,
    keterangan: 'Detergen anti noda',
  },
  ]);
}

(async () => {
  try {
    await sequelize.sync({ alter: true }); 
    await insertDummyProducts(); 
    console.log("Data produk berhasil dimasukkan.");
    process.exit(); 
  } catch (err) {
    console.error("Gagal:", err);
  }
})();

insertDummyProducts();