import { useNavigate } from "react-router-dom";

const TopNavbar = () => {

const navigate = useNavigate();

const logout = () => {
localStorage.removeItem("token");
navigate("/login");
};

return (

<div style={styles.navbar}>

<input
type="text"
placeholder="Search insights..."
style={styles.search}
/>

<div>

<span style={styles.icon}>🔔</span>

<button onClick={logout} style={styles.button}>
Logout
</button>

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
marginRight: "15px",
},

button: {
padding: "6px 10px",
cursor: "pointer",
}

};

export default TopNavbar;