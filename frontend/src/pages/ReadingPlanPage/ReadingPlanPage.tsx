import React from 'react';
import { useReadingStore } from '../../store/readingStore';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Flame,
  PlayCircle,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { planTemplates, createPlan } from '../../data/readingPlans';
import styles from './ReadingPlanPage.module.css';

const ReadingPlanPage: React.FC = () => {
  const { activePlan, setActivePlan, completePlanDay, clearPlan } =
    useReadingStore();
  const navigate = useNavigate();

  const handleStartPlan = (templateId: string) => {
    const plan = createPlan(templateId);
    if (plan) {
      setActivePlan(plan);
    }
  };

  const handleDayClick = (day: number, bookId: number, startChapter: number) => {
    completePlanDay(day);
    navigate(`/read/${bookId}/${startChapter}/1`);
  };

  const completedCount = activePlan
    ? activePlan.days.filter((d) => d.completed).length
    : 0;
  const progressPercent = activePlan
    ? Math.round((completedCount / activePlan.totalDays) * 100)
    : 0;

  // 계획 선택 화면
  if (!activePlan) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>읽기 계획</h1>
          <p>체계적인 성경 읽기를 위한 계획을 선택하세요.</p>
        </header>

        <div className={styles.templateGrid}>
          {planTemplates.map((template) => (
            <article key={template.id} className={styles.templateCard}>
              <div className={styles.templateIcon}>
                <BookOpen size={28} />
              </div>
              <h2>{template.name}</h2>
              <p>{template.description}</p>
              <button
                className={styles.startBtn}
                onClick={() => handleStartPlan(template.id)}
              >
                <PlayCircle size={18} />
                시작하기
              </button>
            </article>
          ))}
        </div>
      </div>
    );
  }

  // 진행 중인 계획 화면
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>{activePlan.name}</h1>
          <p>{activePlan.description}</p>
        </div>
        <button
          className={styles.deleteBtn}
          onClick={clearPlan}
          title="계획 삭제"
        >
          <Trash2 size={18} />
        </button>
      </header>

      <section className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <div className={styles.progressStats}>
            <div className={styles.stat}>
              <strong>{completedCount}</strong>
              <span>/ {activePlan.totalDays}일</span>
            </div>
            <div className={styles.streakBadge}>
              <Flame size={16} />
              <span>{activePlan.streak}일 연속</span>
            </div>
          </div>
          <span className={styles.progressPercent}>{progressPercent}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      <section className={styles.dayList}>
        {activePlan.days.map((day) => (
          <button
            key={day.day}
            className={`${styles.dayItem} ${day.completed ? styles.dayCompleted : ''} ${day.day === activePlan.currentDay && !day.completed ? styles.dayCurrent : ''}`}
            onClick={() =>
              handleDayClick(day.day, day.bookId, day.startChapter)
            }
          >
            <div className={styles.dayStatus}>
              {day.completed ? (
                <CheckCircle2 size={20} className={styles.checkIcon} />
              ) : (
                <Circle size={20} />
              )}
            </div>
            <div className={styles.dayInfo}>
              <strong>
                {day.day}일차
                {day.day === activePlan.currentDay && !day.completed && (
                  <span className={styles.todayBadge}>오늘</span>
                )}
              </strong>
              <span>{day.label}</span>
            </div>
            <ChevronRight size={18} className={styles.chevron} />
          </button>
        ))}
      </section>
    </div>
  );
};

export default ReadingPlanPage;
