## 기존 API

- POST /users/login/google : 구글 로그인✅
    | 항목                | 내용                |
    | ------------------- | ------------------- |
    | method              | POST                |
    | url                 | /users/login/google |
    | HTTP status code    | 200 OK              |
    | Request Body (JSON) | {                   |
    "code": "AUTH_CODE",
    "redirectUri": "postmessage" //팝업방식이면 postmessage를 보내줌
    } |
    | Response Header | Authorization : Bearer accessToken
    Set-Cookie: refreshToken=rft...; HttpOnly; Secure; SameSite=Strict |
    | Response Body |
    {
    “isNewUser” : true , //아직 프로필을 등록하지 않은 유저
    "email": "user@example.com",
    “ nickname” : “사용자 닉네임”
    }
    |
- POST /users/login/kakao : 카카오 로그인✅
    | 항목                | 내용               |
    | ------------------- | ------------------ |
    | method              | POST               |
    | url                 | /users/login/kakao |
    | HTTP status code    | 200 OK             |
    | Request Body (JSON) | {                  |
    "code": "AUTH_CODE",
    "redirectUri": "http://localhost:5173/oauth/kakao/callback"
    } |
    | Response Header | Authorization : Bearer accessToken
    Set-Cookie: refreshToken=rft...; HttpOnly; Secure; SameSite=Strict |
    | Response Body |
    {
    “isNewUser” : true , //아직 프로필을 등록하지 않은 유저
    "email": "user@example.com",
    “ nickname” : “사용자 닉네임”
    }
    |
- POST /users/logout **: 로그아웃**✅ DELETE로 변경하는게 RESTful함
    | 항목                | 내용                                  |
    | ------------------- | ------------------------------------- |
    | method              | POST→DELETE로 변경하는게 옳을 수 있음 |
    | url                 | /users/logout                         |
    | HTTP status code    | 성공 200 OK                           |
    | Request Body (JSON) |                                       |
    | Request Header      | Authorization : Bearer "accessToken   |
    | Response Header     |                                       |
    | Response Body       | 200 OK                                |
- **POST** /users/check-nickname : 닉네임 중복 확인 AP✅
    | 항목                | 내용                                                                                          |
    | ------------------- | --------------------------------------------------------------------------------------------- |
    | method              | **POST→이럴때는 입력된 닉네임을 쿼리스트링으로 보내면 돼서 GET으로 바꾸는 게 적합할 수 있음** |
    | url                 | /users/check-nickname                                                                         |
    | HTTP status code    | 성공 200 OK                                                                                   |
    | Request Header      |                                                                                               |
    | Request Body (JSON) | {                                                                                             |
    "nickname": "youngjae"
    }
    |
    | Response Body | 1. 존재하는 닉네임일 때
    {
    "message": "Unauthorized",
    "statusCode": 401
    } 2. 사용가능한 닉네임일 때
    200OK |
- POST /users/refresh : 토큰 refresh✅
    | 항목             | 내용                                                               |
    | ---------------- | ------------------------------------------------------------------ |
    | method           | POST                                                               |
    | url              | /users/refresh                                                     |
    | HTTP status code | 성공 200 OK                                                        |
    | Reqeust Header   | Set-Cookie: refreshToken=rft...; HttpOnly; Secure; SameSite=Strict |
    | Response Header  | Authorization : Bearer accessToken                                 |
    | Response Body    | 응답 (Response)                                                    |
    1. 성공 (200 OK)
       **헤더**`Authorization`: `Bearer`
       **쿠키**`refreshToken`: 새로 발급된 refresh token`httpOnly: truesecure: true` (production 환경에서만)`sameSite: strictmaxAge: 7일\\`
       **바디**없음 (헤더와 쿠키로만 전달)
    1. 실패 (401 Unauthorized)
       조건: 요청 쿠키에 `refreshToken`이 없거나 유효하지 않은 경우 |
- PUT /users : 유저 정보 수정 (기존에는 /users/user-update 였음) ✅
    | 항목                | 내용                            |
    | ------------------- | ------------------------------- |
    | method              | PUT                             |
    | url                 | /users                          |
    | HTTP status code    | 성공 200 OK                     |
    | Request Header      | Authorization : Bearer JWTToken |
    | Request Body (JSON) | nickname: 닉네임                |
    bio: 소개
    interests : [1,2]
    file : 이미지 파일
    **regionId : 1** |
    | Response Body | {
    "id": 1,
    "email": "2@2.com123",
    "nickname": "새닉12",
    "bio": "소개글입니다",
    "image": null,
    "interests": [
    {
    "id": 1,
    "name": "공방"
    }
    ],
    "point": 0,
    "region": null,
    "teacherProfile": true,
    "createdAt": "2026-02-04T17:59:14.120Z",
    "updatedAt": "2026-02-06T08:16:02.433Z",
    "deletedAt": null
    } |
- GET /users/verify : 유저 토큰 검증✅
    | 항목                | 내용                                                               |
    | ------------------- | ------------------------------------------------------------------ |
    | method              | GET                                                                |
    | url                 | /users/verify                                                      |
    | HTTP status code    | 성공 200 OK                                                        |
    | Reqeust Header      | Authorization : Bearer accessToken                                 |
    | Request Body (JSON) |                                                                    |
    | Response Header     | Set-Cookie: refreshToken=rft...; HttpOnly; Secure; SameSite=Strict |
    | Response Body       | **1. 토큰이 없거나 잘못된 경우**                                   |
    응답 코드: `401 Unauthorized` 2. **토큰은 유효하지만 DB에 사용자가 없는 경우**
    응답 코드: `401 Unauthorized` 3. 만료된 토큰
    응답 코드: `401 Unauthorized` 4. 유효한 사용자일 때
    응답 코드: 200 ok
    {
    "authenticated": true,
    "isNewUser": false,
    "id": 1,
    "email": "2@2.com123",
    "nickname": "새닉12",
    "bio": "소개글입니다",
    "profileImage": null,
    "interests": [
    {
    "id": 1,
    "name": "공방"
    }
    ],
    **"point": 0,
    "region": null,
    "teacherProfile": true,**
    "createdAt": "2026-02-04T17:59:14.120Z",  
     "updatedAt": "2026-02-05T09:24:27.774Z",
    "deletedAt": null
    } |
    | | |
    | | |
- GET /users : 전체 유저 조회✅
    개발과정에서 전체 유저 확인용 API입니다.
- DELETE /users✅
    | 항목                | 내용                               |
    | ------------------- | ---------------------------------- |
    | method              | DELETE                             |
    | url                 | /users                             |
    | HTTP status code    | 성공 200 OK                        |
    | Reqeust Header      | Authorization : Bearer accessToken |
    | Request Body (JSON) |                                    |
    | Response Header     |                                    |
    | Response Body       | 200 OK                             |
    - 탈퇴 로직 응답 명세
        ## **검증 내용**
        ### **시나리오 테스트 결과**
        1. **수강 예정 내역이 있는 사용자**: 탈퇴 시도 시 "수강 예정인 클래스가 있어 탈퇴할 수 없습니다." 에러 반환 확인.
        2. **참여 예정 모임이 있는 사용자**: 탈퇴 시도 시 "참여 예정인 모임이 있어 탈퇴할 수 없습니다." 에러 반환 확인.
        3. **정상 탈퇴 조건 사용자**:
            - 탈퇴 성공 (200 OK).
            - DB 내 해당 유저 정보가 익명화되고 `deletedAt`이 설정된 것 확인.
            - 탈퇴 후 해당 계정의 토큰으로 접근 시 인증 실패 확인.
        ## **API 응답 명세 (`DELETE /users`)**
        ### **1. 성공 (200 OK)**
        ```json
        json

        {
        "success":true
        }
        ```
        ### **2. 실패 (400 Bad Request)**
        NestJS 기본 예외 형식을 따릅니다. 사유에 따라 `message` 값이 달라집니다.
        ```json
        json

        {
        "statusCode":400,
        "message":"수강 예정인 클래스가 있어 탈퇴할 수 없습니다.",
        "error":"Bad Request"
        }
        ```
        **주요 에러 메시지(`message`):**
        - `"이미 탈퇴했거나 존재하지 않는 사용자입니다."`
        - `"수강 예정인 클래스가 있어 탈퇴할 수 없습니다."`
        - `"진행 예정인 모임의 호스트이므로 탈퇴할 수 없습니다."`
        - `"참여 예정인 모임이 있어 탈퇴할 수 없습니다."`
        - `"수강 예정인 학생이 있는 클래스가 있어 탈퇴할 수 없습니다."`
        ### **3. 인증 실패 (401 Unauthorized)**
        ```json
        json

        {
        "statusCode":401,
        "message":"Unauthorized"
        }
        ```
        ***
        ## **참고 사항**
        **NOTE**
        익명화 처리 시 `email`과 `providerId`에 `Date.now()`를 포함하여, 추후 동일한 소셜 계정이나 이메일로 다시 가입하더라도 DB 유니크 제약 조건에 걸리지 않도록 설계했습니다.

## 📌 1. 클래스(Class) 관련 API

영어문법상 course→lesson으로 세분화를 많이 함

보통 lesson이 단 건을 의미함

### 유저용

- **POST /lessons** : 레슨 생성+임시저장✅→이미지1,2,3,4로 바꿀것
  생성할거면 status를 ACTIVE를 보내고 임시저장이면 status값을 보내지 않거나 DRAFT를 보냄
  | 항목 | 내용 |
  | --- | --- |
  | method | POST |
  | url | /lessons |
  | HTTP status code | 성공시 201
  실패
  이미지 없으면 400에러 |
  | Request Header | Authorization: Bearer <accessToken> |
  | Request Body | {
  "lessonCategoryId": 1,
  "title": "도예 원데이 클래스",
  "description": "초보자 대상 도예 클래스입니다.",
  "level": "BEGINNER",
  "durationMin": 90,
  "curriculum": "성형, 건조, 채색",
  "subCategoryIds": [3, 4, 5],
  "maxParticipants": 8,
  "regionId": 1,
  "address": "서울특별시 마포구 양화로 45",
  "detailAddress": "3층 301호",
  "directionsText": "합정역 2번 출구 도보 5분",
  **"status": "DRAFT", (기본이 DRAFT)**
  "price": 50000,
  "discountRate": 10,
  "discountedPrice": 45000,
  "reservationLeadDays": 3,
  ”image1” : 대표이미지파일,
  ”image2” : 이미지파일2,
  ”image3” : 이미지파일3,
  ”image4” : 이미지파일4,
  } |
  | Response Body | x |
- **PUT /lessons/:lessonId** : 레슨 수정+휴면도 이걸로 합니다✅
  | 항목 | 내용 |
  | ---------------- | ----------------------------------- |
  | method | PUT |
  | url | /lessons/{:lessonId} |
  | HTTP status code | 성공시 204 |
  | Request Header | Authorization: Bearer <accessToken> |
  | Request Body | { |
  "lessonCategoryId": 1,
  "title": "도예 원데이 클래스",
  "description": "초보자 대상 도예 클래스입니다.",
  "level": "BEGINNER",
  "durationMin": 90,
  "curriculum": "성형, 건조, 채색",
  "subCategoryIds": [3, 4, 5],
  "maxParticipants": 8,
  "regionId": 1,
  "address": "서울특별시 마포구 양화로 45",
  "detailAddress": "3층 301호",
  "directionsText": "합정역 2번 출구 도보 5분",
  **"status": "DRAFT",→INACTIVE로 변경 하면 휴면**
  "price": 50000,
  "discountRate": 10,
  "discountedPrice": 45000,
  "reservationLeadDays": 3,
  ”representativeImage” : 이미지파일
  } |
  | Response Body | |
- **DELETE /lessons/:lessonId** : 레슨 삭제 (soft delete)→기한이 만료된 건 아예 삭제를 못하게 로직으로 구현해야함(이거 여기 아님)(조건부 삭제 불가능)✅
  | 항목 | 내용 |
  | ---------------- | ----------------------------------- |
  | method | DELETE |
  | url | /lessons/{lessonId} |
  | HTTP status code | 성공시 204 |
  | Request Header | Authorization: Bearer <accessToken> |
  | Request Body | X |
  | Response Body | X |
- **POST /lessons/:lessonId/schedules** : 레슨 일정 추가→수정필요→수정완✅
  | 항목 | 내용 |
  | ---------------- | ------------------------------ |
  | method | POST |
  | url | /lessons/{lessonsId}/schedules |
  | HTTP status code | 성공시 201 |
  실패시
  배열 비어있음, 날짜형식 오류, startAt >= endAt,레슨 duration과 일정 길이 불일치요청 본문 내 중복 일정DB unique 충돌(이미 존재하는 일정 포함)→400에러
  본인 레슨 아닌거 403에러 |
  | Request Header | Authorization: Bearer <accessToken> |
  | Request Body | [
  {
  "startAt": "2026-02-23T10:00:00",
  "endAt": "2026-02-23T11:30:00"
  },
  {
  "startAt": "2026-02-24T14:00:00",
  "endAt": "2026-02-24T15:30:00"
  }
  ] |
  | Response Body | x |
- **~~PUT /lessons/schedules/:scheduleId** : 레슨 일정 수정✅~~
- **DELETE /lessons/schedules/:scheduleId** : 레슨 일정 삭제✅

    | 항목             | 내용                                  |
    | ---------------- | ------------------------------------- | --- |
    | method           | DELETE                                |
    | url              | /lessons/schedules/{lessonScheduleId} |     |
    | HTTP status code | 성공시 204                            |

    실패시
    403 본인이 개설한 클래스가 아닐때
    400 이미 신청자가 있는 일정은 삭제 못하게 하기 |
    | Request Header | Authorization: Bearer <accessToken> |
    | Request Body | |
    | Response Body | x |
    | | |

- **GET /lessons** : 클래스 목록(전체) 조회 (카테고리, 지역, 난이도, 검색 필터 지원)✅
  | 항목 | 타입 | 설명 | 예시 |
  | --------------- | ------- | ---------------------------------------------- | ------------------------------------------------------- | ---------------------------------------- |
  | page | number | 페이지 번호 (기본 1) | page=1 |
  | limit | number | 페이지 크기 (기본 10, 최대 50) | limit=10 |
  | sort | enum | 정렬 기준 (기본 LATEST) | sort=LIKES |
  | regionId | number | number[] | 지역 ID 필터 (단일/다중 가능) | regionId=1 / regionId=1,2 |
  | categoryId | number | number[] | 대분류 카테고리 ID 필터 | categoryId=10 / categoryId=10,11 |
  | subCategoryId | number | number[] | 소분류 카테고리 ID 필터 | subCategoryId=5 / subCategoryId=5,6 |
  | level | enum | enum[] | 난이도 필터 (BEGINNER,INTERMEDIATE,ADVANCED) | level=beginner / level=BEGINNER,ADVANCED |
  | status | enum | enum[] | 상태 필터 (ACTIVE,INACTIVE 등). 미전달 시 ACTIVE만 조회 | status=ACTIVE,INACTIVE |
  | minParticipants | number | 최대 정원 하한 필터 (maxParticipants >= 값) | minParticipants=5 |
  | maxParticipants | number | 최대 정원 상한 필터 (maxParticipants <= 값) | maxParticipants=10 |
  | minPrice | number | 가격 하한 필터 (price >= 값) | minPrice=20000 |
  | maxPrice | number | 가격 상한 필터 (price <= 값) | maxPrice=50000 |
  | days | enum | enum[] | 요일 필터 (WEEKDAY,SATURDAY,SUNDAY) | days=WEEKDAY / days=WEEKDAY,SUNDAY |
  | timeRange | string | 시간 범위 필터 (시작-종료, 0~24, 예: 9-12) | timeRange=9-12 |
  | finishedFilter | boolean | DTO에 존재하지만 현재 서비스 로직에서는 미사용 | finishedFilter=true |
  | 항목 | 내용 |
  | ---------------- | ---------------------------------- |
  | method | **GET** |
  | url | /lessons?여기뒤에 붙이시면 됩니다. |
  | HTTP status code | 성공시 204 |
  실패시
  403 본인이 개설한 클래스가 아닐때
  400 이미 신청자가 있는 일정은 삭제 못하게 하기 |
  | Request Header | Authorization: Bearer <accessToken> |
  | Request Body | X없음 |
  | Response Body | {
  "data": [
  {
  "id": 1,
  "userId": 2,
  "lessonCategoryId": 1,
  "lessonCategoryName": "독서",
  "title": "도자기 원데이 클래스",
  "description": "초보자도 쉽게 따라올 수 있는 도자기 클래스입니다.",
  "level": "BEGINNER",
  "durationMin": 90,
  "curriculum": "흙 반죽, 성형, 건조, 채색",
  "status": "ACTIVE",
  "price": 50000,
  "discountRate": 10,
  "discountedPrice": 45000,
  "maxParticipants": 8,
  "representativeImage": "https://cdn.example.com/lessons/1.jpg",
  "likeCount": 0,
  "regionId": 1,
  "regionName": "서울특별시",
  "address": "서울특별시 마포구 양화로 45",
  "latitude": 37.5515008030203,
  "longitude": 126.91395024016,
  "detailAddress": "3층 301호",
  "directionsText": "합정역 2번 출구 도보 5분",
  "reservationLeadDays": 3,
  "rate": 0,
  "deletedAt": null,
  "reviewAiSummary": null,
  "createdAt": "2026-02-12T04:45:14.430Z",
  "updatedAt": "2026-02-12T05:57:50.391Z",
  "teacher": {
  "id": 2,
  "nickname": "테스트2"
  },
  "subCategories": [
  { "id": 3, "name": "도예기초" },
  { "id": 4, "name": "핸드빌딩" }
  ],
  "schedules": [
  {
  "id": 12,
  "startAt": "2026-02-20T10:00:00",
  "endAt": "2026-02-20T12:00:00",
  "status": "RECRUITING",
  "currentParticipants": 0
  }
  ]
  }
  ],
  "meta": {
  "totalCount": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
  }
  } |
  | | |
- **GET /lessons/{lessonId}** : 클래스 상세 조회 (커리큘럼, 일정, 이미지, 리뷰 포함)✅
  | 항목 | 내용 |
  | ---------------- | ---------------------------------- |
  | method | **GET** |
  | url | /lessons?여기뒤에 붙이시면 됩니다. |
  | HTTP status code | 성공시 204 |
  실패시
  403 본인이 개설한 클래스가 아닐때
  400 이미 신청자가 있는 일정은 삭제 못하게 하기 |
  | Request Header | Authorization: Bearer <accessToken> |
  | Request Body | |
  | Response Body | {
  "id": 1,
  "userId": 2,
  "lessonCategoryId": 1,
  "lessonCategoryName": "독서",
  "title": "도자기 원데이 클래스",
  "description": "초보자도 쉽게 따라올 수 있는 도자기 클래스입니다.",
  "level": "BEGINNER",
  "durationMin": 90,
  "curriculum": "흙 반죽, 성형, 건조, 채색",
  "status": "ACTIVE",
  "price": 50000,
  "discountRate": 10,
  "discountedPrice": 45000,
  "maxParticipants": 8,
  "representativeImage": "https://cdn.example.com/lessons/1.jpg",
  "likeCount": 0,
  "regionId": 1,
  "regionName": "서울특별시",
  "address": "서울특별시 마포구 양화로 45",
  "latitude": 37.5515008030203,
  "longitude": 126.91395024016,
  "detailAddress": "3층 301호",
  "directionsText": "합정역 2번 출구 도보 5분",
  "reservationLeadDays": 3,
  "rate": 0,
  "deletedAt": null,
  "reviewAiSummary": null,
  "createdAt": "2026-02-12T04:45:14.430Z",
  "updatedAt": "2026-02-12T05:57:50.391Z",
  "teacher": {
  "id": 2,
  "nickname": "테스트2",
  "image": "https://cdn.example.com/users/2.jpg"
  },
  "subCategories": [
  { "id": 3, "name": "도예기초" },
  { "id": 4, "name": "핸드빌딩" }
  ],
  "schedules": [
  {
  "id": 12,
  "startAt": "2026-02-20T10:00:00",
  "endAt": "2026-02-20T12:00:00",
  "status": "RECRUITING",
  "currentParticipants": 0
  }
  ],
  "images": [
  {
  "id": 21,
  "image": "https://cdn.example.com/lessons/1/gallery-1.jpg",
  "sequence": 1
  }
  ],
  "reviews": [
  {
  "id": 31,
  "rating": 5,
  "content": "정말 재밌었어요!",
  "representativeImage": "https://cdn.example.com/reviews/31/main.jpg",
  "createdAt": "2026-02-12T06:20:00.000Z",
  "user": {
  "id": 7,
  "nickname": "수강생A"
  },
  "images": [
  {
  "id": 41,
  "image": "https://cdn.example.com/reviews/31/1.jpg",
  "sequence": 1
  }
  ]
  }
  ]
  } |
  | | |
- **GET /lessons/{lessonId}/schedules** : 클래스 일정 조회

선생님이 클래스를 조회(수강생ID 배열 필요 Enrollments에서)

## 📌 2. 모멘토 관련 API

- POST / teachers : 모멘토 등록 API 입니다.✅
    | 항목             | 내용       |
    | ---------------- | ---------- |
    | method           | POST       |
    | url              | /teachers  |
    | HTTP status code | 성공시 201 |
    실패시
    이미 등록한 유저이거나 이미 등록된 닉네임이면 409에러 |
    | Request Header | Authorization: Bearer <accessToken> |
    | Request Body | {
    "nickname": "string",
    "image": 이미지 파일,
    "introduction": "string"
    } |
    | Response Body | X |
- PUT / teachers : 모멘토 수정 API입니다✅
    | 항목             | 내용       |
    | ---------------- | ---------- |
    | method           | PUT        |
    | url              | /teachers  |
    | HTTP status code | 성공시 204 |
    실패시
    이미 등록된 닉네임이면 409에러 |
    | Request Header | Authorization: Bearer <accessToken> |
    | Request Body | {
    "nickname": "string",
    "image": 이미지 파일,
    "introduction": "string"
    } |
    | Response Body | X |
- DELETE / teachers : 모멘토 삭제 API 입니다✅
    | 항목             | 내용                |
    | ---------------- | ------------------- |
    | method           | DELETE              |
    | url              | /teachers/{user_id} |
    | HTTP status code | 성공시 204          |
    실패시
    401-토큰만료,404-없는 유저 |
    | Request Header | Authorization: Bearer <accessToken> |
    | Request Body | X |
    | Response Body | X |
- GET / teachers / {userId} : 모멘토 조회 API✅→이미지 url 추가
    | 항목             | 내용                |
    | ---------------- | ------------------- |
    | method           | GET                 |
    | url              | /teachers/{user_id} |
    | HTTP status code | 성공시 200          |
    | Request Header   | X                   |
    | Request Body     | X                   |
    | Response Body    | {                   |
    id : 1,→웬만한거 전부다 userId로 검증해서 쓸일이 없을거 같긴한데 일단 보내겠습니다.
    nickname: “닉네임”,
    profileImage: “이미지 url”
    introduction : “소개”
    } |

## 📌 3. 결제/포인트/쿠폰 API

### 유저용

- GET /payments/preview : 결제창 진입 ✅(가격, 소계, 쿠폰 목록, 보유 포인트 조회)
    | 항목             | 내용                                           |
    | ---------------- | ---------------------------------------------- |
    | method           | GET                                            |
    | url              | /payments/preview?scheduleId={id}&quantity={n} |
    | HTTP status code | 200 OK                                         |
    | Request Header   | Authorization: Bearer <accessToken>            |
    | Request Body     | X                                              |
    | Response Body    | {                                              |
    "originalPrice": 30000,
    "quantity": 2,
    "subtotal": 60000,
    "availableCoupons": [
    {
    "id": 1,
    "description": "가입 10% 할인 쿠폰",
    "discountType": "PERCENT",
    "discountValue": 10,
    "validUntil": "2026-03-01T23:59:59.000Z"
    }
    ],
    "userPoints": 0,
    "canPay": false,
    "lessons": {
    "category": {
    "id": 1,
    "name": "대분류"
    },
    "representativeImage": "https://storage.googleapis.com/...jpg",
    "title": "수학 강의",
    "schedule": {
    "startAt": "2026-02-17T01:02:00.000Z",
    "endAt": "2026-02-17T02:03:00.000Z"
    },
    "address": " 서울특별시 강남구 테헤란로 123"
    }
    } |
- POST /payments/calculate : 사용자 쿠폰 선택 ✅(쿠폰 적용 후 최종 결제 금액 계산, 포인트로 결제 가능 여부 확인)
    | 항목             | 내용                                |
    | ---------------- | ----------------------------------- |
    | method           | POST                                |
    | url              | /payments/calculate                 |
    | HTTP status code | 성공시 200                          |
    | Request Header   | Authorization: Bearer <accessToken> |
    | Request Body     | {                                   |
    "scheduleId": 1,
    "quantity": 2,
    "couponId": 1
    } |
    | Response Body | 결제 가능
    {
    "subtotal": 60000,
    "couponDiscount": 6000,
    "finalPrice": 54000,
    "userPoints": 100000,
    "canPay": true
    }
    결제 불가능(잔액부족)
    {
    "subtotal": 40000,
    "couponDiscount": 4000,
    "finalPrice": 36000,
    "userPoints": 8000,
    "canPay": false // 보유 포인트로 결제가 가능한지 여부
    } |
- POST /enrollments : 결제 버튼 클릭 ✅--> email 추가됨
    | 항목             | 내용                                |
    | ---------------- | ----------------------------------- |
    | method           | POST                                |
    | url              | /enrollments                        |
    | HTTP status code | 성공시 201                          |
    | Request Header   | Authorization: Bearer <accessToken> |
    | Request Body     | {                                   |
    "scheduleId": 1,
    "finalPrice": 54000,
    "quantity": 2,
    "couponId": 1,
    "email" : "test@test.com"
    } |
    | Response Body | 결제 성공 시
    201 created
    {
    "enrollmentId": 1,
    "status": "ACCEPTED",
    "transaction": {
    "id": 1,
    "amount": 54000,
    "couponId": 1,
    "type": "USE",
    "status": "COMPLETED"
    },
    "remainingPoints": 46000,
    "teacherBalance": 100000
    }
    결제 실패 시
    400 bad request
    { 
    "canPay": false, 
    "error": { 
    "code": "INSUFFICIENT_POINTS",
     "message": "보유 포인트가 부족하여 결제를 진행할 수 없습니다." 
    }, 
    "finalPrice": 36000,
     "userPoints": 8000
    } |
- GET /enrollments/{enrollmentID}/cancel-info : 수강취소 조회 ✅
    | 항목             | 내용                                    |
    | ---------------- | --------------------------------------- |
    | method           | GET                                     |
    | url              | /enrollments/{enrollmentID}/cancel-info |
    | HTTP status code | 성공시 200                              |
    | Request Header   | Authorization: Bearer <accessToken>     |
    | Request Body     | X                                       |
    | Response Body    | {                                       |
    "classInfo": {
    "title": "수학 강의",
    "teacherName": "선생닉네임",
    "startAt": "2026-02-17T01:02:00.000Z",
    "endAt": "2026-02-17T02:03:00.000Z"
    },
    "paymentInfo": {
    "originPrice": 60000,
    "discountAmount": 6000,
    "finalPrice": 54000,
    "quantity": 2,
    "coupon": {
    "id": 1,
    "name": "가입 10% 할인 쿠폰",
    "discountType": "PERCENT",
    "discountValue": 10
    }
    },
    "refundInfo": {
    "deductedAmount": 16200,
    "refundAmount": 37800,
    "paidAmount": 54000
    }
    } |
- **PUT /enrollments/{id}/cancel** : 수강 취소(환불 처리) ✅
    - 서비스에서 학생/선생님 권한 체크
    - 환불, 포인트 복구, 트랜잭션 상태 변경, 참가자 수 감소까지 트랜잭션 처리
    - Postman에서 학생/선생님 각각 토큰으로 테스트 가능
    | 항목             | 내용                                    |
    | ---------------- | --------------------------------------- |
    | method           | **PUT**                                 |
    | url              | **/enrollments/{enrollmentsId}/cancel** |
    | HTTP status code | 200 OK                                  |
    | Request Header   | Authorization: Bearer <accessToken>     |
    | Request Body     | {                                       |
    "reason": "개인 사정",
    "detailReason": "시간이 맞지 않음"
    } |
    | Response Body | {
    "enrollmentId": 1,
    "status": "CANCELED",
    "refundAmount": 5000,
    "remainingPoints": 10000
    } |

필터링 추가, title으로 변경, 상태값 변경

- **GET** /enrollments/me?page=1&limit=10&filter=수강취소 : 내가 신청한 클래스 목록 조회✅
    | 항목             | 내용                                            |
    | ---------------- | ----------------------------------------------- |
    | method           | **GET**                                         |
    | url              | /enrollments/me?page=1&limit=10&filter=수강취소 |
    | HTTP status code | 성공시 200                                      |
    | Request Header   | Authorization: Bearer <accessToken>             |
    | Request Body     |                                                 |
    | Response Body    | {                                               |
    "meta": {
    "totalCount": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
    },
    "data": [
    {
    "enrollmentId": 1,
    "scheduleId": 1,
    "image": "https://storage.googleapis.com/...jpg",
    "title": " 초보자를 위한 수능 수학 1등급 완성 강의 ",
    "startAt": "2026-03-20T05:00:00.000Z",
    "endAt": "2026-03-20T07:00:00.000Z",
    "status": "수강예정", // "수강예정", "수강완료", "수강취소", "기한만료"
    "transactionStatus": "COMPLETED",
    "transactionId": 3,
    "refundTransactionId": null,
    "reviewId": 3
    }
    ]
    } |
- GET /payments/detail/{enrollmentId} 결제 상세 ✅
    | 항목             | 내용                                |
    | ---------------- | ----------------------------------- |
    | method           | **GET**                             |
    | url              | /payments/detail/{enrollmentId}     |
    | HTTP status code | 성공시 200                          |
    | Request Header   | Authorization: Bearer <accessToken> |
    | Request Body     |                                     |
    | Response Body    | 정상 결제                           |
    {
    "orderId": 2,
    "transactionStatus": "COMPLETED",
    "paymentDate": "2026-02-13T19:01:21.852Z",
    "classInfo": {
    "title": "수학 강의",
    "teacherName": "알 수 없음",
    "startAt": "2026-02-17T01:02:00.000Z",
    "endAt": "2026-02-17T02:03:00.000Z"
    },
    "paymentInfo": {
    "originPrice": 60000,
    "discountAmount": 6000,
    "finalPrice": 54000,
    "quantity": 2,
    "coupon": {
    "id": 1,
    "name": "가입 10% 할인 쿠폰",
    "discountType": "PERCENT",
    "discountValue": 10
    }
    },
    "refundInfo": null
    }
    환불됨
    {
    "orderId": 2,
    "transactionStatus": "COMPLETED",
    "paymentDate": "2026-02-13T19:01:21.852Z",
    "classInfo": {
    "title": "수학 강의",
    "teacherName": "알 수 없음",
    "startAt": "2026-02-17T01:02:00.000Z",
    "endAt": "2026-02-17T02:03:00.000Z"
    },
    "paymentInfo": {
    "originPrice": 60000,
    "discountAmount": 6000,
    "finalPrice": 54000,
    "quantity": 2,
    "coupon": {
    "id": 1,
    "name": "가입 10% 할인 쿠폰",
    "discountType": "PERCENT",
    "discountValue": 10
    }
    },
    "refundInfo": {
    "deductedAmount": 16200,
    "refundAmount": 37800,
    "paidAmount": 54000,
    "refundDate": "2026-02-13T19:11:53.885Z",
    "reason": "개인 사정",
    "detailReason": "환불율 70% 적용"
    }
    } |
- **GET /points/me** : 내 포인트 잔액 및 내역 조회 최신순 ✅
    | 항목             | 내용                                |
    | ---------------- | ----------------------------------- |
    | method           | **GET**                             |
    | url              | **/points/me**                      |
    | HTTP status code | 성공시 200                          |
    | Request Header   | Authorization: Bearer <accessToken> |
    | Request Body     |                                     |
    | Response Body    | {                                   |
    "userPoints": 1000000,
    "teacherProfit": 16200,
    "history": [
    {//선생님이 환불 해준 금액
    "transactionId": 5,
    "lessonName": null,
    "type": "DEDUCT",
    "status": "COMPLETED",
    "amount": -37800,
    "coupon": null,
    "createdAt": "2026-02-13T19:11:53.894Z"
    },
    {//유저가 환불받음
    "transactionId": 4,
    "lessonName": "수학 강의",
    "type": "REFUND",
    "status": "COMPLETED",
    "amount": 37800,
    "coupon": {
    "code": "JOIN11",
    "discountType": "PERCENT",
    "discountValue": 10
    },
    "createdAt": "2026-02-13T19:11:53.885Z"
    },
    ...
    ]
    } |
- **POST /points/charge** : 포인트 충전 ✅
    | 항목             | 내용                                |
    | ---------------- | ----------------------------------- |
    | method           | **POST**                            |
    | url              | **/points/charge**                  |
    | HTTP status code | 성공시 201                          |
    | Request Header   | Authorization: Bearer <accessToken> |
    | Request Body     | {                                   |
    "amount" : 10000
    } |
    | Response Body | {
    "transaction": {
    "id": 44,
    "amount": 10000,
    "type": "CHARGE",
    "status": "COMPLETED",
    "createdAt": "2026-02-11T21:54:31.586Z"
    },
    "userPoints": 99902001
    } |

---

## 쿠폰

- **GET /coupons/{id}** : 쿠폰 상세 조회 ✅
    | 항목             | 내용                                |
    | ---------------- | ----------------------------------- |
    | method           | **GET**                             |
    | url              | **/coupons/{id}**                   |
    | HTTP status code | 성공시 200                          |
    | Request Header   | Authorization: Bearer <accessToken> |
    | Request Body     |                                     |
    | Response Body    | {                                   |
    "id": 1,
    "code": "JOIN10",
    "description": "가입 10% 할인 쿠폰",
    "discountType": "PERCENT",
    "discountValue": 10,
    "maxUsage": 1000,
    "currentUsage": 0,
    "validFrom": "2026-02-01T00:00:00.000Z",
    "validUntil": "2026-03-01T23:59:59.000Z",
    "createdAt": "2026-02-11T15:26:44.747Z",
    "updatedAt": "2026-02-11T15:26:44.747Z"
    } |
- **GET /coupons** : 전체 쿠폰 조회✅ 배너용 필터링이 필요함
    | 항목             | 내용         |
    | ---------------- | ------------ |
    | method           | **GET**      |
    | url              | **/coupons** |
    | HTTP status code | 성공시 200   |
    | Request Header   |              |
    | Request Body     |              |
    | Response Body    | [            |
    {
    "id": 1,
    "code": "JOIN10",
    "description": "가입 10% 할인 쿠폰",
    "discountType": "PERCENT",
    "discountValue": 10,
    "maxUsage": 1000,
    "currentUsage": 0,
    "validFrom": "2026-02-01T00:00:00.000Z",
    "validUntil": "2026-03-01T23:59:59.000Z",
    "createdAt": "2026-02-11T15:26:44.747Z",
    "updatedAt": "2026-02-11T15:26:44.747Z"
    }
    …
    ] |
- **POST /coupons** : 쿠폰 생성 (우리만 씀)✅
    | 항목             | 내용         |
    | ---------------- | ------------ |
    | method           | **POST**     |
    | url              | **/coupons** |
    | HTTP status code | 성공시 200   |
    | Request Header   |              |
    | Request Body     | {            |
    "code": "JOIN10",
    "description": "가입 10% 할인 쿠폰",
    "discountType": "PERCENT",
    "discountValue": 10,
    "maxUsage": 1000,
    "validFrom": "2026-02-01T00:00:00.000Z",
    "validUntil": "2026-03-01T23:59:59.000Z"
    } |
    | Response Body | {
    "id": 1,
    "code": "JOIN10",
    "description": "가입 10% 할인 쿠폰",
    "discountType": "PERCENT",
    "discountValue": 10,
    "maxUsage": 1000,
    "currentUsage": 0,
    "validFrom": "2026-02-01T00:00:00.000Z",
    "validUntil": "2026-03-01T23:59:59.000Z",
    "createdAt": "2026-02-11T15:26:44.747Z",
    "updatedAt": "2026-02-11T15:26:44.747Z"
    } |
- **POST /coupons/issue** : 특정 유저에게 쿠폰 발급✅
  리뷰작성시 쿠폰 지급?
        | 항목 | 내용 |
        | --- | --- |
        | method | **GET** |
        | url | **/coupons/issue** |
        | HTTP status code | 성공시 200 |
        | Request Header | Authorization: Bearer <accessToken> |
        | Request Body | {
        "userId": 1,
        "couponId": 3
        } |
        | Response Body | {
        "id": 1,
        "userId": 1,
        "couponId": 3,
        "isUsed": false,
        "usedAt": null,
        "issuedAt": "2026-02-12T14:34:33.734Z"
        } |
- **GET /coupons/me** : 유저가 가진 쿠폰 조회✅
    | 항목             | 내용                                |
    | ---------------- | ----------------------------------- |
    | method           | **GET**                             |
    | url              | **/coupons/me**                     |
    | HTTP status code | 성공시 200                          |
    | Request Header   | Authorization: Bearer <accessToken> |
    | Request Body     |                                     |
    | Response Body    | [                                   |
    {
    "id": 3,
    "code": "JOIN11",
    "description": "가입 10% 할인 쿠폰",
    "discountType": "PERCENT",
    "discountValue": 10,
    "validFrom": "2026-02-01T00:00:00.000Z",
    "validUntil": "2026-03-01T23:59:59.000Z",
    "isUsed": false,
    "usedAt": null,
    "issuedAt": "2026-02-12T14:34:33.734Z",
    "status": "AVAILABLE"
    }
    …
    ]
    유저 액세스 토큰이 없으면
    {
    "message": "Unauthorized",
    "statusCode": 401
    } |

## 📌 4. 리뷰(Review) 시스템 API

### 유저용

- **POST /reviews** : 리뷰 작성 (이미지 포함) ✅
    | 항목             | 내용       |
    | ---------------- | ---------- |
    | method           | POST       |
    | url              | /reviews   |
    | HTTP status code | 성공시 201 |
    실패시
    이미지 8개 초과 시 400에러
    수강생이 아닐경우, 모멘토 자신일 경우 403에러
    이미 리뷰를 남겼을 경우 409에러 |
    | Request Header | Authorization: Bearer <accessToken> |
    | Request Body | {
    "enrollmentId": Number,
    "rating" : Float,
    "content" : String,
    아래는 옵셔널
    "image1": 이미지 파일(Form-Data),
    "image2": 이미지 파일(Form-Data),
    "image3": 이미지 파일(Form-Data),
    "image4": 이미지 파일(Form-Data),
    "image5": 이미지 파일(Form-Data),
    "image6": 이미지 파일(Form-Data),
    "image7": 이미지 파일(Form-Data),
    "image8": 이미지 파일(Form-Data),
    } |
    | Response Body | X |
- **GET /reviews/me/enrollments/{:enrollmentId}** : 내가 작성한 특정 수강에 대한 리뷰 조회✅
    | 항목             | 내용                                        |
    | ---------------- | ------------------------------------------- |
    | method           | GET                                         |
    | url              | **/reviews/me/enrollments/{:enrollmentId}** |
    | HTTP status code | 성공시 200                                  |
    | Request Header   | Authorization: Bearer <accessToken>         |
    | Request Body     |                                             |
    | Response Body    | {                                           |
    "id": 12,
    "enrollmentId": 10,
    "rating": 4.5,
    "content": "좋은 수업이었어요.",
    "images": [
    {"id": 1, "image": "https://...", "sequence": 1},
    {"id": 2, "image": "https://...", "sequence": 2}
    ]
    } |
- **GET /lessons/{:lessonId}/reviews?page=1&limit=6** : 특정 클래스의 최신 리뷰 목록 조회✅
    | 항목             | 내용                              |
    | ---------------- | --------------------------------- |
    | method           | GET                               |
    | url              | /lessons/3/reviews?page=1&limit=6 |
    | HTTP status code | 성공시 200                        |
    | Request Header   |                                   |
    | Request Body     |                                   |
    | Response Body    | {                                 |
    "data": [
    {
    "id": 101,
    "rating": 4.5,
    "content": "좋은 수업이었어요.",
    "representativeImage": "https://...",
    "createdAt": "2026-02-12T06:20:00.000Z",
    "user": { "id": 7, "nickname": "수강생A" },
    "images": [...]
    }
    ],
    "meta": {
    "totalCount": 27,
    "page": 1,
    "limit": 6,
    "totalPages": 5
    }
    } |
- **GET /reviews?page=1&limit=6** : 전체 최신 리뷰 조회✅
    | 항목             | 내용                    |
    | ---------------- | ----------------------- |
    | method           | GET                     |
    | url              | /reviews?page=1&limit=6 |
    | HTTP status code | 성공시 200              |
    | Response Body    | {                       |
    "data": [
    {
    "id": 301,
    "lessonId": 11,
    "lessonTitle": "클래스명",
    "rating": 4.0,
    "content": "재밌었어요.",
    "representativeImage": "https://..."
    }
    ],
    ...
    } |
- **PUT /reviews/{:reviewId}** : 리뷰 수정✅
    | 항목             | 내용                     |
    | ---------------- | ------------------------ |
    | method           | PUT                      |
    | url              | **/reviews/{:reviewId}** |
    | HTTP status code | 성공시 204               |
    | Request Body     | {                        |
    "rating" : Float,
    "content" : String,
    "removeSequences": Number[], // 삭제할 이미지 sequence 배열
    "image1": File,
    ...
    "image8": File
    } |

---

## 📌 5. 채팅(Chat) 시스템 API

- **POST /chat-rooms** : 채팅방 생성 (수강생 전용) ✅
- **GET /chat-rooms** : 내 채팅방 목록 조회 ✅
- **GET /chat-rooms/{roomId}/messages** : 채팅 메시지 내역 조회 ✅

---

## 📌 6. 프론트 조회용

- GET /lesson-categories : 주 카테고리 조회 ✅
- GET /lesson-categories/{id} : 서브카테고리 조회 ✅
- GET /regions : 지역 조회 ✅

---

## 📌 7. 좋아요(위시리스트) API

- POST /likes : 좋아요 추가 ✅
- DELETE /likes : 좋아요 취소 ✅
- **GET /likes/me** : 이 버튼은 `GET /lessons?isLiked=true` 로 대체하여 사용 권장.
  (필요 시 기존 `/likes/me` 도 유지 가능하지만, 통일성을 위해 클래스 목록 API 활용)
