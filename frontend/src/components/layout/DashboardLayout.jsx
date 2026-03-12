import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const DashboardLayout = ({ children }) => {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex">

      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1">

        <TopNavbar setOpen={setOpen} />

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;