export async function parseErrorMessage(response: Response): Promise<string> {
  const fallbackError = response.statusText || `HTTP ${response.status}`;
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  
  if (!contentType.includes("application/json")) {
    return fallbackError;
  }

  try {
    const clonedResponse = response.clone();
    const body = (await clonedResponse.json()) as unknown;

    if (!body || typeof body !== "object") {
      return fallbackError;
    }

    const target = body as { message?: unknown; error?: unknown };
    const msg = target.message ?? target.error;

    if (typeof msg === "string" && msg.trim().length > 0) {
      return msg.trim();
    }

    if (Array.isArray(msg) && msg.length > 0) {
      const combined = msg
        .filter((item): item is string => typeof item === "string" && item.length > 0)
        .join(", ");
      return combined.length > 0 ? combined : fallbackError;
    }
  } catch {
    return fallbackError;
  }

  return fallbackError;
}