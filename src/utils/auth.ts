type UserRole = 'admin' | 'medical' | 'faculty' | 'student';

interface User {
  username: string;
  password: string;
  role: UserRole;
  fullName: string;
  email: string;
  avatar?: string;
  department?: string;
}

const users: User[] = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    fullName: 'Admin User',
    email: 'admin@example.com',
    department: 'Administration'
  },
  { username: 'medical', password: 'medical123', role: 'medical', fullName: 'Medical User', email: 'medical@example.com', department: 'Medical' },
  { username: 'faculty', password: 'faculty123', role: 'faculty', fullName: 'Faculty User', email: 'faculty@example.com', department: 'Faculty' },
  { username: 'student', password: 'student123', role: 'student', fullName: 'Student User', email: 'student@example.com', department: 'Student' },
];

export function authenticateUser(username: string, password: string): User | null {
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
}

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
}
