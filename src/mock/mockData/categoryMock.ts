// 클래스 카테고리
export const CLASS_CATEGORIES = [
    {
        id: 1,
        name: "핸드메이드"
    },
    {
        id: 2,
        name: "쿠킹"
    },
    {
        id: 3,
        name: "플라워·가드닝"
    },
    {
        id: 4,
        name: "드로잉"
    },
    {
        id: 5,
        name: "음악"
    },
    {
        id: 6,
        name: "요가·필라테스"
    },
    {
        id: 7,
        name: "레져·스포츠"
    },
    {
        id: 8,
        name: "뷰티"
    },
    {
        id: 9,
        name: "반려동물"
    },
    {
        id: 10,
        name: "체험"
    },
    {
        id: 11,
        name: "자기계발"
    },
    {
        id: 12,
        name: "로컬여행"
    },
];

// 서브 클래스 카테고리
export const SUB_CLASS_CATEGORIES = [
    // 핸드메이드
    {
        id: 1,
        category_id: 1,
        name: "캔들·디퓨저"
    },
    {
        id: 2,
        category_id: 1,
        name: "향수"
    },
    {
        id: 3,
        category_id: 1,
        name: "비누·배쓰밤"
    },
    {
        id: 4,
        category_id: 1,
        name: "위빙·소잉"
    },
    {
        id: 5,
        category_id: 1,
        name: "라탄·마크라메"
    },
    {
        id: 6,
        category_id: 1,
        name: "액세서리"
    },
    {
        id: 7,
        category_id: 1,
        name: "가죽"
    },
    {
        id: 8,
        category_id: 1,
        name: "도자기"
    },
    {
        id: 9,
        category_id: 1,
        name: "목공"
    },
    {
        id: 10,
        category_id: 1,
        name: "레진"
    },
    {
        id: 11,
        category_id: 1,
        name: "디자인·굿즈"
    },
    {
        id: 12,
        category_id: 1,
        name: "업사이클링"
    },
    {
        id: 13,
        category_id: 1,
        name: "기타 공예"
    },
    // 쿠킹
    {
        id: 14,
        category_id: 2,
        name: "베이킹"
    },
    {
        id: 15,
        category_id: 2,
        name: "요리"
    },
    {
        id: 16,
        category_id: 2,
        name: "떡·앙금"
    },
    {
        id: 17,
        category_id: 2,
        name: "디저트·음료"
    },
    {
        id: 18,
        category_id: 2,
        name: "커피·바리스타"
    },
    {
        id: 19,
        category_id: 2,
        name: "기타 쿠킹"
    },
    // 드로잉
    {
        id: 20,
        category_id: 4,
        name: "드로잉"
    },
    {
        id: 21,
        category_id: 4,
        name: "소묘"
    },
    {
        id: 22,
        category_id: 4,
        name: "펜화"
    },
    {
        id: 23,
        category_id: 4,
        name: "캘리그라피"
    },
    {
        id: 24,
        category_id: 4,
        name: "수채화"
    },
    {
        id: 25,
        category_id: 4,
        name: "동양화"
    },
    {
        id: 26,
        category_id: 4,
        name: "서양화"
    },
    {
        id: 27,
        category_id: 4,
        name: "민화"
    },
    {
        id: 28,
        category_id: 4,
        name: "일러스트"
    },
    {
        id: 29,
        category_id: 4,
        name: "유화"
    },
    {
        id: 30,
        category_id: 4,
        name: "아크릴"
    },
    {
        id: 31,
        category_id: 4,
        name: "디지털 드로잉"
    },
    {
        id: 32,
        category_id: 4,
        name: "기타 드로잉"
    },
    // 음악
    {
        id: 33,
        category_id: 5,
        name: "피아노"
    },
    {
        id: 34,
        category_id: 5,
        name: "기타·우쿠렐레"
    },
    {
        id: 35,
        category_id: 5,
        name: "보컬"
    },
    {
        id: 36,
        category_id: 5,
        name: "작사·작곡"
    },
    {
        id: 37,
        category_id: 5,
        name: "프로듀싱"
    },
    {
        id: 38,
        category_id: 5,
        name: "기타 악기"
    },
    // 요가·필라테스
    {
        id: 39,
        category_id: 6,
        name: "요가"
    },
    {
        id: 40,
        category_id: 6,
        name: "필라테스"
    },
    // 레져·스포츠
    {
        id: 41,
        category_id: 7,
        name: "피트니스"
    },
    {
        id: 42,
        category_id: 7,
        name: "실내 운동"
    },
    {
        id: 43,
        category_id: 7,
        name: "야외 운동"
    },
    {
        id: 44,
        category_id: 7,
        name: "댄스"
    },
    {
        id: 45,
        category_id: 7,
        name: "레저"
    },
    {
        id: 46,
        category_id: 7,
        name: "기타 스포츠"
    },
    // 뷰티
    {
        id: 47,
        category_id: 8,
        name: "메이크업"
    },
    {
        id: 48,
        category_id: 8,
        name: "헤어"
    },
    {
        id: 49,
        category_id: 8,
        name: "네일아트"
    },
    {
        id: 50,
        category_id: 8,
        name: "타투"
    },
    {
        id: 51,
        category_id: 8,
        name: "셀프케어"
    },
    // 반려동물
    {
        id: 52,
        category_id: 9,
        name: "펫 푸드"
    },
    {
        id: 53,
        category_id: 9,
        name: "펫 에티켓"
    },
    {
        id: 54,
        category_id: 9,
        name: "펫 액세서리"
    },
    {
        id: 55,
        category_id: 9,
        name: "펫 미용"
    },
    {
        id: 56,
        category_id: 9,
        name: "기타 펫 클래스"
    }
];