import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MockUser } from '@/data/mockUsers';
import { authenticateUser, getCurrentUser, setCurrentUser as setStoredUser } from '@/utils/auth';

interface UserContextType {
  user: MockUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (updates: Partial<MockUser>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const currentUser = getCurrentUser();
    console.log('UserProvider: Initial user check:', currentUser);
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log('UserProvider: Attempting login with email:', email);
    const authenticatedUser = authenticateUser(email, password);
    if (authenticatedUser) {
      console.log('UserProvider: Login successful:', authenticatedUser);
      setStoredUser(authenticatedUser);
      setUser(authenticatedUser);
      setIsAuthenticated(true);
    } else {
      console.error('UserProvider: Login failed: Invalid credentials');
      throw new Error('Invalid credentials');
    }
  };

  const logout = async () => {
    console.log('UserProvider: Logging out user:', user?.email);
    setStoredUser(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates: Partial<MockUser>) => {
    console.log('UserProvider: Updating user with:', updates);
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      setStoredUser(updated);
      return updated;
    });
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    updateUser
  };

  console.log('UserProvider: Current context value:', value);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}