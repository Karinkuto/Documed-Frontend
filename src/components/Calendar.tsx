import React from 'react'
import { IntakeCalendar } from './IntakeCalendar'
import { MonthCalendar } from './MonthCalendar'

export function Calendar() {
  return (
    <div className="flex space-x-6 h-[calc(100vh-6rem)]">
      <IntakeCalendar />
      <MonthCalendar />
    </div>
  )
}
