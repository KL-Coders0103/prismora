const KPICard = ({ title, value, change }) => {
  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <h2>{value}</h2>
      <p style={{ color: change > 0 ? "green" : "red" }}>
        {change > 0 ? "+" : ""}
        {change}%
      </p>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "200px",
  },
};

export default KPICard;