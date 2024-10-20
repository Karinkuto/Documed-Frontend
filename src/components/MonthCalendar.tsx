import React, { useState, useCallback, useMemo, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import Popover from "@/components/Popover"

interface Event {
  id: string;
  title: string;
  date: Date;
  color: string;
  textColor: string;
  borderColor: string;
  description?: string;
}

const events: Event[] = [
  { id: 'CR-014/23', title: 'Client Review', date: new Date(2024, 9, 9), color: 'bg-indigo-100', textColor: 'text-indigo-700', borderColor: 'border-indigo-400', description: 'Annual review with client XYZ' },
  { id: 'CHU-16/24', title: 'Team Check-up', date: new Date(2024, 9, 16), color: 'bg-pink-100', textColor: 'text-pink-700', borderColor: 'border-pink-400', description: 'Monthly team progress meeting' },
  { id: 'VAC-01/23', title: 'Vacation', date: new Date(2024, 9, 20), color: 'bg-orange-100', textColor: 'text-orange-700', borderColor: 'border-orange-400', description: 'Team building retreat' },
  { id: 'REQ-02/23', title: 'Requirements Gathering', date: new Date(2024, 9, 24), color: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-400', description: 'Initial meeting for new project' },
];

export function MonthCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);

  const changeMonth = useCallback((delta: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startOffset = (firstDay.getDay() + 6) % 7; // Adjust for Monday start
    
    for (let i = 0; i < startOffset; i++) {
      const prevMonthDay = new Date(year, month, -startOffset + i + 1);
      days.push({ date: prevMonthDay, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push({ date: nextMonthDay, isCurrentMonth: false });
    }
    
    return days;
  }, [currentDate]);

  const formatMonthYear = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleDateClick = (date: Date, event: React.MouseEvent) => {
    if (calendarRef.current) {
      const calendarRect = calendarRef.current.getBoundingClientRect();
      const cellRect = event.currentTarget.getBoundingClientRect();
      
      const popoverWidth = 250; // This should match the width in the Popover component
      const estimatedPopoverHeight = 100; // Estimate a reasonable height
      
      let top = cellRect.bottom - calendarRect.top;
      let left = cellRect.left - calendarRect.left;
      
      // Adjust if too close to the right edge
      if (left + popoverWidth > calendarRect.width) {
        left = calendarRect.width - popoverWidth;
      }
      
      // Adjust if too close to the bottom edge
      if (top + estimatedPopoverHeight > calendarRect.height) {
        top = cellRect.top - calendarRect.top - estimatedPopoverHeight;
      }
      
      setPopoverPosition({ top, left });
    }
    setSelectedDate(date);
    setIsPopoverOpen(true);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
    setSelectedDate(null);
  };

  return (
    <div ref={calendarRef} className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative">
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-800">{formatMonthYear(currentDate)}</h2>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => changeMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => changeMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs font-medium h-7 px-2"
            onClick={goToToday}
          >
            <CalendarIcon className="mr-1 h-3 w-3" />
            Today
          </Button>
          <div className="flex border rounded-md bg-gray-100 p-0.5">
            <Button variant="ghost" size="sm" className="text-xs px-2 py-0.5 h-6 rounded-sm">Day</Button>
            <Button variant="ghost" size="sm" className="text-xs px-2 py-0.5 h-6 rounded-sm">Week</Button>
            <Button variant="secondary" size="sm" className="text-xs px-2 py-0.5 h-6 bg-white shadow-sm rounded-sm">Month</Button>
          </div>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-7 grid-rows-[auto_repeat(6,1fr)] gap-px bg-gray-200 overflow-auto">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center font-medium py-2 bg-gray-50 text-xs text-gray-500">{day}</div>
        ))}
        {daysInMonth.map(({ date, isCurrentMonth }, index) => {
          const event = events.find(e => e.date.getTime() === date.getTime());
          const dayIsToday = isToday(date);

          return (
            <div 
              key={index} 
              className={`p-1 bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out ${!isCurrentMonth && 'bg-gray-50'} ${dayIsToday && 'bg-green-50'}`}
              onClick={(e) => handleDateClick(date, e)}
            >
              <div className={`text-right text-xs ${isCurrentMonth ? (dayIsToday ? 'text-green-600 font-semibold' : 'text-gray-700') : 'text-gray-400'}`}>
                {date.getDate()}
              </div>
              {event && (
                <div className={`mt-1 px-1 py-0.5 text-[10px] ${event.color} ${event.textColor} rounded border-l ${event.borderColor} truncate`}>
                  {event.title}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <Popover 
          isOpen={isPopoverOpen} 
          onClose={closePopover}
          position={popoverPosition}
          color={events.find(e => e.date.getTime() === selectedDate.getTime())?.color || 'bg-white'}
        >
          <EventDetails 
            event={events.find(e => e.date.getTime() === selectedDate.getTime())}
            date={selectedDate}
          />
        </Popover>
      )}
    </div>
  )
}

function EventDetails({ event, date }: { event?: Event, date: Date }) {
  return (
    <div className="text-xs">
      <p className="font-semibold">{date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      {event ? (
        <>
          <p className="mt-1 font-medium">{event.title}</p>
          <p className="text-gray-600">{event.id}</p>
          {event.description && <p className="mt-1">{event.description}</p>}
        </>
      ) : (
        <p className="mt-1">No events scheduled</p>
      )}
    </div>
  )
}
