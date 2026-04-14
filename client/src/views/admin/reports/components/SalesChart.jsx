import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { ResponsiveContainer } from "recharts";
import { formatRupiah } from "../../../../utils/format";

export default function SalesChart({ data }) {
  return (
         <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-bold mb-4">Sales Chart</h3>
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
        <XAxis dataKey="period" />
        <YAxis tickFormatter={(value) => formatRupiah(value)} />
                                   <Tooltip
         formatter={(value) => formatRupiah(value)}
       />
        <Line type="monotone" dataKey="revenue" />
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
}