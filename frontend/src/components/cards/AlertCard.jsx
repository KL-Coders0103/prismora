const AlertCard = ({ title, message, severity }) => {
  const color =
    severity === "high"
      ? "#ef4444"
      : severity === "medium"
      ? "#f59e0b"
      : "#22c55e";

  return (
    <div style={{ ...styles.card, borderLeft: `6px solid ${color}` }}>
      <h3>{title}</h3>
      <p>{message}</p>
      <span style={{ color }}>{severity.toUpperCase()}</span>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "320px",
  },
};

export default AlertCard;
