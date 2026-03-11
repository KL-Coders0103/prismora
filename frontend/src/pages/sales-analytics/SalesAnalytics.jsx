import DashboardLayout from "../../components/layout/DashboardLayout";
import RevenueChart from "../../components/charts/RevenueChart";
import CategoryChart from "../../components/charts/CategoryChart";
import SalesTable from "../../components/tables/SalesTable";

const SalesAnalytics = () => {
  return (
    <DashboardLayout>
      <h1>Sales Analytics</h1>

      <h2>Revenue Trend</h2>
      <RevenueChart />

      <h2 style={{ marginTop: "40px" }}>Sales by Category</h2>
      <CategoryChart />

      <h2 style={{ marginTop: "40px" }}>Top Products</h2>
      <SalesTable />
    </DashboardLayout>
  );
};

export default SalesAnalytics;
