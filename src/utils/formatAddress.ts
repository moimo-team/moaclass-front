// 시/군/구 주소만 보여주는 함수
export const getDistrictFromAddress = (fullAddress: string): string => {
  if (!fullAddress) return "";

  // 1. 공백으로 주소 쪼개기
  const parts = fullAddress.split(" ");

  // 2. '구'로 끝날 때(동작구, 분당구)
  const gu = parts.find((part) => part.endsWith("구"));
  if (gu) return gu;

  // 3. '군'으로 끝날 때(가평군, 태안군)
  const gun = parts.find((part) => part.endsWith("군"));
  if (gun) return gun;

  // 4. '시'로 끝내기(서울시, 세종시)
  const si = parts.find((part) => part.endsWith("시"));
  if (si) return si;

  // 5. 모두 충족되지 않을 때 그냥 첫 번째 단어 반환
  return parts[0];
};
