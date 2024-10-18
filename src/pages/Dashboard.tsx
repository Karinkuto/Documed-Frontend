import { useState } from "react"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import { StatCards } from "@/components/StatCards"
import { CurrentIntakes } from "@/components/CurrentIntakes"
import { RecentActivities } from "@/components/RecentActivities"
import { Calendar } from "@/components/Calendar"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard")
  useDocumentTitle(activeTab);

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === "Dashboard" && (
            <div className="space-y-4">
              <StatCards />
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3">
                  <CurrentIntakes />
                </div>
                <div className="col-span-2">
                  <RecentActivities />
                </div>
              </div>
            </div>
          )}
          {activeTab === "Calendar" && <Calendar />}
        </main>
      </div>
    </div>
  )
}
