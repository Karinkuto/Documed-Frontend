import { Calendar, Clock, CalendarDays } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

type CalendarView = 'day' | 'week' | 'month';

interface CalendarViewPickerProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarViewPicker({ currentView, onViewChange }: CalendarViewPickerProps) {
  const VIEWS: { label: CalendarView; icon: React.ReactNode }[] = [
    {
      label: 'day',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: 'week',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      label: 'month',
      icon: <CalendarDays className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex rounded-md border border-gray-200 bg-white p-1">
      <AnimatedBackground
        defaultValue={currentView}
        className="rounded-sm bg-gray-100"
        transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.3,
        }}
        onValueChange={(newView) => onViewChange(newView as CalendarView)}
      >
        {VIEWS.map((view) => (
          <button
            key={view.label}
            data-id={view.label}
            type="button"
            className="relative inline-flex h-7 items-center justify-center px-3 text-xs text-gray-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-gray-900"
          >
            <span className="flex items-center">
              {view.icon}
              <span className="ml-2">{view.label.charAt(0).toUpperCase() + view.label.slice(1)}</span>
            </span>
          </button>
        ))}
      </AnimatedBackground>
    </div>
  );
}
