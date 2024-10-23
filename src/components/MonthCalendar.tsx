import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { EventDetails } from "@/components/EventDetails"
import { useCalendarStore } from '@/services/calendarService';
import { AnimatedPopover } from '@/components/AnimatedPopover';
import { CalendarHeader } from '@/components/CalendarHeader';

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
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);

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

  const handleEventHover = (event: Event, mouseEvent: React.MouseEvent) => {
    if (calendarRef.current) {
      const calendarRect = calendarRef.current.getBoundingClientRect();
      const eventRect = mouseEvent.currentTarget.getBoundingClientRect();
      
      const popoverWidth = 300;
      const estimatedPopoverHeight = 300;
      
      let top = eventRect.bottom - calendarRect.top;
      let left = eventRect.left - calendarRect.left;
      
      if (left + popoverWidth > calendarRect.width) {
        left = calendarRect.width - popoverWidth;
      }
      
      if (top + estimatedPopoverHeight > calendarRect.height) {
        top = eventRect.top - calendarRect.top - estimatedPopoverHeight;
      }
      
      setPopoverPosition({ top, left });
    }
    
    setHoveredEvent(event);
  };

  const handleEventLeave = () => {
    setHoveredEvent(null);
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
              ${!isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
              ${dayIsToday ? 'bg-green-100' : ''}
            `}
          >
            <div className={`text-right text-xs
              ${isCurrentMonth ? (dayIsToday ? 'text-green-800 font-semibold' : 'text-gray-700') : 'text-gray-400'}
            `}>
              {date.getDate()}
            </div>
            {dayEvents.map((event, eventIndex) => (
              <div 
                key={eventIndex} 
                className={`mt-1 px-1 py-0.5 text-[10px] ${event.color} ${event.textColor} rounded border-l ${event.borderColor} truncate cursor-pointer transition-all duration-150 ease-in-out hover:scale-105`}
                onMouseEnter={(e) => handleEventHover(event, e)}
                onMouseLeave={handleEventLeave}
              >
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
                      onClick={(e) => handleEventHover(event, e)}
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
                    onClick={(e) => handleEventHover(event, e)}
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
      <CalendarHeader
        displayDate={displayDate}
        currentView={currentView}
        daysInWeek={daysInWeek}
        todayButtonClass={todayButtonClass}
        onChangeDate={changeDate}
        onGoToToday={goToToday}
        onViewChange={handleViewChange}
      />

      {currentView === 'month' && renderMonthView()}
      {currentView === 'week' && renderWeekView()}
      {currentView === 'day' && renderDayView()}

      <AnimatedPopover
        isOpen={hoveredEvent !== null}
        position={popoverPosition}
        color={hoveredEvent?.color || 'bg-white'}
      >
        {hoveredEvent && (
          <EventDetails
            event={hoveredEvent}
            date={hoveredEvent.date}
          />
        )}
      </AnimatedPopover>
    </div>
  )
}
