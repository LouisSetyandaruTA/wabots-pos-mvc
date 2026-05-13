export default function OngoingOrders({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h3 className="font-bold mb-4">
        Order Sedang Diproses
      </h3>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Status</th>
            <th>Metode</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {data.map((o) => (
            <tr key={o.id}>
              <td>{o.customer?.name}</td>
              <td>{o.fulfillmentStatus}</td>
              <td>{o.deliveryMethod}</td>
              <td>
                Rp {Number(o.totalPrice).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}