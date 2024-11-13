import { useState } from "react"
import { StatCards } from "@/components/StatCards"
import { CurrentIntakes } from "@/components/CurrentIntakes"
import { RecentActivities } from "@/components/RecentActivities"
import { Calendar } from "@/components/Calendar"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"

export default function Dashboard() {
  useDocumentTitle("Dashboard");

  return (
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
  );
}
