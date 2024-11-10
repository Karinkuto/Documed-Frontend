'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/AnimatedDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Filter, SortAsc, Trash2, XIcon, Check } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Participant } from '@/types/Event';
import { mockUsers, searchUsers } from '@/data/mockUsers';

interface ParticipantsDialogProps {
  participants: Participant[];
  children: React.ReactNode;
}

export function ParticipantsDialog({ participants, children }: ParticipantsDialogProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Get unique departments from participants
  const departments = [...new Set(mockUsers.map(user => user.department))];

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                        p.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContainer>
        <DialogContent className="w-[90vw] max-w-3xl rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Participants
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {participants.length} total participants
              </p>
            </div>
            <DialogClose>
              <Button variant="ghost" size="icon">
                <XIcon className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedStatus(prev => 
                prev === 'all' ? 'confirmed' : prev === 'confirmed' ? 'pending' : 'all'
              )}
              className="min-w-[100px] justify-between"
            >
              {selectedStatus === 'all' ? 'All Status' : 
               selectedStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
              <Filter size={14} className="ml-2" />
            </Button>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['all', ...departments].map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDepartment(dept)}
                className="shrink-0"
              >
                {dept === 'all' ? 'All Departments' : dept}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-2">
              {filteredParticipants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No participants found
                </div>
              ) : (
                filteredParticipants.map((participant) => (
                  <div 
                    key={participant.email}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[#7EC143] transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-[#7EC143]/10 text-[#7EC143]">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                        <div className="text-xs text-gray-500">{participant.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={participant.status === 'confirmed' 
                          ? 'bg-[#7EC143]/10 text-[#7EC143] gap-1' 
                          : 'bg-yellow-100 text-yellow-800 gap-1'}
                      >
                        {participant.status === 'confirmed' && <Check size={12} />}
                        {participant.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
} 