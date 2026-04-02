import React from "react";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast"; // Professional SaaS toast notifications

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Global Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white shadow-lg rounded-lg',
          duration: 4000,
        }} 
      />
      
      {/* App Routing */}
      <AppRoutes />
    </div>
  );
}

export default App;