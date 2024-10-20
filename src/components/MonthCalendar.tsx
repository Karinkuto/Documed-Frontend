import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import Popover from "@/components/Popover"
import { EventDetails } from "@/components/EventDetails"
import { CalendarViewPicker } from "@/components/CalendarViewPicker"
import { useCalendarStore } from '@/services/calendarService';

interface Event {
  id: string;
  title: string;
  date: Date;
  color: string;
  textColor: string;
  borderColor: string;
  description?: string;
}

interface MonthCalendarProps {
  todayButtonClass: string;
  currentDate: Date;
}

export function MonthCalendar({ todayButtonClass, currentDate: initialDate }: MonthCalendarProps) {
  const events = useCalendarStore(state => state.events);
  const fetchEvents = useCalendarStore(state => state.fetchEvents);
  const [displayDate, setDisplayDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('month');
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    console.log("Current events:", events); // Debug log
  }, [events]);

  useEffect(() => {
    setDisplayDate(initialDate);
  }, [initialDate]);

  const changeMonth = useCallback((delta: number) => {
    setDisplayDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    setDisplayDate(new Date());
  }, []);

  const daysInMonth = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
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
  }, [displayDate]);

  const daysInWeek = useMemo(() => {
    const startOfWeek = new Date(displayDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return { date, isCurrentMonth: date.getMonth() === displayDate.getMonth() };
    });
  }, [displayDate]);

  const hoursInDay = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const date = new Date(displayDate);
      date.setHours(i, 0, 0, 0);
      return date;
    });
  }, [displayDate]);

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
      
      const popoverWidth = 250;
      const estimatedPopoverHeight = 100;
      
      let top = cellRect.bottom - calendarRect.top;
      let left = cellRect.left - calendarRect.left;
      
      if (left + popoverWidth > calendarRect.width) {
        left = calendarRect.width - popoverWidth;
      }
      
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

  const handleViewChange = (view: 'day' | 'week' | 'month') => {
    setCurrentView(view);
  };

  const changeDate = useCallback((delta: number) => {
    setDisplayDate(prevDate => {
      const newDate = new Date(prevDate);
      switch (currentView) {
        case 'day':
          newDate.setDate(newDate.getDate() + delta);
          break;
        case 'week':
          newDate.setDate(newDate.getDate() + delta * 7);
          break;
        case 'month':
          newDate.setMonth(newDate.getMonth() + delta);
          break;
      }
      return newDate;
    });
  }, [currentView]);

  const renderMonthView = () => (
    <div className="flex-grow grid grid-cols-7 grid-rows-[auto_repeat(6,1fr)] gap-px bg-gray-200 overflow-auto">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
        <div key={day} className="text-center font-medium py-2 bg-gray-50 text-xs text-gray-500">{day}</div>
      ))}
      {daysInMonth.map(({ date, isCurrentMonth }, index) => {
        const dayEvents = events.filter(e => 
          e.date.getFullYear() === date.getFullYear() &&
          e.date.getMonth() === date.getMonth() &&
          e.date.getDate() === date.getDate()
        );
        const dayIsToday = isToday(date);

        return (
          <div 
            key={index} 
            className={`p-1 transition-colors duration-150 ease-in-out
              ${!isCurrentMonth ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}
              ${dayIsToday ? 'bg-green-100 hover:bg-green-200' : ''}
            `}
            onClick={(e) => handleDateClick(date, e)}
          >
            <div className={`text-right text-xs
              ${isCurrentMonth ? (dayIsToday ? 'text-green-800 font-semibold' : 'text-gray-700') : 'text-gray-400'}
            `}>
              {date.getDate()}
            </div>
            {dayEvents.map((event, eventIndex) => (
              <div key={eventIndex} className={`mt-1 px-1 py-0.5 text-[10px] ${event.color} ${event.textColor} rounded border-l ${event.borderColor} truncate`}>
                {event.title}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  const renderWeekView = () => (
    <div className="flex-grow flex flex-col h-full">
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-2 text-center text-xs font-medium text-gray-500"></div>
        {daysInWeek.map(({ date }, index) => {
          const dayIsToday = isToday(date);
          return (
            <div 
              key={index} 
              className={`p-1 text-center border-l border-gray-200 ${dayIsToday ? 'bg-gray-50' : ''}`}
            >
              <div className="text-xs font-medium text-gray-900">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-xs ${dayIsToday ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex-grow overflow-auto">
        <div className="grid grid-cols-8 h-full divide-x divide-gray-200">
          <div className="col-span-1">
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
              <div key={hour} className="h-10 text-right pr-2 text-xs text-gray-500 relative">
                <span className="absolute top-[-0.5em] right-2">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>
          {daysInWeek.map(({ date }, dayIndex) => (
            <div key={dayIndex} className="col-span-1 relative">
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="h-10 border-t border-gray-100"></div>
              ))}
              {events
                .filter(e => e.date.toDateString() === date.toDateString())
                .map((event, eventIndex) => {
                  const startHour = event.date.getHours();
                  const startMinute = event.date.getMinutes();
                  const duration = 2; // Assume 2 hour duration for this example
                  return (
                    <div
                      key={eventIndex}
                      className={`absolute left-1 right-1 ${event.color} ${event.textColor} rounded-sm p-1 overflow-hidden`}
                      style={{
                        top: `${startHour * 2.5 + (startMinute / 60) * 2.5}rem`,
                        height: `${duration * 2.5}rem`,
                      }}
                      onClick={(e) => handleDateClick(event.date, e)}
                    >
                      <div className="text-xs font-semibold">{event.title}</div>
                      <div className="text-xs">
                        {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDayView = () => (
    <div className="flex-grow overflow-auto">
      <div className="grid grid-cols-[auto_1fr] gap-2">
        {hoursInDay.map((hour, index) => (
          <React.Fragment key={index}>
            <div className="text-right pr-2 py-2 text-xs text-gray-500">
              {hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
            </div>
            <div className="border-t border-gray-200 py-2">
              {events
                .filter(e => e.date.toDateString() === displayDate.toDateString() && e.date.getHours() === hour.getHours())
                .map((event, eventIndex) => (
                  <div 
                    key={eventIndex}
                    className={`px-2 py-1 text-xs ${event.color} ${event.textColor} rounded border-l ${event.borderColor} mb-1`}
                    onClick={(e) => handleDateClick(event.date, e)}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={calendarRef} className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative">
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => changeDate(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => changeDate(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            {currentView === 'day' 
              ? displayDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
              : currentView === 'week'
                ? `${daysInWeek[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${daysInWeek[6].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : formatMonthYear(displayDate)
            }
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={`font-medium flex items-center justify-center ${todayButtonClass}`}
            onClick={goToToday}
          >
            <CalendarIcon className="mr-1 h-3 w-3" />
            Today
          </Button>
          <CalendarViewPicker currentView={currentView} onViewChange={handleViewChange} />
        </div>
      </div>

      {currentView === 'month' && renderMonthView()}
      {currentView === 'week' && renderWeekView()}
      {currentView === 'day' && renderDayView()}

      {selectedDate && isPopoverOpen && (
        <Popover 
          isOpen={isPopoverOpen} 
          onClose={closePopover}
          position={popoverPosition}
          color={events.find(e => 
            e.date.getFullYear() === selectedDate.getFullYear() &&
            e.date.getMonth() === selectedDate.getMonth() &&
            e.date.getDate() === selectedDate.getDate()
          )?.color || 'bg-white'}
        >
          {events.some(e => 
            e.date.getFullYear() === selectedDate.getFullYear() &&
            e.date.getMonth() === selectedDate.getMonth() &&
            e.date.getDate() === selectedDate.getDate()
          ) ? (
            <EventDetails 
              event={events.find(e => 
                e.date.getFullYear() === selectedDate.getFullYear() &&
                e.date.getMonth() === selectedDate.getMonth() &&
                e.date.getDate() === selectedDate.getDate()
              )}
              date={selectedDate}
            />
          ) : (
            <div className="p-4">
              <p className="text-sm text-gray-600">No events scheduled for this day.</p>
            </div>
          )}
        </Popover>
      )}
    </div>
  )
}
