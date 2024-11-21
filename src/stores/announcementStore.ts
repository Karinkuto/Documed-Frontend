import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';

interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  attachments?: Array<{
    name: string;
    url: string;
  }>;
  comments?: Array<{
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: string;
  }>;
}

interface AnnouncementState {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  loadAnnouncements: () => Promise<void>;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Announcement>;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  addComment: (announcementId: string, comment: { content: string; authorId: string }) => Promise<void>;
}

export const useAnnouncementStore = create<AnnouncementState>()(
  persist(
    (set, get) => ({
      announcements: [],
      isLoading: false,
      error: null,

      loadAnnouncements: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get<Announcement[]>(API_ENDPOINTS.ANNOUNCEMENTS.LIST);
          if (response.data) {
            set({ announcements: response.data, isLoading: false });
          } else {
            set(state => ({ ...state, isLoading: false }));
          }
        } catch (error) {
          console.error('Error loading announcements:', error);
          set(state => ({ ...state, error: 'Failed to load announcements', isLoading: false }));
        }
      },

      addAnnouncement: async (announcement) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<Announcement>(
            API_ENDPOINTS.ANNOUNCEMENTS.CREATE,
            announcement
          );
          const newAnnouncement = response.data;
          
          set(state => ({
            announcements: [...state.announcements, newAnnouncement],
            isLoading: false
          }));
          
          return newAnnouncement;
        } catch (error) {
          console.error('Error adding announcement:', error);
          set(state => ({ ...state, error: 'Failed to create announcement', isLoading: false }));
          throw error;
        }
      },

      updateAnnouncement: async (id, announcement) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.put<Announcement>(
            API_ENDPOINTS.ANNOUNCEMENTS.UPDATE(id),
            announcement
          );
          const updatedAnnouncement = response.data;
          
          set(state => ({
            announcements: state.announcements.map(a => 
              a.id === id ? updatedAnnouncement : a
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error updating announcement:', error);
          set(state => ({ ...state, error: 'Failed to update announcement', isLoading: false }));
          throw error;
        }
      },

      deleteAnnouncement: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.delete(API_ENDPOINTS.ANNOUNCEMENTS.DELETE(id));
          set(state => ({
            announcements: state.announcements.filter(a => a.id !== id),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error deleting announcement:', error);
          set(state => ({ ...state, error: 'Failed to delete announcement', isLoading: false }));
          throw error;
        }
      },

      togglePin: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.put(API_ENDPOINTS.ANNOUNCEMENTS.TOGGLE_PIN(id));
          set(state => ({
            announcements: state.announcements.map(a => 
              a.id === id ? { ...a, isPinned: !a.isPinned } : a
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error toggling pin:', error);
          set(state => ({ ...state, error: 'Failed to toggle pin', isLoading: false }));
          throw error;
        }
      },

      addComment: async (announcementId, comment) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API endpoint when available
          const newComment = {
            id: Date.now().toString(),
            ...comment,
            createdAt: new Date().toISOString(),
          };

          set(state => ({
            announcements: state.announcements.map(a => 
              a.id === announcementId
                ? {
                    ...a,
                    comments: [...(a.comments || []), newComment],
                  }
                : a
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error adding comment:', error);
          set(state => ({ ...state, error: 'Failed to add comment', isLoading: false }));
          throw error;
        }
      },
    }),
    {
      name: 'announcements-storage',
      partialize: (state) => ({ 
        announcements: state.announcements.map(a => ({
          ...a,
          comments: a.comments?.slice(-10) // Only persist last 10 comments
        }))
      }),
    }
  )
);
