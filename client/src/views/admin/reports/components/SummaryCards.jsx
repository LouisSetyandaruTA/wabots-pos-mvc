import { formatRupiah } from "../../../../utils/format";

export default function SummaryCards({ data }) {

  const cards = [
    {
      title: "Total Revenue",
      value: `Rp ${Number(data.totalRevenue || 0).toLocaleString("id-ID")}`
    },
    {
      title: "Total Orders",
      value: data.totalOrders || 0
    },
    {
      title: "AOV",
      value: `Rp ${Math.round(data.avgOrderValue || 0).toLocaleString("id-ID")}`
    },
    {
      title: "Pending",
      value: data.pendingOrders || 0
    },
    {
      title: "Paid",
      value: data.paidOrders || 0
    },
    {
      title: "Ready Pickup",
      value: data.readyPickupOrders || 0
    },
    {
      title: "Shipping",
      value: data.shippingOrders || 0
    },
    {
      title: "Completed",
      value: data.completedOrders || 0
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow p-4"
        >
          <p className="text-gray-500 text-sm">
            {card.title}
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {card.value}
          </h3>
        </div>
      ))}
    </div>
  );
}
