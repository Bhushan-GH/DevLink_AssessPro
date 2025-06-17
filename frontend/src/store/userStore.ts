import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
}

interface UserState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      login: (userData: User) => set({ user: userData }),
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null });
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

