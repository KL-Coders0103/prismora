import { useState } from "react";
import { motion as Motion } from "framer-motion";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const DashboardLayout = ({ children }) => {

  const [open, setOpen] = useState(false);

  return (

    <div className="flex h-screen bg-linear-to-br from-slate-950 to-slate-900 text-white">

      {/* Sidebar */}

      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Navbar */}

        <TopNavbar setOpen={setOpen} />

        {/* Page Content */}

        <main className="flex-1 overflow-y-auto p-6">

          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >

            {children}

          </Motion.div>

        </main>

      </div>

    </div>

  );
};

export default DashboardLayout;