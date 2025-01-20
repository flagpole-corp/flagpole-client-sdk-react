const ENVIRONMENTS = {
  development: {
    API_URL: "http://localhost:5000",
    WS_URL: "ws://localhost:5000",
  },
  staging: {
    API_URL: "https://api.staging.useflagpole.dev",
    WS_URL: "wss://api.staging.useflagpole.dev",
  },
  production: {
    API_URL: "https://api.useflagpole.dev",
    WS_URL: "wss://api.useflagpole.dev",
  },
} as const;

const getEnvironment = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "useflagpole.dev") return "production";
    if (hostname === "staging.useflagpole.dev") return "staging";
  }
  return "development";
};

export const DEFAULT_CONFIG = {
  ...ENVIRONMENTS[getEnvironment()],
  VERSION: "0.0.1",
  SOCKET_TIMEOUT: 20000,
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
} as const;
