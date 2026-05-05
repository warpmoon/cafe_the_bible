import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export const getBooks = () => api.get('books/');
export const getChapters = (bookId: number) => api.get(`books/${bookId}/chapters/`);
export const getVerses = (bookId: number, chapter: number) => api.get(`books/${bookId}/chapters/${chapter}/verses/`);

export default api;
