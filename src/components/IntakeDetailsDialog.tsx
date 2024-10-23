'use client';

import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/components/AnimatedDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Briefcase, Clock, XIcon } from 'lucide-react';
import { Event } from '@/types/Event';

interface IntakeDetailsDialogProps {
  event: Event;
  children: React.ReactNode;
}

export function IntakeDetailsDialog({ event, children }: IntakeDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContainer>
        <DialogContent className="w-[90vw] max-w-3xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-sm opacity-70 transition-all hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-gray-600">
            <XIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </DialogClose>

          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {event.title} - {event.id}
          </DialogTitle>

          <div className="mt-4 grid gap-4">
            {/* Basic Info Section */}
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock size={16} />
                <span>{event.date.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                {event.group?.toLowerCase() === 'students' ? (
                  <Users size={16} className="text-blue-500" />
                ) : (
                  <Briefcase size={16} className="text-green-500" />
                )}
                <span>{event.group}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Location:</span> {event.location}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Duration:</span> {event.duration} minutes
              </div>
            </div>

            {/* Description */}
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {event.description}
            </div>

            {/* Participants Section */}
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Participants
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {event.avatars.map((avatar, i) => (
                  <Avatar key={i} className="h-8 w-8">
                    <AvatarImage src={avatar} alt={`Participant ${i + 1}`} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {event.users > event.avatars.length && (
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
                    +{event.users - event.avatars.length} more
                  </span>
                )}
              </div>
            </div>

            {/* Statistics Section */}
            {event.stats && (
              <DialogDescription className="mt-6">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Statistics
                  </h3>
                  <div className="grid gap-2">
                    {event.stats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {stat.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full bg-[#7EC143]"
                              style={{ width: `${stat.value}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {stat.value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogDescription>
            )}
          </div>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
}
