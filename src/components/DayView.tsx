import React, { useState, useEffect } from 'react';
import { Event } from '@/types/Event';
import { TimeGridIndicator } from './TimeGridIndicator';

interface DayViewProps {
  events: Event[];
  displayDate: Date;
  handleEventHover: (event: Event, mouseEvent: React.MouseEvent) => void;
  handleEventLeave: () => void;
}

export const DayView: React.FC<DayViewProps> = ({
  events,
  displayDate,
  handleEventHover,
  handleEventLeave
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const hourHeight = 40; // Match the WeekView's hour height

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const isToday = displayDate.toDateString() === new Date().toDateString();

  return (
    <div className="flex-grow flex flex-col h-full">
      <div className="grid grid-cols-1 border-b border-gray-200">
        <div className="p-1 text-center">
          <div className="text-xs font-medium text-gray-900">
            {displayDate.toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
          <div className="text-xs text-gray-500">
            {displayDate.getDate()}
          </div>
        </div>
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
          <div className="col-span-7 relative">
            <div className="h-5"></div> {/* Empty half row at the top */}
            {Array.from({ length: 25 }, (_, hour) => (
              <div key={hour} className="h-10 border-t border-gray-200"></div>
            ))}
            <div className="h-5 border-t border-gray-200"></div> {/* Empty half row at the bottom with border */}
            <TimeGridIndicator 
              currentTime={currentTime} 
              showIndicator={isToday} 
              hourHeight={hourHeight}
            />
            {events
              .filter(e => e.date.toDateString() === displayDate.toDateString())
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
        </div>
      </div>
    </div>
  );
};
