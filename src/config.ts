const ENVIRONMENTS = {
  API_URL: "https://useflagpole-api.onrender.com",
  WS_URL: "wss://useflagpole-api.onrender.com",
} as const;

export const DEFAULT_CONFIG = {
  ...ENVIRONMENTS,
  VERSION: "0.0.1",
  SOCKET_TIMEOUT: 20000,
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
} as const;
