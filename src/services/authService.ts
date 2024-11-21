import { mockUsers, MockUser } from '@/data/mockUsers';

const LOCAL_STORAGE_KEY = 'documed_user';

export const authService = {
  login: (email: string, password: string): Promise<MockUser> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },

  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      resolve();
    });
  },

  getCurrentUser: (): MockUser | null => {
    const userStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(LOCAL_STORAGE_KEY);
  }
};
