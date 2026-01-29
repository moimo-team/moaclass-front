import { http, HttpResponse, delay } from 'msw';
import { httpUrl, interestCategories } from './mockData';

// 관심사 조회 핸들러
export const getInterests = http.get(`${httpUrl}/interests`, async () => {
    await delay(1000);
    return HttpResponse.json(interestCategories,
        { status: 200 }
    );
});