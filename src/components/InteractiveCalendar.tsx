import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { EventDetails } from "@/components/EventDetails"
import { useCalendarStore } from '@/services/calendarService';
import { AnimatedPopover } from '@/components/AnimatedPopover';
import { CalendarHeader } from '@/components/CalendarHeader';
import { MonthView } from '@/components/MonthView';
import { WeekView } from '@/components/WeekView';
import { DayView } from '@/components/DayView';
import { Event } from '@/types/Event';

interface InteractiveCalendarProps {
  todayButtonClass: string;
  currentDate: Date;
}

export function InteractiveCalendar({ todayButtonClass, currentDate: initialDate }: InteractiveCalendarProps) {
  const events = useCalendarStore(state => state.events);
  const fetchEvents = useCalendarStore(state => state.fetchEvents);
  const [displayDate, setDisplayDate] = useState(initialDate);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('month');
  const calendarRef = useRef<HTMLDivElement>(null);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    setDisplayDate(initialDate);
  }, [initialDate]);

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

      {currentView === 'month' && (
        <MonthView
          daysInMonth={daysInMonth}
          events={events}
          isToday={isToday}
          handleEventHover={handleEventHover}
          handleEventLeave={handleEventLeave}
        />
      )}
      {currentView === 'week' && (
        <WeekView
          daysInWeek={daysInWeek}
          events={events}
          isToday={isToday}
          handleEventHover={handleEventHover}
          handleEventLeave={handleEventLeave}
        />
      )}
      {currentView === 'day' && (
        <DayView
          events={events}
          displayDate={displayDate}
          handleEventHover={handleEventHover}
          handleEventLeave={handleEventLeave}
        />
      )}

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
