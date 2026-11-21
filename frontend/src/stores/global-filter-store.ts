import { create } from "zustand";

export interface DateRangeOption {
  id: string;
  label: string;
  days: number;
}

export const DATE_RANGE_PRESETS: DateRangeOption[] = [
  { id: "7d", label: "Last 7 Days", days: 7 },
  { id: "30d", label: "Last 30 Days", days: 30 },
  { id: "90d", label: "Last 90 Days", days: 90 },
  { id: "this_month", label: "This Month", days: 30 },
  { id: "prev_month", label: "Previous Month", days: 30 },
  { id: "custom", label: "Custom Range", days: 30 },
];

interface GlobalFilterState {
  selectedRange: DateRangeOption;
  setSelectedRange: (range: DateRangeOption) => void;
  comparePrevious: boolean;
  setComparePrevious: (compare: boolean) => void;
  toggleComparePrevious: () => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  activeDrilldown: { field: string; value: string } | null;
  setDrilldown: (drilldown: { field: string; value: string } | null) => void;
  clearDrilldown: () => void;
}

export const useGlobalFilterStore = create<GlobalFilterState>((set) => ({
  selectedRange: DATE_RANGE_PRESETS[1], // Default: Last 30 Days
  setSelectedRange: (range) => set({ selectedRange: range }),
  comparePrevious: true,
  setComparePrevious: (compare) => set({ comparePrevious: compare }),
  toggleComparePrevious: () => set((state) => ({ comparePrevious: !state.comparePrevious })),
  selectedRegion: "All Regions",
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  activeDrilldown: null,
  setDrilldown: (drilldown) => set({ activeDrilldown: drilldown }),
  clearDrilldown: () => set({ activeDrilldown: null }),
}));
