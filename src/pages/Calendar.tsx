import { Calendar as CalendarComponent } from "@/components/Calendar"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"

export default function Calendar() {
  useDocumentTitle("Calendar");

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <CalendarComponent />
        </main>
      </div>
    </div>
  )
} 