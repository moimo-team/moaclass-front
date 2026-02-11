export const MOCK_ORDERS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  lessonId: i + 1, // 테스트를 위해 ID와 동일하게 설정
  title: `클래스명${i + 1}`,
  startAt: "2026-01-29 12:00",
  endAt: "2026-01-29 15:00",
  representativeImage: `https://picsum.photos/seed/${i + 100}/200/120`,
  price: 33000,
  status: i % 3 === 0 ? "ACCEPTED" : i % 3 === 1 ? "CANCEL" : "COMPLETED",
  isCompleted: i % 3 === 2,
}));
