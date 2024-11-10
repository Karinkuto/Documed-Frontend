import { IntakeCalendar } from './IntakeCalendar'
import { InteractiveCalendar } from './InteractiveCalendar'

export function Calendar() {
  const todayButtonClass = "h-9 px-3 text-xs" // Increased height to match the tab
  const currentDate = new Date() // Get the current date

  return (
    <div className="flex space-x-6 h-full">
      <IntakeCalendar todayButtonClass={todayButtonClass} currentDate={currentDate} />
      <InteractiveCalendar todayButtonClass={todayButtonClass} currentDate={currentDate} />
    </div>
  )
}
