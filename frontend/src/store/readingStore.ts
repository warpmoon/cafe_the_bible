import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontSize = 'small' | 'medium' | 'large';
export type Theme = 'light' | 'dark';

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
  
  // Actions
  setReading: (bookId: number, chapter: number) => void;
  setFontSize: (size: FontSize) => void;
  toggleTheme: () => void;
  toggleBookmark: (verseId: number) => void;
  saveDevotion: (entry: DevotionEntry) => void;
  setDevotionLabelColor: (date: string, color: string) => void;
  saveFaithCheck: (entry: FaithCheckEntry) => void;
  clearHistory: () => void;
}

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

      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),

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
    }),
    {
      name: 'bible-reading-storage',
    }
  )
);
