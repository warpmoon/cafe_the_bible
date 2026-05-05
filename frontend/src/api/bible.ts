import client from './client';
import { BookListResponse, Chapter, Verse, PaginatedResponse } from '../types/bible';

export const getBooks = async (): Promise<BookListResponse> => {
  const { data } = await client.get<BookListResponse>('/books/');
  return data;
};

export const getChapters = async (bookId: number): Promise<Chapter[]> => {
  const { data } = await client.get<Chapter[]>(`/books/${bookId}/chapters/`);
  return data;
};

export const getVerses = async (bookId: number, chapter: number): Promise<Verse[]> => {
  const { data } = await client.get<Verse[]>('/verses/', {
    params: { book: bookId, chapter },
  });
  return data;
};

export const searchVerses = async (
  query: string,
  testament?: string,
  page: number = 1
): Promise<PaginatedResponse<Verse>> => {
  const { data } = await client.get<PaginatedResponse<Verse>>('/search/', {
    params: { q: query, testament, page },
  });
  return data;
};

export const getRandomVerse = async (): Promise<Verse> => {
  const { data } = await client.get<Verse>('/random/');
  return data;
};
