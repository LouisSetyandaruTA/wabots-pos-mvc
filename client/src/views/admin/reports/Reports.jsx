import React, { useEffect, useState, useRef } from "react";
import axios from "../../../utils/axiosInstance";

import SummaryCards from "./components/SummaryCards";
import SalesChart from "./components/SalesChart";
import TopProducts from "./components/TopProducts";
import Filter from "./components/Filter";
import TransactionTable from "./components/TransactionTable";
import { exportReportPDF } from "../../../utils/exportReportPDF";
import OngoingOrders from "./components/OngoingOrders";
import { exportReportExcel } from "../../../utils/exportReportExcel";

export default function Reports() {
    const reportRef = useRef();
    const [data, setData] = useState(null);
const [error, setError] = useState("");
    const [filter, setFilter] = useState({
        startDate: "",
        endDate: "",
        groupBy: "day"
    });

 const fetchData = async (params) => {

  try {

    setError("");

    const res = await axios.get(
      "/reports",
      { params }
    );

    console.log(res.data);

    setData(res.data);

  } catch (err) {

    console.error(err);

    setError(
      err.response?.data?.message ||
      "Gagal mengambil report"
    );
  }
};

    useEffect(() => {
        const today = new Date();
        const last30Days = new Date();
        last30Days.setDate(today.getDate() - 30);


        const defaultFilter = {
            startDate: last30Days.toISOString().split("T")[0],
            endDate: today.toISOString().split("T")[0],
            groupBy: "day"
        };

        setFilter(defaultFilter);
        fetchData(defaultFilter);
    }, []);

    if (error) {

  return (
    <div className="p-6 text-red-500">
      {error}
    </div>
  );
}

    if (!data) return <div>Loading...</div>;

    const safeData = data || {
    summary: {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0
    },
    trends: [],
    topProducts: [],
    transactions: [],
    ongoingOrders: []
};


    const isEmpty =
        safeData.summary.totalOrders === 0 &&
        safeData.trends.length === 0 &&
        safeData.topProducts.length === 0;

    return (

        <div className="p-6" ref={reportRef}>

            <Filter onFilterChange={(f) => {
                setFilter(f);
                fetchData(f);
            }} />
            {
  safeData.transactions.length === 0 && (
    <div className="bg-yellow-50 text-yellow-700 p-3 rounded mb-4">
      Belum ada transaksi completed pada rentang tanggal ini.
    </div>
  )
}
            <button
                onClick={() => exportReportPDF(data, filter)}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
                Export PDF
            </button>

            <SummaryCards data={safeData.summary} />

            <SalesChart data={safeData.trends} />

            <TopProducts data={safeData.topProducts} />

            <TransactionTable data={safeData.transactions} />

            <OngoingOrders data={safeData.ongoingOrders} />

        </div>

    );
}