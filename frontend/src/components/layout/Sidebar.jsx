import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Prismora</h2>

      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/ai-insights" style={styles.link}>AI Insights</Link>
        <Link to="/sales" style={styles.link}>Sales Analytics</Link>
        <Link to="/customers" style={styles.link}>Customer Analytics</Link>
        <Link to="/reports" style={styles.link}>Reports</Link>
        <Link to="/upload" style={styles.link}>Upload Data</Link>
        <Link to="/alerts" style={styles.link}>Alerts</Link>
        <Link to="/team" style={styles.link}>Team</Link>
        <Link to="/settings" style={styles.link}>Settings</Link>
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#111827",
    color: "white",
    padding: "20px",
    position: "fixed",
  },
  logo: {
    marginBottom: "30px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
};

export default Sidebar;