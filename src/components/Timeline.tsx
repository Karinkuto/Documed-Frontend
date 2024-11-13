import { Activity } from "lucide-react";

interface TimelineActivity {
  date: string;
  action: string;
  details: string;
}

interface TimelineProps {
  activities: TimelineActivity[];
}

export default function Timeline({ activities }: TimelineProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="rounded-full p-1 bg-green-100">
              <Activity className="h-4 w-4 text-[#7EC143]" />
            </div>
            {index !== activities.length - 1 && (
              <div className="w-px h-full bg-gray-200 my-1" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{activity.action}</p>
            <p className="text-sm text-gray-500">{activity.details}</p>
            <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 