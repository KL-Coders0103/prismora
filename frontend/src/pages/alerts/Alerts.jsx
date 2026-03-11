import DashboardLayout from "../../components/layout/DashboardLayout";
import AlertCard from "../../components/cards/AlertCard";

const Alerts = () => {
  const alerts = [
    {
      title: "Sales Drop",
      message: "Sales dropped 20% in the last 24 hours.",
      severity: "high",
    },
    {
      title: "Traffic Spike",
      message: "Website traffic increased unusually.",
      severity: "medium",
    },
    {
      title: "Inventory Warning",
      message: "Product A inventory below threshold.",
      severity: "low",
    },
  ];

  return (
    <DashboardLayout>
      <h1>Alerts & Anomalies</h1>

      <div style={styles.grid}>
        {alerts.map((alert, i) => (
          <AlertCard key={i} {...alert} />
        ))}
      </div>
    </DashboardLayout>
  );
};

const styles = {
  grid: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
};

export default Alerts;
