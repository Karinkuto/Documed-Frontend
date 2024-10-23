import React from 'react';
import { Event } from '@/types/Event';
import { TimeGridIndicator } from './TimeGridIndicator';

interface WeekViewProps {
  daysInWeek: { date: Date; isCurrentMonth: boolean }[];
  events: Event[];
  isToday: (date: Date) => boolean;
  handleEventHover: (event: Event, mouseEvent: React.MouseEvent) => void;
  handleEventLeave: () => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  daysInWeek,
  events,
  isToday,
  handleEventHover,
  handleEventLeave
}) => {
  const currentTime = new Date();
  const hourHeight = 40;

  return (
    <div className="flex-grow flex flex-col h-full">
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-2 text-center text-xs font-medium text-gray-500"></div>
        {daysInWeek.map(({ date }, index) => {
          const dayIsToday = isToday(date);
          return (
            <div 
              key={index} 
              className={`p-1 text-center border-l border-gray-200 ${dayIsToday ? 'bg-[#F4FAF0]' : ''}`}
            >
              <div className="text-xs font-medium text-gray-900">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-xs ${dayIsToday ? 'text-green-700 font-semibold' : 'text-gray-500'}`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex-grow overflow-auto">
        <div className="grid grid-cols-8 h-full divide-x divide-gray-200">
          <div className="col-span-1">
            <div className="h-5"></div> {/* Empty half row at the top */}
            {Array.from({ length: 25 }, (_, i) => i).map((hour) => (
              <div key={hour} className="h-10 text-right pr-2 text-xs text-gray-500 relative">
                {hour < 24 && (
                  <span className="absolute top-[-0.5em] right-2">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </span>
                )}
              </div>
            ))}
            <div className="h-5"></div> {/* Empty half row at the bottom */}
          </div>
          {daysInWeek.map(({ date }, dayIndex) => {
            const dayIsToday = isToday(date);
            return (
              <div key={dayIndex} className={`col-span-1 relative ${dayIsToday ? 'bg-[#F4FAF0]' : ''}`}>
                <div className="h-5"></div> {/* Empty half row at the top */}
                {Array.from({ length: 25 }, (_, hour) => (
                  <div key={hour} className="h-10 border-t border-gray-200"></div>
                ))}
                <div className="h-5 border-t border-gray-200"></div> {/* Empty half row at the bottom with border */}
                <TimeGridIndicator 
                  currentTime={currentTime} 
                  showIndicator={dayIsToday} 
                  hourHeight={hourHeight}
                />
                {events
                  .filter(e => e.date.toDateString() === date.toDateString())
                  .map((event, eventIndex) => {
                    const startHour = event.date.getHours();
                    const startMinute = event.date.getMinutes();
                    const duration = event.duration || 60; // Default to 1 hour if duration is not specified
                    return (
                      <div
                        key={eventIndex}
                        className={`absolute left-1 right-1 ${event.color} ${event.textColor} rounded-sm p-1 overflow-hidden`}
                        style={{
                          top: `${(startHour + startMinute / 60) * hourHeight + 20}px`, // Add 20px (half row height) to account for the empty half row
                          height: `${(duration / 60) * hourHeight}px`,
                        }}
                        onMouseEnter={(e) => handleEventHover(event, e)}
                        onMouseLeave={handleEventLeave}
                      >
                        <div className="text-xs font-semibold">{event.title}</div>
                        <div className="text-xs">
                          {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
