import { useQuery } from '@tanstack/react-query';
import * as api from '../api/bible';

export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: api.getBooks,
  });
};

export const useChapters = (bookId: number) => {
  return useQuery({
    queryKey: ['chapters', bookId],
    queryFn: () => api.getChapters(bookId),
    enabled: !!bookId,
  });
};

export const useVerses = (bookId: number, chapter: number) => {
  return useQuery({
    queryKey: ['verses', bookId, chapter],
    queryFn: () => api.getVerses(bookId, chapter),
    enabled: !!bookId && !!chapter,
  });
};

export const useSearch = (query: string, testament?: string, page: number = 1) => {
  return useQuery({
    queryKey: ['search', query, testament, page],
    queryFn: () => api.searchVerses(query, testament, page),
    enabled: query.length >= 2,
  });
};

export const useRandomVerse = () => {
  return useQuery({
    queryKey: ['random-verse'],
    queryFn: api.getRandomVerse,
  });
};
