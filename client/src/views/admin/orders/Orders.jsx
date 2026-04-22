import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  const approve = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/approve`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(JSON.stringify(err?.response?.data || err.message));
    }
  };

  // const pay = async (id) => {
  //   try {
  //     await axios.put(`http://localhost:5000/api/orders/${id}/payment`);
  //     fetchOrders();
  //   } catch (err) {
  //     console.error(err);
  //    alert(JSON.stringify(err?.response?.data || err.message));
  //   }
  // };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("id-ID");
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
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
                        // onClick={() => pay(order.id)}
                        onClick={() => navigate(`/admin/payment/${order.id}`)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Bayar
                      </button>
                    )}

                    {order.status === "paid" && (
                      <span className="text-green-600 font-semibold text-xs">
                        ✔ Selesai
                      </span>
                    )}
                  </td>
                </tr>

                {/* DETAIL */}
                <tr className="bg-gray-50">
                  <td colSpan="5" className="p-2">
                    {order.items?.length > 0 ? (
                      order.items.map((item) => (
                        <div key={item.id} className="text-xs">
                          • {item.variant?.nama_variant} | qty: {item.quantity} | Rp {item.unitPrice}
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