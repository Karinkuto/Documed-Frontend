'use client';

import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/AnimatedDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Briefcase, Clock, XIcon, Calendar } from 'lucide-react';
import { Event } from '@/types/Event';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParticipantsDialog } from '@/components/ParticipantsDialog';

interface IntakeDetailsDialogProps {
  event: Event;
  children: React.ReactNode;
}

export function IntakeDetailsDialog({ event, children }: IntakeDetailsDialogProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGroupIcon = (group: string | undefined) => {
    switch (group?.toLowerCase()) {
      case 'students': return <Users size={14} className="text-[#7EC143]" />;
      case 'faculty': return <Briefcase size={14} className="text-[#7EC143]" />;
      default: return <Users size={14} className="text-[#7EC143]" />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContainer>
        <DialogContent className="w-[90vw] max-w-2xl rounded-xl bg-white p-6 shadow-lg">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-sm opacity-70 transition-all hover:opacity-100">
            <XIcon className="h-4 w-4 text-gray-500" />
          </DialogClose>

          {/* Title & Status */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {event.title || event.id}
              </DialogTitle>
              <Badge className="bg-[#7EC143]/10 text-[#7EC143] font-medium">
                {event.status || 'upcoming'}
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Description */}
            {event.description && (
              <div>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            )}

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-6 py-4 border-y border-gray-100">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Intake Date</div>
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock size={14} className="mr-2 text-[#7EC143]" />
                    {formatDate(event.date)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Location</div>
                  <div className="text-sm text-gray-900">{event.location || 'Not specified'}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Target Group</div>
                  <div className="flex items-center text-sm text-gray-900">
                    {getGroupIcon(event.group)}
                    <span className="ml-2">{event.group || 'All'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Created On</div>
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar size={14} className="mr-2 text-[#7EC143]" />
                    {formatDate(event.createdAt)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Issued By</div>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={event.issuerAvatar} />
                      <AvatarFallback className="bg-[#7EC143]/10 text-[#7EC143]">
                        {event.issuer?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-900">{event.issuer}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Participants ({event.users})</div>
                  <ParticipantsDialog participants={event.participants || []}>
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-90">
                      {event.avatars.slice(0, 3).map((avatar, i) => (
                        <Avatar key={i} className="w-6 h-6 border-2 border-white">
                          <AvatarImage src={avatar} />
                          <AvatarFallback className="bg-[#7EC143]/10 text-[#7EC143] text-xs">
                            {String.fromCharCode(65 + i)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {event.users > 3 && (
                        <div className="h-6 text-xs ml-2 px-2 py-1 bg-[#7EC143]/10 text-[#7EC143] rounded-full">
                          +{event.users - 3} more
                        </div>
                      )}
                    </div>
                  </ParticipantsDialog>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
}
