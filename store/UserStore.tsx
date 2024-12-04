import { create } from 'zustand';

interface User {
  userId: number;
  fullName: string;
  email: string;
  imgAva: string;
  phone: string;
  emergencyPhone: string;
  dateOfBirth: string;
  createdDate: string;
  address: string;
  account: string;
  roles: string;
  status: boolean;
}

interface UserStore {
  user: User | null;
  setUser: (userData: Omit<User, 'password'>) => void;
  clearUser: () => void;
  updateAvatar: (avatarUrl: string) => void

}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
  updateAvatar: (avatarUrl: string) => set(state => ({ ...state, user: { ...state.user, imgAva: avatarUrl } })),
}));

export default useUserStore;

