export function getAuthHeaders(params: {
  authentication: string;
  apiKey?: string;
  credentials?: { user: string; password: string };
}): Record<string, string> {
  const headers: Record<string, string> = {};

  if (params.authentication === "apiKey" && params.apiKey) {
    headers["x-finlight-key"] = params.apiKey;
  }

  if (params.authentication === "basicAuth" && params.credentials) {
    const token = Buffer.from(`${params.credentials.user}:${params.credentials.password}`).toString("base64");
    headers["Authorization"] = `Basic ${token}`;
  }

  return headers;
}
