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
// import Payment from "views/admin/payment/:orderId";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";

const routes = [
  {
  name: "Dashboard",
  layout: "/admin",
  path: "dashboard",
  component: <Dashboard />,
},
  {
    name: "Products",
    layout: "/admin",
    path: "products",
    component: <Products />,
  },
  {
  name: "Orders",
  layout: "/admin",
  path: "orders",
  component: <Orders />,
},
{
  name: "Create Order",
  layout: "/admin",
  path: "createorder",
  component: <CreateOrder />,
},
{
  name: "Reports",
  layout: "/admin",
  path: "reports",
  component: <Reports />,
},
{
  name: "Payment",
  layout: "/admin",
  path: "payment/:orderId",
  component: <PaymentPage />,
},

  // {
  //   name: "Orders",
  //   layout: "/admin",
  //   path: "orders",
  //   component: <Orders />,
  // },
  // {
  //   name: "Main Dashboard",
  //   layout: "/admin",
  //   path: "default",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <MainDashboard />,
  // },
  // {
  //   name: "NFT Marketplace",
  //   layout: "/admin",
  //   path: "nft-marketplace",
  //   icon: <MdOutlineShoppingCart className="h-6 w-6" />,
  //   component: <NFTMarketplace />,
  //   secondary: true,
  // },
  // {
  //   name: "Data Tables",
  //   layout: "/admin",
  //   icon: <MdBarChart className="h-6 w-6" />,
  //   path: "data-tables",
  //   component: <DataTables />,
  // },
  // {
  //   name: "Profile",
  //   layout: "/admin",
  //   path: "profile",
  //   icon: <MdPerson className="h-6 w-6" />,
  //   component: <Profile />,
  // },
  // {
  //   name: "Sign In",
  //   layout: "/auth",
  //   path: "sign-in",
  //   icon: <MdLock className="h-6 w-6" />,
  //   component: <SignIn />,
  // },
  // {
  //   name: "RTL Admin",
  //   layout: "/rtl",
  //   path: "rtl",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <RTLDefault />,
  // },
];
export default routes;
