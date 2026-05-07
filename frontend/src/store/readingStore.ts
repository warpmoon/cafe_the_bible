import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontSize = 'small' | 'medium' | 'large';
export type Theme = 'light' | 'dark';

interface ReadingState {
  currentBookId: number | null;
  currentChapter: number | null;
  fontSize: FontSize;
  theme: Theme;
  bookmarks: number[]; // Verse IDs
  history: { bookId: number; chapter: number; timestamp: number }[];
  
  // Actions
  setReading: (bookId: number, chapter: number) => void;
  setFontSize: (size: FontSize) => void;
  toggleTheme: () => void;
  toggleBookmark: (verseId: number) => void;
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

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'bible-reading-storage',
    }
  )
);
