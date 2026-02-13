import { setupWorker } from 'msw/browser';

import { authHandler } from './authHandler';
import { categoryHandler } from './categoryHandler';
import { chatHandler } from './chatHandler';
import { couponHandlers } from './couponHandler';
import { getInterests } from './interestHandler';
import { lessonHandlers } from './lessonHandler';
import { likeHandlers } from './likeHandler';
import { meetingHandler } from './meetingHandler';
import { getMyMeetings } from './meHandler';
import { notificationHandlers } from './notificationHandler';
import { orderHandler } from './orderHandler';
import { participationHandlers } from './participationHandler';
import { payHandler } from './payHandler';
import { pointHandlers } from './pointHandler';
import { regionHandler } from './regionHandler';
import { scheduleHandlers } from './scheduleHandler';
import { userInfoHandler } from './userInfoHandler';
import { reviewHandler } from './reviewHandler';

const handlers = [
	...authHandler,
	getInterests,
	getMyMeetings,
	...userInfoHandler,
	...meetingHandler,
	...chatHandler,
	...participationHandlers,
	...notificationHandlers,
	...scheduleHandlers,
	...lessonHandlers,
	...regionHandler,
	...categoryHandler,
	...payHandler,
	...couponHandlers,
	...likeHandlers,
	...pointHandlers,
	...orderHandler,
	...reviewHandler,
];

export const worker = setupWorker(...handlers);
