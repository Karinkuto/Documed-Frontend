export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'doctor' | 'patient' | 'admin';
  specialization?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'doctor',
    specialization: 'Cardiology',
    phoneNumber: '+1234567890',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'patient',
    dateOfBirth: '1990-05-15',
    phoneNumber: '+1987654321',
    address: '123 Main St, City',
  },
  {
    id: '3',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'admin',
    phoneNumber: '+1122334455',
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    role: 'doctor',
    specialization: 'Pediatrics',
    phoneNumber: '+1234509876',
  },
  {
    id: '5',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.b@example.com',
    role: 'patient',
    dateOfBirth: '1985-08-22',
    phoneNumber: '+1678901234',
    address: '456 Oak Ave, Town',
  },
];
