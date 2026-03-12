import DashboardLayout from "../../components/layout/DashboardLayout";
import KPICard from "../../components/cards/KPICard";
import RevenueChart from "../../components/charts/RevenueChart";
import SalesChart from "../../components/charts/SalesChart";
import CustomerChart from "../../components/charts/CustomerChart";
import HeatMap from "../../components/charts/HeatMap";
import { useEffect, useState } from "react";
import { getTotalRevenue } from "../../services/analyticsService";

const Dashboard = () => {

  const [revenue, setRevenue] = useState(0);

  useEffect(() => {

    const loadData = async () => {

      const data = await getTotalRevenue();

      setRevenue(data.totalRevenue);

    };

    loadData();

  }, []);

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <KPICard
          title="Revenue"
          value={`${revenue}`}
          change="+12%"
        />

        <KPICard
          title="Sales"
          value="1,240"
          change="+8%"
        />

        <KPICard
          title="Customers"
          value="3,200"
          change="+5%"
        />

        <KPICard
          title="Conversion Rate"
          value="4.3%"
          change="+1.2%"
        />

      </div>

      {/* Charts */}

      <RevenueChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        <SalesChart />

        <CustomerChart />

      </div>

      <div className="mt-6">

        <HeatMap />

      </div>

    </DashboardLayout>

  );
};

export default Dashboard;