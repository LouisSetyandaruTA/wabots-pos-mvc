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
        params: { search, status },
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
      const res = await axios.post(`/orders/${id}/pay`);

      alert("Pembayaran berhasil dikirim ke WhatsApp customer");

      fetchOrders();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Gagal mengirim pembayaran");
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(`/orders/${id}/reject`);

      alert("Pesanan ditolak");

      fetchOrders();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Gagal menolak order");
    }
  };

  const sendOrder = async (id) => {
    try {
      await axios.put(`/orders/send/${id}`);

      alert("Pesanan sedang dikirim");

      fetchOrders();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Gagal mengirim pesanan");
    }
  };

  const completeOrder = async (id) => {
    try {
      await axios.put(`/orders/${id}/complete`);

      alert("Order selesai");

      fetchOrders();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Gagal menyelesaikan order");
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
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Cari order / customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border p-2"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded border p-2"
        >
          <option value="">Semua</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      <h2 className="mb-4 text-xl font-bold">Order Management</h2>

      <div className="rounded-xl bg-white p-4 shadow">
        <table className="w-full text-left text-sm">
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
                      <div className="text-sm text-gray-500">
                        {order.customer?.phoneNumber || "-"}
                      </div>
                    </div>
                  </td>
                  <td>Rp {order.totalPrice}</td>

                  <td>
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        order.status === "pending"
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
                    {/* ======================
                    PENDING
                    ====================== */}

                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => approve(order.id)}
                          className="rounded bg-blue-500 px-3 py-1 text-xs text-white"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => reject(order.id)}
                          className="rounded bg-red-500 px-3 py-1 text-xs text-white"
                        >
                          Tidak Approve
                        </button>
                      </>
                    )}

                    {/* ======================
                    APPROVED
                    ====================== */}

                    {order.status === "approved" && (
                      <>
                        <button
                          onClick={() => pay(order.id)}
                          className="rounded bg-green-500 px-3 py-1 text-xs text-white"
                        >
                          Bayar
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm("Batalkan pesanan ini?")) {
                              reject(order.id);
                            }
                          }}
                          className="rounded bg-red-500 px-3 py-1 text-xs text-white"
                        >
                          Batalkan
                        </button>
                      </>
                    )}

                    {/* ======================
                    PICKUP
                    ====================== */}

                    {order.status === "paid" &&
                      order.deliveryMethod === "pickup" &&
                      order.fulfillmentStatus === "ready_pickup" && (
                        <button
                          onClick={() => completeOrder(order.id)}
                          className="rounded bg-green-500 px-3 py-1 text-xs text-white"
                        >
                          Sudah Diambil
                        </button>
                      )}

                    {/* ====================== 
                    DELIVERY STEP 1 
                    ====================== */}

                    {order.status === "paid" &&
                      order.deliveryMethod === "delivery" &&
                      order.fulfillmentStatus === "delivery" && (
                        <button
                          onClick={() => sendOrder(order.id)}
                          className="rounded bg-orange-500 px-3 py-1 text-xs text-white"
                        >
                          Kirim Pesanan
                        </button>
                      )}

                    {/* ======================
                    DELIVERY STEP 2
                    ====================== */}

                    {order.status === "paid" &&
                      order.deliveryMethod === "delivery" &&
                      order.fulfillmentStatus === "shipping" && (
                        <button
                          onClick={() => completeOrder(order.id)}
                          className="rounded bg-blue-500 px-3 py-1 text-xs text-white"
                        >
                          Sudah Sampai
                        </button>
                      )}

                    {order.fulfillmentStatus === "completed" && (
                      <span className="text-xsfont-semiboldtext-green-600">
                        ✔ Selesai
                      </span>
                    )}
                  </td>

                  <td>
                    <span className="text-xs font-semibold">
                      {order.fulfillmentStatus === "waiting_choice" &&
                        "Menunggu Pilihan"}

                      {order.fulfillmentStatus === "waiting_address" &&
                        "Menunggu Alamat"}

                      {order.fulfillmentStatus === "delivery" &&
                        "Menunggu Dikirim"}

                      {order.fulfillmentStatus === "ready_pickup" &&
                        "Siap Diambil"}

                      {order.fulfillmentStatus === "shipping" &&
                        "Sedang Dikirim"}

                      {order.fulfillmentStatus === "completed" && "Selesai"}
                    </span>

                    {order.deliveryMethod && (
                      <div>
                        <div
                          className="
text-xs
text-gray-500
"
                        >
                          {order.deliveryMethod}
                        </div>

                        {order.deliveryMethod === "delivery" &&
                          order.deliveryAddress && (
                            <div
                              className="
mt-1
text-xs
text-blue-600
"
                            >
                              📍
                              {order.deliveryAddress}
                            </div>
                          )}
                      </div>
                    )}
                  </td>
                </tr>

                {/* DETAIL */}
                <tr className="bg-gray-50">
                  <td colSpan="7" className="p-2">
                    {order.items?.length > 0 ? (
                      order.items.map((item) => (
                        <div key={item.id} className="border-b py-1 text-xs">
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
                            Harga: Rp {item.unitPrice}
                          </div>

                          <div className="font-semibold text-gray-700">
                            Subtotal: Rp {item.subtotal}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">
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
