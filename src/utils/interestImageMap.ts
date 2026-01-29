// src/lib/interestImageMap.ts

// 관심사 이름 목록 (순서 중요: interest_1.png ~ interest_24.png 와 매핑됨)
const INTEREST_NAMES = [
  '인간관계(친목)', '술', '자기계발/공부', '예술', '스포츠/운동',
  '음식', '라이프', '공예/만들기', '책/글쓰기/독서', '차/음료',
  '커리어/직장', '재테크', '반려동물', '게임/액티비티', '여행',
  '심리/상담', '인테리어/가구', '건강', '환경', '엔터',
  '미용', '트렌드', '연애/이성관계', '식물/자연'
];

// Vite의 Glob Import 기능을 사용하여 동적으로 이미지 로드
// eager: true -> 비동기가 아닌 정적으로 로드 (import 구문과 동일 효과)
// import: 'default' -> 모듈의 default export (이미지 경로 string)만 가져옴
const images = import.meta.glob<{ default: string }>('../assets/images/interests/*.webp', {
  eager: true,
  import: 'default',
});

export const interestImageMap: { [key: string]: string } = INTEREST_NAMES.reduce((acc, name, index) => {
  // interest_1.png 부터 시작하므로 index + 1
  const id = index + 1;
  
  // 파일 경로에서 해당 id를 포함하는 키를 찾음
  // 예: ../assets/images/interests/interest_1.png
  const imagePath = Object.keys(images).find(path => path.includes(`interest_${id}.webp`));
  
  if (imagePath) {
    acc[name] = images[imagePath] as unknown as string;
  }
  
  return acc;
}, {} as Record<string, string>);

export const getInterestImageUrl = (interestName: string): string => {
  return interestImageMap[interestName];
};
