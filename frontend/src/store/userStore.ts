import { create } from 'zustand';

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

export const useUserStore = create<UserState>()((set: (partial: Partial<UserState>) => void) => ({
  user: null,
  login: (userData: User) => set({ user: userData }),
  logout: () => set({ user: null }),
}));
