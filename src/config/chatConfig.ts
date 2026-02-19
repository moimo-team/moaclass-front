import { ENV } from '@/utils/env';

export const DEFAULT_CHAT_API_URL = 'http://localhost:3000';

const isMockingEnabled = ENV.ENABLE_MOCK;

export const CHAT_API_URL = isMockingEnabled ? '/api' : ENV.SOCKET_URL || DEFAULT_CHAT_API_URL;
