import { formatRupiah } from "../../../../utils/format";

export default function TopProducts({ data }) {
  const maxSold = Math.max(...data.map((i) => Number(i.totalSold)), 1);

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-bold">🔥 Produk Terlaris</h3>

      <div className="space-y-4">
        {data?.map((item, i) => {
          const percentage = (Number(item.totalSold) / maxSold) * 100;

          return (
            <div key={i}>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{item.productName}</p>

                  <p className="text-sm text-gray-500">
                    Terjual:
                    {item.totalSold}
                  </p>
                </div>

                <p className="font-bold">{formatRupiah(item.revenue)}</p>
              </div>

              <div className="mt-2 h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-blue-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
