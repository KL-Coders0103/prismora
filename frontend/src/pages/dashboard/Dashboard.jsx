import DashboardLayout from "../../components/layout/DashboardLayout";
import KPICard from "../../components/cards/KPICard";
import SalesChart from "../../components/charts/SalesChart";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h1>Dashboard</h1>

      <div style={styles.kpiContainer}>
        <KPICard title="Revenue" value="$120,000" change={12} />
        <KPICard title="Customers" value="1,240" change={5} />
        <KPICard title="Sales Growth" value="18%" change={8} />
        <KPICard title="Profit Margin" value="32%" change={-2} />
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Sales Trend</h2>
        <SalesChart />
      </div>
    </DashboardLayout>
  );
};

const styles = {
  kpiContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
};

export default Dashboard;