import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Stethoscope, 
  Pill, 
  FileText, 
  Syringe, 
  Activity,
  CalendarCheck 
} from 'lucide-react';

// Mock data - replace with real data from your API
const timelineData = [
  {
    id: 1,
    date: '2024-03-15',
    type: 'appointment',
    title: 'Regular Checkup',
    description: 'Annual physical examination with Dr. Smith',
    icon: Stethoscope,
    category: 'Checkup',
  },
  {
    id: 2,
    date: '2024-03-10',
    type: 'prescription',
    title: 'New Prescription',
    description: 'Prescribed antibiotics for respiratory infection',
    icon: Pill,
    category: 'Medication',
  },
  // Add more timeline items as needed
];

const TimelineItem = ({ item, isLast }) => {
  const getIconColor = (type) => {
    const colors = {
      appointment: 'text-blue-500',
      prescription: 'text-green-500',
      test: 'text-purple-500',
      vaccination: 'text-orange-500',
      procedure: 'text-red-500',
    };
    return colors[type] || 'text-gray-500';
  };

  return (
    <div className="relative pb-8">
      {!isLast && (
        <span
          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        />
      )}
      <div className="relative flex space-x-3">
        <div>
          <span className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-opacity-10",
            `bg-${getIconColor(item.type)}-50`
          )}>
            <item.icon className={cn("h-5 w-5", getIconColor(item.type))} />
          </span>
        </div>
        <div className="flex min-w-0 flex-1 justify-between space-x-4">
          <div>
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
          <div className="whitespace-nowrap text-right text-sm">
            <time className="text-gray-500">{item.date}</time>
            <Badge variant="secondary" className="ml-2">
              {item.category}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

const MedicalTimeline = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Medical History</h2>
          <p className="text-sm text-gray-500">Complete timeline of medical events</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {timelineData.map((item, idx) => (
                <li key={item.id}>
                  <TimelineItem 
                    item={item} 
                    isLast={idx === timelineData.length - 1} 
                  />
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalTimeline; 