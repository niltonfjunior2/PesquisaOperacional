"use client";
import { useState, useEffect, useRef } from "react";
import * as Sentry from "@sentry/nextjs";
import { LinearProgram, ObjectiveType, Constraint, LinearProgramSchema } from "@/lib/schemas/linear-program";
import { ObjectiveFunctionInput } from "./ObjectiveFunctionInput";
import { ConstraintsMatrix } from "./ConstraintsMatrix";
import type { SimplexResult } from "@/lib/solvers/simplex";
import { resizeArray } from "@/lib/utils/array";
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from "@/lib/persistence/storage";
import { createMagicUrl, parseMagicUrl } from "@/lib/persistence/magic-url";
import { exportToFile, importFromFile } from "@/lib/persistence/file-io";
import { SensitivityAnalysis } from "./SensitivityAnalysis";
import { GraphicalSolver } from "./GraphicalSolver";
import { generatePdfFromElement } from "@/lib/utils/pdf-generator";

export function SimplexBuilder() {
  const [numVariables, setNumVariables] = useState<number>(2);
  const [objectiveType, setObjectiveType] = useState<ObjectiveType>("MAX");
  const [objectiveCoefficients, setObjectiveCoefficients] = useState<number[]>([0, 0]);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [result, setResult] = useState<SimplexResult | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Inicialização (Hydration safe e Magic URL precedência)
  useEffect(() => {
    let initialModel = parseMagicUrl(window.location.href);
    
    if (!initialModel) {
      initialModel = loadFromLocalStorage();
    } else {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (initialModel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNumVariables(initialModel.numVariables);
      setObjectiveType(initialModel.objectiveType);
      setObjectiveCoefficients(initialModel.objectiveCoefficients);
      setConstraints(initialModel.constraints);
    }

    workerRef.current = new Worker(new URL('@/lib/workers/simplex.worker.ts', import.meta.url));
    workerRef.current.onmessage = (event: MessageEvent<SimplexResult>) => {
      setResult(event.data);
      setIsSolving(false);
      
      if (event.data.status === "ERROR") {
        Sentry.captureException(new Error(event.data.message), {
          tags: { context: "worker_solver" }
        });
      }
    };
    
    setIsLoaded(true);
    return () => workerRef.current?.terminate();
  }, []);

  // Auto-Save Effect (Debounced)
  useEffect(() => {
    if (!isLoaded) return;
    
    const timeout = setTimeout(() => {
      const payload: LinearProgram = {
        numVariables,
        objectiveType,
        objectiveCoefficients,
        constraints
      };
      
      const validation = LinearProgramSchema.safeParse(payload);
      if (validation.success) {
        saveToLocalStorage(validation.data);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [numVariables, objectiveType, objectiveCoefficients, constraints, isLoaded]);

  const handleNumVarsChange = (newNum: number) => {
    if (newNum < 1 || newNum > 20) return;
    setNumVariables(newNum);
    setObjectiveCoefficients(resizeArray(objectiveCoefficients, newNum, 0));
    setConstraints(constraints.map(c => ({
      ...c, 
      coefficients: resizeArray(c.coefficients, newNum, 0)
    })));
  };

  const handleExport = () => {
    const payload: LinearProgram = { numVariables, objectiveType, objectiveCoefficients, constraints };
    exportToFile(payload);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const model = await importFromFile(file);
      setNumVariables(model.numVariables);
      setObjectiveType(model.objectiveType);
      setObjectiveCoefficients(model.objectiveCoefficients);
      setConstraints(model.constraints);
      alert("Projeto importado com sucesso!");
    } catch (err) {
      Sentry.captureException(err, { tags: { context: "file_import" }});
      alert(err instanceof Error ? err.message : "Falha na importação.");
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleShare = async () => {
    const payload: LinearProgram = { numVariables, objectiveType, objectiveCoefficients, constraints };
    const url = createMagicUrl(payload);
    if (!url) {
      alert("Erro ao gerar link de compartilhamento.");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copiado! Qualquer um com o link abrirá este exato modelo instantaneamente.");
    } catch (_) {
      alert("Arquivo inválido ou corrompido.");
    }
  };

  const handleClear = () => {
    if (confirm("Tem certeza que deseja limpar tudo? Isso apagará seu rascunho atual.")) {
      clearLocalStorage();
      setNumVariables(2);
      setObjectiveType("MAX");
      setObjectiveCoefficients([0, 0]);
      setConstraints([]);
      setResult(null);
    }
  };

  const handleGeneratePdf = async () => {
    if (!reportRef.current) return;
    try {
      setIsGeneratingPdf(true);
      await generatePdfFromElement(reportRef.current, "relatorio-pesquisa-operacional.pdf");
    } catch (e) {
      alert("Erro ao gerar PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const solve = () => {
    const payload: LinearProgram = { numVariables, objectiveType, objectiveCoefficients, constraints };
    const validation = LinearProgramSchema.safeParse(payload);
    if (!validation.success) {
      alert("Erro estrutural na validação dos dados de entrada. Verifique as matrizes.");
      return;
    }

    setIsSolving(true);
    setResult(null);
    workerRef.current?.postMessage(validation.data);
  };

  if (!isLoaded) return null; // Previne hydration mismatch

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header com Ações Stateless */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Modelagem Simplex</h1>
          <p className="text-slate-500 mt-1 font-medium">Auto-save ativo no navegador. Sem bancos de dados.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 mr-2">
            <label className="font-semibold text-sm text-slate-700">Variáveis:</label>
            <input 
              type="number" 
              min="1" max="20"
              value={numVariables} 
              onChange={(e) => handleNumVarsChange(parseInt(e.target.value) || 2)}
              className="w-14 p-1 border border-slate-300 rounded text-center font-bold text-slate-800 shadow-inner"
            />
          </div>

          <button onClick={handleShare} className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md font-medium hover:bg-indigo-100 transition border border-indigo-200 text-sm">
            🔗 Compartilhar Link
          </button>
          
          <button onClick={handleExport} className="bg-slate-100 text-slate-700 px-3 py-2 rounded-md font-medium hover:bg-slate-200 transition text-sm">
            ⬇️ Exportar (.po)
          </button>
          
          <button onClick={() => fileInputRef.current?.click()} className="bg-slate-100 text-slate-700 px-3 py-2 rounded-md font-medium hover:bg-slate-200 transition text-sm">
            ⬆️ Importar
          </button>
          <input type="file" accept=".po,.json" ref={fileInputRef} className="hidden" onChange={handleImport} />

          <button onClick={handleClear} className="text-red-500 px-3 py-2 rounded-md font-medium hover:bg-red-50 transition text-sm ml-2">
            Limpar
          </button>
        </div>
      </div>

      <ObjectiveFunctionInput 
        numVariables={numVariables}
        objectiveType={objectiveType}
        setObjectiveType={setObjectiveType}
        coefficients={objectiveCoefficients}
        setCoefficients={setObjectiveCoefficients}
      />

      <ConstraintsMatrix 
        numVariables={numVariables}
        constraints={constraints}
        setConstraints={setConstraints}
      />

      <div className="flex justify-end mb-8">
        <button 
          onClick={solve}
          disabled={isSolving || constraints.length === 0}
          className="bg-emerald-600 disabled:bg-slate-300 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-emerald-700 transition shadow-md flex items-center gap-2"
        >
          {isSolving ? 'Calculando...' : 'Otimizar Solução (Z)'}
        </button>
      </div>

      {result && (
        <div ref={reportRef} className="space-y-6 bg-white p-2 rounded-xl mt-8">
          <div className="flex justify-end mb-2" data-html2canvas-ignore="true">
            <button 
              onClick={handleGeneratePdf} 
              disabled={isGeneratingPdf}
              className="bg-slate-800 disabled:bg-slate-400 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-900 transition shadow flex items-center gap-2"
            >
              {isGeneratingPdf ? "⏳ Gerando PDF..." : "📄 Salvar Relatório em PDF"}
            </button>
          </div>

          <div className={`p-6 rounded-xl shadow-md border-l-4 transition-all ${result.status === 'OPTIMAL' ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
            {/* Output igual */}
            <div className="flex justify-between items-start mb-6 border-b border-slate-200/50 pb-4">
              <h2 className={`text-2xl font-bold ${result.status === 'OPTIMAL' ? 'text-emerald-800' : 'text-red-800'}`}>
                Status da Solução: {result.status}
              </h2>
              <span className="text-xs font-mono bg-white px-2 py-1 rounded text-slate-500 border">
                Worker: {result.iterations} iterações
              </span>
            </div>
            
            {result.status === 'OPTIMAL' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-5 rounded-lg border shadow-sm flex flex-col justify-center items-center text-center">
                  <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-2">Valor (Z)</h3>
                  <div className="text-5xl font-black text-emerald-600">{result.objectiveValue.toFixed(2)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-3">Variáveis</h3>
                  <ul className="space-y-2">
                    {result.variables.map((v, i) => (
                      <li key={i} className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border shadow-sm">
                        <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">x{i+1}</span>
                        <span className="font-bold text-lg text-slate-800">{v.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-red-700 font-medium bg-red-100/50 p-4 rounded-lg">
                {result.message}
              </div>
            )}
          </div>
          
          {result.status === 'OPTIMAL' && (
            <SensitivityAnalysis result={result} numConstraints={constraints.length} />
          )}
          
          {/* Método Gráfico (Apenas para X1 e X2) */}
          {numVariables === 2 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
              <GraphicalSolver model={{ numVariables, objectiveType, objectiveCoefficients, constraints }} result={result} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
