// 클래스 카테고리
export const LESSON_CATEGORIES = [
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
export const LESSON_SUB_CATEGORIES = [
    // 핸드메이드
    {
        id: 1,
        categoryId: 1,
        name: "캔들·디퓨저"
    },
    {
        id: 2,
        categoryId: 1,
        name: "향수"
    },
    {
        id: 3,
        categoryId: 1,
        name: "비누·배쓰밤"
    },
    {
        id: 4,
        categoryId: 1,
        name: "위빙·소잉"
    },
    {
        id: 5,
        categoryId: 1,
        name: "라탄·마크라메"
    },
    {
        id: 6,
        categoryId: 1,
        name: "액세서리"
    },
    {
        id: 7,
        categoryId: 1,
        name: "가죽"
    },
    {
        id: 8,
        categoryId: 1,
        name: "도자기"
    },
    {
        id: 9,
        categoryId: 1,
        name: "목공"
    },
    {
        id: 10,
        categoryId: 1,
        name: "레진"
    },
    {
        id: 11,
        categoryId: 1,
        name: "디자인·굿즈"
    },
    {
        id: 12,
        categoryId: 1,
        name: "업사이클링"
    },
    {
        id: 13,
        categoryId: 1,
        name: "기타 공예"
    },
    // 쿠킹
    {
        id: 14,
        categoryId: 2,
        name: "베이킹"
    },
    {
        id: 15,
        categoryId: 2,
        name: "요리"
    },
    {
        id: 16,
        categoryId: 2,
        name: "떡·앙금"
    },
    {
        id: 17,
        categoryId: 2,
        name: "디저트·음료"
    },
    {
        id: 18,
        categoryId: 2,
        name: "커피·바리스타"
    },
    {
        id: 19,
        categoryId: 2,
        name: "기타 쿠킹"
    },
    // 드로잉
    {
        id: 20,
        categoryId: 4,
        name: "드로잉"
    },
    {
        id: 21,
        categoryId: 4,
        name: "소묘"
    },
    {
        id: 22,
        categoryId: 4,
        name: "펜화"
    },
    {
        id: 23,
        categoryId: 4,
        name: "캘리그라피"
    },
    {
        id: 24,
        categoryId: 4,
        name: "수채화"
    },
    {
        id: 25,
        categoryId: 4,
        name: "동양화"
    },
    {
        id: 26,
        categoryId: 4,
        name: "서양화"
    },
    {
        id: 27,
        categoryId: 4,
        name: "민화"
    },
    {
        id: 28,
        categoryId: 4,
        name: "일러스트"
    },
    {
        id: 29,
        categoryId: 4,
        name: "유화"
    },
    {
        id: 30,
        categoryId: 4,
        name: "아크릴"
    },
    {
        id: 31,
        categoryId: 4,
        name: "디지털 드로잉"
    },
    {
        id: 32,
        categoryId: 4,
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
        categoryId: 6,
        name: "요가"
    },
    {
        id: 40,
        categoryId: 6,
        name: "필라테스"
    },
    // 레져·스포츠
    {
        id: 41,
        categoryId: 7,
        name: "피트니스"
    },
    {
        id: 42,
        categoryId: 7,
        name: "실내 운동"
    },
    {
        id: 43,
        categoryId: 7,
        name: "야외 운동"
    },
    {
        id: 44,
        categoryId: 7,
        name: "댄스"
    },
    {
        id: 45,
        categoryId: 7,
        name: "레저"
    },
    {
        id: 46,
        categoryId: 7,
        name: "기타 스포츠"
    },
    // 뷰티
    {
        id: 47,
        categoryId: 8,
        name: "메이크업"
    },
    {
        id: 48,
        categoryId: 8,
        name: "헤어"
    },
    {
        id: 49,
        categoryId: 8,
        name: "네일아트"
    },
    {
        id: 50,
        categoryId: 8,
        name: "타투"
    },
    {
        id: 51,
        categoryId: 8,
        name: "셀프케어"
    },
    // 반려동물
    {
        id: 52,
        categoryId: 9,
        name: "펫 푸드"
    },
    {
        id: 53,
        categoryId: 9,
        name: "펫 에티켓"
    },
    {
        id: 54,
        categoryId: 9,
        name: "펫 액세서리"
    },
    {
        id: 55,
        categoryId: 9,
        name: "펫 미용"
    },
    {
        id: 56,
        categoryId: 9,
        name: "기타 펫 클래스"
    }
];