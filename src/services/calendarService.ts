import { create } from 'zustand';
import { Event } from '@/types/Event';
import { mockUsers, getRandomParticipants } from '@/data/mockUsers';

const getEventColors = (group?: string) => {
  switch (group?.toLowerCase()) {
    case 'faculty':
      return {
        color: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
      };
    case 'students':
      return {
        color: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
      };
    case 'both':
      return {
        color: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200'
      };
    default:
      return {
        color: 'bg-gray-50',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200'
      };
  }
};

interface CalendarStore {
  events: Event[];
  fetchEvents: () => void;
  addEvent: (event: Event) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],
  fetchEvents: () => {
    const mockEvents: Event[] = [
      {
        id: 'CR-014/23',
        title: 'Team Check-up',
        date: new Date('2024-11-15T10:00:00'),
        createdAt: new Date('2024-11-01T09:00:00'),
        description: 'Monthly team progress meeting',
        group: 'Both',
        issuer: 'John Doe',
        issuerAvatar: '/avatars/john.jpg',
        status: 'upcoming',
        location: 'Conference Room A',
        participants: mockUsers.slice(0, 18).map(user => ({
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          status: user.status
        })),
        users: 18,
        avatars: mockUsers.slice(0, 3).map(user => user.avatar),
        ...getEventColors('Both')
      },
      {
        id: 'CHU-16/24',
        title: 'Department Review',
        date: new Date('2024-11-20T14:30:00'),
        createdAt: new Date('2024-11-05T11:00:00'),
        description: 'Quarterly department performance review',
        group: 'Faculty',
        issuer: 'Jane Smith',
        issuerAvatar: '/avatars/jane.jpg',
        status: 'upcoming',
        location: 'Meeting Room B',
        participants: getRandomParticipants(23),
        users: 23,
        avatars: getRandomParticipants(23).slice(0, 3).map(p => p.avatar),
        ...getEventColors('Faculty')
      },
    ];

    set({ events: mockEvents });
  },
  addEvent: (event) => set((state) => ({ 
    events: [...state.events, {
      ...event,
      participants: event.participants || [],
      avatars: event.participants?.map(p => p.avatar).slice(0, 3) || [],
      users: event.participants?.length || 0,
      ...getEventColors(event.group)
    }] 
  })),
}));
