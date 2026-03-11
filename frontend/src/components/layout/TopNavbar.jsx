const TopNavbar = () => {
  return (
    <div style={styles.navbar}>
      <input
        type="text"
        placeholder="Search insights..."
        style={styles.search}
      />

      <div>
        <span style={styles.icon}>🔔</span>
        <span style={styles.icon}>👤</span>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    height: "60px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  search: {
    padding: "8px",
    width: "250px",
  },
  icon: {
    marginLeft: "15px",
    fontSize: "20px",
  },
};

export default TopNavbar;