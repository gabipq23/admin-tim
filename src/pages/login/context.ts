import { AuthService } from "@/services/auth";
import { LocalStorageKeys, LocalStorageService } from "@/services/storage";
import { create } from "zustand";
import { AuthState, ILoginData } from "@/interfaces/login";

const authService = new AuthService();
const initialAuth = authService.getAuthToken();

export const useAuthContext = create<AuthState>((set) => ({
  user: initialAuth?.user ?? null,
  login: async ({ email, password }: ILoginData) => {
    const res = await authService.login({ email, password });
    set({ user: res?.user ?? null });
  },
  logout: () => {
    const localStorageService = new LocalStorageService();
    localStorageService.removeItem(LocalStorageKeys.accessToken);
    localStorageService.removeItem(LocalStorageKeys.user);
    set({ user: null });
  },

  checkAuth: () => {
    const res = authService.getAuthToken();
    set({ user: res?.user ?? null });
  },
}));
