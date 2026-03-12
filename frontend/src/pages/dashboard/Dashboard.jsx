import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import KPICard from "../../components/cards/KPICard";
import SalesChart from "../../components/charts/SalesChart";
import API from "../../services/api";

const Dashboard = () => {

  const [stats,setStats] = useState(null);

  useEffect(()=>{
    const fetchStats = async () => {
    try{
      const res = await API.get("/analytics/dashboard");
      setStats(res.data);
    }catch(err){
      console.error(err);
    }
  };
  
    fetchStats();
  },[]);

  if(!stats) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <h1>Dashboard</h1>

      <div style={styles.kpiContainer}>
        <KPICard title="Revenue" value={`$${stats.revenue}`} change={12} />
        <KPICard title="Customers" value={stats.customers} change={5} />
        <KPICard title="Sales Growth" value={`${stats.salesGrowth}%`} change={8} />
        <KPICard title="Profit Margin" value={`${stats.profitMargin}%`} change={-2} />
      </div>

      <div style={{marginTop:"40px"}}>
        <h2>Sales Trend</h2>
        <SalesChart/>
      </div>

    </DashboardLayout>
  );
};

const styles = {
  kpiContainer:{
    display:"flex",
    gap:"20px",
    marginTop:"20px"
  }
};

export default Dashboard;