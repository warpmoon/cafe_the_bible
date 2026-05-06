import React from 'react';
import { useReadingStore } from '../../store/readingStore';
import { useQuery } from '@tanstack/react-query';
import client from '../../api/client';
import VerseItem from '../../components/Bible/VerseItem';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import styles from './BookmarkPage.module.css';

import { Verse } from '../../types/bible';

const BookmarkPage: React.FC = () => {
  const { bookmarks, toggleBookmark } = useReadingStore();
  const navigate = useNavigate();

  // Fetch bookmarked verses
  const { data: verses, isLoading } = useQuery({
    queryKey: ['bookmarked-verses', bookmarks],
    queryFn: async () => {
      if (bookmarks.length === 0) return [];
      const promises = bookmarks.map(id => client.get(`/verses/${id}/`));
      const results = await Promise.all(promises);
      return results.map(res => res.data);
    },
    enabled: bookmarks.length > 0,
  });

  const handleVerseClick = (bookId: number, chapter: number) => {
    navigate(`/read/${bookId}/${chapter}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>북마크한 말씀</h1>
      
      {isLoading && <LoadingSpinner />}
      
      {!isLoading && (!verses || verses.length === 0) && (
        <p className={styles.empty}>북마크한 말씀이 없습니다.</p>
      )}

      <div className={styles.list}>
        {verses?.map((verse: Verse) => (
          <div key={verse.id} className={styles.itemWrapper}>
             <div onClick={() => handleVerseClick(verse.book_id, verse.chapter_number)}>
              <VerseItem 
                verse={verse} 
                isBookmarked={true} 
                onToggleBookmark={toggleBookmark} 
              />
              <div className={styles.reference}>
                {verse.book_name} {verse.chapter_number}:{verse.number}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkPage;
