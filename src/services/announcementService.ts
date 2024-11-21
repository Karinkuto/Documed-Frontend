import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import type { Announcement } from '@/types/Announcement';
import type { ApiResponse } from '@/config/api';

export const announcementService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    const response = await apiClient.get<ApiResponse<Announcement[]>>(API_ENDPOINTS.ANNOUNCEMENTS.LIST);
    return response.data.data;
  },

  createAnnouncement: async (announcement: Omit<Announcement, 'id'>): Promise<Announcement> => {
    const response = await apiClient.post<ApiResponse<Announcement>>(
      API_ENDPOINTS.ANNOUNCEMENTS.CREATE,
      announcement
    );
    return response.data.data;
  },

  updateAnnouncement: async (id: string, announcement: Partial<Announcement>): Promise<Announcement> => {
    const response = await apiClient.put<ApiResponse<Announcement>>(
      API_ENDPOINTS.ANNOUNCEMENTS.UPDATE(id),
      announcement
    );
    return response.data.data;
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ANNOUNCEMENTS.DELETE(id));
  },

  togglePin: async (id: string): Promise<Announcement> => {
    const response = await apiClient.patch<ApiResponse<Announcement>>(
      API_ENDPOINTS.ANNOUNCEMENTS.TOGGLE_PIN(id)
    );
    return response.data.data;
  },
};
