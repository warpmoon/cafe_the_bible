import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontSize = 'small' | 'medium' | 'large';
export type Theme = 'light' | 'dark' | 'sepia';

export interface DevotionEntry {
  date: string;
  verseId: number;
  reference: string;
  verseText: string;
  reflection: string;
  prayer: string;
  action: string;
  updatedAt: number;
}

export interface FaithCheckEntry {
  date: string;
  checks: Record<string, boolean>;
  note: string;
  updatedAt: number;
}

export interface ReadingPlanDay {
  day: number;
  label: string;
  bookId: number;
  bookName: string;
  startChapter: number;
  endChapter: number;
  completed: boolean;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  totalDays: number;
  days: ReadingPlanDay[];
  startDate: string;
  currentDay: number;
  streak: number;
  lastReadDate: string;
}

interface ReadingState {
  currentBookId: number | null;
  currentChapter: number | null;
  fontSize: FontSize;
  theme: Theme;
  bookmarks: number[]; // Verse IDs
  history: { bookId: number; chapter: number; timestamp: number }[];
  devotions: Record<string, DevotionEntry>;
  devotionLabelColors: Record<string, string>;
  faithChecks: Record<string, FaithCheckEntry>;
  highlights: Record<number, string>;
  readChapters: Record<string, boolean>;
  activePlan: ReadingPlan | null;
  
  // Actions
  setReading: (bookId: number, chapter: number) => void;
  setFontSize: (size: FontSize) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleBookmark: (verseId: number) => void;
  saveDevotion: (entry: DevotionEntry) => void;
  setDevotionLabelColor: (date: string, color: string) => void;
  saveFaithCheck: (entry: FaithCheckEntry) => void;
  clearHistory: () => void;
  toggleHighlight: (verseId: number, color: string) => void;
  removeHighlight: (verseId: number) => void;
  markChapterRead: (bookId: number, chapter: number) => void;
  setActivePlan: (plan: ReadingPlan) => void;
  completePlanDay: (day: number) => void;
  clearPlan: () => void;
}

const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const useReadingStore = create<ReadingState>()(
  persist(
    (set) => ({
      currentBookId: null,
      currentChapter: null,
      fontSize: 'medium',
      theme: 'light',
      bookmarks: [],
      history: [],
      devotions: {},
      devotionLabelColors: {},
      faithChecks: {},
      highlights: {},
      readChapters: {},
      activePlan: null,

      setReading: (bookId, chapter) => 
        set((state) => ({
          currentBookId: bookId,
          currentChapter: chapter,
          history: [
            { bookId, chapter, timestamp: Date.now() },
            ...state.history.filter(h => h.bookId !== bookId || h.chapter !== chapter)
          ].slice(0, 20)
        })),

      setFontSize: (size) => set({ fontSize: size }),

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => set((state) => {
        const cycle: Record<Theme, Theme> = { light: 'dark', dark: 'sepia', sepia: 'light' };
        return { theme: cycle[state.theme] };
      }),

      toggleBookmark: (verseId) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(verseId)
            ? state.bookmarks.filter((id) => id !== verseId)
            : [...state.bookmarks, verseId]
        })),

      saveDevotion: (entry) =>
        set((state) => ({
          devotions: {
            ...state.devotions,
            [entry.date]: entry,
          },
        })),

      setDevotionLabelColor: (date, color) =>
        set((state) => ({
          devotionLabelColors: {
            ...state.devotionLabelColors,
            [date]: color,
          },
        })),

      saveFaithCheck: (entry) =>
        set((state) => ({
          faithChecks: {
            ...state.faithChecks,
            [entry.date]: entry,
          },
        })),

      clearHistory: () => set({ history: [] }),

      toggleHighlight: (verseId, color) =>
        set((state) => {
          const newHighlights = { ...state.highlights };
          if (newHighlights[verseId] === color) {
            delete newHighlights[verseId];
          } else {
            newHighlights[verseId] = color;
          }
          return { highlights: newHighlights };
        }),

      removeHighlight: (verseId) =>
        set((state) => {
          const newHighlights = { ...state.highlights };
          delete newHighlights[verseId];
          return { highlights: newHighlights };
        }),

      markChapterRead: (bookId, chapter) =>
        set((state) => ({
          readChapters: {
            ...state.readChapters,
            [`${bookId}-${chapter}`]: true,
          },
        })),

      setActivePlan: (plan) => set({ activePlan: plan }),

      completePlanDay: (day) =>
        set((state) => {
          if (!state.activePlan) return {};

          const today = formatDateKey(new Date());
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayKey = formatDateKey(yesterday);

          let newStreak = state.activePlan.streak;
          if (state.activePlan.lastReadDate === today) {
            // Already read today, keep streak
          } else if (state.activePlan.lastReadDate === yesterdayKey) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }

          const updatedDays = state.activePlan.days.map((d) =>
            d.day === day ? { ...d, completed: true } : d
          );

          const nextIncomplete = updatedDays.find((d) => !d.completed);

          return {
            activePlan: {
              ...state.activePlan,
              days: updatedDays,
              currentDay: nextIncomplete ? nextIncomplete.day : state.activePlan.totalDays,
              streak: newStreak,
              lastReadDate: today,
            },
          };
        }),

      clearPlan: () => set({ activePlan: null }),
    }),
    {
      name: 'bible-reading-storage',
    }
  )
);
