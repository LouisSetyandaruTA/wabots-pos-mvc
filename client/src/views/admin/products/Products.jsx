import Card from "components/card";
import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosInstance";

export default function Products() {

  // =========================
  // STATE
  // =========================
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [openedProduct, setOpenedProduct] =
    useState(null);

  const [customCategory, setCustomCategory] =
    useState("");

  const [editProduct, setEditProduct] =
    useState(null);

  const [editVariant, setEditVariant] =
    useState(null);

  // =========================
  // PRODUCT FORM
  // =========================
  const [productForm, setProductForm] =
    useState({
      nama: "",
      categoryId: "",
      satuan: "",
      keterangan: "",
      harga: "",
      stok: "",
      berat: ""
    });

  // =========================
  // VARIANT FORM
  // =========================
  const [variantForm, setVariantForm] =
    useState({
      productId: "",
      nama_variant: "",
      harga: "",
      stok: "",
      berat: ""
    });

  // =========================
  // OPTIONS
  // =========================
  const satuanOptions = [
    "pcs",
    "cup",
    "botol",
    "liter",
    "kg",
    "gram"
  ];

  // =========================
  // FETCH
  // =========================
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        "/products"
      );

      setProducts(res.data);

    } catch (err) {

      console.error(err);
    }
  };

  const fetchCategories = async () => {

    try {

      const res = await axios.get(
        "/categories"
      );

      setCategories(res.data);

    } catch (err) {

      console.error(err);
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filteredProducts =
    products.filter(product => {

      const keyword =
        search.toLowerCase();

      const productMatch =
        product.nama
          .toLowerCase()
          .includes(keyword);

      const variantMatch =
        (product.variants || []).some(v =>
          v.nama_variant
            .toLowerCase()
            .includes(keyword)
        );

      return (
        productMatch ||
        variantMatch
      );
    });

  // =========================
  // CREATE CATEGORY
  // =========================
  const handleCreateCategory =
    async () => {

      if (!customCategory) return;

      try {

        const res = await axios.post(
          "/categories",
          {
            name: customCategory
          }
        );

        setCategories([
          ...categories,
          res.data
        ]);

        setProductForm({
          ...productForm,
          categoryId: res.data.id
        });

        setCustomCategory("");

      } catch (err) {

        alert("Gagal tambah kategori");
      }
    };

  // =========================
  // CREATE PRODUCT
  // =========================
  const createProduct = async () => {

    try {

      await axios.post(
        "/products",
        productForm
      );

      setProductForm({
        nama: "",
        categoryId: "",
        satuan: "",
        keterangan: "",
        harga: "",
        stok: "",
        berat: ""
      });

      fetchProducts();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Gagal tambah product"
      );
    }
  };

  // =========================
  // CREATE VARIANT
  // =========================
  const createVariant = async () => {

    try {

      await axios.post(
        "/variants",
        variantForm
      );

      setVariantForm({
        productId: "",
        nama_variant: "",
        harga: "",
        stok: "",
        berat: ""
      });

      fetchProducts();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Gagal tambah variant"
      );
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {

    if (
      !window.confirm(
        "Nonaktifkan product?"
      )
    ) return;

    await axios.delete(
      `/products/${id}`
    );

    fetchProducts();
  };

  // =========================
  // DELETE VARIANT
  // =========================
  const deleteVariant = async (id) => {

    if (
      !window.confirm(
        "Nonaktifkan variant?"
      )
    ) return;

    await axios.delete(
      `/variants/${id}`
    );

    fetchProducts();
  };

  // =========================
  // EDIT PRODUCT
  // =========================
  const handleEditProduct = (
    product
  ) => {

    setEditProduct({
      productId: product.id,
      nama: product.nama,
      categoryId: product.categoryId,
      satuan: product.satuan,
      keterangan:
        product.keterangan || ""
    });
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const updateProduct = async () => {

    try {

      await axios.put(
        `/products/${editProduct.productId}`,
        {
          nama: editProduct.nama,
          categoryId:
            editProduct.categoryId,
          satuan:
            editProduct.satuan,
          keterangan:
            editProduct.keterangan
        }
      );

      setEditProduct(null);

      fetchProducts();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Gagal update product"
      );
    }
  };

  // =========================
  // UPDATE VARIANT
  // =========================
  const updateVariant = async () => {

    try {

      await axios.put(
        `/variants/${editVariant.id}`,
        {
          nama_variant:
            editVariant.nama_variant,
          harga:
            editVariant.harga,
          stok:
            editVariant.stok,
          berat:
            editVariant.berat
        }
      );

      setEditVariant(null);

      fetchProducts();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Gagal update variant"
      );
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-5 p-6">
      {/* ========================= */}
      {/* CREATE PRODUCT */}
      {/* ========================= */}
      <Card extra="p-5">
        <h2 className="mb-4 text-lg font-bold">Tambah Product</h2>

        <div className="grid grid-cols-3 gap-3">
          <input
            placeholder="Nama Product"
            value={productForm.nama}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                nama: e.target.value,
              })
            }
            className="rounded border p-2"
          />

          <div className="flex gap-2">
            <select
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  categoryId: e.target.value,
                })
              }
              className="w-full rounded border p-2"
            >
              <option value="">Pilih Kategori</option>

              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Tambah"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="rounded border p-2"
            />

            <button
              onClick={handleCreateCategory}
              className="rounded bg-green-500 px-3 text-white"
            >
              +
            </button>
          </div>

          <select
            value={productForm.satuan}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                satuan: e.target.value,
              })
            }
            className="rounded border p-2"
          >
            <option value="">Pilih Satuan</option>

            {satuanOptions.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Harga Default"
            onChange={(e) =>
              setProductForm({
                ...productForm,
                harga: e.target.value,
              })
            }
            className="rounded border p-2"
          />

          <input
            type="number"
            placeholder="Stok Default"
            onChange={(e) =>
              setProductForm({
                ...productForm,
                stok: e.target.value,
              })
            }
            className="rounded border p-2"
          />

          <input
            type="number"
            placeholder="Berat Variant"
            onChange={(e) =>
              setProductForm({
                ...productForm,
                berat: e.target.value,
              })
            }
            className="rounded border p-2"
          />

          <textarea
            placeholder="Keterangan Product"
            value={productForm.keterangan}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                keterangan: e.target.value,
              })
            }
            className="col-span-3 rounded border p-2"
          />
        </div>

        <button
          onClick={createProduct}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Tambah Product
        </button>
      </Card>

      {/* ========================= */}
      {/* CREATE VARIANT */}
      {/* ========================= */}
      <Card extra="p-5">
        <h2 className="mb-3 font-bold">Tambah Variant</h2>

        <div className="grid grid-cols-5 gap-2">
          <select
            value={variantForm.productId}
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                productId: e.target.value,
              })
            }
            className="rounded border p-2"
          >
            <option value="">Pilih Product</option>

            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
              </option>
            ))}
          </select>

          <input
            placeholder="Nama Variant"
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                nama_variant: e.target.value,
              })
            }
            className="rounded border p-2"
          />

          <input
            type="number"
            placeholder="Harga"
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                harga: e.target.value,
              })
            }
            className="rounded border p-2"
          />

          <input
            type="number"
            placeholder="Stok"
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                stok: e.target.value,
              })
            }
            className="rounded border p-2"
          />

          <input
            type="number"
            placeholder="Berat"
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                berat: e.target.value,
              })
            }
            className="rounded border p-2"
          />
        </div>

        <button
          onClick={createVariant}
          className="mt-3 rounded bg-green-500 px-4 py-2 text-white"
        >
          Tambah Variant
        </button>
      </Card>

      {/* ========================= */}
      {/* SEARCH */}
      {/* ========================= */}
      <input
        placeholder="Search product / variant..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded border p-2"
      />

      {/* ========================= */}
      {/* PRODUCTS */}
      {/* ========================= */}
      <Card extra="p-5">
        <h2 className="mb-4 text-lg font-bold">Daftar Product</h2>

        {filteredProducts.map((product) => (
          <div key={product.id} className="mb-4 rounded-xl border p-4">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-bold">{product.nama}</h2>

                <p>Kategori: {product.Category?.name}</p>

                <p>Satuan: {product.satuan}</p>

                <p>Keterangan: {product.keterangan || "-"}</p>

                <p>
                  Total Stok:
                  {(product.variants || [])

                    .filter((v) => v.status === "active")

                    .reduce(
                      (sum, v) => sum + Number(v.stok),

                      0
                    )}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="h-fit rounded bg-blue-500 px-3 py-1 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="h-fit rounded bg-red-500 px-3 py-1 text-white"
                >
                  Nonaktifkan
                </button>

                <button
                  onClick={() =>
                    setOpenedProduct(
                      openedProduct === product.id ? null : product.id
                    )
                  }
                  className="h-fit rounded bg-gray-200 px-3 py-1"
                >
                  {openedProduct === product.id ? "Tutup" : "Detail"}
                </button>
              </div>
            </div>

            {/* VARIANTS */}
            {openedProduct === product.id && (
              <div className="mt-4 border-t pt-4">
                {(product.variants || [])

                  .filter((v) => v.status === "active")

                  .map((v) => (
                    <div key={v.id} className="mb-3 rounded border p-3">
                      <h3 className="font-bold">#{v.nama_variant}</h3>

                      <p>Berat: {v.berat} gr</p>

                      <p>Harga: Rp {v.harga}</p>

                      <p>Stok: {v.stok}</p>

                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => setEditVariant(v)}
                          className="rounded bg-yellow-400 px-3 py-1"
                        >
                          Edit Variant
                        </button>

                        <button
                          onClick={() => deleteVariant(v.id)}
                          className="rounded bg-red-500 px-3 py-1 text-white"
                        >
                          Nonaktifkan
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </Card>

      {/* ========================= */}
      {/* EDIT PRODUCT */}
      {/* ========================= */}
      {editProduct && (
        <Card extra="p-5">
          <h2 className="mb-4 text-lg font-bold">Edit Product</h2>

          <div className="grid grid-cols-2 gap-3">
            <input
              value={editProduct.nama}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  nama: e.target.value,
                })
              }
              className="rounded border p-2"
            />

            <select
              value={editProduct.categoryId}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  categoryId: e.target.value,
                })
              }
              className="rounded border p-2"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={editProduct.satuan}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  satuan: e.target.value,
                })
              }
              className="rounded border p-2"
            >
              {satuanOptions.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <textarea
              value={editProduct.keterangan}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  keterangan: e.target.value,
                })
              }
              className="col-span-2 rounded border p-2"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={updateProduct}
              className="rounded bg-green-500 px-4 py-2 text-white"
            >
              Save
            </button>

            <button
              onClick={() => setEditProduct(null)}
              className="rounded bg-gray-400 px-4 py-2 text-white"
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* ========================= */}
      {/* EDIT VARIANT */}
      {/* ========================= */}
      {editVariant && (
        <Card extra="p-5">
          <h2 className="mb-4 text-lg font-bold">Edit Variant</h2>

          <div className="grid grid-cols-2 gap-3">
            <input
              value={editVariant.nama_variant}
              onChange={(e) =>
                setEditVariant({
                  ...editVariant,
                  nama_variant: e.target.value,
                })
              }
              className="rounded border p-2"
            />

            <input
              type="number"
              value={editVariant.harga}
              onChange={(e) =>
                setEditVariant({
                  ...editVariant,
                  harga: e.target.value,
                })
              }
              className="rounded border p-2"
            />

            <input
              type="number"
              value={editVariant.stok}
              onChange={(e) =>
                setEditVariant({
                  ...editVariant,
                  stok: e.target.value,
                })
              }
              className="rounded border p-2"
            />

            <input
              type="number"
              value={editVariant.berat}
              onChange={(e) =>
                setEditVariant({
                  ...editVariant,
                  berat: e.target.value,
                })
              }
              className="rounded border p-2"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={updateVariant}
              className="rounded bg-green-500 px-4 py-2 text-white"
            >
              Save
            </button>

            <button
              onClick={() => setEditVariant(null)}
              className="rounded bg-gray-400 px-4 py-2 text-white"
            >
              Cancel
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
