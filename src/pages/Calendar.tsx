import { Calendar as CalendarComponent } from "@/components/Calendar"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"

export default function Calendar() {
  useDocumentTitle("Calendar");

  return (
    <CalendarComponent />
  )
} 