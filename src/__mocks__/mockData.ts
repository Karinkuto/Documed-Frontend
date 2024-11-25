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
  diagnosis: string;
  treatment: string;
  notes?: string;
  prescriptions?: string[];
}

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '2',
    patientName: 'John Smith',
    patientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'patient',
    status: 'active',
    lastVisit: '2023-10-15',
    bloodType: 'A+',
    personalInfo: {
      email: 'john.smith@bitscollege.edu.et',
      dateOfBirth: '1985-03-15',
      gender: 'male',
      address: {
        street: '123 Main St',
        city: 'Boston',
        country: 'USA'
      },
      nationality: 'American',
      maritalStatus: 'married'
    },
    diagnosis: 'Hypertension',
    treatment: 'Prescribed blood pressure medication',
    notes: 'Patient should monitor blood pressure daily',
    prescriptions: ['Lisinopril 10mg']
  },
  {
    id: '2',
    patientId: '5',
    patientName: 'Sarah Johnson',
    patientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'patient',
    status: 'active',
    lastVisit: '2023-10-16',
    bloodType: 'O+',
    personalInfo: {
      email: 'sarah.j@bitscollege.edu.et',
      dateOfBirth: '1990-07-22',
      gender: 'female',
      address: {
        street: '456 Oak Ave',
        city: 'Seattle',
        country: 'USA'
      },
      nationality: 'American',
      maritalStatus: 'single'
    },
    diagnosis: 'Common Cold',
    treatment: 'Rest and hydration recommended',
    notes: 'Follow up in 1 week if symptoms persist',
    prescriptions: ['Acetaminophen 500mg']
  }
];
