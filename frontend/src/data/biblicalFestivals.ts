export type FestivalTradition = "jewish" | "church";

export interface BiblicalFestival {
  id: string;
  name: string;
  tradition: FestivalTradition;
  season: string;
  summary: string;
  bibleRefs: string[];
  themes: string[];
}

export const traditionLabels: Record<FestivalTradition | "all", string> = {
  all: "전체",
  jewish: "유대 절기",
  church: "교회 절기",
};

export const biblicalFestivals: BiblicalFestival[] = [
  {
    id: "passover",
    name: "유월절",
    tradition: "jewish",
    season: "니산월 14일",
    summary: "애굽에서 구원받은 사건을 기억하는 절기이며 출애굽 이야기의 중심 절기입니다.",
    bibleRefs: ["출 12:1-28", "레 23:4-8", "눅 22:7-20"],
    themes: ["구원", "어린양", "출애굽"],
  },
  {
    id: "unleavened-bread",
    name: "무교절",
    tradition: "jewish",
    season: "유월절 직후 7일",
    summary: "누룩 없는 떡을 먹으며 급히 애굽을 떠난 일을 기억하는 절기입니다.",
    bibleRefs: ["출 12:15-20", "레 23:6", "신 16:3-8"],
    themes: ["성별", "기억", "출애굽"],
  },
  {
    id: "weeks",
    name: "칠칠절",
    tradition: "jewish",
    season: "초실절 후 50일",
    summary: "맥추의 첫 열매를 드리는 절기이며 신약의 오순절 사건과 연결됩니다.",
    bibleRefs: ["레 23:15-22", "신 16:9-12", "행 2:1-4"],
    themes: ["첫 열매", "감사", "성령"],
  },
  {
    id: "tabernacles",
    name: "초막절",
    tradition: "jewish",
    season: "티쉬리월 15일부터 7일",
    summary: "광야 생활을 기억하며 초막에 거하는 절기입니다.",
    bibleRefs: ["레 23:33-43", "신 16:13-15", "요 7:2-39"],
    themes: ["광야", "하나님의 공급", "기쁨"],
  },
  {
    id: "advent",
    name: "대림절",
    tradition: "church",
    season: "성탄 전 네 주간",
    summary: "그리스도의 오심을 기다리고 다시 오심을 묵상하는 교회력의 시작 절기입니다.",
    bibleRefs: ["사 9:1-7", "마 1:18-25", "눅 1:26-38"],
    themes: ["기다림", "소망", "성육신"],
  },
  {
    id: "christmas",
    name: "성탄절",
    tradition: "church",
    season: "12월 25일",
    summary: "예수 그리스도의 탄생을 기념하는 절기입니다.",
    bibleRefs: ["마 2:1-12", "눅 2:1-20", "요 1:14"],
    themes: ["탄생", "임마누엘", "기쁨"],
  },
  {
    id: "lent",
    name: "사순절",
    tradition: "church",
    season: "부활절 전 40일",
    summary: "예수님의 고난을 기억하며 회개와 절제를 묵상하는 기간입니다.",
    bibleRefs: ["마 4:1-11", "막 8:34-38", "고후 6:1-10"],
    themes: ["회개", "절제", "고난"],
  },
  {
    id: "easter",
    name: "부활절",
    tradition: "church",
    season: "춘분 후 첫 보름 다음 주일",
    summary: "예수 그리스도의 부활을 기념하는 교회 절기의 중심입니다.",
    bibleRefs: ["마 28:1-10", "눅 24:1-12", "고전 15:3-8"],
    themes: ["부활", "새 생명", "승리"],
  },
  {
    id: "pentecost",
    name: "성령강림절",
    tradition: "church",
    season: "부활절 후 50일",
    summary: "성령이 임하고 교회가 복음을 선포하기 시작한 사건을 기억합니다.",
    bibleRefs: ["행 2:1-41", "요 14:16-17", "고전 12:4-13"],
    themes: ["성령", "교회", "선교"],
  },
];
