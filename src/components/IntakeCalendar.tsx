import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarPlus, ChevronRight, Users, Briefcase, Clock } from 'lucide-react'

interface IntakeItem {
  id: string;
  date: string;
  issuer: string;
  group: string;
  users: number;
}

const intakes: IntakeItem[] = [
  { id: 'CR-014/23', date: 'Today 07:19 AM', issuer: 'Tsion Abebe', group: 'Both', users: 3 },
  { id: 'CHU-16/24', date: '16 October 2019 at 5:00 PM', issuer: 'Helen', group: 'Students', users: 3 },
  { id: 'VAC-01/23', date: '20 October 2024 at 8:00 PM', issuer: 'you', group: 'Both', users: 3 },
  { id: 'REQ-02/23', date: '25 October 2019 at 10:00 PM', issuer: 'REQ-02/23', group: 'Faculty', users: 3 },
];

export function IntakeCalendar() {
  const [hoveredIntake, setHoveredIntake] = useState<string | null>(null);

  const getGroupIcon = (group: string) => {
    switch (group.toLowerCase()) {
      case 'students': return <Users size={12} className="text-blue-500" />;
      case 'faculty': return <Briefcase size={12} className="text-green-500" />;
      default: return <Users size={12} className="text-purple-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString.toLowerCase().startsWith('today')) {
      return dateString;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Card className="w-64 flex flex-col bg-white rounded-lg overflow-hidden h-[800px] border border-gray-200">
      <CardContent className="p-4 flex-grow flex flex-col">
        <Button className="w-full bg-[#7EC143] text-white hover:bg-[#6BAF32] mb-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 flex items-center justify-center">
          <CalendarPlus size={14} className="mr-2" />
          Schedule New Intake
        </Button>
        <h3 className="font-semibold text-sm mb-4 text-gray-800">Intakes starting soon</h3>
        <div className="flex-grow flex flex-col space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {intakes.map((intake, index) => (
            <div 
              key={intake.id}
              className="hover:bg-gray-50 p-3 rounded-md transition-all duration-200 border border-gray-100 hover:border-gray-200 cursor-pointer group"
              onMouseEnter={() => setHoveredIntake(intake.id)}
              onMouseLeave={() => setHoveredIntake(null)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-xs text-gray-800 group-hover:text-[#7EC143] transition-colors duration-200">{intake.id}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <Clock size={10} className="mr-1" />
                    {formatDate(intake.date)}
                  </div>
                </div>
                <div className={`transition-opacity duration-200 ${hoveredIntake === intake.id ? 'opacity-100' : 'opacity-0'}`}>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-[#7EC143]" />
                </div>
              </div>
              <div className="text-xs mt-2 flex items-center">
                <span className="font-medium text-gray-700 mr-1">Issued by:</span>
                <span className="text-gray-600">{intake.issuer}</span>
              </div>
              <div className="text-xs mt-1 flex items-center">
                {getGroupIcon(intake.group)}
                <span className="ml-1 text-gray-600">{intake.group}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  {[...Array(intake.users)].map((_, i) => (
                    <Avatar key={i} className="w-6 h-6 -ml-1.5 first:ml-0 border-2 border-white">
                      <AvatarFallback className="text-[10px] bg-blue-100 text-blue-600">
                        {String.fromCharCode(65 + i)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 rounded-full px-1.5 py-0.5">
                    +{15 + index}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="p-4 border-t border-gray-100">
        <Button variant="outline" className="w-full text-xs text-gray-600 hover:text-[#7EC143] bg-transparent hover:bg-gray-50 py-1.5 transition-all duration-200">
          See More
        </Button>
      </div>
    </Card>
  )
}
