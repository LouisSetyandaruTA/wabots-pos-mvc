import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosInstance";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

import { formatRupiah } from "../../../utils/format";

export default function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);
    const formatChartData = () => {
        if (!data?.salesPerDay) return [];

        return data.salesPerDay.map(item => {
            const dateObj = new Date(item.date);

            return {
                date: dateObj.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short"
                }),
                total: Number(item.total)
            };
        });
    };
    const formatTopProducts = () => {
        console.log("RAW TOP PRODUCTS:", data?.topProducts);

        if (!data?.topProducts) return [];

        const result = data.topProducts.map((p) => ({
            name: `${p?.variant?.product?.nama || "Unknown"} - ${p?.variant?.nama_variant || ""}`,
            total: Number(p?.totalSold || 0),
        }));

        console.log("FORMATTED TOP PRODUCTS:", result);

        return result;
    };

    const fetchDashboard = async () => {
        try {
            const res = await axios.get("/dashboard");

            console.log("API RESPONSE:", res.data.data);

            setData(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Dashboard Analytics</h2>

            {/* CARD METRICS */}
            <div className="grid grid-cols-3 gap-4 mb-6">

                <div className="bg-white p-4 rounded-xl shadow">
                    <p className="text-gray-500">Total Revenue</p>
                    <h3 className="text-2xl font-bold">
                        {formatRupiah(data?.totalRevenue)}
                    </h3>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                    <p className="text-gray-500">Total Orders</p>
                    <h3 className="text-2xl font-bold">
                        {data?.totalOrders || 0}
                    </h3>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                    <p className="text-gray-500">Pending Orders</p>
                    <h3 className="text-2xl font-bold">
                        {data?.pendingOrders || 0}
                    </h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <p className="text-gray-500">Paid Orders</p>
                    <h3 className="text-2xl font-bold">
                        {data?.paidOrders || 0}
                    </h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <p className="text-gray-500">Ready Pickup</p>
                    <h3 className="text-2xl font-bold">
                        {data?.readyPickupOrders || 0}
                    </h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <p className="text-gray-500">Shipping</p>
                    <h3 className="text-2xl font-bold">
                        {data?.shippingOrders || 0}
                    </h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <p className="text-gray-500">Completed</p>
                    <h3 className="text-2xl font-bold">
                        {data?.completedOrders || 0}
                    </h3>
                </div>

            </div>

            {/* CHART AREA (NEXT STEP) */}
            <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-bold mb-4">Sales Chart</h3>
                <div className="bg-white p-4 rounded-xl shadow">
                    <h3 className="font-bold mb-4">Sales Per Day</h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={formatChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => formatRupiah(value)} />
                            <Tooltip
                                formatter={(value) => formatRupiah(value)}
                            />
                            <Line type="monotone" dataKey="total" stroke="#4F46E5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow mt-6">
                <h3 className="font-bold mb-4">Top Products</h3>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formatTopProducts()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#22C55E" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}