import type { SimplexResult } from "@/lib/solvers/simplex";
import { useState } from "react";

interface Props {
  result: SimplexResult;
  numConstraints: number;
}

export function SensitivityAnalysis({ result, numConstraints }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (result.status !== "OPTIMAL") return null;

  return (
    <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <svg className={`w-6 h-6 text-slate-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          <h3 className="text-xl font-bold text-slate-800">Análise de Sensibilidade e Pós-Otimização</h3>
        </div>
        <span className="text-sm font-bold text-slate-500 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm">
          {isOpen ? "Ocultar Detalhes" : "Ver Detalhes"}
        </span>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Preço-Sombra (Custo Marginal)</h4>
            <p className="text-sm text-slate-500 mb-5 font-medium leading-relaxed">
              O <strong className="text-slate-700">Preço-Sombra</strong> indica de forma exata o quanto a função objetivo (Z) melhoraria se a capacidade deste recurso fosse aumentada em 1 unidade. É o limite que vale a pena pagar a mais pelo recurso.
            </p>
            <ul className="space-y-3">
              {result.shadowPrices.map((sp, i) => (
                <li key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
                  <span className="font-bold text-slate-600">Restrição {i + 1} (R{i+1})</span>
                  <span className={`font-black text-xl ${sp > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                    {sp > 0 ? `+${sp.toFixed(2)}` : "0.00"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Variáveis de Folga (Sobra)</h4>
            <p className="text-sm text-slate-500 mb-5 font-medium leading-relaxed">
              A <strong className="text-slate-700">Folga (Slack)</strong> mensura o quanto sobrou de um determinado recurso no cenário ótimo. Recursos com folga zero são chamados de "gargalos" do sistema.
            </p>
            <ul className="space-y-3">
              {result.slackVariables.map((slack, i) => (
                <li key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
                  <span className="font-bold text-slate-600">Sobra R{i + 1}</span>
                  <span className={`font-black text-xl ${slack > 0 ? "text-amber-600" : "text-slate-400"}`}>
                    {slack.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
