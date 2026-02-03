import { setupWorker } from "msw/browser";
import { authHandler } from "./authHandler";
import { meetingHandler } from "./meetingHandler";
import { getInterests } from "./interestHandler";
import { getMyMeetings } from "./meHandler";
import { userInfoHandler } from "./userInfoHandler";
import { chatHandler } from "./chatHandler";
import { participationHandlers } from "./participationHandler";
import { notificationHandlers } from "./notificationHandler";
import { lessonHandlers } from "./lessonHandler";

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
];

export const worker = setupWorker(...handlers);
