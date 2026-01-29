import { setupWorker } from "msw/browser";
import { authHandler } from "./authHandler";
import { meetingHandler } from "./meetingHandler";
import { getInterests } from "./interestHandler";
import { getMyMeetings } from "./meHandler";
import { userInfoHandler } from "./userInfoHandler";
import { chatHandler } from "./chatHandler";
import { participationHandlers } from "./participationHandler";

const handlers = [
  ...authHandler,
  getInterests,
  getMyMeetings,
  ...userInfoHandler,
  ...meetingHandler,
  ...chatHandler,
  ...participationHandlers,
];

export const worker = setupWorker(...handlers);
