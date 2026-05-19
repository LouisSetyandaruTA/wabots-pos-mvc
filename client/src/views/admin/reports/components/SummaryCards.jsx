import { formatRupiah } from "../../../../utils/format";

export default function SummaryCards({ data }) {
  const cards = [
    {
      title: "Total Revenue",
      value: `Rp ${Number(data.totalRevenue || 0).toLocaleString("id-ID")}`,
    },
    {
      title: "Total Orders",
      value: data.totalOrders || 0,
    },
    {
      title: "AOV",
      value: `Rp ${Math.round(data.avgOrderValue || 0).toLocaleString(
        "id-ID"
      )}`,
    },
    {
      title: "Pending",
      value: data.pendingOrders || 0,
    },
    {
      title: "Paid",
      value: data.paidOrders || 0,
    },
    {
      title: "Ready Pickup",
      value: data.readyPickupOrders || 0,
    },
    {
      title: "Shipping",
      value: data.shippingOrders || 0,
    },
    {
      title: "Completed",
      value: data.completedOrders || 0,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm text-gray-500">{card.title}</p>

          <h3 className="mt-2 text-2xl font-bold">{card.value}</h3>
        </div>
      ))}
    </div>
  );
}
