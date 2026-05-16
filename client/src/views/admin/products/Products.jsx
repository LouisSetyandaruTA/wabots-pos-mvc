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
    <div className="p-6 space-y-5">

      {/* ========================= */}
      {/* CREATE PRODUCT */}
      {/* ========================= */}
      <Card extra="p-5">

        <h2 className="font-bold text-lg mb-4">
          Tambah Product
        </h2>

        <div className="grid grid-cols-3 gap-3">

          <input
            placeholder="Nama Product"
            value={productForm.nama}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                nama: e.target.value
              })
            }
            className="border p-2 rounded"
          />

          <div className="flex gap-2">

            <select
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  categoryId:
                    e.target.value
                })
              }
              className="border p-2 rounded w-full"
            >
              <option value="">
                Pilih Kategori
              </option>

              {categories.map(c => (
                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Tambah"
              value={customCategory}
              onChange={(e) =>
                setCustomCategory(
                  e.target.value
                )
              }
              className="border p-2 rounded"
            />

            <button
              onClick={
                handleCreateCategory
              }
              className="bg-green-500 text-white px-3 rounded"
            >
              +
            </button>

          </div>

          <select
            value={productForm.satuan}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                satuan:
                  e.target.value
              })
            }
            className="border p-2 rounded"
          >
            <option value="">
              Pilih Satuan
            </option>

            {satuanOptions.map(
              (s, i) => (
                <option
                  key={i}
                  value={s}
                >
                  {s}
                </option>
              )
            )}
          </select>

          <input
            type="number"
            placeholder="Harga Default"
            onChange={(e) =>
              setProductForm({
                ...productForm,
                harga:
                  e.target.value
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Stok Default"
            onChange={(e) =>
              setProductForm({
                ...productForm,
                stok:
                  e.target.value
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Berat Variant"
            onChange={(e) =>
              setProductForm({
                ...productForm,
                berat:
                  e.target.value
              })
            }
            className="border p-2 rounded"
          />

          <textarea
            placeholder="Keterangan Product"
            value={
              productForm.keterangan
            }
            onChange={(e) =>
              setProductForm({
                ...productForm,
                keterangan:
                  e.target.value
              })
            }
            className="border p-2 rounded col-span-3"
          />

        </div>

        <button
          onClick={createProduct}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tambah Product
        </button>

      </Card>

      {/* ========================= */}
      {/* CREATE VARIANT */}
      {/* ========================= */}
      <Card extra="p-5">

        <h2 className="font-bold mb-3">
          Tambah Variant
        </h2>

        <div className="grid grid-cols-5 gap-2">

          <select
            value={variantForm.productId}
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                productId:
                  e.target.value
              })
            }
            className="border p-2 rounded"
          >
            <option value="">
              Pilih Product
            </option>

            {products.map(p => (
              <option
                key={p.id}
                value={p.id}
              >
                {p.nama}
              </option>
            ))}
          </select>

          <input
            placeholder="Nama Variant"
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                nama_variant:
                  e.target.value
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Harga"
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                harga:
                  e.target.value
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Stok"
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                stok:
                  e.target.value
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Berat"
            onChange={(e) =>
              setVariantForm({
                ...variantForm,
                berat:
                  e.target.value
              })
            }
            className="border p-2 rounded"
          />

        </div>

        <button
          onClick={createVariant}
          className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
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
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="border p-2 rounded w-full"
      />

      {/* ========================= */}
      {/* PRODUCTS */}
      {/* ========================= */}
      <Card extra="p-5">

        <h2 className="font-bold text-lg mb-4">
          Daftar Product
        </h2>

        {filteredProducts.map(product => (

          <div
            key={product.id}
            className="border rounded-xl p-4 mb-4"
          >

            <div className="flex justify-between">

              <div>

                <h2 className="font-bold text-lg">
                  {product.nama}
                </h2>

                <p>
                  Kategori:
                  {" "}
                  {product.Category?.name}
                </p>

                <p>
                  Satuan:
                  {" "}
                  {product.satuan}
                </p>

                <p>
                  Keterangan:
                  {" "}
                  {
                    product.keterangan ||
                    "-"
                  }
                </p>

                <p>
                  Total Stok:
                  {" "}
                  {
                    (product.variants || [])
                      .reduce(
                        (sum, v) =>
                          sum + v.stok,
                        0
                      )
                  }
                </p>

              </div>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    handleEditProduct(
                      product
                    )
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded h-fit"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteProduct(
                      product.id
                    )
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded h-fit"
                >
                  Nonaktifkan
                </button>

                <button
                  onClick={() =>
                    setOpenedProduct(
                      openedProduct ===
                        product.id
                        ? null
                        : product.id
                    )
                  }
                  className="bg-gray-200 px-3 py-1 rounded h-fit"
                >
                  {
                    openedProduct ===
                    product.id
                      ? "Tutup"
                      : "Detail"
                  }
                </button>

              </div>

            </div>

            {/* VARIANTS */}
            {openedProduct ===
              product.id && (

              <div className="mt-4 border-t pt-4">

                {(product.variants || [])
                  .map(v => (

                    <div
                      key={v.id}
                      className="border rounded p-3 mb-3"
                    >

                      <h3 className="font-bold">
                        #{v.nama_variant}
                      </h3>

                      <p>
                        Berat:
                        {" "}
                        {v.berat} gr
                      </p>

                      <p>
                        Harga:
                        {" "}
                        Rp {v.harga}
                      </p>

                      <p>
                        Stok:
                        {" "}
                        {v.stok}
                      </p>

                      <div className="flex gap-2 mt-2">

                        <button
                          onClick={() =>
                            setEditVariant(v)
                          }
                          className="bg-yellow-400 px-3 py-1 rounded"
                        >
                          Edit Variant
                        </button>

                        <button
                          onClick={() =>
                            deleteVariant(v.id)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded"
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

          <h2 className="font-bold text-lg mb-4">
            Edit Product
          </h2>

          <div className="grid grid-cols-2 gap-3">

            <input
              value={editProduct.nama}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  nama:
                    e.target.value
                })
              }
              className="border p-2 rounded"
            />

            <select
              value={
                editProduct.categoryId
              }
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  categoryId:
                    e.target.value
                })
              }
              className="border p-2 rounded"
            >
              {categories.map(c => (
                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={
                editProduct.satuan
              }
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  satuan:
                    e.target.value
                })
              }
              className="border p-2 rounded"
            >
              {satuanOptions.map(
                (s, i) => (
                  <option
                    key={i}
                    value={s}
                  >
                    {s}
                  </option>
                )
              )}
            </select>

            <textarea
              value={
                editProduct.keterangan
              }
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  keterangan:
                    e.target.value
                })
              }
              className="border p-2 rounded col-span-2"
            />

          </div>

          <div className="flex gap-2 mt-4">

            <button
              onClick={updateProduct}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() =>
                setEditProduct(null)
              }
              className="bg-gray-400 text-white px-4 py-2 rounded"
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

          <h2 className="font-bold text-lg mb-4">
            Edit Variant
          </h2>

          <div className="grid grid-cols-2 gap-3">

            <input
              value={
                editVariant.nama_variant
              }
              onChange={(e) =>
                setEditVariant({
                  ...editVariant,
                  nama_variant:
                    e.target.value
                })
              }
              className="border p-2 rounded"
            />

            <input
              type="number"
              value={
                editVariant.harga
              }
              onChange={(e) =>
                setEditVariant({
                  ...editVariant,
                  harga:
                    e.target.value
                })
              }
              className="border p-2 rounded"
            />

            <input
              type="number"
              value={
                editVariant.stok
              }
              onChange={(e) =>
                setEditVariant({
                  ...editVariant,
                  stok:
                    e.target.value
                })
              }
              className="border p-2 rounded"
            />

            <input
              type="number"
              value={
                editVariant.berat
              }
              onChange={(e) =>
                setEditVariant({
                  ...editVariant,
                  berat:
                    e.target.value
                })
              }
              className="border p-2 rounded"
            />

          </div>

          <div className="flex gap-2 mt-4">

            <button
              onClick={updateVariant}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() =>
                setEditVariant(null)
              }
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>

          </div>

        </Card>

      )}

    </div>
  );
}
