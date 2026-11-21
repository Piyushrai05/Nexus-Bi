import { create } from "zustand";
import { EvidencePayload } from "@/types/evidence";

interface EvidenceState {
  isOpen: boolean;
  activePayload: EvidencePayload | null;
  openEvidence: (payload: EvidencePayload) => void;
  closeEvidence: () => void;
}

export const useEvidenceStore = create<EvidenceState>((set) => ({
  isOpen: false,
  activePayload: null,
  openEvidence: (payload) => set({ isOpen: true, activePayload: payload }),
  closeEvidence: () => set({ isOpen: false }),
}));
