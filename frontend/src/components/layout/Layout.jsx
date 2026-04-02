import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // MUST use Outlet for React Router nested routes
import { motion as Motion } from "framer-motion";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm md:hidden z-30 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navigation */}
        <TopNavbar setOpen={setOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto max-w-7xl h-full" // Constrain max width for ultra-wide monitors
          >
            {/* React Router injects the child route components (Dashboard, Settings, etc.) here 
            */}
            <Outlet />
          </Motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;