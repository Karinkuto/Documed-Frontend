import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MedicalRecord } from '@/types/MedicalRecord';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';

interface MedicalRecordState {
  records: MedicalRecord[];
  isLoading: boolean;
  error: string | null;
  loadRecords: () => Promise<void>;
  addRecord: (record: Omit<MedicalRecord, 'id'>) => Promise<MedicalRecord>;
  updateRecord: (id: string, record: Partial<MedicalRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  searchRecords: (query: string) => Promise<void>;
}

export const useMedicalRecordStore = create<MedicalRecordState>()(
  persist(
    (set, get) => ({
      records: [],
      isLoading: false,
      error: null,

      loadRecords: async () => {
        // Don't load if we already have records
        if (get().records.length > 0) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get<MedicalRecord[]>(API_ENDPOINTS.MEDICAL_RECORDS.LIST);
          if (response.data && response.data.length > 0) {
            set({ records: response.data, isLoading: false });
          } else {
            // Keep existing records if API returns empty
            set((state) => ({ ...state, isLoading: false }));
          }
        } catch (error) {
          console.error('Error loading records:', error);
          // Keep existing records on error
          set((state) => ({ ...state, error: 'Failed to load medical records', isLoading: false }));
        }
      },

      addRecord: async (record) => {
        set({ isLoading: true, error: null });
        try {
          // Format the record to match the expected structure
          const formattedRecord: MedicalRecord = {
            id: '', // Will be set by the API
            patientId: record.patientId,
            patientName: record.patientName,
            patientAvatar: record.patientAvatar || `/avatars/${record.patientName.charAt(0).toLowerCase()}.png`,
            role: record.role || 'Patient',
            status: record.status || 'active',
            lastVisit: record.lastVisit || new Date().toISOString(),
            bloodType: record.bloodType || '',
            personalInfo: {
              email: record.email || '',
              dateOfBirth: record.dateOfBirth || '',
              gender: record.gender || '',
              address: {
                street: record.street || '',
                city: record.city || '',
                country: record.country || ''
              },
              nationality: record.nationality || '',
              maritalStatus: record.maritalStatus || ''
            },
            medicalInfo: {
              height: record.height || '',
              weight: record.weight || '',
              bloodPressure: record.bloodPressure || '',
              conditions: record.conditions || [],
              familyHistory: record.familyHistory || [],
              lifestyle: {
                smokingStatus: record.smokingStatus || '',
                exerciseFrequency: record.exerciseFrequency || ''
              }
            },
            documents: record.documents || [],
            activityLog: record.activityLog || [{
              action: 'Profile Creation',
              date: new Date().toISOString(),
              description: 'Medical record created'
            }],
            notes: record.notes || '',
            allergies: record.allergies || [],
            medications: record.medications || [],
            prescriptions: record.prescriptions || [],
            pastSurgeries: record.pastSurgeries || [],
            emergencyContact: record.emergencyContact || {
              name: '',
              relationship: '',
              phone: '',
              email: ''
            },
            appointments: record.appointments || [],
            insuranceInfo: record.insuranceInfo || {
              provider: '',
              policyNumber: '',
              expiryDate: ''
            }
          };

          const response = await apiClient.post<MedicalRecord>(
            API_ENDPOINTS.MEDICAL_RECORDS.CREATE,
            formattedRecord
          );
          const newRecord = response.data;
          
          set(state => ({
            records: [...state.records, newRecord],
            isLoading: false
          }));
          
          return newRecord;
        } catch (error) {
          console.error('Error adding record:', error);
          set(state => ({ ...state, error: 'Failed to create medical record', isLoading: false }));
          throw error;
        }
      },

      updateRecord: async (id, record) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.put<MedicalRecord>(
            API_ENDPOINTS.MEDICAL_RECORDS.UPDATE(id),
            record
          );
          const updatedRecord = response.data;
          
          set((state) => ({
            records: state.records.map((r) => (r.id === id ? updatedRecord : r)),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error updating record:', error);
          set((state) => ({ ...state, error: 'Failed to update medical record', isLoading: false }));
          throw error;
        }
      },

      deleteRecord: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.delete(API_ENDPOINTS.MEDICAL_RECORDS.DELETE(id));
          set((state) => ({
            records: state.records.filter((r) => r.id !== id),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error deleting record:', error);
          set((state) => ({ ...state, error: 'Failed to delete medical record', isLoading: false }));
          throw error;
        }
      },

      searchRecords: async (query) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get<MedicalRecord[]>(
            API_ENDPOINTS.MEDICAL_RECORDS.SEARCH,
            { params: { query } }
          );
          if (response.data) {
            set({ records: response.data, isLoading: false });
          } else {
            // Keep existing records if search returns no results
            set((state) => ({ ...state, isLoading: false }));
          }
        } catch (error) {
          console.error('Error searching records:', error);
          // Keep existing records on error
          set((state) => ({ ...state, error: 'Failed to search medical records', isLoading: false }));
        }
      },
    }),
    {
      name: 'medical-records-storage',
      partialize: (state) => ({ 
        records: state.records,
        // Don't persist loading or error states
      }),
      // Only load from API if we don't have any records
      onRehydrateStorage: () => (state) => {
        if (state && (!state.records || state.records.length === 0)) {
          state.loadRecords();
        }
      },
    }
  )
);
