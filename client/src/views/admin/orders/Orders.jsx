import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosInstance";
import { useLocation } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders", {
        params: { search, status }
      });
      setOrders(res.data.data);
    } catch (err) {
      console.error("ORDERS ERROR:", err.response?.data || err.message);
    }
  };
  const approve = async (id) => {
    try {
      await axios.put(`/orders/${id}/approve`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(JSON.stringify(err?.response?.data || err.message));
    }
  };
  const pay = async (id) => {

    try {

      const res = await axios.post(
        `/orders/${id}/pay`
      );

      alert(
        "Pembayaran berhasil dikirim ke WhatsApp customer"
      );

      fetchOrders();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Gagal mengirim pembayaran"
      );
    }
  };

  const completeOrder = async (id) => {

  try {

    await axios.put(
      `/orders/${id}/complete`
    );

    alert("Order selesai");

    fetchOrders();

  } catch (err) {

    console.error(err);

    alert(
      err.response?.data?.message ||
      "Gagal menyelesaikan order"
    );
  }
};

  const formatDate = (date) => {
    return new Date(date).toLocaleString("id-ID");
  };


  useEffect(() => {
    const delay = setTimeout(() => {
      fetchOrders();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, status]);
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus order?")) return;

    try {
      await axios.delete(`/orders/${id}`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal hapus");
    }
  };

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location.search]);

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari order / customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Semua</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      <select onChange={(e) => setStatus(e.target.value)}>
        <option value="">Semua</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="paid">Paid</option>
      </select>
      <h2 className="text-xl font-bold mb-4">Order Management</h2>

      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full text-sm text-left">

          <thead className="border-b">
            <tr>
              <th className="py-2">ID</th>
              <th>Waktu</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Aksi</th>
              <th>Fulfillment</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>

                {/* ROW UTAMA */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2">{order.id.slice(0, 8)}...</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <div>
                      <div className="font-semibold">
                        {order.customer?.name || "-"}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {order.customer?.phoneNumber || "-"}
                      </div>
                    </div>
                  </td>
                  <td>Rp {order.totalPrice}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "approved"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="space-x-2">
                    {["pending", "cancelled"].includes(order.status) && (
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Hapus
                      </button>
                    )}

                    {order.status === "pending" && (
                      <button
                        onClick={() => approve(order.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Approve
                      </button>
                    )}

                    {order.status === "approved" && (
                      <button
                        onClick={() => pay(order.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Bayar
                      </button>
                    )}

                   {order.status === "paid" &&
 order.fulfillmentStatus ===
  "ready_pickup" && (

                       <button
  onClick={() =>
    completeOrder(order.id)
  }
  className="bg-green-500 text-white px-3 py-1 rounded text-xs"
>
  Sudah Diambil
</button>
                      )}

                   {order.status === "paid" &&
 order.fulfillmentStatus ===
  "on_delivery" && (

                     <button
  onClick={() =>
    completeOrder(order.id)
  }
  className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
>
  Sudah Sampai
</button>
                      )}

                    {order.fulfillmentStatus ===
                      "completed" && (
                        <span className="text-green-600 font-semibold text-xs">
                          ✔ Selesai
                        </span>
                      )}
                  </td>
                  <td>
                    <span className="text-xs font-semibold">

                      {order.fulfillmentStatus ===
                        "waiting_choice" &&
                        "Menunggu Pilihan"}

                      {order.fulfillmentStatus ===
                        "waiting_address" &&
                        "Menunggu Alamat"}

                      {order.fulfillmentStatus ===
                        "ready_pickup" &&
                        "Siap Diambil"}

                      {order.fulfillmentStatus ===
                        "on_delivery" &&
                        "Sedang Dikirim"}

                      {order.fulfillmentStatus ===
                        "completed" &&
                        "Selesai"}

                    </span>

                    {order.deliveryMethod && (
                      <div className="text-xs text-gray-500">
                        {order.deliveryMethod}
                      </div>
                    )}
                  </td>
                </tr>

                {/* DETAIL */}
                <tr className="bg-gray-50">
                  <td colSpan="7" className="p-2">
                    {order.items?.length > 0 ? (
                      order.items.map((item) => (
                        <div
                          key={item.id}
                          className="text-xs border-b py-1"
                        >

                          <div className="font-semibold">
                            {item.variant?.product?.nama || "-"}
                          </div>

                          <div className="text-gray-600">
                            Variant:
                            {item.variant?.nama_variant || "-"}
                          </div>

                          <div className="text-gray-600">
                            Qty:
                            {item.quantity}
                          </div>

                          <div className="text-gray-600">
                            Harga:
                            Rp {item.unitPrice}
                          </div>

                          <div className="text-gray-700 font-semibold">
                            Subtotal:
                            Rp {item.subtotal}
                          </div>

                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Tidak ada item
                      </span>
                    )}
                  </td>
                </tr>

              </React.Fragment>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}