import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import { useReadingStore, type DevotionEntry } from '../../store/readingStore';
import TodaySubNav from './TodaySubNav';
import styles from './JesusJournalPage.module.css';

const DEFAULT_LABEL_COLOR = '#3498db';

const bookAbbreviations: Record<string, string> = {
  창세기: '창',
  출애굽기: '출',
  레위기: '레',
  민수기: '민',
  신명기: '신',
  여호수아: '수',
  사사기: '삿',
  룻기: '룻',
  사무엘상: '삼상',
  사무엘하: '삼하',
  열왕기상: '왕상',
  열왕기하: '왕하',
  역대상: '대상',
  역대하: '대하',
  에스라: '스',
  느헤미야: '느',
  에스더: '에',
  욥기: '욥',
  시편: '시',
  잠언: '잠',
  전도서: '전',
  아가: '아',
  이사야: '사',
  예레미야: '렘',
  예레미야애가: '애',
  에스겔: '겔',
  다니엘: '단',
  마태복음: '마',
  마가복음: '막',
  누가복음: '눅',
  요한복음: '요',
  사도행전: '행',
  로마서: '롬',
  고린도전서: '고전',
  고린도후서: '고후',
  갈라디아서: '갈',
  에베소서: '엡',
  빌립보서: '빌',
  골로새서: '골',
  요한계시록: '계',
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDayLabel = (dateKey: string) =>
  new Date(`${dateKey}T00:00:00`).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

const formatVerseTitle = (reference: string) => {
  const match = reference.match(/^(.+)\s(\d+):(\d+)$/);
  if (!match) return reference;

  const [, book, chapter, verse] = match;
  return `${bookAbbreviations[book] ?? book} ${chapter}-${verse}`;
};

const getCalendarDays = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const firstDay = firstDate.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ date: Date; inMonth: boolean }> = [];

  for (let index = firstDay - 1; index >= 0; index -= 1) {
    cells.push({ date: new Date(year, month, -index), inMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(year, month, day), inMonth: true });
  }

  const remaining = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remaining; day += 1) {
    cells.push({ date: new Date(year, month + 1, day), inMonth: false });
  }

  return cells;
};

const JesusJournalPage: React.FC = () => {
  const { devotions, devotionLabelColors, setDevotionLabelColor } = useReadingStore();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());

  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const monthEntries = useMemo(
    () =>
      Object.values(devotions)
        .filter((entry) => {
          const date = new Date(`${entry.date}T00:00:00`);
          return (
            date.getFullYear() === visibleMonth.getFullYear() &&
            date.getMonth() === visibleMonth.getMonth()
          );
        })
        .sort((a, b) => b.date.localeCompare(a.date)),
    [devotions, visibleMonth]
  );

  const moveMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const renderEntrySummary = (entry: DevotionEntry) => {
    const color = devotionLabelColors[entry.date] ?? DEFAULT_LABEL_COLOR;

    return (
      <article key={entry.date} className={styles.entry}>
        <div className={styles.entryHeader}>
          <div>
            <span className={styles.entryDate}>{formatDayLabel(entry.date)}</span>
            <h2>오늘의 말씀 구절({formatVerseTitle(entry.reference)})</h2>
          </div>
          <label className={styles.colorPicker}>
            <Palette size={16} />
            <span>라벨 색상</span>
            <input
              type="color"
              value={color}
              onChange={(event) => setDevotionLabelColor(entry.date, event.target.value)}
              aria-label={`${formatDayLabel(entry.date)} 묵상 라벨 색상`}
            />
          </label>
        </div>
        <p className={styles.verseText}>{entry.verseText}</p>
        <dl className={styles.devotionText}>
          <div>
            <dt>묵상</dt>
            <dd>{entry.reflection || '기록된 묵상이 없습니다.'}</dd>
          </div>
          <div>
            <dt>기도</dt>
            <dd>{entry.prayer || '기록된 기도 제목이 없습니다.'}</dd>
          </div>
          <div>
            <dt>실천</dt>
            <dd>{entry.action || '기록된 실천이 없습니다.'}</dd>
          </div>
        </dl>
      </article>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.date}>오늘의 묵상 기록</span>
        <h1>예수 동행일기</h1>
      </header>
      <TodaySubNav />

      <section className={styles.calendarPanel} aria-label="묵상 캘린더">
        <div className={styles.monthHeader}>
          <button type="button" onClick={() => moveMonth(-1)} aria-label="이전 달">
            <ChevronLeft size={20} />
          </button>
          <strong>
            {visibleMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </strong>
          <button type="button" onClick={() => moveMonth(1)} aria-label="다음 달">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className={styles.weekdays}>
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className={styles.calendarGrid}>
          {calendarDays.map(({ date, inMonth }) => {
            const dateKey = formatDateKey(date);
            const entry = devotions[dateKey];
            const color = devotionLabelColors[dateKey] ?? DEFAULT_LABEL_COLOR;

            return (
              <div
                key={dateKey}
                className={`${styles.dayCell} ${!inMonth ? styles.mutedDay : ''}`}
              >
                <span className={styles.dayNumber}>{date.getDate()}</span>
                {entry && (
                  <div
                    className={styles.devotionLabel}
                    style={{ backgroundColor: color }}
                    title={entry.reference}
                  >
                    {formatVerseTitle(entry.reference)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.entryList} aria-label="묵상 목록">
        {monthEntries.length > 0 ? (
          monthEntries.map(renderEntrySummary)
        ) : (
          <div className={styles.emptyState}>이 달에 저장된 오늘의 묵상이 없습니다.</div>
        )}
      </section>
    </div>
  );
};

export default JesusJournalPage;
