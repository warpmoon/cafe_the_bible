export type BiblicalPlaceCategory =
  | "city"
  | "mountain"
  | "water"
  | "region"
  | "wilderness";

export type LocationConfidence = "high" | "medium" | "low";

export interface BiblicalPlace {
  id: string;
  biblicalName: string;
  modernName: string;
  region: string;
  coordinates: [number, number];
  description: string;
  bibleRefs: string[];
  category: BiblicalPlaceCategory;
  confidence: LocationConfidence;
}

export const categoryLabels: Record<BiblicalPlaceCategory | "all", string> = {
  all: "전체",
  city: "도시",
  mountain: "산",
  water: "강/호수",
  region: "지역",
  wilderness: "광야",
};

export const confidenceLabels: Record<LocationConfidence, string> = {
  high: "위치 확실",
  medium: "위치 추정",
  low: "위치 논쟁",
};

export const biblicalPlaces: BiblicalPlace[] = [
  {
    id: "jerusalem",
    biblicalName: "예루살렘",
    modernName: "Jerusalem",
    region: "이스라엘/팔레스타인",
    coordinates: [31.7683, 35.2137],
    description: "다윗 왕국의 중심이자 성전이 세워진 도시입니다.",
    bibleRefs: ["삼하 5:6-10", "시 122:1-9", "마 21:1-11"],
    category: "city",
    confidence: "high",
  },
  {
    id: "bethlehem",
    biblicalName: "베들레헴",
    modernName: "Bethlehem",
    region: "요단강 서안",
    coordinates: [31.7054, 35.2024],
    description: "다윗의 고향이며 예수님의 탄생지로 알려진 유다의 성읍입니다.",
    bibleRefs: ["룻 1:1", "미 5:2", "마 2:1"],
    category: "city",
    confidence: "high",
  },
  {
    id: "nazareth",
    biblicalName: "나사렛",
    modernName: "Nazareth",
    region: "이스라엘 북부",
    coordinates: [32.6996, 35.3035],
    description: "예수님이 성장하신 갈릴리 지역의 마을입니다.",
    bibleRefs: ["마 2:23", "눅 1:26-27", "눅 4:16"],
    category: "city",
    confidence: "high",
  },
  {
    id: "galilee",
    biblicalName: "갈릴리",
    modernName: "Galilee",
    region: "이스라엘 북부",
    coordinates: [32.85, 35.45],
    description: "예수님의 공생애 사역이 집중적으로 펼쳐진 북부 지역입니다.",
    bibleRefs: ["마 4:12-17", "막 1:14", "요 2:1-11"],
    category: "region",
    confidence: "high",
  },
  {
    id: "jericho",
    biblicalName: "여리고",
    modernName: "Jericho",
    region: "요단강 서안",
    coordinates: [31.856, 35.4599],
    description: "이스라엘이 가나안에 들어가며 처음 점령한 성읍으로 기록됩니다.",
    bibleRefs: ["수 6:1-21", "눅 19:1-10", "막 10:46-52"],
    category: "city",
    confidence: "high",
  },
  {
    id: "capernaum",
    biblicalName: "가버나움",
    modernName: "Kfar Nahum / Capernaum",
    region: "갈릴리 호수 북서쪽",
    coordinates: [32.8803, 35.5733],
    description: "예수님의 갈릴리 사역 중심지 중 하나입니다.",
    bibleRefs: ["마 4:13", "막 2:1-12", "요 6:24"],
    category: "city",
    confidence: "high",
  },
  {
    id: "jordan-river",
    biblicalName: "요단강",
    modernName: "Jordan River",
    region: "이스라엘/요르단 경계",
    coordinates: [32.0833, 35.55],
    description: "이스라엘의 가나안 입성과 예수님의 세례 장면에 등장하는 강입니다.",
    bibleRefs: ["수 3:14-17", "왕하 5:14", "마 3:13-17"],
    category: "water",
    confidence: "high",
  },
  {
    id: "dead-sea",
    biblicalName: "염해",
    modernName: "Dead Sea",
    region: "이스라엘/요르단 사이",
    coordinates: [31.559, 35.4732],
    description: "성경에서 염해 또는 아라바 바다로 불리는 저지대의 큰 호수입니다.",
    bibleRefs: ["민 34:12", "신 3:17", "수 15:2"],
    category: "water",
    confidence: "high",
  },
  {
    id: "mount-sinai",
    biblicalName: "시내산",
    modernName: "Mount Sinai / Jebel Musa",
    region: "이집트 시나이 반도",
    coordinates: [28.5397, 33.9754],
    description: "모세가 율법을 받은 산으로 전통적으로 연결되는 장소입니다.",
    bibleRefs: ["출 19:1-20", "출 24:12-18", "신 5:2"],
    category: "mountain",
    confidence: "medium",
  },
  {
    id: "damascus",
    biblicalName: "다메섹",
    modernName: "Damascus",
    region: "시리아",
    coordinates: [33.5138, 36.2765],
    description: "고대 아람의 주요 도시이며 바울의 회심 이야기와 관련됩니다.",
    bibleRefs: ["왕상 11:24", "행 9:1-19", "고후 11:32"],
    category: "city",
    confidence: "high",
  },
  {
    id: "nineveh",
    biblicalName: "니느웨",
    modernName: "Nineveh / Mosul area",
    region: "이라크 북부",
    coordinates: [36.3594, 43.1529],
    description: "요나서의 중심 무대이며 앗수르 제국의 중요한 도시였습니다.",
    bibleRefs: ["욘 1:2", "욘 3:1-10", "나 1:1"],
    category: "city",
    confidence: "high",
  },
  {
    id: "babylon",
    biblicalName: "바벨론",
    modernName: "Babylon / Hillah area",
    region: "이라크 중부",
    coordinates: [32.5364, 44.4208],
    description: "유다 포로기와 예언서에 반복적으로 등장하는 메소포타미아의 대도시입니다.",
    bibleRefs: ["왕하 24:10-16", "단 1:1-7", "렘 29:1-14"],
    category: "city",
    confidence: "high",
  },
  {
    id: "wilderness-of-judea",
    biblicalName: "유대 광야",
    modernName: "Judean Desert",
    region: "이스라엘/요단강 서안",
    coordinates: [31.705, 35.35],
    description: "세례 요한의 사역과 예수님의 시험 장면에 연결되는 광야 지역입니다.",
    bibleRefs: ["마 3:1", "마 4:1-11", "막 1:4"],
    category: "wilderness",
    confidence: "high",
  },
  {
    id: "mount-carmel",
    biblicalName: "갈멜산",
    modernName: "Mount Carmel",
    region: "이스라엘 하이파 인근",
    coordinates: [32.7294, 35.0497],
    description: "엘리야와 바알 선지자들의 대결 장면으로 잘 알려진 산입니다.",
    bibleRefs: ["왕상 18:19-40", "왕하 2:25", "아 7:5"],
    category: "mountain",
    confidence: "high",
  },
  {
    id: "samaria",
    biblicalName: "사마리아",
    modernName: "Samaria / Sebastia area",
    region: "요단강 서안 북부",
    coordinates: [32.2765, 35.1893],
    description: "북이스라엘 왕국의 수도와 그 주변 지역을 가리킵니다.",
    bibleRefs: ["왕상 16:24", "요 4:4-42", "행 8:5-25"],
    category: "region",
    confidence: "high",
  },
];
