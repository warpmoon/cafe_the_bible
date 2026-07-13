import type { ReadingPlan, ReadingPlanDay } from '../store/readingStore';

interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  generateDays: () => ReadingPlanDay[];
}

// 신약 30일 읽기 계획
const ntBooks = [
  { id: 40, name: '마태복음', chapters: 28 },
  { id: 41, name: '마가복음', chapters: 16 },
  { id: 42, name: '누가복음', chapters: 24 },
  { id: 43, name: '요한복음', chapters: 21 },
  { id: 44, name: '사도행전', chapters: 28 },
  { id: 45, name: '로마서', chapters: 16 },
  { id: 46, name: '고린도전서', chapters: 16 },
  { id: 47, name: '고린도후서', chapters: 13 },
  { id: 48, name: '갈라디아서', chapters: 6 },
  { id: 49, name: '에베소서', chapters: 6 },
  { id: 50, name: '빌립보서', chapters: 4 },
  { id: 51, name: '골로새서', chapters: 4 },
  { id: 52, name: '데살로니가전서', chapters: 5 },
  { id: 53, name: '데살로니가후서', chapters: 3 },
  { id: 54, name: '디모데전서', chapters: 6 },
  { id: 55, name: '디모데후서', chapters: 4 },
  { id: 56, name: '디도서', chapters: 3 },
  { id: 57, name: '빌레몬서', chapters: 1 },
  { id: 58, name: '히브리서', chapters: 13 },
  { id: 59, name: '야고보서', chapters: 5 },
  { id: 60, name: '베드로전서', chapters: 5 },
  { id: 61, name: '베드로후서', chapters: 3 },
  { id: 62, name: '요한일서', chapters: 5 },
  { id: 63, name: '요한이서', chapters: 1 },
  { id: 64, name: '요한삼서', chapters: 1 },
  { id: 65, name: '유다서', chapters: 1 },
  { id: 66, name: '요한계시록', chapters: 22 },
];

// 시편 30일 읽기 계획
const psalmPlan = (): ReadingPlanDay[] => {
  const totalChapters = 150;
  const days = 30;
  const perDay = Math.ceil(totalChapters / days);
  const result: ReadingPlanDay[] = [];

  for (let d = 0; d < days; d++) {
    const start = d * perDay + 1;
    const end = Math.min((d + 1) * perDay, totalChapters);
    result.push({
      day: d + 1,
      label: `시편 ${start}-${end}편`,
      bookId: 19,
      bookName: '시편',
      startChapter: start,
      endChapter: end,
      completed: false,
    });
  }

  return result;
};

// 신약 30일 계획 생성
const nt30Plan = (): ReadingPlanDay[] => {
  const totalChapters = ntBooks.reduce((sum, b) => sum + b.chapters, 0); // 260
  const days = 30;
  const perDay = Math.ceil(totalChapters / days);
  const result: ReadingPlanDay[] = [];

  let dayNum = 1;
  let remaining = perDay;
  let currentBookIdx = 0;
  let currentChapter = 1;

  while (currentBookIdx < ntBooks.length && dayNum <= days) {
    const book = ntBooks[currentBookIdx];
    const chaptersLeftInBook = book.chapters - currentChapter + 1;

    if (chaptersLeftInBook <= remaining) {
      result.push({
        day: dayNum,
        label: `${book.name} ${currentChapter}-${book.chapters}장`,
        bookId: book.id,
        bookName: book.name,
        startChapter: currentChapter,
        endChapter: book.chapters,
        completed: false,
      });
      remaining -= chaptersLeftInBook;
      currentBookIdx++;
      currentChapter = 1;

      if (remaining <= 0) {
        dayNum++;
        remaining = perDay;
      }
    } else {
      const endChapter = currentChapter + remaining - 1;
      result.push({
        day: dayNum,
        label: `${book.name} ${currentChapter}-${endChapter}장`,
        bookId: book.id,
        bookName: book.name,
        startChapter: currentChapter,
        endChapter: endChapter,
        completed: false,
      });
      currentChapter = endChapter + 1;
      dayNum++;
      remaining = perDay;
    }
  }

  return result;
};

// 잠언 31일 계획
const proverbsPlan = (): ReadingPlanDay[] => {
  return Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    label: `잠언 ${i + 1}장`,
    bookId: 20,
    bookName: '잠언',
    startChapter: i + 1,
    endChapter: i + 1,
    completed: false,
  }));
};

export const planTemplates: PlanTemplate[] = [
  {
    id: 'nt-30',
    name: '신약 30일 통독',
    description: '30일 안에 신약 전체를 읽는 계획입니다. 하루 약 8-9장씩 읽습니다.',
    generateDays: nt30Plan,
  },
  {
    id: 'psalm-30',
    name: '시편 30일',
    description: '30일 동안 시편 150편을 완독하는 계획입니다. 하루 5편씩 읽습니다.',
    generateDays: psalmPlan,
  },
  {
    id: 'proverbs-31',
    name: '잠언 31일',
    description: '한 달 동안 잠언 31장을 하루 1장씩 읽는 계획입니다.',
    generateDays: proverbsPlan,
  },
];

export const createPlan = (templateId: string): ReadingPlan | null => {
  const template = planTemplates.find((t) => t.id === templateId);
  if (!template) return null;

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, '0')}-${`${today.getDate()}`.padStart(2, '0')}`;

  return {
    id: template.id,
    name: template.name,
    description: template.description,
    totalDays: template.generateDays().length,
    days: template.generateDays(),
    startDate: todayKey,
    currentDay: 1,
    streak: 0,
    lastReadDate: '',
  };
};
