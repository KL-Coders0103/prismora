const InsightCard = ({ title, message, type, confidence }) => {
  const color =
    type === "alert"
      ? "#ef4444"
      : type === "opportunity"
      ? "#22c55e"
      : "#6366f1";

  return (
    <div style={styles.card}>
      <h3 style={{ color }}>{title}</h3>
      <p>{message}</p>
      <p style={styles.confidence}>Confidence: {confidence}%</p>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "320px",
  },
  confidence: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#6b7280",
  },
};

export default InsightCard;
