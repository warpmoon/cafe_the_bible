import React, { useMemo, useState } from 'react';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import { useReadingStore, type FaithCheckEntry } from '../../store/readingStore';
import TodaySubNav from './TodaySubNav';
import styles from './FaithCheckPage.module.css';

type GraphRange = 'week' | 'month' | 'year';

const TEMP_CHECK_ITEMS = [
  { id: 'word', label: '말씀을 읽고 마음에 남은 구절을 붙잡았나요?' },
  { id: 'prayer', label: '정해진 시간에 기도했나요?' },
  { id: 'gratitude', label: '감사한 일을 한 가지 이상 기록했나요?' },
  { id: 'obedience', label: '오늘 순종해야 할 일을 실천했나요?' },
  { id: 'love', label: '가까운 사람에게 사랑을 표현했나요?' },
  { id: 'repentance', label: '돌아볼 죄와 태도를 하나님 앞에 고백했나요?' },
];

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getScore = (checks: Record<string, boolean>) => {
  const checkedCount = TEMP_CHECK_ITEMS.filter((item) => checks[item.id]).length;
  return Math.round((checkedCount / TEMP_CHECK_ITEMS.length) * 100);
};

const average = (values: number[]) => {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
};

const buildGraphData = (
  range: GraphRange,
  faithChecks: Record<string, FaithCheckEntry>
) => {
  const today = new Date();

  if (range === 'week') {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = formatDateKey(date);
      return {
        label: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
        score: faithChecks[key] ? getScore(faithChecks[key].checks) : 0,
      };
    });
  }

  if (range === 'month') {
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekBuckets = [1, 2, 3, 4, 5].map((week) => ({ label: `${week}주`, scores: [] as number[] }));

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = formatDateKey(date);
      const entry = faithChecks[key];
      if (entry) {
        const weekIndex = Math.min(Math.floor((day - 1) / 7), 4);
        weekBuckets[weekIndex].scores.push(getScore(entry.checks));
      }
    }

    return weekBuckets.map((bucket) => ({
      label: bucket.label,
      score: average(bucket.scores),
    }));
  }

  const year = today.getFullYear();
  return Array.from({ length: 12 }, (_, month) => {
    const monthScores = Object.values(faithChecks)
      .filter((entry) => {
        const date = new Date(`${entry.date}T00:00:00`);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .map((entry) => getScore(entry.checks));

    return {
      label: `${month + 1}월`,
      score: average(monthScores),
    };
  });
};

const FaithCheckPage: React.FC = () => {
  const { faithChecks, saveFaithCheck } = useReadingStore();
  const [range, setRange] = useState<GraphRange>('week');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const today = new Date();
  const todayKey = formatDateKey(today);
  const todayEntry = faithChecks[todayKey];
  const [checks, setChecks] = useState<Record<string, boolean>>(() => todayEntry?.checks ?? {});
  const [note, setNote] = useState(() => todayEntry?.note ?? '');
  const graphData = useMemo(() => buildGraphData(range, faithChecks), [faithChecks, range]);
  const todayScore = getScore(checks);

  const handleToggle = (id: string) => {
    setChecks((current) => ({ ...current, [id]: !current[id] }));
    setSavedAt(null);
  };

  const handleSave = () => {
    const updatedAt = today.getTime();
    saveFaithCheck({
      date: todayKey,
      checks,
      note,
      updatedAt,
    });
    setSavedAt(updatedAt);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.date}>
          {today.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </span>
        <h1>오늘의 신앙 체크</h1>
      </header>
      <TodaySubNav />

      <section className={styles.checkPanel} aria-labelledby="faith-check-title">
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>Daily check</span>
            <h2 id="faith-check-title">하루 신앙 점검</h2>
          </div>
          <strong className={styles.score}>{todayScore}점</strong>
        </div>

        <div className={styles.checkList}>
          {TEMP_CHECK_ITEMS.map((item) => (
            <label key={item.id} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={Boolean(checks[item.id])}
                onChange={() => handleToggle(item.id)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        <label className={styles.noteField}>
          <span>오늘의 메모</span>
          <textarea
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setSavedAt(null);
            }}
            placeholder="점검하며 떠오른 생각을 적어보세요."
            rows={3}
          />
        </label>

        <div className={styles.saveRow}>
          {savedAt && (
            <span className={styles.savedState}>
              <CheckCircle2 size={16} />
              저장됨
            </span>
          )}
          <button type="button" onClick={handleSave}>
            점검 저장
          </button>
        </div>
      </section>

      <section className={styles.graphPanel} aria-labelledby="faith-graph-title">
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>Progress</span>
            <h2 id="faith-graph-title">결과 그래프</h2>
          </div>
          <BarChart3 size={22} />
        </div>

        <div className={styles.rangeTabs} role="tablist" aria-label="그래프 기간">
          {[
            { value: 'week', label: '주별' },
            { value: 'month', label: '월별' },
            { value: 'year', label: '연간' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={range === item.value ? styles.activeRange : styles.rangeButton}
              onClick={() => setRange(item.value as GraphRange)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.graph}>
          {graphData.map((item) => (
            <div key={item.label} className={styles.barGroup}>
              <div className={styles.barTrack}>
                <div className={styles.bar} style={{ height: `${item.score}%` }} />
              </div>
              <strong>{item.score}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FaithCheckPage;
