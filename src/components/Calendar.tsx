import { IntakeCalendar } from './IntakeCalendar'
import { MonthCalendar } from './MonthCalendar'

export function Calendar() {
  const todayButtonClass = "h-9 px-3 text-xs" // Increased height to match the tab
  const currentDate = new Date() // Get the current date

  return (
    <div className="flex space-x-6 h-[calc(119vh-1rem)]">
      <IntakeCalendar todayButtonClass={todayButtonClass} currentDate={currentDate} />
      <MonthCalendar todayButtonClass={todayButtonClass} currentDate={currentDate} />
    </div>
  )
}
