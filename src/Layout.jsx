import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import WheelSidebar from '@/components/organisms/WheelSidebar';
import ApperIcon from '@/components/ApperIcon';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-surface-200">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-surface-200 flex-shrink-0`}>
        <WheelSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-surface-200 hover:bg-surface-50 transition-colors"
        title={sidebarOpen ? 'Close Sidebar' : 'Open Saved Wheels'}
      >
        <ApperIcon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={20} />
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;