import { formatRupiah, formatAOV } from "../../../../utils/format";

export default function SummaryCards({ data }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="p-4 bg-white shadow rounded">
        <p>Total Revenue</p>
        <h2>{formatRupiah(data?.totalRevenue)}</h2>
      </div>

      <div className="p-4 bg-white shadow rounded">
        <p>Total Orders</p>
        <h2>{data?.totalOrders || 0}</h2>
      </div>

      <div className="p-4 bg-white shadow rounded">
        <p>AOV</p>
        <h2>{formatRupiah(Math.round(data?.avgOrderValue || 0))}</h2>
      </div>
    </div>
  );
}
