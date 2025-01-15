const BASE_URL = "http://localhost:5000";

console.log("[FlagPole SDK] Using BASE_URL:", BASE_URL);

export const DEFAULT_CONFIG = {
  API_URL: BASE_URL.replace(/\/$/, ""),
  WS_URL: BASE_URL.replace(/\/$/, ""),
  VERSION: "1.0.0",
  SOCKET_TIMEOUT: 20000,
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
} as const;

export type Environment = "development" | "staging" | "production";
