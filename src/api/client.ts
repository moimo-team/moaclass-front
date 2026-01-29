import { useAuthStore } from "@/store/authStore";
import axios, { type AxiosRequestConfig } from "axios";


export const createClient = (config?: AxiosRequestConfig) => {
    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'https://moimo-back.vercel.app',
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true, // 쿠키 전송을 위해 필수
        ...config,
    });

    // 인증이 필요 없는 API 목록
    // const publicEndpoints = [
    //     '/users/login',
    //     '/users/register',
    //     '/users/find-password',
    //     '/users/reset-password'
    // ];

    // 요청 인터셉터 : 매 요청마다 최신 토큰 헤더에 추가
    axiosInstance.interceptors.request.use((config) => {
        const { accessToken } = useAuthStore.getState();

        // public API가 아닐 경우에만 토큰 추가
        // const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

        if (accessToken) {
            config.headers.set('Authorization', `Bearer ${accessToken}`);
        }

        // FormData 전송 시 Content-Type 헤더 제거 (브라우저가 자동으로 boundary 포함하여 설정)
        if (config.data instanceof FormData) {
            config.headers.delete('Content-Type');
        }

        return config;
    })

    // 응답 인터셉터 : 401 발생 시 토큰 갱신 시도
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            // public API 요청에서 발생한 401은 갱신 시도하지 않음
            // const isPublicEndpoint = publicEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

            // 401 에러이고, 재시도한 적이 없는 요청일 때
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // /users/refresh API를 호출하여 새로운 토큰 시도
                    // 주의: 무한 루프 방지를 위해 login, logout, refresh API는 제외할 수 있음
                    if (originalRequest.url?.includes('/users/login') || originalRequest.url?.includes('/users/refresh')) {
                        return Promise.reject(error);
                    }

                    // 순환 참조 방지를 위해 직접 호출
                    const { setAccessToken } = useAuthStore.getState();

                    const response = await axiosInstance.post("/users/refresh");
                    const newToken = response.data.accessToken || response.headers.authorization?.replace("Bearer ", "");

                    if (newToken) {
                        setAccessToken(newToken);
                        // 새로운 토큰으로 헤더 교체 후 재발송
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    // 갱신 실패 시 로그아웃 처리
                    const { storeLogout } = useAuthStore.getState();
                    storeLogout();

                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        })

    return axiosInstance;
}

export const apiClient = createClient();

// Chat API를 위한 별도 클라이언트
export const chatApiClient = createClient({
    baseURL: 'https://moimo-back.onrender.com'
});