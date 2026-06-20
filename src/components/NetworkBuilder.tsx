"use client";
import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { solveDijkstra, DijkstraResult } from "@/lib/solvers/graphs";

export function NetworkBuilder() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "A", position: { x: 100, y: 200 }, data: { label: "Cidade A" }, style: { fontWeight: "bold", border: "2px solid #3b82f6", borderRadius: "8px" } },
    { id: "B", position: { x: 500, y: 200 }, data: { label: "Cidade B" }, style: { fontWeight: "bold", border: "2px solid #3b82f6", borderRadius: "8px" } },
    { id: "C", position: { x: 300, y: 50 }, data: { label: "Cidade C" }, style: { fontWeight: "bold", border: "2px solid #3b82f6", borderRadius: "8px" } }
  ]);
  const [edges, setEdges] = useState<Edge[]>([
    { id: "e-A-C", source: "A", target: "C", label: "15", data: { weight: 15 }, type: 'straight', style: { strokeWidth: 2, stroke: '#94a3b8' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' }, labelBgStyle: { fill: 'white' }, labelStyle: { fontWeight: 700 } },
    { id: "e-C-B", source: "C", target: "B", label: "20", data: { weight: 20 }, type: 'straight', style: { strokeWidth: 2, stroke: '#94a3b8' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' }, labelBgStyle: { fill: 'white' }, labelStyle: { fontWeight: 700 } },
    { id: "e-A-B", source: "A", target: "B", label: "50", data: { weight: 50 }, type: 'straight', style: { strokeWidth: 2, stroke: '#94a3b8' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' }, labelBgStyle: { fill: 'white' }, labelStyle: { fontWeight: 700 } }
  ]);

  const [startNode, setStartNode] = useState("A");
  const [endNode, setEndNode] = useState("B");
  const [undirected, setUndirected] = useState(false);
  const [result, setResult] = useState<DijkstraResult | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const costStr = prompt("Distância/Custo desta rota (Ex: 10):", "10");
      if (costStr !== null && !isNaN(Number(costStr))) {
        const cost = Number(costStr);
        const newEdge: Edge = {
          ...params,
          id: `e-${params.source}-${params.target}-${Date.now()}`,
          label: cost.toString(),
          data: { weight: cost },
          type: 'straight',
          style: { strokeWidth: 2, stroke: '#94a3b8' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
          labelBgStyle: { fill: 'white' },
          labelStyle: { fontWeight: 700, fill: '#334155' }
        };
        setEdges((eds) => addEdge(newEdge, eds));
        setResult(null); // Reseta o resultado ao alterar o grafo
      }
    },
    []
  );

  const addNode = () => {
    const id = String.fromCharCode(65 + nodes.length); // A, B, C, D...
    const newNode: Node = {
      id,
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: { label: `Cidade ${id}` },
      style: { fontWeight: "bold", border: "2px solid #3b82f6", borderRadius: "8px", background: 'white' }
    };
    setNodes(nds => [...nds, newNode]);
    setResult(null);
  };

  const solve = () => {
    // Reseta o estilo de todas as arestas
    setEdges(eds => eds.map(e => ({
      ...e, 
      style: { ...e.style, stroke: '#94a3b8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
      animated: false
    })));

    const gEdges = edges.map(e => ({ source: e.source, target: e.target, weight: Number(e.data?.weight) || 1 }));
    const nIds = nodes.map(n => n.id);

    const res = solveDijkstra(nIds, gEdges, startNode, endNode, undirected);
    setResult(res);

    if (res.status === "OPTIMAL") {
      const pathEdges = new Set<string>();
      for (let i = 0; i < res.path.length - 1; i++) {
        pathEdges.add(`${res.path[i]}->${res.path[i+1]}`);
        if (undirected) {
          pathEdges.add(`${res.path[i+1]}->${res.path[i]}`);
        }
      }

      setEdges(eds => eds.map(e => {
        const inPath = pathEdges.has(`${e.source}->${e.target}`);

        if (inPath) {
          return {
            ...e,
            animated: true,
            style: { ...e.style, stroke: '#10b981', strokeWidth: 5 }, // Verde esmeralda brilhante
            markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
          };
        }
        return e;
      }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 mb-12 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Redes e Grafos (Dijkstra)</h2>
          <p className="text-slate-500 font-medium">Construa o grafo arrastando entre os pontos azuis e descubra o Caminho Mais Curto.</p>
        </div>
        
        <div className="flex gap-4">
           <button onClick={addNode} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg border border-slate-300 transition-colors">
             + Adicionar Cidade
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Painel de Controle */}
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Roteamento</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-600 mb-1">Ponto de Partida</label>
            <select value={startNode} onChange={e => setStartNode(e.target.value)} className="w-full p-2 border rounded-lg bg-slate-50 font-bold">
              {nodes.map(n => <option key={n.id} value={n.id}>{n.data.label as string}</option>)}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-600 mb-1">Destino Final</label>
            <select value={endNode} onChange={e => setEndNode(e.target.value)} className="w-full p-2 border rounded-lg bg-slate-50 font-bold">
              {nodes.map(n => <option key={n.id} value={n.id}>{n.data.label as string}</option>)}
            </select>
          </div>

          <div className="mb-6 bg-slate-50 p-3 rounded-lg border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={undirected} onChange={e => setUndirected(e.target.checked)} className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-slate-700">Mão-dupla (Grafo não direcionado)</span>
            </label>
          </div>
          
          <button onClick={solve} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-lg shadow-md transition-transform active:scale-95 flex justify-center items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Calcular Dijkstra
          </button>

          {result && (
            <div className={`mt-6 p-4 rounded-lg border-l-4 ${result.status === 'OPTIMAL' ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
               <h4 className={`font-black mb-2 ${result.status === 'OPTIMAL' ? 'text-emerald-800' : 'text-red-800'}`}>
                 {result.status === 'OPTIMAL' ? 'Caminho Encontrado!' : 'Inviável'}
               </h4>
               
               {result.status === 'OPTIMAL' ? (
                 <>
                   <div className="text-2xl font-black text-emerald-600 mb-2">Custo: {result.totalCost}</div>
                   <div className="text-sm font-medium text-slate-600 leading-relaxed">
                     Rota: <br/>
                     <span className="font-bold text-slate-800">{result.path.join(" ➔ ")}</span>
                   </div>
                 </>
               ) : (
                 <p className="text-sm text-red-700 font-medium">{result.message}</p>
               )}
            </div>
          )}
        </div>

        {/* Canvas do React Flow */}
        <div className="col-span-1 lg:col-span-3 bg-slate-50 border border-slate-200 rounded-xl shadow-inner h-[600px] overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            defaultEdgeOptions={{ type: 'straight' }}
          >
            <Controls />
            <Background gap={20} size={1} color="#cbd5e1" />
          </ReactFlow>
        </div>

      </div>
    </div>
  );
}
