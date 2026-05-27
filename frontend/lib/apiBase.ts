const IS_SERVER = typeof window === "undefined";

const CLIENT_ENV_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");


export function getApiBaseUrl(purpose: 'fetch' | 'link' = 'fetch'): string {
if (!IS_SERVER) {
  if (!CLIENT_ENV_URL) {
    return typeof location !== 'undefined' ? location.origin : "";
  }
  return CLIENT_ENV_URL;
}

  const serverStrategies = {
    link: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    fetch: process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  };

  return serverStrategies[purpose].replace(/\/$/, "");
}