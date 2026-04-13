import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
const [data, setData] = useState(null);

useEffect(() => {
  fetchDashboard();
}, []);

const fetchDashboard = async () => {
  const res = await axios.get("http://localhost:5000/api/dashboard");
  setData(res.data.data);
};

useEffect(() => {
  axios.get("http://localhost:5000/api/dashboard")
    .then(res => {
      console.log(res.data); 
      setData(res.data);
    })
    .catch(err => console.error(err));
}, []);

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          title={"Total Orders"}
          subtitle={data.totalOrders || "Loading..."}
        />

        <Widget
          title={"Total Products"}
          subtitle={data.totalProducts || "Loading..."}
        />
        {/* <Widget
          title={"Total Revenue"}
          subtitle={dashboardData?.totalRevenue || "Loading..."}
        />

        <Widget
          title={"Total Orders"}
          subtitle={dashboardData?.totalOrders || "Loading..."}
        />

        <Widget
          title={"Pending Orders"}
          subtitle={dashboardData?.pendingOrders || "Loading..."}
        />

        <Widget
          title={"Products"}
          subtitle={dashboardData?.totalProducts || "Loading..."}
        /> */}
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        {/* Complex Table , Task & Calendar */}

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
