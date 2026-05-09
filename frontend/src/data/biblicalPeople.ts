export interface BiblicalPerson {
  id: string;
  name: string;
  period: string;
  role: string;
  summary: string;
  bibleRefs: string[];
  relatedPlaces: string[];
}

export const biblicalPeople: BiblicalPerson[] = [
  {
    id: "abraham",
    name: "아브라함",
    period: "족장 시대",
    role: "믿음의 조상",
    summary: "하나님의 부르심을 따라 고향을 떠났고, 이스라엘 언약 이야기의 출발점이 되는 인물입니다.",
    bibleRefs: ["창 12:1-9", "창 15:1-21", "롬 4:1-25"],
    relatedPlaces: ["하란", "세겜", "헤브론"],
  },
  {
    id: "moses",
    name: "모세",
    period: "출애굽 시대",
    role: "출애굽 지도자",
    summary: "이스라엘을 애굽에서 이끌어 냈고 시내산에서 율법을 받은 지도자입니다.",
    bibleRefs: ["출 3:1-12", "출 14:21-31", "신 34:1-12"],
    relatedPlaces: ["애굽", "시내산", "모압 평지"],
  },
  {
    id: "david",
    name: "다윗",
    period: "통일 왕국",
    role: "이스라엘 왕",
    summary: "유다와 이스라엘을 다스린 왕이며 예루살렘을 왕국의 중심으로 삼았습니다.",
    bibleRefs: ["삼상 16:1-13", "삼하 5:1-10", "시 23:1-6"],
    relatedPlaces: ["베들레헴", "헤브론", "예루살렘"],
  },
  {
    id: "elijah",
    name: "엘리야",
    period: "분열 왕국",
    role: "선지자",
    summary: "북이스라엘의 우상 숭배에 맞서 하나님의 말씀을 전한 선지자입니다.",
    bibleRefs: ["왕상 17:1-24", "왕상 18:19-40", "왕하 2:1-12"],
    relatedPlaces: ["그릿 시냇가", "사르밧", "갈멜산"],
  },
  {
    id: "mary",
    name: "마리아",
    period: "신약 시대",
    role: "예수님의 어머니",
    summary: "나사렛에서 천사의 방문을 받고 예수님의 탄생 이야기 중심에 서는 인물입니다.",
    bibleRefs: ["눅 1:26-38", "눅 2:1-20", "요 19:25-27"],
    relatedPlaces: ["나사렛", "베들레헴", "예루살렘"],
  },
  {
    id: "peter",
    name: "베드로",
    period: "초대 교회",
    role: "사도",
    summary: "예수님의 제자였고 초대 교회에서 복음을 전한 핵심 사도입니다.",
    bibleRefs: ["마 16:13-20", "요 21:15-19", "행 2:14-41"],
    relatedPlaces: ["가버나움", "갈릴리", "예루살렘"],
  },
  {
    id: "paul",
    name: "바울",
    period: "초대 교회",
    role: "이방인의 사도",
    summary: "다메섹 길에서 회심한 뒤 여러 지역에 복음을 전하고 교회에 편지를 보냈습니다.",
    bibleRefs: ["행 9:1-19", "행 13:1-3", "롬 1:1-7"],
    relatedPlaces: ["다메섹", "안디옥", "로마"],
  },
];
