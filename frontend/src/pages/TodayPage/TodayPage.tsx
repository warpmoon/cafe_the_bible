import React, { useState, useRef, useEffect } from 'react';
import { useRandomVerse } from '../../hooks/useBible';
import { useReadingStore } from '../../store/readingStore';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { 
  Share2, 
  RefreshCw, 
  MoreVertical, 
  Download, 
  Smartphone, 
  Monitor,
  CheckCircle2
} from 'lucide-react';
import { toJpeg } from 'html-to-image';
import styles from './TodayPage.module.css';

// Import background images
import bgHorizontal from '../../assets/images/todaypage/card-coffee-w1.jpg';
import bgVertical from '../../assets/images/todaypage/card-coffee_h1.jpg';

const TodayPage: React.FC = () => {
  const { data: verse, isLoading, refetch, isFetching } = useRandomVerse();
  const { devotions, saveDevotion } = useReadingStore();
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Record<'reflection' | 'prayer' | 'action', string>>>({});
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const todayKey = new Date().toISOString().slice(0, 10);
  const savedDevotion = devotions[todayKey];
  const reflection = draft.reflection ?? savedDevotion?.reflection ?? '';
  const prayer = draft.prayer ?? savedDevotion?.prayer ?? '';
  const action = draft.action ?? savedDevotion?.action ?? '';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = async () => {
    if (!verse) return;
    setIsMenuOpen(false);
    
    const text = `[오늘의 말씀] ${verse.book_name} ${verse.chapter_number}:${verse.number}\n\n${verse.text}\n\n- Cafe the Bible -`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '오늘의 말씀',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error('공유 실패:', err);
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('클립보드에 복사되었습니다.');
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsMenuOpen(false);

    try {
      // Small delay to ensure menu is closed and UI is stable
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toJpeg(cardRef.current, { 
        quality: 0.95,
        filter: (node) => {
          // Exclude the menu container from the capture
          if (node instanceof HTMLElement) {
             return !node.classList.contains(styles.menuContainer);
          }
          return true;
        }
      });
      
      const link = document.createElement('a');
      link.download = `bible-verse-${new Date().getTime()}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('다운로드 실패:', err);
      alert('이미지 생성에 실패했습니다.');
    }
  };

  const toggleLayout = () => {
    setLayout(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
    setIsMenuOpen(false);
  };

  const handleSaveDevotion = () => {
    if (!verse) return;

    const updatedAt = Date.now();
    saveDevotion({
      date: todayKey,
      verseId: verse.id,
      reference: `${verse.book_name} ${verse.chapter_number}:${verse.number}`,
      verseText: verse.text,
      reflection,
      prayer,
      action,
      updatedAt,
    });
    setDraft({});
    setSavedAt(updatedAt);
  };

  const updateDraft = (field: 'reflection' | 'prayer' | 'action', value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setSavedAt(null);
  };

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.date}>{todayStr}</span>
        <h1 className={styles.title}>오늘의 말씀</h1>
      </header>

      {verse && (
        <>
          <div 
            ref={cardRef}
            className={`${styles.card} ${layout === 'horizontal' ? styles.cardHorizontal : styles.cardVertical}`}
          >
            <img 
              src={layout === 'horizontal' ? bgHorizontal : bgVertical} 
              alt="Background" 
              className={styles.backgroundImage}
            />
            <div className={styles.overlay} />
            
            <div className={styles.menuContainer} ref={menuRef}>
              <button 
                className={styles.kebabBtn}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="더 보기"
              >
                <MoreVertical size={20} />
              </button>
              
              {isMenuOpen && (
                <div className={styles.dropdown}>
                  <button className={styles.menuItem} onClick={toggleLayout}>
                    {layout === 'horizontal' ? (
                      <><Smartphone size={18} /> 세로형</>
                    ) : (
                      <><Monitor size={18} /> 가로형</>
                    )}
                  </button>
                  <button className={styles.menuItem} onClick={handleDownload}>
                    <Download size={18} /> 다운로드
                  </button>
                  <button className={styles.menuItem} onClick={handleShare}>
                    <Share2 size={18} /> 공유하기
                  </button>
                </div>
              )}
            </div>

            <div className={styles.cardContent}>
              <div className={styles.quoteMark}>"</div>
              <p className={styles.text}>{verse.text}</p>
              <div className={styles.reference}>
                {verse.book_name} {verse.chapter_number}:{verse.number}
              </div>
              <div className={styles.watermark}>Cafe the Bible</div>
            </div>
          </div>

          <div className={styles.actions}>
            <button 
              onClick={() => refetch()} 
              className={`${styles.refreshBtn} ${isFetching ? styles.spinning : ''}`}
              title="새로고침"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <section className={styles.devotionPanel} aria-labelledby="devotion-title">
            <div className={styles.devotionHeader}>
              <div>
                <span className={styles.eyebrow}>Daily reflection</span>
                <h2 id="devotion-title">오늘의 묵상</h2>
              </div>
              {savedAt && (
                <span className={styles.savedState}>
                  <CheckCircle2 size={16} />
                  저장됨
                </span>
              )}
            </div>

            <label className={styles.field}>
              <span>말씀이 오늘 내게 주는 의미</span>
              <textarea
                value={reflection}
                onChange={(event) => updateDraft('reflection', event.target.value)}
                placeholder="말씀을 읽으며 떠오른 생각을 적어보세요."
                rows={4}
              />
            </label>

            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>기도 제목</span>
                <textarea
                  value={prayer}
                  onChange={(event) => updateDraft('prayer', event.target.value)}
                  placeholder="오늘의 기도를 적어보세요."
                  rows={3}
                />
              </label>

              <label className={styles.field}>
                <span>오늘의 실천</span>
                <textarea
                  value={action}
                  onChange={(event) => updateDraft('action', event.target.value)}
                  placeholder="작게 실천할 한 가지를 적어보세요."
                  rows={3}
                />
              </label>
            </div>

            <button className={styles.saveBtn} onClick={handleSaveDevotion}>
              묵상 저장
            </button>
          </section>
        </>
      )}
    </div>
  );
};

export default TodayPage;
