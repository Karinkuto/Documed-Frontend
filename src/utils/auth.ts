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
    email: 'admin@bitscollege.edu.et',
    avatar: '/avatars/admin.jpg',
    role: 'Admin',
    department: 'Administration',
    status: 'confirmed'
  },
  {
    id: 'medical1',
    name: 'Medical User',
    email: 'medical@bitscollege.edu.et',
    avatar: '/avatars/medical.jpg',
    role: 'Medical',
    department: 'Medical Department',
    status: 'confirmed'
  },
  {
    id: 'staff1',
    name: 'Staff User',
    email: 'staff@bitscollege.edu.et',
    avatar: '/avatars/staff.jpg',
    role: 'Staff',
    department: 'Staff Department',
    status: 'confirmed'
  }
];

// Store username-password pairs separately for security
const userCredentials: Record<string, string> = {
  'admin@bitscollege.edu.et': 'admin123',
  'medical@bitscollege.edu.et': 'medical123',
  'staff@bitscollege.edu.et': 'staff123'
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

// Password validation
export const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
};

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < passwordRequirements.minLength) {
    errors.push(`Password must be at least ${passwordRequirements.minLength} characters long`);
  }
  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Temporary password generation
export function generateTemporaryPassword(): string {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  // Ensure at least one of each required character type
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // uppercase
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // lowercase
  password += "0123456789"[Math.floor(Math.random() * 10)]; // number
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)]; // special char
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Check if password needs to be changed
export function requiresPasswordChange(user: any): boolean {
  return user?.temporaryPassword === true;
}

// Session management
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
let sessionTimer: number | null = null;

export function startSessionTimer(onTimeout: () => void): void {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
  sessionTimer = window.setTimeout(onTimeout, SESSION_TIMEOUT);
}

export function resetSessionTimer(onTimeout: () => void): void {
  startSessionTimer(onTimeout);
}

export function clearSessionTimer(): void {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
    sessionTimer = null;
  }
}
