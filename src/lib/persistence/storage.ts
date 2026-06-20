import { LinearProgram, LinearProgramSchema } from "../schemas/linear-program";

const STORAGE_KEY = "po_simplex_autosave";

export function saveToLocalStorage(model: LinearProgram): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(model));
  } catch (error) {
    console.error("Erro ao salvar no LocalStorage", error);
  }
}

export function loadFromLocalStorage(): LinearProgram | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    const validation = LinearProgramSchema.safeParse(parsed);
    
    if (validation.success) {
      return validation.data;
    } else {
      console.warn("Auto-save inválido detectado e ignorado.");
      return null;
    }
  } catch (error) {
    return null;
  }
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
