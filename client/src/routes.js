import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";

import Products from "views/admin/products/Products";
import Orders from "views/admin/orders/Orders";
import CreateOrder from "views/admin/orders/CreateOrder";
import Dashboard from "views/admin/dashboard/Dashboard";
import Reports from "views/admin/reports/Reports";
import PaymentPage from "views/admin/payment/PaymentPage";
import ProtectedRoute from "utils/ProtectedRoute";
import BusinessSettings from "views/admin/business/BusinessSettings";
import ChatDashboard from "views/admin/chat/ChatDashboard";


import PublicRoute from "utils/PublicRoute";
import Login from "views/auth/Login";
// import Payment from "views/admin/payment/:orderId";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdShoppingCart,
  MdReceipt,
  MdAddBox,
  MdBarChart,
  MdPayment,
  MdStore,
  MdChat,
} from "react-icons/md";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    name: "Products",
    layout: "/admin",
    path: "products",
    icon: <MdShoppingCart className="h-6 w-6" />,
    component: <ProtectedRoute><Products /></ProtectedRoute>,
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "orders",
    icon: <MdReceipt className="h-6 w-6" />,
    component: <ProtectedRoute><Orders /></ProtectedRoute>,
  },
  // {
  //   name: "Create Order",
  //   layout: "/admin",
  //   path: "createorder",
  //   icon: <MdAddBox className="h-6 w-6" />,
  //   component: <ProtectedRoute><CreateOrder /></ProtectedRoute>,
  // },

  {
    name: "Business",
    layout: "/admin",
    path: "business",
    icon: <MdStore className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <BusinessSettings />
      </ProtectedRoute>
    ),
  },
  // {
  //   name: "Payment",
  //   layout: "/admin",
  //   path: "payment/:orderId",
  //   icon: <MdPayment className="h-6 w-6" />,
  //   component: <ProtectedRoute><PaymentPage /></ProtectedRoute>,
  // },
  {
  name: "Chats",
  layout: "/admin",
  path: "chats",
  icon: <MdChat className="h-6 w-6" />,
  component: (
    <ProtectedRoute>
      <ChatDashboard />
    </ProtectedRoute>
  ),
},
  {
    name: "Reports",
    layout: "/admin",
    path: "reports",
    icon: <MdBarChart className="h-6 w-6" />,
    component: <ProtectedRoute><Reports /></ProtectedRoute>,
  },

];
export default routes;
