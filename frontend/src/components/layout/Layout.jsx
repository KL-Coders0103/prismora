import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion as Motion } from "framer-motion";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import CommandPalette from "../ui/CommonPalette";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Mobile Overlay */}
      {open && (
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <TopNavbar setOpen={setOpen} />

        {/* Page Content */}
        <main
          role="main"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative"
        >
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-7xl h-full"
          >
            <Outlet />
          </Motion.div>

          <CommandPalette />
        </main>
      </div>
    </div>
  );
};

export default Layout;