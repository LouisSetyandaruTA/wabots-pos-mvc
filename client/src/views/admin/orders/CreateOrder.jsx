import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosInstance";

export default function CreateOrder() {
  const [customers, setCustomers] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [qty, setQty] = useState(1);

  // 🔥 FETCH DATA
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    const res = await axios.get("/customers");
    setCustomers(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get("/products");

    // flatten variants
    const allVariants = [];
    res.data.forEach((p) => {
      (p.variants || []).forEach((v) => {
        allVariants.push({
          ...v,
          productName: p.nama
        });
      });
    });

    setVariants(allVariants);
  };

  // 🔥 ADD TO CART
  const addToCart = () => {
    if (!selectedVariant || qty <= 0) return;

    const variant = variants.find(v => v.id == selectedVariant);

    setCart([
      ...cart,
      {
        variantId: variant.id,
        name: `${variant.productName} - ${variant.nama_variant}`,
        price: variant.harga,
        quantity: qty
      }
    ]);
  };

  // 🔥 SUBMIT ORDER
  const submitOrder = async () => {
    try {
      await axios.post("/orders", {
        customerId: selectedCustomer,
        items: cart.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        }))
      });

      alert("Order berhasil dibuat");
      setCart([]);
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal create order");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create Order</h2>

      <div className="bg-white p-4 rounded-xl shadow space-y-4">

        {/* CUSTOMER */}
        <div>
          <label>Customer</label>
          <select
            className="w-full border p-2 rounded"
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">Pilih Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* VARIANT */}
        <div>
          <label>Produk Variant</label>
          <select
            className="w-full border p-2 rounded"
            onChange={(e) => setSelectedVariant(e.target.value)}
          >
            <option value="">Pilih Produk</option>
            {variants.map(v => (
              <option key={v.id} value={v.id}>
                {v.productName} - {v.nama_variant} (stok: {v.stok})
              </option>
            ))}
          </select>
        </div>

        {/* QTY */}
        <div>
          <label>Quantity</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </div>

        {/* ADD */}
        <button
          onClick={addToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tambah ke Cart
        </button>

        {/* CART */}
        <div className="border p-3 rounded">
          <h3 className="font-bold mb-2">Cart</h3>

          {cart.map((item, index) => (
            <div key={index}>
              {item.name} | qty: {item.quantity}
            </div>
          ))}
        </div>

        {/* SUBMIT */}
        <button
          onClick={submitOrder}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Buat Order
        </button>

      </div>
    </div>
  );
}