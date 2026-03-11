import DashboardLayout from "../../components/layout/DashboardLayout";
import CustomerPieChart from "../../components/charts/CustomerPieChart";
import CustomerTable from "../../components/tables/CustomerTable";
import KPICard from "../../components/cards/KPICard";

const CustomerAnalytics = () => {
  return (
    <DashboardLayout>
      <h1>Customer Analytics</h1>

      <div style={styles.cards}>
        <KPICard title="Total Customers" value="2,450" change={6} />
        <KPICard title="Retention Rate" value="78%" change={4} />
        <KPICard title="Churn Rate" value="12%" change={-2} />
      </div>

      <h2 style={{ marginTop: "40px" }}>Customer Segmentation</h2>
      <CustomerPieChart />

      <h2 style={{ marginTop: "40px" }}>Top Customers</h2>
      <CustomerTable />
    </DashboardLayout>
  );
};

const styles = {
  cards: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
};

export default CustomerAnalytics;
