import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("Reports");
  useDocumentTitle("Reports");

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-2xl font-bold mb-4">Reports</h1>
          <p>Reports page content will go here.</p>
        </main>
      </div>
    </div>
  );
} 