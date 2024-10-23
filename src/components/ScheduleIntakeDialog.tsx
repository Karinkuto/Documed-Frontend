'use client';

import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/AnimatedDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarPlus } from 'lucide-react';
import { useCalendarStore } from '@/services/calendarService';
import { Textarea } from "@/components/ui/textarea";

interface ScheduleIntakeDialogProps {
  children: React.ReactNode;
}

export function ScheduleIntakeDialog({ children }: ScheduleIntakeDialogProps) {
  const { addEvent } = useCalendarStore();
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    group: '',
    deadline: '',
    sampleFormats: [] as { name: string }[],
  });

  const handleSubmit = () => {
    const newEvent = {
      id: `REQ-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      title: formData.title,
      date: new Date(formData.deadline),
      description: formData.description,
      group: formData.group,
      issuer: 'Adminu',
      status: 'upcoming',
      users: 0,
      avatars: [],
      color: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-400',
      location: 'TBD',
      duration: 60,
      stats: [
        { name: "Completed", value: 0 },
        { name: "In Progress", value: 0 },
        { name: "Pending", value: 100 }
      ]
    };

    addEvent(newEvent);
  };

  const handleAddSample = () => {
    setFormData(prev => ({
      ...prev,
      sampleFormats: [...prev.sampleFormats, { name: 'Scan.png' }]
    }));
  };

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContainer>
        <DialogContent className="w-[90vw] max-w-3xl rounded-xl bg-white p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="h-9 w-9 rounded-full bg-[#7EC143]/10 flex items-center justify-center">
              <CalendarPlus className="h-4 w-4 text-[#7EC143]" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Create New Requirement
              </DialogTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                Requirement ID: <span className="font-medium">001894</span> • Issued by Adminu
              </p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-[1.5fr,1fr] gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-800">Basic Information</h3>
                
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Requirement Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Monthly Health Certificate"
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide a clear description of the requirement..."
                    className="h-24 py-2 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-800">Schedule & Recipients</h3>
                
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Deadline
                  </label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    User Group
                  </label>
                  <Select 
                    value={formData.group}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, group: value }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select target group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Students">Students</SelectItem>
                      <SelectItem value="Faculty">Faculty</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-800">Sample Formats</h3>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  {formData.sampleFormats.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-500">No sample formats added yet</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddSample}
                        className="mt-2 text-[#7EC143] border-[#7EC143] hover:bg-[#7EC143] hover:text-white h-8"
                      >
                        + Add Sample Format
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.sampleFormats.map((sample, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-100">
                          <span className="text-xs text-gray-600">📄 {sample.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                sampleFormats: prev.sampleFormats.filter((_, i) => i !== index)
                              }));
                            }}
                            className="ml-auto text-gray-400 hover:text-gray-600 h-auto p-1"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddSample}
                        className="w-full mt-2 text-[#7EC143] border-[#7EC143] hover:bg-[#7EC143] hover:text-white h-8"
                      >
                        + Add Another Sample
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="text-gray-600 px-4 h-9"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    group: '',
                    deadline: '',
                    sampleFormats: [],
                  });
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-[#7EC143] text-white hover:bg-[#6BAF32] px-4 h-9"
              onClick={handleSubmit}
            >
              Create Requirement
            </Button>
          </div>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
}
