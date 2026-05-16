import React, { useEffect } from "react";
import axios from "../../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

useEffect(() => {
  loadSnap();
  createPayment();
}, []);

  const loadSnap = () => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.REACT_APP_MIDTRANS_CLIENT_KEY
    );
    script.async = true;

    document.body.appendChild(script);
  };

const createPayment = async () => {
  try {
    const res = await axios.post(`/payment/create/${orderId}`);

    if (!res.data.token) {
      alert("Token tidak ditemukan");
      return;
    }
    

    window.snap.pay(res.data.token, {
      onSuccess: function () {
        alert("Pembayaran berhasil");
        navigate("/admin/orders");
      },
      onPending: function () {
        alert("Menunggu pembayaran");
      },
      onError: function () {
        alert("Pembayaran gagal");
      }
    });

  } catch (err) {
    console.error("ERROR PAYMENT:", err.response?.data || err.message);
    alert("Gagal memulai pembayaran");
  }
};

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Menunggu Pembayaran...</h2>
      <p>Silakan scan QRIS</p>
    </div>
  );
}
