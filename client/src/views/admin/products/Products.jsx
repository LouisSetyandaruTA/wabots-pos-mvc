import Card from "components/card";
import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosInstance";

export default function Products() {

  // ================= STATE =================
  const [products, setProducts] = useState([]); // raw product
  const [variants, setVariants] = useState([]); // flattened
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  // PRODUCT FORM
  const [productForm, setProductForm] = useState({
    nama: "",
    categoryId: "",
    satuan: "",
    harga: "",
    stok: "",
    berat: ""
  });

  // VARIANT FORM
  const [variantForm, setVariantForm] = useState({
    productId: "",
    nama_variant: "",
    harga: "",
    stok: "",
    berat: ""
  });

  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

const fetchProducts = async () => {
  try {
    const res = await axios.get("/products", {
      params: { search }
    });

    setProducts(res.data);

    const flat = [];

    res.data.forEach(p => {
      (p.variants || []).forEach(v => {
        flat.push({
          ...v,
          productId: p.id,
          productName: p.nama,
          category: p.Category?.name,
          categoryId: p.categoryId,
          satuan: p.satuan,
        });
      });
    });

    setVariants(flat);

  } catch (err) {
    console.error(err);
  }
};
  const fetchCategories = async () => {
    const res = await axios.get("/categories");
    setCategories(res.data);
  };

  const handleCreateCategory = async () => {
    if (!customCategory) return;

    try {
      const res = await axios.post("/categories", {
        name: customCategory
      });

      setCategories([...categories, res.data]);

      setProductForm({
        ...productForm,
        categoryId: res.data.id
      });

      setCustomCategory("");
    } catch (err) {
      alert("Gagal tambah kategori");
    }
  };

  // ================= CREATE PRODUCT =================
  const createProduct = async () => {
    if (!productForm.nama || !productForm.categoryId) {
      alert("Data product belum lengkap");
      return;
    }
    if (!productForm.harga || productForm.harga <= 0) {
      return alert("Harga tidak valid");
    }

    await axios.post("/products", productForm);

    setProductForm({ nama: "", categoryId: "", satuan: "" });
    fetchProducts();
  };

  // ================= CREATE VARIANT =================
  const createVariant = async () => {
    if (!variantForm.productId) return alert("Pilih product");

    await axios.post("/variants", variantForm);

    setVariantForm({
      productId: "",
      nama_variant: "",
      harga: "",
      stok: "",
      berat: ""
    });

    fetchProducts();
  };

  // ================= DELETE VARIANT =================
  const deleteVariant = async (id) => {
    if (!window.confirm("Hapus variant?")) return;

    await axios.delete(`/variants/${id}`);
    fetchProducts();
  };

  // ================= FILTER =================
  // const filtered = variants.filter(v =>
  //   v.productName.toLowerCase().includes(search.toLowerCase()) ||
  //   v.nama_variant.toLowerCase().includes(search.toLowerCase())
  // );
  const filtered = variants;
  //======================

  const [editVariant, setEditVariant] = useState(null);
  // ================= TAMBAHAN YANG HILANG =================
  const [customCategory, setCustomCategory] = useState("");

  const satuanOptions = [
    "pcs",
    "liter",
    "kg",
    "gram",
    "botol",
    "kotak",
    "sachet"
  ];

  const [editProduct, setEditProduct] = useState(null);
  const handleEditProduct = (variant) => {
    setEditProduct({
      productId: variant.productId,
      variantId: variant.id,

      nama: variant.productName,
      categoryId: variant.categoryId,
      satuan: variant.satuan,

      harga: variant.harga,
      stok: variant.stok,
      berat: variant.berat
    });
  };

  const updateProduct = async () => {
  try {
    // UPDATE PRODUCT
    await axios.put(`/products/${editProduct.productId}`, {
      nama: editProduct.nama,
      categoryId: editProduct.categoryId,
      satuan: editProduct.satuan
    });

    // UPDATE DEFAULT VARIANT
    await axios.put(`/variants/${editProduct.variantId}`, {
      harga: editProduct.harga,
      stok: editProduct.stok,
      berat: editProduct.berat
    });

    setEditProduct(null);
    fetchProducts();

  } catch (err) {
    alert(err.response?.data?.message || "Gagal update");
  }
};

useEffect(() => {
  const delay = setTimeout(() => {
    fetchProducts();
  }, 400);

  return () => clearTimeout(delay);
}, [search]);

  // ================= UI =================
  return (
    <div className="p-6 space-y-5">

      {/* ================= PRODUCT FORM ================= */}
      <Card extra="p-4">
        <h2 className="font-bold mb-3">Tambah Product</h2>

        <div className="grid grid-cols-3 gap-3">

          <input
            placeholder="Nama Product"
            value={productForm.nama}
            onChange={(e) =>
              setProductForm({ ...productForm, nama: e.target.value })
            }
            className="border p-2 rounded"
          />

          {/* CATEGORY + ADD */}
          <div className="flex gap-2">
            <select
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm({ ...productForm, categoryId: e.target.value })
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Pilih Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <input
              placeholder="Tambah"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="border p-2 rounded"
            />

            <button
              onClick={handleCreateCategory}
              className="bg-green-500 text-white px-2 rounded"
            >
              +
            </button>
          </div>

          {/* SATUAN */}
          <select
            value={productForm.satuan}
            onChange={(e) =>
              setProductForm({ ...productForm, satuan: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Pilih Satuan</option>
            {satuanOptions.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>

          {/* DEFAULT VARIANT FIELDS */}
          <input
            placeholder="Harga Default"
            type="number"
            onChange={(e) =>
              setProductForm({ ...productForm, harga: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Stok Default"
            type="number"
            onChange={(e) =>
              setProductForm({ ...productForm, stok: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Berat"
            type="number"
            onChange={(e) =>
              setProductForm({ ...productForm, berat: e.target.value })
            }
            className="border p-2 rounded"
          />

        </div>

        <p className="text-xs text-gray-500 mt-2">
          Produk akan otomatis memiliki variant "Default"
        </p>

        <button
          onClick={createProduct}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tambah Product
        </button>
      </Card>

      {/* ================= VARIANT FORM ================= */}
      <Card extra="p-4">
        <h2 className="font-bold mb-3">Tambah Variant</h2>

        <div className="grid grid-cols-5 gap-2">
          <select
            value={variantForm.productId}
            onChange={(e) =>
              setVariantForm({ ...variantForm, productId: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Pilih Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>

          <input
            placeholder="Nama Variant"
            onChange={(e) =>
              setVariantForm({ ...variantForm, nama_variant: e.target.value })
            }
            className="border p-2"
          />

          <input
            type="number"
            placeholder="Harga"
            onChange={(e) =>
              setVariantForm({ ...variantForm, harga: e.target.value })
            }
            className="border p-2"
          />

          <input
            type="number"
            placeholder="Stok"
            onChange={(e) =>
              setVariantForm({ ...variantForm, stok: e.target.value })
            }
            className="border p-2"
          />

          <button
            onClick={createVariant}
            className="bg-green-500 text-white px-2 rounded"
          >
            Tambah
          </button>
        </div>
      </Card>

      {/* ================= SEARCH ================= */}
      <input
        placeholder="Search product / variant..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full"
      />

      {/* ================= TABLE ================= */}
      <Card extra="p-4">
        <h2 className="font-bold mb-3">Daftar Produk</h2>

        <table className="w-full text-sm">
         <thead>
  <tr>
    <th>Product</th>
    <th>Variant</th>
    <th>Kategori</th>
    <th>Satuan</th>
    <th>Berat</th>
    <th>Harga</th>
    <th>Stok</th>
    <th>Aksi</th>
  </tr>
</thead>

      <tbody>
  {filtered.map(v => (
    <tr key={v.id} className="border-b">

      <td>{v.productName}</td>

      <td>
        <span className="font-semibold">
          {v.nama_variant}
        </span>

        {v.nama_variant === "Default" && (
          <span className="text-xs text-gray-500 ml-2">
            (Default)
          </span>
        )}
      </td>

      <td>{v.category}</td>

      <td>{v.satuan}</td>

      <td>{v.berat} gr</td>

      <td>Rp {v.harga}</td>

      <td>{v.stok}</td>

      <td className="flex gap-2">

        <button
          onClick={() => handleEditProduct(v)}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Edit Product
        </button>

        <button
          onClick={() => setEditVariant(v)}
          className="bg-yellow-400 px-2 py-1 rounded"
        >
          Edit Variant
        </button>

        <button
          onClick={() => deleteVariant(v.id)}
          className="text-red-500"
        >
          Hapus
        </button>

      </td>

    </tr>
  ))}
</tbody>
        </table>

      </Card>
      {editVariant && (
        <Card extra="p-4 mt-4">
          <h3 className="font-bold mb-2">Edit Variant</h3>

          <input
            value={editVariant.nama_variant}
            onChange={(e) =>
              setEditVariant({
                ...editVariant,
                nama_variant: e.target.value
              })
            }
            className="border p-2 mb-2 w-full"
          />

          <input
            type="number"
            value={editVariant.harga}
            onChange={(e) =>
              setEditVariant({
                ...editVariant,
                harga: e.target.value
              })
            }
            className="border p-2 mb-2 w-full"
          />

          <input
            type="number"
            value={editVariant.stok}
            onChange={(e) =>
              setEditVariant({
                ...editVariant,
                stok: e.target.value
              })
            }
            className="border p-2 mb-2 w-full"
          />

          <button
            onClick={async () => {
              await axios.put(`/variants/${editVariant.id}`, {
                nama_variant: editVariant.nama_variant,
                harga: editVariant.harga,
                stok: editVariant.stok,
                berat: editVariant.berat
              });
              setEditVariant(null);
              fetchProducts();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </Card>

      )}
      {editProduct && (
        <Card extra="p-4 mt-4">
          <h2 className="font-bold mb-3">Edit Product</h2>

          <div className="grid grid-cols-3 gap-3">

            <input
              value={editProduct.nama}
              onChange={(e) =>
                setEditProduct({ ...editProduct, nama: e.target.value })
              }
              className="border p-2 rounded"
            />

            {/* CATEGORY */}
            <select
              value={editProduct.categoryId}
              onChange={(e) =>
                setEditProduct({ ...editProduct, categoryId: e.target.value })
              }
              className="border p-2 rounded"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* SATUAN */}
            <select
              value={editProduct.satuan}
              onChange={(e) =>
                setEditProduct({ ...editProduct, satuan: e.target.value })
              }
              className="border p-2 rounded"
            >
              {satuanOptions.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>

            {/* DEFAULT VARIANT */}
            <input
              type="number"
              value={editProduct.harga}
              onChange={(e) =>
                setEditProduct({ ...editProduct, harga: e.target.value })
              }
              className="border p-2 rounded"
            />

            <input
              type="number"
              value={editProduct.stok}
              onChange={(e) =>
                setEditProduct({ ...editProduct, stok: e.target.value })
              }
              className="border p-2 rounded"
            />

            <input
              type="number"
              value={editProduct.berat}
              onChange={(e) =>
                setEditProduct({ ...editProduct, berat: e.target.value })
              }
              className="border p-2 rounded"
            />

          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={updateProduct}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setEditProduct(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}


// import Card from "components/card";
// import React, { useEffect, useState } from "react";
// import axios from "../../../utils/axiosInstance";

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState({
//     nama: "",
//     categoryId: "",
//     satuan: "",
//     berat: "",
//     harga: "",
//     stok: ""
//   });
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     const res = await axios.get("/categories");
//     setCategories(res.data);
//   };
//   const satuanOptions = ["pcs", "liter", "kg", "gram", "botol", "kotak", "sachet"];
//   const [error, setError] = useState("");

//   const [variants, setVariants] = useState({});
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [variantForm, setVariantForm] = useState({
//     nama_variant: "",
//     harga: "",
//     stok: "",
//     berat: "",
//     satuan: ""
//   });

//   const fetchVariants = async (productId) => {
//     try {
//       const res = await axios.get(`/variants/${productId}`);
//       setVariants(prev => ({
//         ...prev,
//         [productId]: res.data
//       }));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const createVariant = async (productId) => {
//     try {
//       await axios.post("/variants", {
//         ...variantForm,
//         productId,
//       });

//       await fetchVariants(productId)
//       await fetchProducts()

//       setVariantForm({
//         nama_variant: "",
//         harga: "",
//         stok: "",
//         berat: "",
//       });

//     } catch (err) {
//       alert(err.response?.data?.message);
//     }
//   };

//   const deleteVariant = async (id, productId) => {
//     await axios.delete(`/variants/${id}`);
//     fetchVariants(productId);
//     await fetchProducts() // 🔥
//   };

//   const [editVariantId, setEditVariantId] = useState(null);
//   const [variantEditForm, setVariantEditForm] = useState({});

//   const updateVariant = async (id, productId) => {
//     try {
//       await axios.put(`/variants/${id}`, variantEditForm);

//       setEditVariantId(null);

//       // 🔥 WAJIB
//       await fetchVariants(productId);

//       // 🔥 WAJIB (ini yang bikin stok product ikut update)
//       await fetchProducts();

//     } catch (err) {
//       alert(err.response?.data?.message);
//     }
//   };


//   const [editId, setEditId] = useState(null);

//   const fetchProducts = () => {
//     axios.get("/products")
//       .then(res => {
//         if (Array.isArray(res.data)) {
//           setProducts(res.data);
//         } else {
//           setProducts([]);
//         }
//       })
//       .catch(err => console.error(err));
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // HANDLE INPUT
//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleCategoryChange = (e) => {
//     setForm({
//       ...form,
//       categoryId: e.target.value
//     });
//   };

//   // CREATE / UPDATE
//   const handleSubmit = () => {
//     if (
//       !form.nama ||
//       !form.harga ||
//       !form.stok ||
//       !form.categoryId ||
//       !form.satuan ||
//       !form.berat
//     ) {
//       alert("Semua field wajib diisi!");
//       return;
//     }

//     if (form.harga <= 0 || form.stok < 0 || form.berat <= 0) {
//       alert("Nilai tidak valid!");
//       return;
//     }

//     if (editId) {
//       axios.put(`/products/${editId}`, form)
//         .then(() => {
//           resetForm();
//           fetchProducts();
//         });
//     } else {
//       axios.post("/products", form)
//         .then(() => {
//           setError("");
//           resetForm();
//           fetchProducts();
//         })
//         .catch(err => {
//           setError(err.response?.data?.message || "Terjadi error");
//         });
//     }
//   };

//   const handleEdit = (p) => {
//     setEditId(p.id);
//     setForm({
//       nama: p.nama,
//       categoryId: p.categoryId,
//       satuan: p.satuan,
//       berat: p.berat,
//       harga: p.harga,
//       stok: p.stok
//     });
//   };

//   const handleDelete = (id) => {
//     if (!window.confirm("Yakin hapus produk ini?")) return;

//     axios.delete(`/products/${id}`)
//       .then(() => fetchProducts());
//   };

//   const resetForm = () => {
//     setForm({
//       nama: "",
//       categoryId: "",
//       satuan: "",
//       berat: "",
//       harga: "",
//       stok: ""
//     });
//     setEditId(null);
//   };



//   return (
//     <div className="mt-5 grid grid-cols-1 gap-5">

//       {/* FORM */}
//       <Card extra="w-full p-4">
//         <h2 className="text-xl font-bold mb-4">
//           {editId ? "Edit Produk" : "Tambah Produk"}
//         </h2>

//         {error && (
//           <div className="bg-red-100 text-red-600 p-2 rounded mb-2">
//             {error}
//           </div>
//         )}

//         <div className="grid grid-cols-3 gap-4">
//           <input
//             name="nama"
//             placeholder="Nama Produk"
//             value={form.nama}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//           <input
//             name="harga"
//             placeholder="Harga"
//             type="number"
//             value={form.harga}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//           <input
//             name="stok"
//             placeholder="Stok"
//             type="number"
//             value={form.stok}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />
//           <div className="flex gap-2">
//             <select
//               value={form.categoryId}
//               onChange={handleCategoryChange}
//               className="border p-2 rounded"
//             >
//               <option value="">Pilih Kategori</option>
//               {categories.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>

//           </div>
//           <select
//             name="satuan"
//             value={form.satuan}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           >
//             <option value="">Pilih Satuan</option>
//             {satuanOptions.map((s, i) => (
//               <option key={i} value={s}>{s}</option>
//             ))}
//           </select>
//           <input
//             name="berat"
//             type="number"
//             placeholder="Berat (gram)"
//             value={form.berat}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />
//         </div>

//         <div className="mt-4 flex gap-2">
//           <button
//             onClick={handleSubmit}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             {editId ? "Update" : "Tambah"}
//           </button>

//           {editId && (
//             <button
//               onClick={resetForm}
//               className="bg-gray-400 text-white px-4 py-2 rounded"
//             >
//               Batal
//             </button>
//           )}

//         </div>
//       </Card>

//       {/* TABLE */}
//       <Card extra="w-full p-4">
//         <h2 className="text-xl font-bold mb-4">Daftar Produk</h2>

//         <table className="w-full text-left">
//           <thead>
//             <tr>
//               <th>Nama</th>
//               <th>Kategori</th>
//               <th>Satuan</th>
//               <th>Berat (g)</th>
//               <th>Harga</th>
//               <th>Stok</th>
//               <th>Aksi</th>
//             </tr>
//           </thead>

//           <tbody>
//             {products.length > 0 ? (
//               products.map((p) => (
//                 <React.Fragment key={p.id}>

//                   {/* ROW PRODUCT */}
//                   <tr className="border-b hover:bg-gray-100">
//                     <td>{p.nama}</td>
//                     <td>{p.Category?.name}</td>
//                     <td>{p.satuan}</td>
//                     <td>{p.berat} g</td>
//                     <td>Rp {p.harga.toLocaleString()}</td>
//                     <td>{p.stok}</td>
//                     <td className="p-2 flex gap-2">
//                       <button
//                         onClick={() => handleEdit(p)}
//                         className="bg-yellow-400 px-2 py-1 rounded"
//                       >
//                         Edit
//                       </button>

//                       <button
//                         onClick={() => handleDelete(p.id)}
//                         className="bg-red-500 text-white px-2 py-1 rounded"
//                       >
//                         Delete
//                       </button>

//                       <button
//                         onClick={() => {
//                           setSelectedProduct(p.id);
//                           fetchVariants(p.id);
//                         }}
//                         className="bg-green-500 text-white px-2 py-1 rounded"
//                       >
//                         Variant
//                       </button>
//                     </td>
//                   </tr>

//                   {/* ROW VARIANT */}
//                   {selectedProduct === p.id && (
//                     <tr>
//                       <td colSpan="7">

//                         {/* FORM VARIANT */}
//                         <div className="p-4 bg-gray-100 border-2 border-blue-300 rounded-lg mb-3">
//                           <h3 className="font-bold mb-2">
//                             Variant untuk: {products.find(p => p.id === selectedProduct)?.nama}
//                           </h3>

//                           <div className="flex gap-2">
//                             <input
//                               placeholder="Nama"
//                               onChange={(e) =>
//                                 setVariantForm({ ...variantForm, nama_variant: e.target.value })
//                               }
//                             />
//                             <input
//                               placeholder="Harga"
//                               type="number"
//                               onChange={(e) =>
//                                 setVariantForm({ ...variantForm, harga: e.target.value })
//                               }
//                             />
//                             <input
//                               placeholder="Stok"
//                               type="number"
//                               onChange={(e) =>
//                                 setVariantForm({ ...variantForm, stok: e.target.value })
//                               }
//                             />
//                             <input
//                               placeholder="Berat"
//                               type="number"
//                               onChange={(e) =>
//                                 setVariantForm({ ...variantForm, berat: e.target.value })
//                               }
//                             />

//                             <button
//                               onClick={() => createVariant(p.id)}
//                               className="bg-blue-500 text-white px-2"
//                             >
//                               Tambah
//                             </button>
//                             <button
//                               onClick={() => setSelectedProduct(null)}
//                               className="mb-2 text-sm text-red-500"
//                             >
//                               Tutup Variant
//                             </button>
//                           </div>
//                         </div>

//                         {/* LIST VARIANT */}
//                         <table className="w-full text-sm">
//                           <thead>
//                             <tr>
//                               <th>Nama</th>
//                               <th>Harga</th>
//                               <th>Stok</th>
//                               <th>Berat</th>
//                               <th>Aksi</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {(variants[p.id] || []).map((v) => (
//                               <tr key={v.id}>
//                                 <td>{v.nama_variant}</td>

//                                 <td>
//                                   {editVariantId === v.id ? (
//                                     <input
//                                       value={variantEditForm.harga}
//                                       onChange={(e) =>
//                                         setVariantEditForm({ ...variantEditForm, harga: e.target.value })
//                                       }
//                                     />
//                                   ) : (
//                                     v.harga
//                                   )}
//                                 </td>

//                                 <td>
//                                   {editVariantId === v.id ? (
//                                     <input
//                                       value={variantEditForm.stok}
//                                       onChange={(e) =>
//                                         setVariantEditForm({ ...variantEditForm, stok: e.target.value })
//                                       }
//                                     />
//                                   ) : (
//                                     v.stok
//                                   )}
//                                 </td>

//                                 <td>
//                                   {editVariantId === v.id ? (
//                                     <input
//                                       value={variantEditForm.berat}
//                                       onChange={(e) =>
//                                         setVariantEditForm({ ...variantEditForm, berat: e.target.value })
//                                       }
//                                     />
//                                   ) : (
//                                     v.berat
//                                   )}
//                                 </td>

//                                 <td>
//                                   {editVariantId === v.id ? (
//                                     <button
//                                       onClick={() => updateVariant(v.id, p.id)}
//                                       className="bg-blue-500 text-white px-2"
//                                     >
//                                       Save
//                                     </button>
//                                   ) : (
//                                     <button
//                                       onClick={() => {
//                                         setEditVariantId(v.id);
//                                         setVariantEditForm(v);
//                                       }}
//                                       className="bg-yellow-400 px-2"
//                                     >
//                                       Edit
//                                     </button>
//                                   )}

//                                   <button
//                                     onClick={() => deleteVariant(v.id, p.id)}
//                                     className="bg-red-500 text-white px-2"
//                                   >
//                                     Hapus
//                                   </button>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>

//                       </td>
//                     </tr>
//                   )}

//                 </React.Fragment>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center p-4">
//                   Loading...
//                 </td>
//               </tr>
//             )}


//           </tbody>
//         </table>
//       </Card>
//     </div>
//   );
// }