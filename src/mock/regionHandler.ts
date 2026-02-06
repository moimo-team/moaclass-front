import { http, HttpResponse, delay } from "msw";
import { httpUrl } from "./mockData/mockData";
import { REGIONS } from "@/constants/regions";

const getRegions = http.get(`${httpUrl}/regions`, async () => {
    await delay(1000);
    return HttpResponse.json(REGIONS, {
        status: 200,
    });
});

export const regionHandler = [getRegions];