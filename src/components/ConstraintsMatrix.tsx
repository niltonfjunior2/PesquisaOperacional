"use client";
import { Constraint, ConstraintOperator } from "@/lib/schemas/linear-program";
import React from "react";

interface Props {
  constraints: Constraint[];
  setConstraints: (c: Constraint[]) => void;
  numVariables: number;
  nonNegativity: boolean;
  setNonNegativity: (v: boolean) => void;
  variableBounds: number[];
  setVariableBounds: (v: number[]) => void;
}

export function ConstraintsMatrix({ constraints, setConstraints, numVariables, nonNegativity, setNonNegativity, variableBounds, setVariableBounds }: Props) {
  
  const addConstraint = () => {
    setConstraints([
      ...constraints,
      {
        id: crypto.randomUUID(),
        coefficients: new Array(numVariables).fill(0),
        operator: "<=",
        rhs: 0
      }
    ]);
  };

  const removeConstraint = (id: string) => {
    setConstraints(constraints.filter(c => c.id !== id));
  };

  const updateConstraint = (id: string, field: string, value: any, varIndex?: number) => {
    setConstraints(constraints.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c };
      if (field === "operator") updated.operator = value;
      else if (field === "rhs") updated.rhs = value;
      else if (field === "coef" && varIndex !== undefined) {
        updated.coefficients = [...updated.coefficients];
        updated.coefficients[varIndex] = value;
      }
      return updated;
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>, row: number, col: number) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      document.getElementById(`c-cell-${row - 1}-${col}`)?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      document.getElementById(`c-cell-${row + 1}-${col}`)?.focus();
    } else if (e.key === "ArrowLeft") {
      const target = e.target as HTMLInputElement;
      if (target.type === "number" && target.selectionStart === 0) {
        e.preventDefault();
        document.getElementById(`c-cell-${row}-${col - 1}`)?.focus();
      }
    } else if (e.key === "ArrowRight") {
      const target = e.target as HTMLInputElement;
      if (target.type === "number" && target.selectionEnd === target.value?.length) {
        e.preventDefault();
        document.getElementById(`c-cell-${row}-${col + 1}`)?.focus();
      }
    }
  };

  return (
    <section className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm mb-6" aria-labelledby="matrix-title">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <h2 id="matrix-title" className="text-xl font-bold text-slate-800">Matriz de Restrições</h2>
        <button 
          onClick={addConstraint} 
          aria-label="Adicionar nova restrição na matriz"
          className="bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-800 transition-all shadow focus:ring-4 focus:ring-blue-300 focus:outline-none"
        >
          + Adicionar Restrição
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-300 shadow-inner bg-slate-50" tabIndex={0} role="region" aria-label="Tabela de restrições com navegação por setas disponível">
        <table className="w-full text-left border-collapse min-w-max" role="grid">
          <thead>
            <tr className="bg-slate-200 border-b border-slate-300 text-slate-800">
              <th className="p-3 w-16 text-center font-extrabold" scope="col">#</th>
              {Array.from({ length: numVariables }).map((_, i) => (
                <th key={i} className="p-3 text-center font-bold" scope="col">x{i+1}</th>
              ))}
              <th className="p-3 text-center w-28 font-bold" scope="col">Operador</th>
              <th className="p-3 text-center w-36 font-bold" scope="col">Lado Direito (RHS)</th>
              <th className="p-3 text-center w-16 font-bold" scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {constraints.map((c, i) => (
              <tr key={c.id} className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors">
                <td className="p-3 font-bold text-slate-500 text-center">R{i+1}</td>
                {Array.from({ length: numVariables }).map((_, j) => (
                  <td key={j} className="p-3 text-center">
                    <input 
                      id={`c-cell-${i}-${j}`}
                      type="number"
                      aria-label={`Coeficiente de x${j+1} para a restrição ${i+1}`}
                      value={c.coefficients[j] || ""}
                      onChange={(e) => updateConstraint(c.id, "coef", parseFloat(e.target.value) || 0, j)}
                      onKeyDown={(e) => handleKeyDown(e, i, j)}
                      className="w-24 p-2.5 border border-slate-300 rounded-md text-center bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-semibold text-slate-900 shadow-sm"
                    />
                  </td>
                ))}
                <td className="p-3 text-center">
                  <select 
                    id={`c-cell-${i}-${numVariables}`}
                    aria-label={`Operador da restrição ${i+1}`}
                    value={c.operator}
                    onChange={(e) => updateConstraint(c.id, "operator", e.target.value as ConstraintOperator)}
                    onKeyDown={(e) => handleKeyDown(e, i, numVariables)}
                    className="w-full p-2.5 border border-slate-300 rounded-md bg-white font-black text-slate-900 text-center focus:ring-2 focus:ring-blue-600 shadow-sm cursor-pointer"
                  >
                    <option value="<=">&le;</option>
                    <option value=">=">&ge;</option>
                    <option value="=">=</option>
                  </select>
                </td>
                <td className="p-3 text-center">
                  <input 
                    id={`c-cell-${i}-${numVariables + 1}`}
                    type="number"
                    aria-label={`Lado direito constante (RHS) da restrição ${i+1}`}
                    value={c.rhs || ""}
                    onChange={(e) => updateConstraint(c.id, "rhs", parseFloat(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, i, numVariables + 1)}
                    className="w-full p-2.5 border border-slate-300 rounded-md text-center bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-bold text-slate-900 shadow-sm"
                  />
                </td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => removeConstraint(c.id)} 
                    aria-label={`Excluir restrição ${i+1}`}
                    className="text-red-600 hover:text-white hover:bg-red-600 font-bold p-2 transition-all rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    title="Excluir Restrição"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
            {constraints.length === 0 && (
              <tr>
                <td colSpan={numVariables + 4} className="p-10 text-center text-slate-600 font-medium bg-white border-dashed border-2 border-slate-200">
                  Nenhuma restrição definida. Comece adicionando uma regra matemática.
                </td>
              </tr>
            )}
            
            {/* Non-negativity Constraint Indicator */}
            <tr className={`border-t-2 border-slate-300 transition-colors ${nonNegativity ? 'bg-emerald-50/50' : 'bg-orange-50/50'}`}>
              <td className="p-3 font-bold text-slate-500 text-center align-middle">NN</td>
              <td colSpan={numVariables + 3} className="p-3 align-middle">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={nonNegativity} 
                        onChange={(e) => setNonNegativity(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                    <div>
                      <strong className={nonNegativity ? "text-emerald-800" : "text-orange-800"}>
                        {nonNegativity ? "Restrições de Não Negatividade Ativas" : "Restrições de Não Negatividade Desativadas"}
                      </strong>
                      <p className="text-sm text-slate-600">
                        {nonNegativity 
                          ? "Permite editar os limites mínimos das variáveis para valores >= 0." 
                          : "Nenhuma restrição de não negatividade será aplicada ao processo de otimização."}
                      </p>
                    </div>
                  </div>

                  {nonNegativity && (
                    <div className="flex flex-wrap items-center gap-3 border-l pl-4 border-emerald-200">
                      <span className="text-sm font-semibold text-emerald-800">Limites Mínimos:</span>
                      {Array.from({ length: numVariables }).map((_, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-500">x{j+1} &ge;</span>
                          <input 
                            type="number"
                            min="0"
                            step="0.1"
                            value={variableBounds[j] !== undefined ? variableBounds[j] : 0}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val >= 0) {
                                const newBounds = [...variableBounds];
                                newBounds[j] = val;
                                setVariableBounds(newBounds);
                              } else if (e.target.value === "") {
                                const newBounds = [...variableBounds];
                                newBounds[j] = 0;
                                setVariableBounds(newBounds);
                              }
                            }}
                            className="w-14 p-1 border border-emerald-300 rounded text-center text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500 font-medium flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Dica de UX: Você pode usar as <kbd className="bg-slate-100 px-1 border rounded">Setas Direcionais ⌨️</kbd> do teclado para navegar rapidamente entre as células das matrizes sem precisar usar o mouse.
      </p>
    </section>
  );
}
