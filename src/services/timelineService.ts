import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import type { TimelineItem } from '@/types/Timeline';
import type { ApiResponse } from '@/config/api';

export const timelineService = {
  getPatientTimeline: async (patientId: string): Promise<TimelineItem[]> => {
    const response = await apiClient.get<ApiResponse<TimelineItem[]>>(
      API_ENDPOINTS.MEDICAL_TIMELINE.LIST(patientId)
    );
    return response.data.data;
  },

  addTimelineItem: async (item: Omit<TimelineItem, 'id'>): Promise<TimelineItem> => {
    const response = await apiClient.post<ApiResponse<TimelineItem>>(
      API_ENDPOINTS.MEDICAL_TIMELINE.CREATE,
      item
    );
    return response.data.data;
  },

  updateTimelineItem: async (id: string, item: Partial<TimelineItem>): Promise<TimelineItem> => {
    const response = await apiClient.put<ApiResponse<TimelineItem>>(
      API_ENDPOINTS.MEDICAL_TIMELINE.UPDATE(id),
      item
    );
    return response.data.data;
  },

  deleteTimelineItem: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.MEDICAL_TIMELINE.DELETE(id));
  },
};
