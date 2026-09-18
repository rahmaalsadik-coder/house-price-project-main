import type { PredictionRequest, PredictionResponse } from "../types/prediction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (Array.isArray(body?.detail)) {
      // FastAPI/Pydantic 422 validation errors
      return body.detail
        .map((e: { loc?: unknown[]; msg?: string }) => {
          const field = Array.isArray(e.loc) ? e.loc[e.loc.length - 1] : "field";
          return `${field}: ${e.msg}`;
        })
        .join("; ");
    }
    if (typeof body?.detail === "string") return body.detail;
    return JSON.stringify(body);
  } catch {
    return response.statusText || "Unknown error";
  }
}

export async function predictPrice(
  payload: PredictionRequest,
): Promise<PredictionResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError(
      "Could not reach the prediction server. Is the backend running on " +
        `${API_BASE_URL}?`,
    );
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as PredictionResponse;
}

export async function fetchLocations(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) throw new Error("bad response");
    return (await response.json()) as string[];
  } catch {
    // Fall back to the bundled snapshot if the backend isn't reachable yet
    // (e.g. the user is just poking around the frontend before starting it).
    const fallback = await import("../data/locations.json");
    return fallback.default as string[];
  }
}
