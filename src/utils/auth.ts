type UserRole = 'admin' | 'medical' | 'faculty' | 'student';

interface User {
  username: string;
  password: string;
  role: UserRole;
}

const users: User[] = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'medical', password: 'medical123', role: 'medical' },
  { username: 'faculty', password: 'faculty123', role: 'faculty' },
  { username: 'student', password: 'student123', role: 'student' },
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
