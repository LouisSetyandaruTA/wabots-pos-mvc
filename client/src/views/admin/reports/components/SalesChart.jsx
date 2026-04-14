import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { ResponsiveContainer } from "recharts";

export default function SalesChart({ data }) {
  return (
   <div className="w-full h-[300px]">
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" />
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
}