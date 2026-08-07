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
  const { devotions, devotionLabelColors, setDevotionLabelColor, saveDevotion } = useReadingStore();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  
  const today = new Date();
  const todayKey = formatDateKey(today);
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [draftDevotion, setDraftDevotion] = useState(() => {
    const existing = devotions[todayKey];
    return {
      reference: existing?.reference ?? '',
      verseText: existing?.verseText ?? '',
      reflection: existing?.reflection ?? '',
      prayer: existing?.prayer ?? '',
      action: existing?.action ?? '',
      journal: existing?.journal ?? '',
    };
  });
  const [savedState, setSavedState] = useState<boolean>(false);

  const handleSelectDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    const existing = devotions[dateKey];
    setDraftDevotion({
      reference: existing?.reference ?? '',
      verseText: existing?.verseText ?? '',
      reflection: existing?.reflection ?? '',
      prayer: existing?.prayer ?? '',
      action: existing?.action ?? '',
      journal: existing?.journal ?? '',
    });
    setSavedState(false);
  };

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

  const handleSave = () => {
    saveDevotion({
      date: selectedDate,
      verseId: devotions[selectedDate]?.verseId ?? 0,
      reference: draftDevotion.reference || '묵상 기록',
      verseText: draftDevotion.verseText,
      reflection: draftDevotion.reflection,
      prayer: draftDevotion.prayer,
      action: draftDevotion.action,
      journal: draftDevotion.journal,
      updatedAt: Date.now(),
    });
    setSavedState(true);
    setTimeout(() => setSavedState(false), 2000);
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
          {entry.journal && (
            <div>
              <dt>동행 일기</dt>
              <dd>{entry.journal}</dd>
            </div>
          )}
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
                className={`${styles.dayCell} ${!inMonth ? styles.mutedDay : ''} ${selectedDate === dateKey ? styles.selectedDay : ''}`}
                onClick={() => handleSelectDate(dateKey)}
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

      {/* 캘린더 하단에 노출되는 인라인 일기 작성 폼 */}
      <section className={styles.journalFormPanel} aria-labelledby="journal-form-title">
        <div className={styles.formHeader}>
          <div>
            <span className={styles.eyebrow}>Write journal</span>
            <h2 id="journal-form-title">{formatDayLabel(selectedDate)} 일기 작성</h2>
          </div>
          {savedState && (
            <span className={styles.savedBadge}>저장 완료</span>
          )}
        </div>
        
        <div className={styles.formBody}>
          <div className={styles.formGrid}>
            <label className={styles.formGroup}>
              <span>말씀 구절</span>
              <input
                type="text"
                value={draftDevotion.reference}
                onChange={(e) => setDraftDevotion(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="예: 마태복음 6:33"
              />
            </label>
            <label className={styles.formGroup}>
              <span>말씀 본문</span>
              <input
                type="text"
                value={draftDevotion.verseText}
                onChange={(e) => setDraftDevotion(prev => ({ ...prev, verseText: e.target.value }))}
                placeholder="오늘 마음에 닿은 말씀 본문을 적어보세요."
              />
            </label>
          </div>

          <label className={styles.formGroup}>
            <span>말씀이 오늘 내게 주는 의미 (묵상)</span>
            <textarea
              value={draftDevotion.reflection}
              onChange={(e) => setDraftDevotion(prev => ({ ...prev, reflection: e.target.value }))}
              placeholder="말씀을 읽고 묵상한 내용을 기록해 보세요."
              rows={3}
            />
          </label>

          <div className={styles.formGrid}>
            <label className={styles.formGroup}>
              <span>기도 제목</span>
              <textarea
                value={draftDevotion.prayer}
                onChange={(e) => setDraftDevotion(prev => ({ ...prev, prayer: e.target.value }))}
                placeholder="오늘의 기도를 적어보세요."
                rows={3}
              />
            </label>
            <label className={styles.formGroup}>
              <span>오늘의 실천</span>
              <textarea
                value={draftDevotion.action}
                onChange={(e) => setDraftDevotion(prev => ({ ...prev, action: e.target.value }))}
                placeholder="오늘 하루 실천해 볼 내용을 적어보세요."
                rows={3}
              />
            </label>
          </div>

          <label className={styles.formGroup}>
            <span>동행 일기 (개인 메모)</span>
            <textarea
              value={draftDevotion.journal}
              onChange={(e) => setDraftDevotion(prev => ({ ...prev, journal: e.target.value }))}
              placeholder="오늘 하루 주님과 동행하며 느낀 생각, 감사, 혹은 개인의 소소한 일기를 자유롭게 기록해 보세요."
              rows={4}
            />
          </label>
        </div>

        <div className={styles.formFooter}>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            일기 저장
          </button>
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
