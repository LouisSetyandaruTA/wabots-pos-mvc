/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import routes from "routes.js";

import { useEffect, useState } from "react";
import { getUser } from "utils/auth";

const Sidebar = ({ open, onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const u = getUser();
      setUser(u);
    };

    // load pertama
    loadUser();

    // 🔥 listen perubahan login/logout
    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  return (
    <div
      className={`fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl transition-all dark:!bg-navy-800 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      {/* CLOSE BTN */}
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      {/* HEADER */}
      <div className="mx-6 mt-10 flex flex-col gap-1">

        {/* APP NAME */}
        <h1 className="text-2xl font-extrabold text-navy-700 dark:text-white">
          Wabots <span className="text-blue-500">POS</span>
        </h1>

        {/* DIVIDER */}
        <div className="mt-4 mb-4 h-px bg-gray-200 dark:bg-white/20" />

        {/* BUSINESS */}
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {user?.businessName || "Your Business"}
        </p>

        {/* USER */}
        <p className="text-xs text-gray-500">
          Logged in as {user?.username || "-"}
        </p>
      </div>

      {/* DIVIDER */}
      <div className="mt-5 mb-7 h-px bg-gray-300 dark:bg-white/30" />

      {/* MENU */}
      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>
    </div>
  );
};

export default Sidebar;