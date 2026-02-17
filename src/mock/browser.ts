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
import { reviewHandler } from './reviewHandler';
import { scheduleHandlers } from './scheduleHandler';
import { teacherHandler } from './teacherHandler';
import { userInfoHandler } from './userInfoHandler';

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
	...teacherHandler,
];

export const worker = setupWorker(...handlers);
