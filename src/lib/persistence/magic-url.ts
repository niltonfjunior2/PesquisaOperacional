import { LinearProgram, LinearProgramSchema } from "../schemas/linear-program";
import LZString from "lz-string";

export function createMagicUrl(model: LinearProgram): string {
  try {
    const jsonStr = JSON.stringify(model);
    const compressed = LZString.compressToEncodedURIComponent(jsonStr);
    const url = new URL(window.location.href);
    url.searchParams.delete("data");
    url.searchParams.set("cdata", compressed);
    return url.toString();
  } catch (e) {
    console.error("Erro ao gerar URL", e);
    return "";
  }
}

export function parseMagicUrl(urlStr: string): LinearProgram | null {
  try {
    const url = new URL(urlStr);
    const compressed = url.searchParams.get("cdata");
    const base64 = url.searchParams.get("data");
    
    let jsonStr = "";
    
    if (compressed) {
      jsonStr = LZString.decompressFromEncodedURIComponent(compressed);
    } else if (base64) {
      jsonStr = decodeURIComponent(atob(base64));
    } else {
      return null;
    }

    if (!jsonStr) return null;

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
