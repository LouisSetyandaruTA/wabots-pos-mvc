export default function TopProducts({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3>Top Products</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th>Product</th>
            <th>Sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, i) => (
            <tr key={i}>
              <td>{item.productName || item["variant.Product.nama"]}</td>
              <td>{item.totalSold}</td>
              <td>{item.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}