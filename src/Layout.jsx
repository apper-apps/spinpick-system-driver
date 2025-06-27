import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import "@/index.css";
import ApperIcon from "@/components/ApperIcon";
import WheelSidebar from "@/components/organisms/WheelSidebar";
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-surface-200">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-surface-200 flex-shrink-0`}>
        <WheelSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

{/* Sidebar Toggle Button */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        whileHover={{ 
          scale: 1.05, 
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)" 
        }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-surface-200 hover:bg-surface-50 transition-all duration-200 group"
        title={sidebarOpen ? 'Close Sidebar' : 'Open Saved Wheels'}
      >
        <motion.div
          animate={{ rotate: sidebarOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ApperIcon 
            name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} 
            size={20} 
            className="group-hover:text-primary transition-colors" 
          />
        </motion.div>
      </motion.button>
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;