const hour = new Date().getHours();
const minute = new Date().getMinutes();
const second = new Date().getSeconds();

console.log("[FlagPole SDK] Loading config module...");
console.log(`SDK Config loaded! Version ${hour} - ${minute} - ${second}`);

const BASE_URL = "http://localhost:5000";
console.log("[FlagPole SDK] BASE_URL:", BASE_URL);

export const DEFAULT_CONFIG = {
  API_URL: BASE_URL.replace(/\/$/, ""),
  WS_URL: BASE_URL.replace(/\/$/, ""),
} as const;

console.log("[FlagPole SDK] Exporting config:", DEFAULT_CONFIG);
