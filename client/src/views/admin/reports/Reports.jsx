import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import SummaryCards from "./components/SummaryCards";
import SalesChart from "./components/SalesChart";
import TopProducts from "./components/TopProducts";
import Filter from "./components/Filter";
import TransactionTable from "./components/TransactionTable";
import { exportReportPDF } from "../../../utils/exportReportPDF";

export default function Reports() {
    const reportRef = useRef();
    const [data, setData] = useState(null);
    const [filter, setFilter] = useState({
        startDate: "",
        endDate: "",
        groupBy: "day"
    });

    const fetchData = async (params) => {
        try {
            const res = await axios.get("http://localhost:5000/api/reports", { params });

            console.log("DATA:", res.data);
            setData(res.data);
        } catch (err) {
            console.error("API ERROR:", err);
        }
    };

    useEffect(() => {
        const today = new Date();
        const last7Days = new Date();
        last7Days.setDate(today.getDate() - 7);


        const defaultFilter = {
            startDate: last7Days.toISOString().split("T")[0],
            endDate: today.toISOString().split("T")[0],
            groupBy: "day"
        };

        setFilter(defaultFilter);
        fetchData(defaultFilter);
    }, []);

    if (!data) return <div>Loading...</div>;

    if (!data.summary) return <div>No data available</div>;

    const isEmpty =
        data.summary.totalOrders === 0 &&
        data.trends.length === 0 &&
        data.topProducts.length === 0;

    if (isEmpty) {
        return <div>Tidak ada data dalam rentang tanggal</div>;
    }
    return (

        <div className="p-6" ref={reportRef}>

            <Filter onFilterChange={(f) => {
                setFilter(f);
                fetchData(f);
            }} />
            <button
                onClick={() => exportReportPDF(data, filter)}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
                Export PDF
            </button>

            <SummaryCards data={data.summary} />

            <SalesChart data={data.trends} />

            <TopProducts data={data.topProducts} />

            <TransactionTable data={data.transactions} />

        </div>

    );
}