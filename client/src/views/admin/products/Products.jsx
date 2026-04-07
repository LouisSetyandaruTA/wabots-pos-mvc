import Card from "components/card";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    satuan: "",
    berat: "",
    harga: "",
    stok: ""
  });
  const kategoriOptions = ["Sembako", "Minuman", "Makanan", "Kebersihan"];
  const satuanOptions = ["pcs", "liter", "kg", "gram", "botol", "kotak", "sachet"];
  const [customKategori, setCustomKategori] = useState("");
  const [error, setError] = useState("");

  const [variants, setVariants] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variantForm, setVariantForm] = useState({
    nama_variant: "",
    harga: "",
    stok: "",
    berat: "",
    satuan: ""
  });

  const fetchVariants = async (productId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/variants/${productId}`);
    setVariants(prev => ({
      ...prev,
      [productId]: res.data
    }));
  } catch (err) {
    console.error(err);
  }
};


  const [editId, setEditId] = useState(null);

  const fetchProducts = () => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // CREATE / UPDATE
  const handleSubmit = () => {
    if (
      !form.nama ||
      !form.harga ||
      !form.stok ||
      !form.kategori ||
      !form.satuan ||
      !form.berat
    ) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (form.harga <= 0 || form.stok < 0 || form.berat <= 0) {
      alert("Nilai tidak valid!");
      return;
    }

    if (editId) {
      axios.put(`http://localhost:5000/api/products/${editId}`, form)
        .then(() => {
          resetForm();
          fetchProducts();
        });
    } else {
      axios.post("http://localhost:5000/api/products", form)
        .then(() => {
          setError("");
          resetForm();
          fetchProducts();
        })
        .catch(err => {
          setError(err.response?.data?.message || "Terjadi error");
        });
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({
      nama: p.nama,
      kategori: p.kategori,
      satuan: p.satuan,
      berat: p.berat,
      harga: p.harga,
      stok: p.stok
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Yakin hapus produk ini?")) return;

    axios.delete(`http://localhost:5000/api/products/${id}`)
      .then(() => fetchProducts());
  };

  const resetForm = () => {
    setForm({
      nama: "",
      kategori: "",
      satuan: "",
      berat: "",
      harga: "",
      stok: ""
    });
    setCustomKategori("");
    setEditId(null);
  };

  return (
    <div className="mt-5 grid grid-cols-1 gap-5">

      {/* FORM */}
      <Card extra="w-full p-4">
        <h2 className="text-xl font-bold mb-4">
          {editId ? "Edit Produk" : "Tambah Produk"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <input
            name="nama"
            placeholder="Nama Produk"
            value={form.nama}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="harga"
            placeholder="Harga"
            type="number"
            value={form.harga}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="stok"
            placeholder="Stok"
            type="number"
            value={form.stok}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <div className="flex gap-2">
            <select
              name="kategori"
              value={form.kategori}
              onChange={(e) => {
                setForm({ ...form, kategori: e.target.value });
                setCustomKategori("");
              }}
              className="border p-2 rounded w-full"
            >
              <option value="">Pilih Kategori</option>
              {kategoriOptions.map((k, i) => (
                <option key={i} value={k}>{k}</option>
              ))}
            </select>

            <input
              placeholder="Custom"
              value={customKategori}
              onChange={(e) => {
                const value = e.target.value;
                setCustomKategori(value);

                if (value) {
                  setForm({ ...form, kategori: value });
                }
              }}
              className="border p-2 rounded w-full"
            />
          </div>
          <select
            name="satuan"
            value={form.satuan}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Pilih Satuan</option>
            {satuanOptions.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
          <input
            name="berat"
            type="number"
            placeholder="Berat (gram)"
            value={form.berat}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editId ? "Update" : "Tambah"}
          </button>

          {editId && (
            <button
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
          )}
          
        </div>
      </Card>

      {/* TABLE */}
      <Card extra="w-full p-4">
        <h2 className="text-xl font-bold mb-4">Daftar Produk</h2>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Satuan</th>
              <th>Berat (g)</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-100">
                  <td>{p.nama}</td>
                  <td>{p.kategori}</td>
                  <td>{p.satuan}</td>
                  <td>{p.berat} g</td>
                  <td>Rp {p.harga.toLocaleString()}</td>
                  <td>{p.stok}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-400 px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}