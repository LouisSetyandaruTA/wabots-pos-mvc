import { formatRupiah } from "../../../../utils/format";

export default function SummaryCards({ data }) {
  return (
    <div  className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-gray-500">Total Revenue</p>
        <h2 className="text-2xl font-bold">{formatRupiah(data?.totalRevenue)}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-gray-500">Total Orders</p>
        <h2 className="text-2xl font-bold">{data?.totalOrders || 0}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-gray-500">AOV</p>
        <h2 className="text-2xl font-bold">{formatRupiah(Math.round(data?.avgOrderValue || 0))}</h2>
      </div>
    </div>
  );
}

