import { useEffect } from "react";

/**
 * 카카오 로그인 팝업 콜백 페이지
 * 
 * 이 컴포넌트는 카카오 인가 서버에서 리다이렉트된 후 실행되며,
 * URL에서 인가 코드(code)를 추출하여 부모 창(Login.tsx)으로 전달하는 브릿지 역할을 합니다.
 * 
 * 동작 흐름:
 * 1. 카카오 로그인 완료 후 이 페이지로 리다이렉트됨 (URL에 code 포함)
 * 2. useEffect에서 URL의 쿼리 파라미터에서 code 추출
 * 3. window.opener.postMessage()로 부모 창에 code 전달
 * 4. 팝업 창 자동 닫기
 */
const KakaoCallback = () => {
    useEffect(() => {
        // URL에서 인가 코드 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
            // 에러 발생 시 부모 창에 에러 전달
            window.opener?.postMessage(
                { type: "KAKAO_LOGIN_ERROR", error },
                window.location.origin
            );
            window.close();
            return;
        }

        if (code && window.opener) {
            // 인가 코드를 부모 창으로 전달
            window.opener.postMessage(
                { type: "KAKAO_LOGIN_SUCCESS", code },
                window.location.origin
            );
            // 팝업 창 닫기
            window.close();
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <p className="text-lg text-muted-foreground">로그인 처리 중...</p>
            </div>
        </div>
    );
};

export default KakaoCallback;
