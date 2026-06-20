import { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Label
} from "recharts";
import { LinearProgram } from "@/lib/schemas/linear-program";
import { generateGraphicalData, GraphicalData, Point2D } from "@/lib/solvers/graphical";
import type { SimplexResult } from "@/lib/solvers/simplex";

interface Props {
  model: LinearProgram;
  result: SimplexResult | null;
}

export function GraphicalSolver({ model, result }: Props) {
  const [data, setData] = useState<GraphicalData | null>(null);

  useEffect(() => {
    if (model.numVariables === 2) {
      try {
        const generated = generateGraphicalData(model);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(generated);
      } catch (e) {
        console.error("Erro ao gerar dados gráficos:", e);
      }
    }
  }, [model]);

  if (model.numVariables !== 2) return null;
  if (!data) return <div className="p-4 text-center text-slate-500">Calculando geometria...</div>;

  // Fechar o polígono ligando o último ponto ao primeiro
  const polygonPoints = data.feasiblePolygon.length > 2 
    ? [...data.feasiblePolygon, data.feasiblePolygon[0]] 
    : data.feasiblePolygon;

  // Formatar dados para o Recharts Scatter
  const polygonData = polygonPoints.map((p, idx) => ({ x: p.x, y: p.y, name: `Vértice ${idx}` }));

  // Se houver resultado ótimo, adicionamos o ponto ótimo no gráfico
  let optimalPointData: { x: number, y: number }[] = [];
  if (result && result.status === "OPTIMAL") {
    optimalPointData = [{ x: result.variables[0], y: result.variables[1] }];
  }

  // Cores lindas para as retas
  const colors = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-slate-800">Método Gráfico</h3>
          <p className="text-slate-500 font-medium">Visualização cartesiana da Região Viável (somente para X1 e X2).</p>
        </div>
        {result && result.status === "OPTIMAL" && (
           <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200 text-sm font-bold text-emerald-800">
             Solução em X1: {result.variables[0].toFixed(2)}, X2: {result.variables[1].toFixed(2)}
           </div>
        )}
      </div>

      <div className="w-full h-[500px] bg-slate-50 rounded-lg p-4 border border-slate-100">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="X1" 
              domain={[0, data.maxX]} 
              stroke="#64748b"
            >
              <Label value="Variável X1" offset={-10} position="insideBottom" fill="#475569" fontWeight="bold"/>
            </XAxis>
            <YAxis 
              type="number" 
              dataKey="y" 
              name="X2" 
              domain={[0, data.maxY]} 
              stroke="#64748b"
            >
              <Label value="Variável X2" angle={-90} position="insideLeft" fill="#475569" fontWeight="bold"/>
            </YAxis>
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#1e293b' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) : value}
            />

            {/* O Polígono Viável (Desenhado conectando Scatter Points) */}
            {polygonData.length > 0 && (
              <Scatter 
                name="Região Viável" 
                data={polygonData} 
                fill="#10b981" 
                line={{ stroke: '#059669', strokeWidth: 3 }} 
                shape="circle"
              />
            )}

            {/* As linhas das restrições */}
            {data.lines.map((line, idx) => (
              <ReferenceLine 
                key={`line-${idx}`}
                segment={[{ x: line.p1.x, y: line.p1.y }, { x: line.p2.x, y: line.p2.y }]}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            ))}

            {/* O Ponto Ótimo */}
            {optimalPointData.length > 0 && (
               <Scatter 
                 name="Ponto Ótimo (Z Máximo/Mínimo)" 
                 data={optimalPointData} 
                 fill="#ef4444" 
                 shape="star"
                 r={100} // Tamanho da estrela 
               />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-slate-600">
         <div className="flex items-center gap-2">
           <div className="w-4 h-4 bg-[#10b981] rounded-sm"></div>
           Polígono de Região Viável
         </div>
         <div className="flex items-center gap-2">
           <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
           Solução Ótima 
         </div>
         <div className="flex items-center gap-2">
           <div className="w-4 h-0.5 bg-slate-400 border border-dashed border-slate-600"></div>
           Restrições do Problema
         </div>
      </div>
    </div>
  );
}
