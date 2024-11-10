"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/AnimatedDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarPlus } from "lucide-react";
import { useCalendarStore } from "@/services/calendarService";
import { Textarea } from "@/components/ui/textarea";
import { AddParticipantDialog } from '@/components/AddParticipantDialog';
import { MockUser } from '@/data/mockUsers';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from 'lucide-react';

interface ScheduleIntakeDialogProps {
  children: React.ReactNode;
}

export function ScheduleIntakeDialog({ children }: ScheduleIntakeDialogProps) {
  const { addEvent } = useCalendarStore();
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    group: "",
    deadline: "",
    sampleFormats: [] as { name: string }[],
    location: "",
    duration: 60,
    status: "upcoming",
    color: "blue",
  });
  const [selectedParticipants, setSelectedParticipants] = React.useState<MockUser[]>([]);

  const handleSubmit = () => {
    const colorSchemes = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-400",
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-400",
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        border: "border-purple-400",
      },
      red: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-400",
      },
    };

    const colors = colorSchemes[formData.color];

    const newEvent = {
      id: `REQ-${Math.floor(Math.random() * 100000).toString().padStart(6, "0")}`,
      title: formData.title,
      date: new Date(formData.deadline),
      createdAt: new Date(),
      description: formData.description,
      group: formData.group,
      issuer: "Admin",
      status: formData.status,
      users: selectedParticipants.length,
      avatars: selectedParticipants.map(p => p.avatar),
      location: formData.location,
      duration: formData.duration,
      participants: selectedParticipants.map(p => ({
        name: p.name,
        email: p.email,
        avatar: p.avatar,
        status: 'pending'
      })),
    };

    addEvent(newEvent);
  };

  const handleAddSample = () => {
    setFormData((prev) => ({
      ...prev,
      sampleFormats: [...prev.sampleFormats, { name: "Scan.png" }],
    }));
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
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
                Requirement ID: <span className="font-medium">001894</span> •
                Issued by Adminu
              </p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-[1.5fr,1fr] gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-800">
                  Basic Information
                </h3>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Requirement Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Provide a clear description of the requirement..."
                    className="h-24 py-2 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-800">
                  Schedule & Recipients
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Deadline
                    </label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          deadline: e.target.value,
                        }))
                      }
                      className="h-9"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Duration (minutes)
                    </label>
                    <Select
                      value={formData.duration.toString()}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className="h-9 relative z-[100]">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="180">3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Location
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="e.g., Room 101"
                      className="h-9"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      User Group
                    </label>
                    <Select
                      value={formData.group}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, group: value }))
                      }
                    >
                      <SelectTrigger className="h-9 relative z-[100]">
                        <SelectValue placeholder="Select target group" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        <SelectItem value="Students">Students</SelectItem>
                        <SelectItem value="Faculty">Faculty</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-800">
                  Appearance
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Status
                    </label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="h-9 relative z-[100]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Color Theme
                    </label>
                    <Select
                      value={formData.color}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, color: value }))
                      }
                    >
                      <SelectTrigger className="h-9 relative z-[100]">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Participants Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-800">
                  Participants ({selectedParticipants.length})
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  {selectedParticipants.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-500">
                        No participants added yet
                      </p>
                      <AddParticipantDialog
                        onSelect={(users) => setSelectedParticipants(users)}
                        selectedUsers={[]}
                        targetGroup={formData.group as 'Faculty' | 'Student' | 'Both'}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2 text-[#7EC143] border-[#7EC143] hover:bg-[#7EC143] hover:text-white h-8"
                        >
                          + Add Participants
                        </Button>
                      </AddParticipantDialog>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="max-h-[300px] overflow-y-auto space-y-2">
                        {selectedParticipants.map((participant) => (
                          <div
                            key={participant.id}
                            className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-100"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={participant.avatar} />
                                <AvatarFallback>
                                  {participant.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-xs font-medium">
                                  {participant.name}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  {participant.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] h-5">
                                {participant.role}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                onClick={() => setSelectedParticipants(prev => 
                                  prev.filter(p => p.id !== participant.id)
                                )}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <AddParticipantDialog
                        onSelect={(users) => setSelectedParticipants(prev => [...prev, ...users])}
                        selectedUsers={selectedParticipants.map(p => p.id)}
                        targetGroup={formData.group as 'Faculty' | 'Student' | 'Both'}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 text-[#7EC143] border-[#7EC143] hover:bg-[#7EC143] hover:text-white h-8"
                        >
                          + Add More Participants
                        </Button>
                      </AddParticipantDialog>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Formats Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-800">
                  Sample Formats
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  {formData.sampleFormats.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-500">
                        No sample formats added yet
                      </p>
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
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-100"
                        >
                          <span className="text-xs text-gray-600">
                            📄 {sample.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                sampleFormats: prev.sampleFormats.filter(
                                  (_, i) => i !== index
                                ),
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
            <DialogClose>
              <Button
                variant="outline"
                className="text-gray-600 px-4 h-9"
                onClick={() => {
                  setFormData({
                    title: "",
                    description: "",
                    group: "",
                    deadline: "",
                    sampleFormats: [],
                    location: "",
                    duration: 60,
                    status: "upcoming",
                    color: "blue",
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
