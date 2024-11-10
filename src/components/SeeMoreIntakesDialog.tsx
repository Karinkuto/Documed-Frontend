import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/AnimatedDialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Event } from "@/services/calendarService";
import { Clock, Users, Briefcase, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IntakeDetailsDialog } from "@/components/IntakeDetailsDialog";

interface SeeMoreIntakesDialogProps {
  events: Event[];
  children: React.ReactNode;
}

export function SeeMoreIntakesDialog({
  events,
  children,
}: SeeMoreIntakesDialogProps) {
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

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContainer>
        <DialogContent className="w-[90vw] max-w-6xl rounded-xl bg-white p-6 shadow-lg">
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-6">
            All Upcoming Intakes
          </DialogTitle>

          <ScrollArea className="h-[70vh]">
            <div className="space-y-3 pr-4">
              {events.map((event) => (
                <IntakeDetailsDialog key={event.id} event={event}>
                  <div className="hover:bg-gray-50 p-4 rounded-lg transition-all duration-200 border border-gray-200 hover:border-[#7EC143] cursor-pointer group w-full">
                    <div className="flex items-center gap-8">
                      {/* Left section - ID and Date */}
                      <div className="w-44 shrink-0">
                        <div className="font-semibold text-sm text-gray-800 group-hover:text-[#7EC143] transition-colors duration-200">
                          {event.id}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatDate(event.date)}
                        </div>
                      </div>

                      {/* Issuer section */}
                      <div className="w-72 shrink-0">
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700">
                            Issued by:
                          </span>
                          <span className="ml-1 text-gray-600 truncate">
                            {event.issuer || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Group section */}
                      <div className="w-40 shrink-0">
                        <div className="flex items-center text-sm">
                          {getGroupIcon(event.group || "")}
                          <span className="ml-1 text-gray-600">
                            {event.group || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Right section - Avatars and Count */}
                      <div className="flex items-center gap-3 ml-auto">
                        <div className="flex items-center">
                          {event.avatars
                            .slice(0, 3)
                            .map((avatar: string, i: number) => (
                              <Avatar
                                key={i}
                                className="w-7 h-7 -ml-2 first:ml-0 border-2 border-white"
                              >
                                <AvatarImage
                                  src={avatar}
                                  alt={`User ${i + 1}`}
                                />
                                <AvatarFallback className="text-[10px] bg-blue-100 text-blue-600">
                                  {String.fromCharCode(65 + i)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                        </div>
                        {event.users > 3 && (
                          <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1 shrink-0">
                            +{event.users - 3} more
                          </span>
                        )}
                        <ChevronRight
                          size={16}
                          className="text-gray-400 group-hover:text-[#7EC143] opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2"
                        />
                      </div>
                    </div>
                  </div>
                </IntakeDetailsDialog>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
            <DialogClose>
              <Button variant="outline" className="text-gray-600">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
}
