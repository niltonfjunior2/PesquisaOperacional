import { LinearProgram, LinearProgramSchema } from "../schemas/linear-program";

export function createMagicUrl(model: LinearProgram): string {
  try {
    const jsonStr = JSON.stringify(model);
    // Base64 encode safe for URLs
    const base64 = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.searchParams.set("data", base64);
    return url.toString();
  } catch (e) {
    console.error("Erro ao gerar URL", e);
    return "";
  }
}

export function parseMagicUrl(urlStr: string): LinearProgram | null {
  try {
    const url = new URL(urlStr);
    const base64 = url.searchParams.get("data");
    if (!base64) return null;

    const jsonStr = decodeURIComponent(atob(base64));
    const parsed = JSON.parse(jsonStr);
    const validation = LinearProgramSchema.safeParse(parsed);
    
    if (validation.success) {
      return validation.data;
    }
    return null;
  } catch (e) {
    return null;
  }
}
