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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Filter } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { MockUser, searchUsers } from '@/data/mockUsers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AddParticipantDialogProps {
  onSelect: (users: MockUser[]) => void;
  selectedUsers?: string[];
  targetGroup?: 'Faculty' | 'Student' | 'Both';
  children: React.ReactNode;
}

export function AddParticipantDialog({ 
  onSelect, 
  selectedUsers = [], 
  targetGroup,
  children 
}: AddParticipantDialogProps) {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Faculty' | 'Student' | undefined>(
    targetGroup === 'Both' ? undefined : targetGroup as 'Faculty' | 'Student' | undefined
  );
  const [selected, setSelected] = useState<string[]>(selectedUsers);

  const users = searchUsers(search, selectedRole);

  const handleSelect = (userId: string) => {
    setSelected(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleConfirm = () => {
    const selectedParticipants = users.filter(user => selected.includes(user.id));
    onSelect(selectedParticipants);
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContainer>
        <DialogContent className="w-[90vw] max-w-2xl rounded-xl bg-white p-6 shadow-lg">
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-6">
            Add Participants
          </DialogTitle>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-9"
              />
            </div>
            
            {targetGroup === 'Both' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter size={14} className="mr-2" />
                    {selectedRole || 'All Roles'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedRole(undefined)}>
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRole('Faculty')}>
                    Faculty
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRole('Student')}>
                    Student
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <ScrollArea className="h-[50vh] mb-6">
            <div className="space-y-2">
              {users.map((user) => (
                <div 
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selected.includes(user.id) ? 'bg-[#7EC143]/10' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelect(user.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{user.role}</Badge>
                    <Badge variant="outline">{user.department}</Badge>
                    {selected.includes(user.id) && (
                      <Badge className="bg-[#7EC143] text-white">Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
            <div className="text-sm text-gray-500">
              {selected.length} users selected
            </div>
            <div className="flex gap-2">
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose>
                <Button 
                  className="bg-[#7EC143] hover:bg-[#7EC143]/90 text-white"
                  onClick={handleConfirm}
                >
                  Add Selected
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
} 