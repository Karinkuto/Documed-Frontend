import type { MedicalRecord } from "@/types/MedicalRecord";

// Add these fields to your medical record type
interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  status: 'Active' | 'Completed' | 'Discontinued';
  startDate: string;
  endDate: string;
  instructions: string;
}

interface PrescriptionHistory {
  medication: string;
  period: string;
  status: string;
}

export const mockMedicalRecords: MedicalRecord[] = [
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
      },
      // Add more prescriptions...
    ],
    prescriptionHistory: [
      {
        medication: "Ibuprofen",
        period: "Jan 2024 - Feb 2024",
        status: "Completed"
      },
      // Add more history items...
    ]
  },
  // Add other records here...
];
