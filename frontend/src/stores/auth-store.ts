import { create } from "zustand";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  getIdToken,
} from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "executive" | "analyst" | "engineer" | "viewer";
  activeWorkspaceId: string;
  activeWorkspaceName: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  idToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register" | "forgot";

  // Actions
  openAuthModal: (tab?: "login" | "register" | "forgot") => void;
  closeAuthModal: () => void;
  setError: (err: string | null) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  idToken: null,
  isLoading: true,
  error: null,
  isAuthModalOpen: false,
  authModalTab: "login",

  openAuthModal: (tab = "login") => set({ isAuthModalOpen: true, authModalTab: tab, error: null }),
  closeAuthModal: () => set({ isAuthModalOpen: false, error: null }),
  setError: (error) => set({ error }),

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const token = await getIdToken(res.user);
      set({
        user: res.user,
        idToken: token,
        profile: {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || "Executive Leader",
          photoURL: res.user.photoURL,
          role: "executive",
          activeWorkspaceId: `ws_${res.user.uid.slice(0, 8)}`,
          activeWorkspaceName: "Enterprise Omnichannel Group",
        },
        isAuthModalOpen: false,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err?.message || "Google Sign-In failed.", isLoading: false });
      throw err;
    }
  },

  loginWithEmail: async (email, pass) => {
    set({ isLoading: true, error: null });
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const token = await getIdToken(res.user);
      set({
        user: res.user,
        idToken: token,
        profile: {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || email.split("@")[0],
          photoURL: null,
          role: "executive",
          activeWorkspaceId: `ws_${res.user.uid.slice(0, 8)}`,
          activeWorkspaceName: "Enterprise Omnichannel Group",
        },
        isAuthModalOpen: false,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err?.message || "Email login failed.", isLoading: false });
      throw err;
    }
  },

  registerWithEmail: async (email, pass, name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const token = await getIdToken(res.user);
      set({
        user: res.user,
        idToken: token,
        profile: {
          uid: res.user.uid,
          email: res.user.email,
          displayName: name || email.split("@")[0],
          photoURL: null,
          role: "executive",
          activeWorkspaceId: `ws_${res.user.uid.slice(0, 8)}`,
          activeWorkspaceName: "Enterprise Omnichannel Group",
        },
        isAuthModalOpen: false,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err?.message || "Registration failed.", isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({
        user: null,
        profile: null,
        idToken: null,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err?.message, isLoading: false });
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await sendPasswordResetEmail(auth, email);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || "Password reset failed.", isLoading: false });
      throw err;
    }
  },

  initAuthListener: () => {
    return onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const token = await getIdToken(currentUser);
          set({
            user: currentUser,
            idToken: token,
            profile: {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email?.split("@")[0] || "Executive User",
              photoURL: currentUser.photoURL,
              role: "executive",
              activeWorkspaceId: `ws_${currentUser.uid.slice(0, 8)}`,
              activeWorkspaceName: "Enterprise Omnichannel Group",
            },
            isLoading: false,
          });
        } catch {
          set({ user: currentUser, isLoading: false });
        }
      } else {
        set({ user: null, profile: null, idToken: null, isLoading: false });
      }
    });
  },
}));
