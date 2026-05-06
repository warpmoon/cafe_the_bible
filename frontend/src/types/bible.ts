export type Testament = 'OT' | 'NT';

export interface Book {
  id: number;
  name: string;
  testament: Testament;
  order: number;
}

export interface BookListResponse {
  OT: Book[];
  NT: Book[];
}

export interface Chapter {
  id: number;
  number: number;
}

export interface Verse {
  id: number;
  book_id: number;
  book_name: string;
  chapter_number: number;
  number: number;
  text: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
