import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import type { MedicalRecord } from '@/types/MedicalRecord';
import type { ApiResponse } from '@/config/api';

// Local storage key
const STORAGE_KEY = 'medical-records';

// Helper functions for localStorage
const getStoredRecords = (): MedicalRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const setStoredRecords = (records: MedicalRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

const generateId = () => {
  return 'mr_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const medicalRecordService = {
  getAllRecords: async (): Promise<MedicalRecord[]> => {
    try {
      const response = await apiClient.get<ApiResponse<MedicalRecord[]>>(API_ENDPOINTS.MEDICAL_RECORDS.LIST);
      return response.data.data;
    } catch (error) {
      console.log('Falling back to localStorage');
      return getStoredRecords();
    }
  },

  getRecordById: async (id: string): Promise<MedicalRecord> => {
    try {
      const response = await apiClient.get<ApiResponse<MedicalRecord>>(API_ENDPOINTS.MEDICAL_RECORDS.DETAIL(id));
      return response.data.data;
    } catch (error) {
      const records = getStoredRecords();
      const record = records.find(r => r.id === id);
      if (!record) throw new Error('Record not found');
      return record;
    }
  },

  getRecordsByPatientId: async (patientId: string): Promise<MedicalRecord[]> => {
    try {
      const response = await apiClient.get<ApiResponse<MedicalRecord[]>>(
        API_ENDPOINTS.MEDICAL_RECORDS.LIST,
        { params: { patientId } }
      );
      return response.data.data;
    } catch (error) {
      const records = getStoredRecords();
      return records.filter(r => r.patientId === patientId);
    }
  },

  searchRecords: async (query: string): Promise<MedicalRecord[]> => {
    try {
      const response = await apiClient.get<ApiResponse<MedicalRecord[]>>(
        API_ENDPOINTS.MEDICAL_RECORDS.SEARCH,
        { params: { q: query } }
      );
      return response.data.data;
    } catch (error) {
      const records = getStoredRecords();
      const lowerQuery = query.toLowerCase();
      return records.filter(r => 
        r.patientName.toLowerCase().includes(lowerQuery) ||
        r.diagnosis?.toLowerCase().includes(lowerQuery) ||
        r.notes?.toLowerCase().includes(lowerQuery)
      );
    }
  },

  addRecord: async (record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> => {
    try {
      const response = await apiClient.post<ApiResponse<MedicalRecord>>(
        API_ENDPOINTS.MEDICAL_RECORDS.CREATE,
        record
      );
      return response.data.data || response.data;
    } catch (error) {
      const newRecord = {
        ...record,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as MedicalRecord;
      
      const records = getStoredRecords();
      records.push(newRecord);
      setStoredRecords(records);
      
      return newRecord;
    }
  },

  updateRecord: async (id: string, record: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    try {
      const response = await apiClient.put<ApiResponse<MedicalRecord>>(
        API_ENDPOINTS.MEDICAL_RECORDS.UPDATE(id),
        record
      );
      return response.data.data;
    } catch (error) {
      const records = getStoredRecords();
      const index = records.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Record not found');
      
      const updatedRecord = {
        ...records[index],
        ...record,
        updatedAt: new Date().toISOString(),
      };
      records[index] = updatedRecord;
      setStoredRecords(records);
      
      return updatedRecord;
    }
  },

  deleteRecord: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(API_ENDPOINTS.MEDICAL_RECORDS.DELETE(id));
    } catch (error) {
      const records = getStoredRecords();
      const filteredRecords = records.filter(r => r.id !== id);
      setStoredRecords(filteredRecords);
    }
  },
};
