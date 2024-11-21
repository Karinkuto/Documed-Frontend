import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Event } from '@/types/Event';

interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  loadEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      isLoading: false,
      error: null,

      loadEvents: async () => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call when available
          set(state => ({ ...state, isLoading: false }));
        } catch (error) {
          console.error('Error loading events:', error);
          set(state => ({ ...state, error: 'Failed to load events', isLoading: false }));
        }
      },

      addEvent: async (event) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call when available
          const newEvent: Event = {
            ...event,
            id: 'evt_' + Date.now().toString(36),
            createdAt: new Date(),
          };
          
          set(state => ({
            events: [...state.events, newEvent],
            isLoading: false
          }));
          
          return newEvent;
        } catch (error) {
          console.error('Error adding event:', error);
          set(state => ({ ...state, error: 'Failed to create event', isLoading: false }));
          throw error;
        }
      },

      updateEvent: async (id, event) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call when available
          set(state => ({
            events: state.events.map(e => e.id === id ? { ...e, ...event } : e),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error updating event:', error);
          set(state => ({ ...state, error: 'Failed to update event', isLoading: false }));
          throw error;
        }
      },

      deleteEvent: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call when available
          set(state => ({
            events: state.events.filter(e => e.id !== id),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error deleting event:', error);
          set(state => ({ ...state, error: 'Failed to delete event', isLoading: false }));
          throw error;
        }
      },
    }),
    {
      name: 'events-storage',
      partialize: (state) => ({ events: state.events }),
    }
  )
);
