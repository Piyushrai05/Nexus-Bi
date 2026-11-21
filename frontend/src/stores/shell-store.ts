import { create } from "zustand";

interface ShellState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  presenterMode: boolean;
  setPresenterMode: (presenter: boolean) => void;
  togglePresenterMode: () => void;

  guidedTourActive: boolean;
  tourStep: number;
  startGuidedTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  exitGuidedTour: () => void;
}

export const useShellStore = create<ShellState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  presenterMode: false,
  setPresenterMode: (presenter) => set({ presenterMode: presenter }),
  togglePresenterMode: () => set((state) => ({ presenterMode: !state.presenterMode })),

  guidedTourActive: false,
  tourStep: 1,
  startGuidedTour: () => set({ guidedTourActive: true, tourStep: 1 }),
  nextTourStep: () => set((state) => ({ tourStep: state.tourStep + 1 })),
  prevTourStep: () => set((state) => ({ tourStep: Math.max(1, state.tourStep - 1) })),
  exitGuidedTour: () => set({ guidedTourActive: false, tourStep: 1 }),
}));
