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

  // useEffect(() => {
  // if (!orderId) return;

  // tunggu 5 detik seolah user bayar
//   const timer = setTimeout(async () => {
//     try {
//       await axios.post("/payment/webhook", {
//         order_id: orderId,
//         transaction_status: "settlement"
//       });

//       alert("Pembayaran berhasil (simulasi)");

//       // redirect atau refresh
//       window.location.href = "/admin/orders";

//     } catch (err) {
//       console.error(err);
//     }
//   }, 5000);

//   return () => clearTimeout(timer);
// }, [orderId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Menunggu Pembayaran...</h2>
      <p>Silakan scan QRIS</p>
    </div>
  );
}

// import React, { useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// export default function PaymentPage() {
//   const { orderId } = useParams();

//   useEffect(() => {
//     loadSnap();
//     createPayment();
//   }, []);

//   const loadSnap = () => {
//     const script = document.createElement("script");
//     script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
//     script.setAttribute("data-client-key", process.env.REACT_APP_MIDTRANS_CLIENT_KEY);
//     script.async = true;

//     document.body.appendChild(script);
//   };

//   const createPayment = async () => {
//     const res = await axios.post(
//       `http://localhost:5000/api/payment/create/${orderId}`
//     );

//     window.snap.pay(res.data.token, {
//       onSuccess: function () {
//         alert("Pembayaran berhasil");
//       },
//       onPending: function () {
//         alert("Menunggu pembayaran");
//       },
//       onError: function () {
//         alert("Pembayaran gagal");
//       }
//     });
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold">Payment QRIS</h2>
//     </div>
//   );
// }