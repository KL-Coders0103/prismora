import DashboardLayout from "../../components/layout/DashboardLayout";
import InsightCard from "../../components/cards/InsightCard";

const AIInsights = () => {
  const insights = [
    {
      title: "Sales Forecast",
      message: "Sales expected to grow by 15% next month.",
      type: "info",
      confidence: 92,
    },
    {
      title: "Inventory Alert",
      message: "Product A inventory running low.",
      type: "alert",
      confidence: 88,
    },
    {
      title: "Opportunity",
      message: "Customer retention campaign could increase revenue.",
      type: "opportunity",
      confidence: 85,
    },
  ];

  return (
    <DashboardLayout>
      <h1>AI Insights</h1>

      <div style={styles.grid}>
        {insights.map((item, index) => (
          <InsightCard key={index} {...item} />
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

export default AIInsights;
