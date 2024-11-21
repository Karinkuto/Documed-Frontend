import { User } from '@/__mocks__/mockUsers';
import { MockUser } from '@/data/mockUsers';

type UserRole = 'admin' | 'medical' | 'faculty' | 'student';

interface User extends MockUser {
  username: string;
  password: string;
}

const users: MockUser[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: '/avatars/admin.jpg',
    role: 'Admin',
    department: 'Administration',
    status: 'confirmed'
  },
  {
    id: 'medical1',
    name: 'Medical User',
    email: 'medical@example.com',
    avatar: '/avatars/medical.jpg',
    role: 'Medical',
    department: 'Medical Department',
    status: 'confirmed'
  },
  {
    id: 'staff1',
    name: 'Staff User',
    email: 'staff@example.com',
    avatar: '/avatars/staff.jpg',
    role: 'Staff',
    department: 'Staff Department',
    status: 'confirmed'
  }
];

// Store username-password pairs separately for security
const userCredentials: Record<string, string> = {
  'admin@example.com': 'admin123',
  'medical@example.com': 'medical123',
  'staff@example.com': 'staff123'
};

export function authenticateUser(email: string, password: string): MockUser | null {
  console.log('Attempting authentication with:', { email });
  if (userCredentials[email] === password) {
    const user = users.find(u => u.email === email);
    console.log('Authentication result:', user);
    return user || null;
  }
  console.log('Authentication failed: invalid credentials');
  return null;
}

export function getCurrentUser(): MockUser | null {
  const userJson = localStorage.getItem('currentUser');
  console.log('Getting current user from localStorage:', userJson);
  return userJson ? JSON.parse(userJson) : null;
}

export function setCurrentUser(user: MockUser | null): void {
  console.log('Setting current user:', user);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
}
