"use client";
import { useState, useEffect, useRef } from "react";
import * as Sentry from "@sentry/nextjs";
import { TransportProblem, transformTransportToSimplex } from "@/lib/transformers/transport";
import { LinearProgramSchema } from "@/lib/schemas/linear-program";
import type { SimplexResult } from "@/lib/solvers/simplex";
import { resizeArray, updateArrayItem, updateMatrixItem } from "@/lib/utils/array";

interface TransportRowProps {
  sourceIndex: number;
  numDests: number;
  costs: number[][];
  setCosts: React.Dispatch<React.SetStateAction<number[][]>>;
  supply: number[];
  setSupply: React.Dispatch<React.SetStateAction<number[]>>;
}

function TransportRow({ sourceIndex, numDests, costs, setCosts, supply, setSupply }: TransportRowProps) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <th className="p-3 bg-amber-50 text-amber-900 font-black border border-slate-300 text-left shadow-sm">
        Origem {sourceIndex + 1}
      </th>
      {Array.from({length: numDests}).map((_, d) => (
        <td key={d} className="p-2 border border-slate-200">
          <input 
            type="number" 
            aria-label={`Custo da Origem ${sourceIndex + 1} para Destino ${d + 1}`}
            value={costs[sourceIndex][d] || ""} 
            onChange={(e) => updateMatrixItem(costs, sourceIndex, d, parseFloat(e.target.value) || 0, setCosts)} 
            className="w-full p-2.5 text-center font-bold bg-white focus:bg-white rounded border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-slate-800" 
            placeholder="R$"
          />
        </td>
      ))}
      <td className="p-2 border border-slate-300 bg-emerald-50 shadow-sm">
        <input 
          type="number" 
          aria-label={`Oferta disponível na Origem ${sourceIndex + 1}`}
          value={supply[sourceIndex] || ""} 
          onChange={(e) => updateArrayItem(supply, sourceIndex, parseFloat(e.target.value) || 0, setSupply)} 
          className="w-full p-2.5 text-center font-black rounded border-2 border-emerald-300 focus:ring-2 focus:ring-emerald-500 text-emerald-900" 
        />
      </td>
    </tr>
  );
}

export function TransportBuilder() {
  const [numSources, setNumSources] = useState(2);
  const [numDests, setNumDests] = useState(3);
  
  const [costs, setCosts] = useState<number[][]>(Array(2).fill(0).map(() => Array(3).fill(0)));
  const [supply, setSupply] = useState<number[]>([100, 200]);
  const [demand, setDemand] = useState<number[]>([50, 100, 150]);
  
  const [result, setResult] = useState<SimplexResult | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('@/lib/workers/simplex.worker.ts', import.meta.url));
    workerRef.current.onmessage = (event: MessageEvent<SimplexResult>) => {
      setResult(event.data);
      setIsSolving(false);
      if (event.data.status === "ERROR") {
        Sentry.captureException(new Error(event.data.message), { tags: { context: "transport_solver" } });
      }
    };
    return () => workerRef.current?.terminate();
  }, []);

  const handleResize = (s: number, d: number) => {
    if (s < 1 || d < 1 || s > 15 || d > 15) return;
    setNumSources(s);
    setNumDests(d);
    
    setSupply(resizeArray(supply, s, 0));
    setDemand(resizeArray(demand, d, 0));
    
    const newCosts = resizeArray(costs, s, []);
    for (let i = 0; i < s; i++) {
      newCosts[i] = resizeArray(costs[i] || [], d, 0);
    }
    setCosts(newCosts);
  };

  const solve = () => {
    const tp: TransportProblem = { numSources, numDestinations: numDests, costs, supply, demand, objectiveType: "MIN" };
    
    // Transpila para formato Simplex LinearProgram
    const model = transformTransportToSimplex(tp);
    
    // ZOD: Auditoria rigorosa pós-transpilação (Zero Trust)
    const validation = LinearProgramSchema.safeParse(model);
    if (!validation.success) {
      alert("Falha de segurança/tipagem na transpilação. Os dados gerados são inválidos.");
      Sentry.captureException(new Error("Zod validation failed post-transpilation"), { tags: { context: "security" } });
      return;
    }
    
    const sumSupply = supply.reduce((a, b) => a + b, 0);
    const sumDemand = demand.reduce((a, b) => a + b, 0);
    if (sumSupply !== sumDemand) {
       alert(`Aviso de Balanceamento Educacional:\nA Oferta Total (${sumSupply}) difere da Demanda (${sumDemand}). O método estrito exige igualdade.\nNeste MVP as equações tentarão satisfazer exatamente a demanda e a oferta simultaneamente, o que resultará em INVIABILIDADE algébrica. Sugestão: adicione um nó fictício manual com custo 0 para aborver a folga.`);
    }

    setIsSolving(true);
    setResult(null);
    workerRef.current?.postMessage(validation.data);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Módulo de Transporte (Logística)</h2>
          <p className="text-slate-500 font-medium">Modelagem visual 2D transpilada para o motor Simplex via Método Big-M.</p>
        </div>
        <div className="flex gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div>
            <label className="text-sm font-bold text-slate-600 block mb-1">Origens</label>
            <input type="number" min="1" max="15" value={numSources} onChange={(e) => handleResize(parseInt(e.target.value)||1, numDests)} className="w-16 p-2 text-center border rounded font-bold shadow-inner" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-600 block mb-1">Destinos</label>
            <input type="number" min="1" max="15" value={numDests} onChange={(e) => handleResize(numSources, parseInt(e.target.value)||1)} className="w-16 p-2 text-center border rounded font-bold shadow-inner" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-x-auto mb-6">
        <table className="w-full border-collapse min-w-max" aria-label="Grade de Custos de Transporte">
          <thead>
            <tr>
              <th className="p-3 bg-slate-100 border border-slate-300 text-slate-700 font-bold uppercase tracking-wide">Custos (Cij)</th>
              {Array.from({length: numDests}).map((_, d) => (
                <th key={d} className="p-3 bg-indigo-50 text-indigo-800 font-black border border-slate-300">Destino {d+1}</th>
              ))}
              <th className="p-3 bg-emerald-50 text-emerald-800 font-black border border-slate-300 shadow-sm">OFERTA</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({length: numSources}).map((_, s) => (
              <TransportRow 
                key={s} 
                sourceIndex={s} 
                numDests={numDests} 
                costs={costs} 
                setCosts={setCosts} 
                supply={supply} 
                setSupply={setSupply} 
              />
            ))}
            <tr>
              <th className="p-3 bg-indigo-50 text-indigo-900 font-black border border-slate-300 text-left shadow-sm">DEMANDA</th>
              {Array.from({length: numDests}).map((_, d) => (
                <td key={d} className="p-2 border border-slate-300 bg-indigo-50 shadow-sm">
                  <input 
                    type="number" 
                    aria-label={`Demanda requerida no Destino ${d+1}`}
                    value={demand[d] || ""} 
                    onChange={(e) => updateArrayItem(demand, d, parseFloat(e.target.value) || 0, setDemand)} 
                    className="w-full p-2.5 text-center font-black rounded border-2 border-indigo-300 focus:ring-2 focus:ring-indigo-500 text-indigo-900" 
                  />
                </td>
              ))}
              <td className="p-3 border border-slate-300 bg-slate-100 font-bold text-center text-slate-500 text-xs uppercase tracking-widest">
                Check
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <button 
          onClick={solve} 
          disabled={isSolving} 
          className="bg-indigo-600 disabled:bg-slate-400 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 shadow-xl transition-all flex items-center gap-2"
        >
          {isSolving ? 'Calculando Roteamento (Worker)...' : 'Otimizar Rotas (Minimizar Custo)'}
        </button>
      </div>

      {result && (
        <div className={`p-8 rounded-2xl shadow-2xl border-l-8 transition-all ${result.status === 'OPTIMAL' ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-600'}`}>
          <h2 className={`text-3xl font-black mb-6 ${result.status === 'OPTIMAL' ? 'text-emerald-900' : 'text-red-900'}`}>Status: {result.status}</h2>
          
          {result.status === 'OPTIMAL' ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center col-span-1 md:col-span-1">
                <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase mb-2">Custo Logístico Total (Mínimo)</h3>
                <div className="text-5xl font-black text-emerald-600">R$ {result.objectiveValue.toFixed(2)}</div>
                <span className="text-xs text-slate-400 mt-4 font-mono">Resolvido via Simplex em {result.iterations} iterações.</span>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1 md:col-span-2">
                <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">Plano de Embarque (Rotas Ativas)</h3>
                <ul className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {result.variables.map((v, i) => {
                    if (v < 1e-6) return null; // Só mostra rotas efetivamente usadas na base
                    const s = Math.floor(i / numDests);
                    const d = i % numDests;
                    return (
                      <li key={i} className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-lg border border-slate-100 shadow-sm">
                        <span className="font-bold text-slate-700">Origem {s+1} &rarr; Destino {d+1}</span>
                        <div className="flex items-center gap-3">
                           <span className="text-sm font-medium text-slate-400">Transportar:</span>
                           <span className="font-black text-lg text-indigo-700 bg-indigo-100 px-3 py-1 rounded-md">{v.toFixed(2)} un</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-red-800 font-bold bg-red-100 p-5 rounded-xl border border-red-200">
              {result.message}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
