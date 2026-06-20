"use client";
import { ObjectiveType } from "@/lib/schemas/linear-program";

interface Props {
  objectiveType: ObjectiveType;
  setObjectiveType: (type: ObjectiveType) => void;
  coefficients: number[];
  setCoefficients: (coefs: number[]) => void;
  numVariables: number;
}

export function ObjectiveFunctionInput({ objectiveType, setObjectiveType, coefficients, setCoefficients, numVariables }: Props) {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, col: number) => {
    if (e.key === "ArrowLeft" && (e.target as HTMLInputElement).selectionStart === 0) {
      e.preventDefault();
      document.getElementById(`obj-cell-${col - 1}`)?.focus();
    } else if (e.key === "ArrowRight" && (e.target as HTMLInputElement).selectionEnd === (e.target as HTMLInputElement).value?.length) {
      e.preventDefault();
      document.getElementById(`obj-cell-${col + 1}`)?.focus();
    }
  };

  return (
    <section className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm mb-6" aria-labelledby="obj-title">
      <h2 id="obj-title" className="text-xl font-bold mb-5 text-slate-800 border-b border-slate-100 pb-3">Função Objetivo (Z)</h2>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <label htmlFor="objective-type" className="font-bold text-slate-700">Meta Estratégica:</label>
        <select 
          id="objective-type"
          value={objectiveType} 
          onChange={(e) => setObjectiveType(e.target.value as ObjectiveType)}
          className="p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-black text-slate-900 focus:ring-4 focus:ring-blue-200 focus:border-blue-600 transition-all cursor-pointer shadow-sm"
          aria-label="Tipo de Otimização (Maximizar ou Minimizar)"
        >
          <option value="MAX">MAXIMIZAR (Lucro / Retorno)</option>
          <option value="MIN">MINIMIZAR (Custo / Tempo)</option>
        </select>
      </div>
      
      <div 
        className="flex items-center gap-3 overflow-x-auto py-5 px-4 bg-blue-50/30 rounded-xl border border-blue-100 shadow-inner" 
        role="group" 
        aria-label="Coeficientes para cálculo da função objetivo"
      >
        <span className="font-black text-3xl text-slate-800 tracking-wider mr-2" aria-hidden="true">Z = </span>
        {Array.from({ length: numVariables }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap">
            <input 
              id={`obj-cell-${i}`}
              type="number"
              aria-label={`Coeficiente Custo/Lucro para a variável x${i+1}`}
              value={coefficients[i] || ""}
              onChange={(e) => {
                const newCoefs = [...coefficients];
                newCoefs[i] = parseFloat(e.target.value) || 0;
                setCoefficients(newCoefs);
              }}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-24 p-3 border border-slate-300 rounded-lg text-center bg-white focus:ring-2 focus:ring-blue-600 font-bold text-xl text-slate-900 transition-all shadow-sm"
              placeholder={`C${i+1}`}
            />
            <label htmlFor={`obj-cell-${i}`} className="font-bold italic text-slate-600 text-xl" aria-hidden="true">x{i+1}</label>
            {i < numVariables - 1 && <span className="mx-2 text-slate-400 font-black text-2xl" aria-hidden="true">+</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
