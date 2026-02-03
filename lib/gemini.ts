// Gemini client — server-side only
import { GoogleGenAI } from "@google/genai";

export function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
}

// Gemini 3 only. Default: Flash (free-tier friendly). Set GEMINI_USE_PRO=1 if you have Pro quota.
// Rate limits: https://ai.google.dev/gemini-api/docs/rate-limits
const USE_PRO = process.env.GEMINI_USE_PRO === "1";
const PRO = "gemini-3-pro-preview";
const FLASH = "gemini-3-flash-preview";

export const MODELS = {
  CONTEXT_WEAVER: USE_PRO ? PRO : FLASH,
  RESOURCE_ALLOCATOR: USE_PRO ? PRO : FLASH,
  POLICY_ENFORCER: FLASH,
} as const;
