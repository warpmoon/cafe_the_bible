import React, { useState } from 'react';
import { useSearch } from '../../hooks/useBible';
import SearchBar from '../../components/Common/SearchBar';
import VerseItem from '../../components/Bible/VerseItem';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { useReadingStore } from '../../store/readingStore';
import { useNavigate } from 'react-router-dom';
import styles from './SearchPage.module.css';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [testament, setTestament] = useState<string | undefined>();
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useReadingStore();

  const { data, isLoading } = useSearch(query, testament);

  const handleResultClick = (bookId: number, chapter: number) => {
    navigate(`/read/${bookId}/${chapter}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <SearchBar onSearch={setQuery} placeholder="성경 구절 검색 (예: 하나님 사랑)" />
        <div className={styles.filters}>
          <button 
            className={!testament ? styles.activeFilter : ''} 
            onClick={() => setTestament(undefined)}
          >
            전체
          </button>
          <button 
            className={testament === 'OT' ? styles.activeFilter : ''} 
            onClick={() => setTestament('OT')}
          >
            구약
          </button>
          <button 
            className={testament === 'NT' ? styles.activeFilter : ''} 
            onClick={() => setTestament('NT')}
          >
            신약
          </button>
        </div>
      </header>

      {isLoading && <LoadingSpinner />}

      <div className={styles.results}>
        {data?.results.map((verse: any) => (
          <div key={verse.id} className={styles.resultItem} onClick={() => handleResultClick(verse.book_id, verse.chapter_number)}>
            <div className={styles.resultHeader}>
              <span className={styles.reference}>{verse.book_name} {verse.chapter_number}:{verse.number}</span>
            </div>
            <p className={styles.text}>{verse.text}</p>
          </div>
        ))}
        {query && data?.results.length === 0 && !isLoading && (
          <p className={styles.empty}>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
