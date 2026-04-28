// import Card from "components/card";
// import React, { useEffect, useState } from "react";
// import axios from "../../../utils/axiosInstance";

// export default function Products() {

// // ================= STATE =================
// const [products, setProducts] = useState([]);
// const [categories, setCategories] = useState([]);

// const [form, setForm] = useState({
// nama: "",
// categoryId: "",
// satuan: "",
// berat: ""
// });

// const [customCategory, setCustomCategory] = useState("");
// const [editId, setEditId] = useState(null);

// const [selectedProduct, setSelectedProduct] = useState(null);
// const [variants, setVariants] = useState({});

// const [variantForm, setVariantForm] = useState({
// nama_variant: "",
// harga: "",
// stok: "",
// berat: ""
// });

// // ================= FETCH =================
// useEffect(() => {
// fetchProducts();
// fetchCategories();
// }, []);

// const fetchProducts = async () => {
// const res = await axios.get("/products");
// setProducts(res.data);
// };

// const fetchCategories = async () => {
// const res = await axios.get("/categories");
// setCategories(res.data);
// };

// const fetchVariants = async (productId) => {
// const res = await axios.get(`/variants/${productId}`);
// setVariants(prev => ({
// ...prev,
// [productId]: res.data
// }));
// };

// // ================= HANDLER =================
// const handleChange = (e) => {
// setForm({ ...form, [e.target.name]: e.target.value });
// };

// const handleSubmit = async () => {
// if (!form.nama || !form.categoryId) {
// alert("Data belum lengkap");
// return;
// }

// if (editId) {
//   await axios.put(`/products/${editId}`, form);
// } else {
//   const res = await axios.post("/products", form);

//   // AUTO DEFAULT VARIANT
//   await axios.post("/variants", {
//     productId: res.data.id,
//     nama_variant: "Default",
//     harga: 0,
//     stok: 0,
//     berat: form.berat || 0
//   });
// }

// resetForm();
// fetchProducts();

// };

// const handleEdit = (p) => {
// setEditId(p.id);
// setForm({
// nama: p.nama,
// categoryId: p.categoryId,
// satuan: p.satuan,
// berat: p.berat
// });
// };

// const handleDelete = async (id) => {
// if (!window.confirm("Yakin hapus?")) return;
// await axios.delete(`/products/${id}`);
// fetchProducts();
// };

// const resetForm = () => {
// setForm({
// nama: "",
// categoryId: "",
// satuan: "",
// berat: ""
// });
// setEditId(null);
// };

// // ================= CATEGORY =================
// const handleCreateCategory = async () => {
// if (!customCategory) return;


// const res = await axios.post("/categories", {
//   name: customCategory
// });

// setCategories([...categories, res.data]);
// setForm({ ...form, categoryId: res.data.id });
// setCustomCategory("");


// };

// // ================= VARIANT =================
// const createVariant = async (productId) => {
// await axios.post("/variants", {
// ...variantForm,
// productId
// });


// setVariantForm({
//   nama_variant: "",
//   harga: "",
//   stok: "",
//   berat: ""
// });

// fetchVariants(productId);


// };

// const deleteVariant = async (id, productId) => {
// await axios.delete(`/variants/${id}`);
// fetchVariants(productId);
// };

// // ================= UI =================
// return ( <div className="mt-5 grid gap-5">

//   {/* FORM */}
//   <Card extra="p-4">
//     <h2 className="text-xl font-bold mb-4">
//       {editId ? "Edit Produk" : "Tambah Produk"}
//     </h2>

//     <div className="grid grid-cols-3 gap-4">

//       <input
//         name="nama"
//         placeholder="Nama Produk"
//         value={form.nama}
//         onChange={handleChange}
//         className="border p-2 rounded"
//       />

//       {/* CATEGORY */}
//       <div className="flex gap-2">
//         <select
//           value={form.categoryId}
//           onChange={(e) =>
//             setForm({ ...form, categoryId: e.target.value })
//           }
//           className="border p-2 rounded w-full"
//         >
//           <option value="">Pilih Kategori</option>
//           {categories.map(c => (
//             <option key={c.id} value={c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>

//         <input
//           placeholder="+ kategori"
//           value={customCategory}
//           onChange={(e) => setCustomCategory(e.target.value)}
//           className="border p-2 rounded"
//         />

//         <button
//           onClick={handleCreateCategory}
//           className="bg-green-500 text-white px-2 rounded"
//         >
//           +
//         </button>
//       </div>

//       <input
//         name="berat"
//         type="number"
//         placeholder="Berat"
//         value={form.berat}
//         onChange={handleChange}
//         className="border p-2 rounded"
//       />

//     </div>

//     <div className="mt-4 flex gap-2">
//       <button
//         onClick={handleSubmit}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         {editId ? "Update" : "Tambah"}
//       </button>

//       {editId && (
//         <button
//           onClick={resetForm}
//           className="bg-gray-400 text-white px-4 py-2 rounded"
//         >
//           Batal
//         </button>
//       )}
//     </div>
//   </Card>

//   {/* TABLE */}
//   <Card extra="p-4">
//     <h2 className="text-xl font-bold mb-4">Daftar Produk</h2>

//     <table className="w-full">
//       <thead>
//         <tr>
//           <th>Nama</th>
//           <th>Kategori</th>
//           <th>Aksi</th>
//         </tr>
//       </thead>

//       <tbody>
//         {products.map(p => (
//           <React.Fragment key={p.id}>

//             {/* PRODUCT */}
//             <tr className="border-b">
//               <td>{p.nama}</td>
//               <td>{p.Category?.name}</td>
//               <td className="flex gap-2">

//                 <button
//                   onClick={() => handleEdit(p)}
//                   className="bg-yellow-400 px-2 py-1 rounded"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => handleDelete(p.id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded"
//                 >
//                   Delete
//                 </button>

//                 <button
//                   onClick={() => {
//                     setSelectedProduct(p.id);
//                     fetchVariants(p.id);
//                   }}
//                   className="bg-green-500 text-white px-2 py-1 rounded"
//                 >
//                   Variant
//                 </button>

//               </td>
//             </tr>

//             {/* VARIANT */}
//             {selectedProduct === p.id && (
//               <tr>
//                 <td colSpan="3">

//                   <div className="bg-gray-100 p-3 rounded mt-2">

//                     <div className="flex gap-2 mb-2">
//                       <input
//                         placeholder="Nama"
//                         onChange={(e) =>
//                           setVariantForm({
//                             ...variantForm,
//                             nama_variant: e.target.value
//                           })
//                         }
//                       />
//                       <input
//                         placeholder="Harga"
//                         type="number"
//                         onChange={(e) =>
//                           setVariantForm({
//                             ...variantForm,
//                             harga: e.target.value
//                           })
//                         }
//                       />
//                       <input
//                         placeholder="Stok"
//                         type="number"
//                         onChange={(e) =>
//                           setVariantForm({
//                             ...variantForm,
//                             stok: e.target.value
//                           })
//                         }
//                       />

//                       <button
//                         onClick={() => createVariant(p.id)}
//                         className="bg-blue-500 text-white px-2"
//                       >
//                         +
//                       </button>
//                     </div>

//                     {(variants[p.id] || []).map(v => (
//                       <div key={v.id} className="flex justify-between border-b py-1">
//                         <span>{v.nama_variant} | Rp {v.harga} | stok {v.stok}</span>
//                         <button
//                           onClick={() => deleteVariant(v.id, p.id)}
//                           className="text-red-500"
//                         >
//                           Hapus
//                         </button>
//                       </div>
//                     ))}

//                   </div>

//                 </td>
//               </tr>
//             )}

//           </React.Fragment>
//         ))}
//       </tbody>
//     </table>

//   </Card>

// </div>


// );
// }
