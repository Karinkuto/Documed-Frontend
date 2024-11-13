export interface MedicalDocument {
  id: string;
  title: string;
  category: string;
  uploadDate: string;
  size: string;
  type: "report" | "prescription" | "test" | "certificate";
}

export interface ActivityLog {
  action: string;
  date: string;
  time: string;
  details?: string;
}

interface MedicalInfo {
  height: string;
  weight: string;
  bloodPressure: string;
  conditions: string[];
  familyHistory: Array<{
    condition: string;
    relation: string;
  }>;
  lifestyle: {
    smokingStatus: string;
    exerciseFrequency: string;
  };
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  role: string;
  status: string;
  lastVisit: string;
  bloodType: string;
  personalInfo: {
    email: string;
    dateOfBirth: string;
    gender: string;
    address: {
      street: string;
      city: string;
      country: string;
    };
    nationality: string;
    maritalStatus: string;
  };
  allergies: string[];
  medications: string[];
  activityLog: Array<{
    date: string;
    action: string;
    details: string;
  }>;
  documents: Array<{
    id: string;
    title: string;
    type: string;
    size: string;
    lastModified: string;
    thumbnail?: string;
  }>;
  pastConditions?: string[];
  pastSurgeries?: Array<{
    procedure: string;
    date: string;
  }>;
  prescriptions?: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    status: string;
    endDate: string;
    instructions: string;
  }>;
  prescriptionHistory?: Array<{
    medication: string;
    period: string;
    status: string;
  }>;
  medicalInfo: MedicalInfo;
}

export const getStatusColor = (type: MedicalDocument["type"]) => {
  const colors = {
    report: "bg-blue-100 text-blue-800",
    prescription: "bg-purple-100 text-purple-800",
    test: "bg-green-100 text-green-800",
    certificate: "bg-yellow-100 text-yellow-800",
  };
  return colors[type];
}; 