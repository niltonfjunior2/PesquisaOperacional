import { LinearProgram, LinearProgramSchema } from "../schemas/linear-program";

export function exportToFile(model: LinearProgram, filename: string = "modelo.po"): void {
  const jsonStr = JSON.stringify(model, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importFromFile(file: File): Promise<LinearProgram> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result);
        const validation = LinearProgramSchema.safeParse(parsed);
        
        if (validation.success) {
          resolve(validation.data);
        } else {
          reject(new Error("Formato de arquivo inválido. As matrizes não correspondem a um problema linear estruturado ou contém dados maliciosos mitigados pelo Zod."));
        }
      } catch (err) {
        reject(new Error("O arquivo está corrompido ou não é um JSON válido."));
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo base do disco."));
    reader.readAsText(file);
  });
}
