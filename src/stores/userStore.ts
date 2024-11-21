import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MockUser } from '@/data/mockUsers';
import { authenticateUser, getCurrentUser, setCurrentUser } from '@/utils/auth';

interface UserState {
  user: MockUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<MockUser>) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: getCurrentUser(),
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = authenticateUser(email, password);
          if (user) {
            setCurrentUser(user);
            set({ user, isLoading: false });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          console.error('Login failed:', error);
          set({ error: 'Login failed. Please check your credentials.', isLoading: false });
          throw error;
        }
      },

      logout: () => {
        setCurrentUser(null);
        set({ user: null, error: null });
        // Clear other stores if needed
        localStorage.removeItem('token');
      },

      updateUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = get().user;
          if (!currentUser) {
            throw new Error('No user logged in');
          }

          // TODO: Replace with actual API call when available
          const updatedUser = {
            ...currentUser,
            ...userData,
          };
          
          setCurrentUser(updatedUser);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          console.error('Error updating user:', error);
          set(state => ({ ...state, error: 'Failed to update user', isLoading: false }));
          throw error;
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
