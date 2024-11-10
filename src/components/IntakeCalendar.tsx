import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarPlus,
  ChevronRight,
  Users,
  Briefcase,
  Clock,
} from "lucide-react";
import { useCalendarStore, Event } from "@/services/calendarService";
import { IntakeDetailsDialog } from "@/components/IntakeDetailsDialog";
import { ScheduleIntakeDialog } from "@/components/ScheduleIntakeDialog";
import { SeeMoreIntakesDialog } from "@/components/SeeMoreIntakesDialog";

interface IntakeCalendarProps {
  todayButtonClass: string;
}

export function IntakeCalendar({ todayButtonClass }: IntakeCalendarProps) {
  const [hoveredIntake, setHoveredIntake] = useState<string | null>(null);
  const events = useCalendarStore((state) => state.events);
  const fetchEvents = useCalendarStore((state) => state.fetchEvents);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleEvents, setVisibleEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const calculateVisibleEvents = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerHeight = container.parentElement?.clientHeight || 0;
      const headerHeight = 80; // Approximate height of the "Schedule" button and "Intakes starting soon" text
      const availableHeight = containerHeight - headerHeight;

      // Get the actual height of the first event card if it exists
      const firstEventCard = container.firstElementChild;
      const eventCardHeight = firstEventCard
        ? firstEventCard.clientHeight + 12
        : 120; // 12px for margin

      const possibleEvents = Math.floor(availableHeight / eventCardHeight);
      setVisibleEvents(events.slice(0, Math.max(1, possibleEvents)));
    };

    // Create a ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleEvents();
    });

    // Observe the container
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      // Also observe the parent element to catch container size changes
      if (containerRef.current.parentElement) {
        resizeObserver.observe(containerRef.current.parentElement);
      }
    }

    // Initial calculation
    calculateVisibleEvents();

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [events]);

  const getGroupIcon = (group: string) => {
    switch (group?.toLowerCase()) {
      case "students":
        return <Users size={12} className="text-blue-500" />;
      case "faculty":
        return <Briefcase size={12} className="text-green-500" />;
      default:
        return <Users size={12} className="text-purple-500" />;
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="w-64 flex flex-col bg-white rounded-lg overflow-hidden border border-gray-200">
      <CardContent className="p-4 flex flex-col h-full relative">
        <ScheduleIntakeDialog>
          <Button
            className={`today-button ${todayButtonClass} w-full bg-white hover:bg-gray-50 mb-4 group border border-gray-200`}
          >
            <div className="flex w-full">
              {/* Left column with icon and primary text */}
              <div className="flex-1 flex items-center justify-start border-r border-gray-200 pr-3">
                <CalendarPlus size={16} className="text-[#7EC143] mr-2" />
                <span className="text-gray-700 font-medium text-sm">
                  Schedule
                </span>
              </div>

              {/* Right column with secondary text and transition effect */}
              <div className="flex-1 flex items-center justify-end pl-3">
                <span className="text-xs text-gray-500 group-hover:text-[#7EC143] transition-colors duration-200">
                  New Intake
                </span>
                <ChevronRight
                  size={14}
                  className="ml-1 text-gray-400 group-hover:text-[#7EC143] transition-colors duration-200"
                />
              </div>
            </div>
          </Button>
        </ScheduleIntakeDialog>

        <h3 className="font-semibold text-sm mb-4 text-gray-800">
          Intakes starting soon
        </h3>
        <div
          ref={containerRef}
          className="flex-grow flex flex-col space-y-3 overflow-hidden"
        >
          {visibleEvents.map((event) => (
            <IntakeDetailsDialog key={event.id} event={event}>
              <div
                className="hover:bg-gray-50 p-3 rounded-md transition-all duration-200 border border-gray-100 hover:border-gray-200 cursor-pointer group"
                onMouseEnter={() => setHoveredIntake(event.id)}
                onMouseLeave={() => setHoveredIntake(null)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-xs text-gray-800 group-hover:text-[#7EC143] transition-colors duration-200">
                      {event.id}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock size={10} className="mr-1" />
                      {formatDate(event.date)}
                    </div>
                  </div>
                  <div
                    className={`transition-opacity duration-200 ${
                      hoveredIntake === event.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <ChevronRight
                      size={16}
                      className="text-gray-400 group-hover:text-[#7EC143]"
                    />
                  </div>
                </div>
                <div className="text-xs mt-2 flex items-center">
                  <span className="font-medium text-gray-700 mr-1">
                    Issued by:
                  </span>
                  <span className="text-gray-600">{event.issuer || "N/A"}</span>
                </div>
                <div className="text-xs mt-1 flex items-center">
                  {getGroupIcon(event.group || "")}
                  <span className="ml-1 text-gray-600">
                    {event.group || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    {event.avatars
                      .slice(0, 3)
                      .map((avatar: string, i: number) => (
                        <Avatar
                          key={i}
                          className="w-6 h-6 -ml-1.5 first:ml-0 border-2 border-white"
                        >
                          <AvatarImage src={avatar} alt={`User ${i + 1}`} />
                          <AvatarFallback className="text-[10px] bg-[#7EC143]/10 text-[#7EC143]">
                            {String.fromCharCode(65 + i)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    {event.users > 3 && (
                      <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 rounded-full px-1.5 py-0.5">
                        +{event.users - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </IntakeDetailsDialog>
          ))}
        </div>

        {/* Gradient overlay and See More button */}
        {events.length > visibleEvents.length && (
          <div
            className="absolute bottom-0 left-0 right-0 h-32 flex items-end"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,1) 100%)",
            }}
          >
            <div className="w-full px-4">
              <SeeMoreIntakesDialog events={events}>
                <Button
                  variant="outline"
                  className="w-full mb-4 text-xs text-gray-600 hover:text-[#7EC143] bg-transparent hover:bg-gray-50 transition-all duration-200"
                >
                  See More
                </Button>
              </SeeMoreIntakesDialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
