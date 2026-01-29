import { http, HttpResponse, delay } from "msw";
import { httpUrl } from "./mockData";

// Mock 사용자 정보 상태 관리 (userInfoHandler에서 이동)
let mockUserInfo = {
    id: 3,
    email: "moimo@email.com",
    nickname: "테스터",
    bio: "소개글입니다",
    interests: [
        { id: 1, name: "인간관계(친목)" },
        { id: 2, name: "술" },
        { id: 3, name: "자기계발/공부" }
    ],
    profileImage: "https://picsum.photos/id/111/300/300"
};

// 일반 로그인 핸들러
const login = http.post(`${httpUrl}/users/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as any;
    await delay(1000);

    if (email === "moimo@email.com" && password === "12345678") {
        return HttpResponse.json(
            {
                user: {
                    id: 3,
                    isNewUser: false, // 기존 유저는 메인으로 이동
                    email,
                    nickname: "테스터",
                },
                accessToken: "mock-jwt-token",
            },
            {
                headers: {
                    Authorization: "Bearer mock-jwt-token",
                    "Set-Cookie":
                        "refreshToken=mock-refresh-token; HttpOnly; Secure; SameSite=Strict",
                    // 'Set-Cookie': 'refreshToken=mock-refresh-token; HttpOnly; SameSite=Lax'
                },
            },
        );
    }

    if (email === "newuser@email.com" && password === "12345678") {
        return HttpResponse.json(
            {
                user: {
                    id: 4,
                    isNewUser: true, // 신규 유저는 추가 정보 입력 페이지로 이동
                    email,
                    nickname: "신규유저",
                },
                accessToken: "mock-jwt-token-new",
            },
            {
                headers: {
                    Authorization: "Bearer mock-jwt-token-new",
                    "Set-Cookie":
                        "refreshToken=mock-refresh-token; HttpOnly; Secure; SameSite=Strict",
                },
            },
        );
    }

    return new HttpResponse(
        JSON.stringify({ message: "이메일 또는 비밀번호가 일치하지 않습니다." }),
        { status: 401 },
    );
});

// 구글 로그인
const googleLogin = http.post(
    `${httpUrl}/users/login/google`,
    async ({ request }) => {
        try {
            const { code, redirectUri } = (await request.json()) as any;
            console.log("google login request:", { code, redirectUri });
            await delay(1000);
            return HttpResponse.json(
                {
                    user: {
                        id: 5,
                        isNewUser: true,
                        email: "google-user@email.com",
                        nickname: "구글사용자",
                    },
                    accessToken: "mock-jwt-token",
                },
                {
                    status: 200,
                    headers: {
                        Authorization: "Bearer mock-jwt-token",
                        "Set-Cookie":
                            "refreshToken=mock-refresh-token; HttpOnly; Secure; SameSite=Strict",
                    },
                },
            );
        } catch (error) {
            console.error("MSW googleLogin error:", error);
            return new HttpResponse(
                JSON.stringify({
                    error: {
                        code: "500",
                        message: error instanceof Error ? error.message : "Unknown error",
                    },
                }),
                { status: 500 },
            );
        }
    },
);

// 로그아웃 핸들러
const logout = http.post(`${httpUrl}/users/logout`, async () => {
    await delay(1000);
    return HttpResponse.json({ message: "로그아웃이 완료되었습니다." });
});

// 회원가입 핸들러
const join = http.post(`${httpUrl}/users/register`, async ({ request }) => {
    const { email, password, nickname } = (await request.json()) as any;
    await delay(1000);
    return HttpResponse.json(
        {
            message: "회원가입 성공",
            user: {
                id: 3,
                email: email,
                password: password,
                nickname: nickname,
                bio: null,
                resetCode: null,
                refreshToken: null,
                createdAt: "2026-01-07T08:11:07.000Z",
                updatedAt: "2026-01-07T08:11:07.000Z",
            },
            accessToken: "mock-jwt-token",
        },
        {
            headers: {
                Authorization: "Bearer mock-jwt-token",
                "Set-Cookie":
                    "refreshToken=mock-refresh-token; HttpOnly; Secure; SameSite=Strict",
            },
        },
    );
});

// 이메일 중복 확인
const checkEmail = http.post(
    `${httpUrl}/users/check-email`,
    async ({ request }) => {
        const { email } = (await request.json()) as any;
        await delay(500);

        if (email === "taken@email.com") {
            return new HttpResponse(
                JSON.stringify({ message: "이미 사용 중인 이메일입니다." }),
                { status: 409 },
            );
        }

        return HttpResponse.json(
            { message: "사용 가능한 이메일입니다." },
            { status: 200 },
        );
    },
);

// 닉네임 중복 확인
const checkNickname = http.post(
    `${httpUrl}/users/check-nickname`,
    async ({ request }) => {
        const { nickname } = (await request.json()) as any;
        await delay(500);

        if (nickname === "nickname123") {
            return new HttpResponse(
                JSON.stringify({ message: "이미 사용 중인 닉네임입니다." }),
                { status: 409 },
            );
        }
        return HttpResponse.json(
            { message: "사용 가능한 닉네임입니다." },
            { status: 200 },
        );
    },
);

// 비밀번호 재설정 코드 저장소 (메모리 DB 역할)
const resetCodeStore = new Map<string, { email: string; expiresAt: Date }>();
// 비밀번호 재설정 토큰 저장소
const resetTokenStore = new Map<
    string,
    { email: string; resetCode: string; expiresAt: Date }
>();

// 비밀번호 찾기
const findPassword = http.post(
    `${httpUrl}/users/password-reset/request`,
    async ({ request }) => {
        const { email } = (await request.json()) as any;
        await delay(1000);

        if (email === "moimo@email.com") {
            // 인증코드 생성 (6자리 숫자)
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            // 만료 시간 설정 (5분)
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

            // 저장소에 저장
            resetCodeStore.set(resetCode, { email, expiresAt });
            console.log(
                `[Mock] Reset Code Generated for ${email}: ${resetCode}, Expires at: ${expiresAt.toLocaleTimeString()} `,
            );

            return HttpResponse.json(
                { message: "비밀번호 재설정 이메일이 발송되었습니다.", resetCode },
                { status: 200 },
            );
        }
        return HttpResponse.json(
            { message: "이메일이 일치하지 않습니다." },
            { status: 404 },
        );
    },
);

// 비밀번호 인증코드 확인
const verifyResetCode = http.post(
    `${httpUrl}/users/password-reset/verify`,
    async ({ request }) => {
        const { email, code } = (await request.json()) as any;
        await delay(1000);

        // 저장소에서 해당 코드 찾기
        const storedData = resetCodeStore.get(code);

        if (!storedData) {
            return new HttpResponse(
                JSON.stringify({ message: "유효하지 않은 인증코드입니다." }),
                { status: 400 },
            );
        }

        // 이메일 일치 확인
        if (storedData.email !== email) {
            return new HttpResponse(
                JSON.stringify({ message: "이메일이 일치하지 않습니다." }),
                { status: 404 },
            );
        }

        // 만료 시간 확인
        if (storedData.expiresAt < new Date()) {
            resetCodeStore.delete(code);
            return new HttpResponse(
                JSON.stringify({ message: "인증코드가 만료되었습니다." }),
                { status: 410 },
            );
        }

        // resetToken 생성 (백엔드에서 내려주는 토큰, 암호화된 토큰 형태)
        const resetToken = `reset_token_${Date.now()}_${Math.random()
            .toString(36)
            .substring(7)}`;
        const tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분

        // resetToken 저장소에 저장
        resetTokenStore.set(resetToken, {
            email,
            resetCode: code,
            expiresAt: tokenExpiresAt,
        });
        console.log(
            `[Mock] Reset Token Generated for ${email}: ${resetToken}, Expires at: ${tokenExpiresAt.toLocaleTimeString()}`,
        );

        return HttpResponse.json(
            {
                resetToken,
            },
            { status: 200 },
        );
    },
);

// 비밀번호 재설정
const resetPassword = http.put(
    `${httpUrl}/users/password-reset/confirm`,
    async ({ request }) => {
        const { resetToken, resetCode, newPassword } =
            (await request.json()) as any;
        await delay(1000);

        // resetToken 검증
        const tokenData = resetTokenStore.get(resetToken);

        if (!tokenData) {
            return new HttpResponse(
                JSON.stringify({ message: "유효하지 않은 토큰입니다." }),
                { status: 400 },
            );
        }

        // resetCode 일치 확인
        if (tokenData.resetCode !== resetCode) {
            return new HttpResponse(
                JSON.stringify({ message: "유효하지 않은 인증코드입니다." }),
                { status: 400 },
            );
        }

        // 토큰 만료 확인
        if (tokenData.expiresAt < new Date()) {
            resetTokenStore.delete(resetToken);
            return new HttpResponse(
                JSON.stringify({ message: "토큰이 만료되었습니다." }),
                { status: 410 },
            );
        }

        // 비밀번호 변경 성공 (Mock에서는 로그만 출력)
        console.log(
            `[Mock] Password reset successful for ${tokenData.email}, New Password: ${newPassword}`,
        );

        // 사용 완료된 토큰 및 코드 삭제
        resetTokenStore.delete(resetToken);
        resetCodeStore.delete(resetCode);

        return HttpResponse.json(
            { message: "비밀번호가 성공적으로 변경되었습니다." },
            { status: 200 },
        );
    },
);

// 토큰 갱신 핸들러
const refresh = http.post(`${httpUrl}/users/refresh`, async ({ request }) => {
    const cookies = request.headers.get("cookie");
    await delay(500);

    if (cookies?.includes("refreshToken=mock-refresh-token")) {
        return HttpResponse.json(
            {
                accessToken: "new-mock-jwt-token",
            },
            {
                status: 200,
                headers: {
                    Authorization: "Bearer new-mock-jwt-token",
                },
            },
        );
    }

    return new HttpResponse(
        JSON.stringify({ message: "유효하지 않은 리프레시 토큰입니다." }),
        { status: 401 },
    );
});

// 사용자 인증 핸들러 (users/me 통합)
const verifyUser = http.get(`${httpUrl}/users/verify`, async ({ request }) => {
    const token = request.headers.get("Authorization");
    const cookies = request.headers.get("cookie");
    await delay(1000);

    // 토큰도 없고 쿠키도 없는 경우
    if (!token && (!cookies || !cookies.includes("refreshToken="))) {
        return new HttpResponse(
            JSON.stringify({ message: "인증 토큰이 없습니다." }),
            { status: 401 },
        );
    }

    console.log("User Info (Verify - Token Based):", {
        token,
        userInfo: mockUserInfo,
    });

    // 통합된 응답: 인증 정보 + 모든 사용자 정보
    return HttpResponse.json(
        {
            authenticated: true,
            isNewUser: false,
            ...mockUserInfo, // 모든 사용자 정보 포함
            accessToken: "mock-jwt-token",
        },
        {
            status: 200,
            headers: {
                Authorization: "Bearer mock-jwt-token",
            },
        },
    );
});

// 사용자 정보 업데이트 핸들러 (userInfoHandler에서 이동)
const userUpdate = http.put(
    `${httpUrl}/users/user-update`,
    async ({ request }) => {
        try {
            const authHeader = request.headers.get("Authorization");
            if (!authHeader) {
                return new HttpResponse(null, { status: 401 });
            }

            const formData = await request.formData();
            const bio = formData.get("bio") as string;
            const rawInterests = formData.getAll("interests");
            let interests: any[] = [];

            if (
                rawInterests.length === 1 &&
                typeof rawInterests[0] === "string" &&
                (rawInterests[0] as string).startsWith("[")
            ) {
                // JSON string 처리
                try {
                    interests = JSON.parse(rawInterests[0] as string);
                } catch (e) {
                    interests = [rawInterests[0]];
                }
            } else {
                interests = rawInterests;
            }

            const file = formData.get("file");

            console.log("User Update (Token Based):", {
                bio,
                interests,
                file,
                token: authHeader
            });

            // Mock 상태 업데이트
            mockUserInfo = {
                ...mockUserInfo,
                bio: bio || mockUserInfo.bio,
                // interests가 ID인 경우와 이름인 경우를 모두 대응 (Mock 데이터 보정을 위해)
                interests: interests.map((item: any, index: number) => {
                    if (typeof item === 'number' || !isNaN(Number(item))) {
                        // ID가 들어온 경우 (실제 서비스와 유사)
                        return { id: Number(item), name: `관심사 ${item}` };
                    }
                    return { id: index + 100, name: item }; // 이름이 들어온 경우 (기존 방식)
                }),
            };

            // 이미지 파일이 있는 경우
            if (file && file instanceof File) {
                mockUserInfo.profileImage = URL.createObjectURL(file);
            }

            await delay(1000);
            return HttpResponse.json(mockUserInfo);
        } catch (error) {
            console.error("userUpdate handler error:", error);
            return new HttpResponse(null, { status: 500 });
        }
    }
);

export const authHandler = [
    login,
    join,
    checkEmail,
    checkNickname,
    findPassword,
    verifyResetCode,
    resetPassword,
    googleLogin,
    logout,
    refresh,
    verifyUser,
    userUpdate, // 사용자 정보 업데이트 핸들러 추가
];
