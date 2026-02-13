import { http, HttpResponse, delay } from 'msw';

import { REGIONS } from '@/constants/regions';

import { httpUrl } from './mockData/mockData';

const getRegions = http.get(`${httpUrl}/regions`, async () => {
	await delay(1000);
	return HttpResponse.json(REGIONS, {
		status: 200,
	});
});

export const regionHandler = [getRegions];
