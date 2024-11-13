import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
} 