import { formatRupiah } from "../../../../utils/format";

export default function TopProducts({ data }) {
    return (
              <div className="bg-white p-4 rounded-xl shadow mt-6">
                <h3 className="font-bold mb-4">Top Products</h3>
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
                            <td>{formatRupiah(item.revenue)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}