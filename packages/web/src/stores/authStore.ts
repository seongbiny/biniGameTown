import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

type AuthState = {
  session: Session | null;
  setSession: (session: Session | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
}));
