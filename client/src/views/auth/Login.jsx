import React, { useState } from "react";
import axios from "utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const res = await axios.post("/auth/login", {
      username,
      password,
    });

    localStorage.setItem("token", res.data.token);

    window.dispatchEvent(new Event("userChanged"));

    navigate("/admin/dashboard");

    console.log("LOGIN SUCCESS:", res.data);

  } catch (err) {
    alert(err?.response?.data?.message || "Login gagal");
  }
};

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-navy-800">
      
      {/* HEADER */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white">
          Wabots POS
        </h1>
        <p className="text-sm text-gray-500">
          Selamat datang di sistem Point of Sales berbasis AI
        </p>
      </div>

      {/* FORM */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Username</label>
          <input
            type="text"
            placeholder="Masukkan username"
            className="mt-1 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            className="mt-1 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>

    </div>
  );
}

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "utils/axiosInstance";

// export default function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     username: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("/auth/login", form);

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       navigate("/admin/dashboard");

//     } catch (err) {
//       alert("Login gagal");
//     }
//   };

//   return (
//     <div className="flex h-screen w-full items-center justify-center bg-lightPrimary dark:bg-navy-900">

//       <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-navy-800">

//         <h2 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
//           Login
//         </h2>

//         <p className="mb-6 text-gray-500">
//           Masuk ke sistem POS kamu
//         </p>

//         <form onSubmit={handleLogin}>

//           {/* USERNAME */}
//           <div className="mb-4">
//             <label className="text-sm text-gray-600 dark:text-white">
//               Username
//             </label>
//             <input
//               type="text"
//               name="username"
//               onChange={handleChange}
//               className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
//               placeholder="Masukkan username"
//               required
//             />
//           </div>

//           {/* PASSWORD */}
//           <div className="mb-6">
//             <label className="text-sm text-gray-600 dark:text-white">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               onChange={handleChange}
//               className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
//               placeholder="Masukkan password"
//               required
//             />
//           </div>

//           {/* BUTTON */}
//           <button
//             type="submit"
//             className="w-full rounded-lg bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600"
//           >
//             Login
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }