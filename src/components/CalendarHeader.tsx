import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { CalendarViewPicker } from "@/components/CalendarViewPicker";
import { formatMonthYear } from '@/utils/dateHelpers';

interface CalendarHeaderProps {
  displayDate: Date;
  currentView: 'day' | 'week' | 'month';
  daysInWeek: { date: Date; isCurrentMonth: boolean }[];
  todayButtonClass: string;
  onChangeDate: (delta: number) => void;
  onGoToToday: () => void;
  onViewChange: (view: 'day' | 'week' | 'month') => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  displayDate,
  currentView,
  daysInWeek,
  todayButtonClass,
  onChangeDate,
  onGoToToday,
  onViewChange,
}) => {
  const formatHeaderDate = () => {
    switch (currentView) {
      case 'day':
        return `${displayDate.toLocaleString('default', { weekday: 'short' })} ${displayDate.getDate()} ${displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
      case 'week':
      case 'month':
        return displayDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white border-b">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onChangeDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onChangeDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          {formatHeaderDate()}
        </h2>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`font-medium flex items-center justify-center ${todayButtonClass}`}
          onClick={onGoToToday}
        >
          <CalendarIcon className="mr-1 h-3 w-3" />
          Today
        </Button>
        <CalendarViewPicker currentView={currentView} onViewChange={onViewChange} />
      </div>
    </div>
  );
};
