import { http, HttpResponse } from 'msw';
import { mockUsers } from './mockUsers';
import { mockAnnouncements } from './mockAnnouncements';
import { mockTimeline } from './mockTimeline';
import { API_ENDPOINTS } from '@/config/api';
import type { MedicalRecord } from '@/types/MedicalRecord';

// Helper function to add base URL to endpoint
const endpoint = (path: string) => `/mock${path}`;

// Load initial records from localStorage or use default mock data
const STORAGE_KEY = 'mockMedicalRecords';

const getStoredRecords = (): MedicalRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading stored records:', error);
    return [];
  }
};

const saveRecords = (records: MedicalRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving records:', error);
  }
};

// Initialize with default data if empty
const defaultRecords: MedicalRecord[] = [
  {
    id: "REC-001",
    patientId: "567868",
    patientName: "Alemitu Barbara",
    patientAvatar: "/avatars/alemitu.jpg",
    personalInfo: {
      age: 24,
      gender: "Female",
      dateOfBirth: "1999-08-15",
      nationality: "Ethiopian",
      maritalStatus: "Single",
      email: "alemitu.barbara@bitscollege.edu.et",
      address: {
        street: "123 University St",
        city: "Addis Ababa",
        country: "Ethiopia",
      },
    },
    bloodType: "O-",
    diagnosis: "Seasonal Allergies",
    medications: ["Cetirizine 10mg"],
    allergies: ["Pollen", "Dust"],
    lastVisit: "2024-05-24",
    status: "active",
    role: "Student",
    documents: [
      {
        id: "DOC-001",
        title: "Vaccination Record",
        category: "Health Reports",
        uploadDate: "2024-11-30",
        size: "1.2 MB",
        type: "report",
      },
    ],
    activityLog: [
      {
        action: "Last Login",
        date: "2024-05-24",
        time: "09:27 AM",
      },
      {
        action: "Document Upload",
        date: "2024-11-30",
        time: "02:09 AM",
        details: "Vaccination Record",
      },
      {
        action: "File Access",
        date: "2024-03-09",
        time: "07:33 AM",
        details: "Downloaded Medical Info",
      },
      {
        action: "Form Submission",
        date: "2024-09-13",
        time: "05:45 AM",
        details: "Medical History Update",
      },
      {
        action: "Profile Update",
        date: "2024-04-06",
        time: "03:07 AM",
        details: "Emergency Contact Changed",
      },
    ],
    prescriptions: [
      {
        medication: "Amoxicillin",
        dosage: "500mg",
        frequency: "3 times daily",
        prescribedBy: "Smith",
        status: "Active",
        startDate: "2024-03-01",
        endDate: "2024-03-14",
        instructions: "Take with food. Complete full course."
      }
    ],
    prescriptionHistory: [
      {
        medication: "Ibuprofen",
        period: "Jan 2024 - Feb 2024",
        status: "Completed"
      }
    ]
  }
];

let mockMedicalRecords = getStoredRecords();
if (mockMedicalRecords.length === 0) {
  mockMedicalRecords = defaultRecords;
  saveRecords(mockMedicalRecords);
}

// Image handlers
const imageHandlers = [
  http.get('/placeholder.svg', () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }),

  http.get('/avatars/*', () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
  }),

  http.get('https://api.dicebear.com/7.x/avataaars/svg*', () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }),
];

export const handlers = [
  // Medical Records handlers
  http.get(endpoint(API_ENDPOINTS.MEDICAL_RECORDS.LIST), () => {
    const records = getStoredRecords();
    return HttpResponse.json({ data: records });
  }),

  http.get(endpoint(API_ENDPOINTS.MEDICAL_RECORDS.DETAIL(':id')), ({ params }) => {
    const records = getStoredRecords();
    const record = records.find(r => r.id === params.id);
    if (!record) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: record });
  }),

  http.get(endpoint(API_ENDPOINTS.MEDICAL_RECORDS.SEARCH), ({ request }) => {
    const records = getStoredRecords();
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.toLowerCase() || '';
    const filtered = records.filter(record =>
      record.patientName.toLowerCase().includes(query) ||
      record.patientId.toLowerCase().includes(query) ||
      record.diagnosis.toLowerCase().includes(query)
    );
    return HttpResponse.json({ data: filtered });
  }),

  http.post(endpoint(API_ENDPOINTS.MEDICAL_RECORDS.CREATE), async ({ request }) => {
    try {
      const newRecord = await request.json();
      console.log('Creating new record:', newRecord);
      
      const records = getStoredRecords();
      const record: MedicalRecord = {
        ...newRecord,
        id: (records.length + 1).toString(),
        patientAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newRecord.patientName}`,
        lastVisit: new Date().toISOString().split('T')[0]
      };
      
      console.log('Created record:', record);
      records.push(record);
      saveRecords(records);
      mockMedicalRecords = records; // Update the in-memory records
      
      return HttpResponse.json({
        data: record,
        message: 'Medical record created successfully',
        status: 200
      });
    } catch (error) {
      console.error('Error in mock handler:', error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.put(endpoint(API_ENDPOINTS.MEDICAL_RECORDS.UPDATE(':id')), async ({ params, request }) => {
    const records = getStoredRecords();
    const updateData = await request.json();
    const index = records.findIndex(r => r.id === params.id);
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    records[index] = {
      ...records[index],
      ...updateData,
    };
    saveRecords(records);
    mockMedicalRecords = records; // Update the in-memory records
    
    return HttpResponse.json({
      data: records[index],
      message: 'Medical record updated successfully',
      status: 200
    });
  }),

  http.delete(endpoint(API_ENDPOINTS.MEDICAL_RECORDS.DELETE(':id')), ({ params }) => {
    const records = getStoredRecords();
    const index = records.findIndex(r => r.id === params.id);
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    records.splice(index, 1);
    saveRecords(records);
    mockMedicalRecords = records; // Update the in-memory records
    
    return HttpResponse.json({
      message: 'Medical record deleted successfully',
      status: 200
    });
  }),

  // Users handlers
  http.get(endpoint(API_ENDPOINTS.USERS.LIST), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = mockUsers.slice(start, end);

    return HttpResponse.json({
      data: paginatedUsers,
      meta: {
        total: mockUsers.length,
        page,
        limit,
      },
    });
  }),

  // Announcements handlers
  http.get(endpoint(API_ENDPOINTS.ANNOUNCEMENTS.LIST), () => {
    return HttpResponse.json({ data: mockAnnouncements });
  }),

  // Medical Timeline handlers
  http.get(endpoint(API_ENDPOINTS.MEDICAL_TIMELINE.LIST(':patientId')), ({ params }) => {
    const { patientId } = params;
    const timeline = mockTimeline.filter(item => item.patientId === patientId);
    return HttpResponse.json({ data: timeline });
  }),

  ...imageHandlers,
];
