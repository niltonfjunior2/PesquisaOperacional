export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface DijkstraResult {
  status: "OPTIMAL" | "UNREACHABLE";
  path: string[]; // IDs dos nós no caminho ótimo
  totalCost: number;
  message?: string;
}

export function solveDijkstra(nodesId: string[], edges: GraphEdge[], startId: string, endId: string, undirected: boolean = false): DijkstraResult {
  if (!nodesId.includes(startId) || !nodesId.includes(endId)) {
    return { status: "UNREACHABLE", path: [], totalCost: 0, message: "Origem ou Destino inválidos." };
  }

  // Lista de Adjacência
  const adj: Record<string, { to: string, weight: number }[]> = {};
  nodesId.forEach(n => adj[n] = []);
  
  edges.forEach(e => {
    if (adj[e.source] && nodesId.includes(e.target)) {
      adj[e.source].push({ to: e.target, weight: e.weight });
    }
    // Se não direcionado (mão-dupla), adiciona o inverso
    if (undirected && adj[e.target] && nodesId.includes(e.source)) {
      adj[e.target].push({ to: e.source, weight: e.weight });
    }
  });

  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  nodesId.forEach(n => {
    dist[n] = Infinity;
    prev[n] = null;
    unvisited.add(n);
  });
  
  dist[startId] = 0;

  // Dijkstra Main Loop (O(V^2) implementation)
  while (unvisited.size > 0) {
    let current: string | null = null;
    let minDist = Infinity;
    
    // Extract Min
    for (const node of unvisited) {
      if (dist[node] < minDist) {
        minDist = dist[node];
        current = node;
      }
    }

    // Se todos os nós restantes são inalcançáveis, interrompe
    if (current === null || minDist === Infinity) {
      break; 
    }

    if (current === endId) {
      break; // Chegou no destino! Early exit (Lazy evaluation)
    }

    unvisited.delete(current);

    // Relaxar arestas vizinhas
    for (const edge of adj[current]) {
      if (unvisited.has(edge.to)) {
        const alt = dist[current] + edge.weight;
        if (alt < dist[edge.to]) {
          dist[edge.to] = alt;
          prev[edge.to] = current;
        }
      }
    }
  }

  if (dist[endId] === Infinity) {
    return { status: "UNREACHABLE", path: [], totalCost: 0, message: "Não existe caminho conectado entre as cidades selecionadas." };
  }

  // Backtracking para desenhar a linha vermelha
  const path: string[] = [];
  let curr: string | null = endId;
  while (curr !== null) {
    path.unshift(curr);
    curr = prev[curr];
  }

  return {
    status: "OPTIMAL",
    path,
    totalCost: dist[endId]
  };
}
