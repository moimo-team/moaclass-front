import { setupWorker } from 'msw/browser';
import { authHandler } from './authHandler';
import { meetingHandler } from './meetingHandler';
import { getInterests } from './interestHandler';
import { getMyMeetings } from './meHandler';
import { userInfoHandler } from './userInfoHandler';
import { chatHandler } from './chatHandler';
import { participationHandlers } from './participationHandler';
import { notificationHandlers } from './notificationHandler';
import { lessonHandlers } from './lessonHandler';
import { regionHandler } from './regionHandler';
import { categoryHandler } from './categoryHandler';
import { payHandler } from './payHandler';
import { couponHandlers } from './couponHandler';
import { likeHandlers } from './likeHandler';
import { pointHandlers } from './pointHandler';
import { scheduleHandlers } from './scheduleHandler';

const handlers = [
  ...authHandler,
  getInterests,
  getMyMeetings,
  ...userInfoHandler,
  ...meetingHandler,
  ...chatHandler,
  ...participationHandlers,
  ...notificationHandlers,
  ...lessonHandlers,
  ...regionHandler,
  ...categoryHandler,
  ...payHandler,
  ...couponHandlers,
  ...likeHandlers,
  ...pointHandlers,
  ...scheduleHandlers,
];

export const worker = setupWorker(...handlers);
