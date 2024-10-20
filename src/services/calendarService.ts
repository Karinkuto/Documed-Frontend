import { create } from 'zustand'

export interface Event {
  id: string;
  title: string;
  date: Date;
  color: string;
  textColor: string;
  borderColor: string;
  description?: string;
  issuer: string;
  group: string;
  users: number;
  status?: 'upcoming' | 'in-progress' | 'completed';
  location?: string;
  duration: number; // in minutes
  avatars: string[]; // URLs for avatar images
}

interface CalendarState {
  events: Event[];
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  fetchEvents: () => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  removeEvent: (id) => set((state) => ({ events: state.events.filter(e => e.id !== id) })),
  updateEvent: (id, updatedEvent) => set((state) => ({
    events: state.events.map(e => e.id === id ? { ...e, ...updatedEvent } : e)
  })),
  fetchEvents: async () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const mockEvents: Event[] = [
      { 
        id: 'CR-014/23', 
        title: 'Client Review', 
        date: new Date(currentYear, currentMonth, 15, 10, 0),
        color: 'bg-indigo-100', 
        textColor: 'text-indigo-700', 
        borderColor: 'border-indigo-400', 
        description: 'Annual review with client XYZ',
        issuer: 'John Doe',
        group: 'Both',
        users: 18,
        status: 'upcoming',
        location: 'Conference Room A',
        duration: 120,
        avatars: [
          'https://i.pravatar.cc/150?img=1',
          'https://i.pravatar.cc/150?img=2',
          'https://i.pravatar.cc/150?img=3',
        ]
      },
      { 
        id: 'CHU-16/24', 
        title: 'Team Check-up', 
        date: new Date(currentYear, currentMonth, 20, 14, 30),
        color: 'bg-pink-100', 
        textColor: 'text-pink-700', 
        borderColor: 'border-pink-400', 
        description: 'Monthly team progress meeting',
        issuer: 'Jane Smith',
        group: 'Faculty',
        users: 23,
        status: 'upcoming',
        location: 'Meeting Room B',
        duration: 60,
        avatars: [
          'https://i.pravatar.cc/150?img=4',
          'https://i.pravatar.cc/150?img=5',
          'https://i.pravatar.cc/150?img=6',
        ]
      },
      { 
        id: 'VAC-01/23', 
        title: 'Vacation', 
        date: new Date(2023, 9, 26, 9, 0),
        color: 'bg-orange-100', 
        textColor: 'text-orange-700', 
        borderColor: 'border-orange-400', 
        description: 'Team building retreat',
        issuer: 'HR Department',
        group: 'Both',
        users: 35,
        status: 'upcoming',
        location: 'Offsite Resort',
        duration: 480,
        avatars: [
          'https://i.pravatar.cc/150?img=7',
          'https://i.pravatar.cc/150?img=8',
          'https://i.pravatar.cc/150?img=9',
        ]
      },
      { 
        id: 'REQ-02/23', 
        title: 'Requirements Gathering', 
        date: new Date(2023, 9, 27, 13, 0),
        color: 'bg-blue-100', 
        textColor: 'text-blue-700', 
        borderColor: 'border-blue-400', 
        description: 'Initial meeting for new project',
        issuer: 'Project Manager',
        group: 'Students',
        users: 27,
        status: 'upcoming',
        location: 'Lab 101',
        duration: 180,
        avatars: [
          'https://i.pravatar.cc/150?img=10',
          'https://i.pravatar.cc/150?img=11',
          'https://i.pravatar.cc/150?img=12',
        ]
      },
    ];
    set({ events: mockEvents });
  },
}));
