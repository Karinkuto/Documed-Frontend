import { createContext, useContext, useState, ReactNode } from 'react';
import { getCurrentUser } from '@/utils/auth';

interface UserContextType {
  userProfile: {
    username: string;
    fullName: string;
    email: string;
    role: string;
    avatar: string;
    department: string;
    language: string;
    timezone: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    twoFactorAuth: boolean;
    bio: string;
    phone: string;
    expertise: string;
    isPublicProfile: boolean;
    isAvailableConsult: boolean;
  };
  updateUserProfile: (profile: Partial<UserContextType['userProfile']>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const authUser = getCurrentUser();
  
  const [userProfile, setUserProfile] = useState({
    username: authUser?.username || 'john.doe',
    fullName: authUser?.fullName || 'John Doe',
    email: authUser?.email || 'john.doe@example.com',
    role: authUser?.role || 'Administrator',
    avatar: authUser?.avatar || '/avatars/default.png',
    department: authUser?.department || 'medical',
    language: 'en',
    timezone: 'UTC+8',
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    bio: '',
    phone: '',
    expertise: 'general',
    isPublicProfile: false,
    isAvailableConsult: false,
  });

  const updateUserProfile = (profile: Partial<UserContextType['userProfile']>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  return (
    <UserContext.Provider value={{ userProfile, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 