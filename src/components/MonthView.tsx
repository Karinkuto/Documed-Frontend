import React from 'react';
import { Event } from '@/types/Event';

interface MonthViewProps {
  daysInMonth: { date: Date; isCurrentMonth: boolean }[];
  events: Event[];
  isToday: (date: Date) => boolean;
  handleEventHover: (event: Event, mouseEvent: React.MouseEvent) => void;
  handleEventLeave: () => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  daysInMonth,
  events,
  isToday,
  handleEventHover,
  handleEventLeave
}) => {
  return (
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
};
