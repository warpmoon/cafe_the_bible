import client from './client';
import { BookListResponse, Chapter, Verse, PaginatedResponse, VoiceRecord } from '../types/bible';

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

export const uploadVoiceRecord = async (
  verseId: number,
  audioBlob: Blob
): Promise<VoiceRecord> => {
  const formData = new FormData();
  formData.append('verse', verseId.toString());
  const extension = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
  formData.append('audio_file', audioBlob, `recording.${extension}`);

  const { data } = await client.post<VoiceRecord>('/audio/voice-records/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteVoiceRecord = async (recordId: number): Promise<void> => {
  await client.delete(`/audio/voice-records/${recordId}/`);
};

export const getVoiceRecords = async (params: {
  book?: number;
  chapter?: number;
  verse?: number;
}): Promise<VoiceRecord[]> => {
  const { data } = await client.get<VoiceRecord[]>('/audio/voice-records/', { params });
  return data;
};
