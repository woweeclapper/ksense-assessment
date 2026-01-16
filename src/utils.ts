import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

export const API_KEY = process.env.API_KEY as string;
export const BASE_URL = process.env.BASE_URL as string;



export async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "x-api-key": API_KEY }
      });

      // Retry-worthy statuses
      if (res.status === 429 || res.status === 500 || res.status === 503) {
        const delay = 500 * (i + 1);
        console.warn(`Server busy (${res.status}), retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      // Unauthorized should fail immediately
      if (res.status === 401) {
        throw new Error("Unauthorized");
      }

      // Any other non-OK status
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      // Success
      return res.json();
    } catch (err) {
      // Last attempt → throw
      if (i === retries - 1) throw err;

      // Retry after catch (network errors, timeouts, etc.)
      const delay = 300 * (i + 1);
      console.warn(`Request failed, retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

export function parseBloodPressure(bp?: string | null) {
  if (!bp || typeof bp !== "string" || !bp.includes("/")) {
    return { score: 0, valid: false };
  }

  const [sysStr, diaStr] = bp.split("/");
  const sys = parseInt(sysStr);
  const dia = parseInt(diaStr);

  if (isNaN(sys) || isNaN(dia)) return { score: 0, valid: false };

  if (sys >= 140 || dia >= 90) return { score: 4, valid: true };
  if (sys >= 130 || dia >= 80) return { score: 3, valid: true };
  if (sys >= 120 && dia < 80) return { score: 2, valid: true };
  if (sys < 120 && dia < 80) return { score: 1, valid: true };

  return { score: 0, valid: false };
}

export function parseTemperature(temp?: string | null) {
  const t = parseFloat(temp ?? "");
  if (isNaN(t)) return { score: 0, valid: false };

  if (t >= 101.0) return { score: 2, valid: true };
  if (t >= 99.6) return { score: 1, valid: true };
  return { score: 0, valid: true };
}

export function parseAge(age?: string | number | null) {
  const a = typeof age === "number" ? age : parseInt(age ?? "");
  if (isNaN(a)) return { score: 0, valid: false };

  if (a < 40) return { score: 1, valid: true };
  if (a <= 65) return { score: 1, valid: true };
  return { score: 2, valid: true };
}
