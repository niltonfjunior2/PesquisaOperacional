import { LinearProgram, Constraint } from "../schemas/linear-program";

export interface TransportProblem {
  numSources: number;
  numDestinations: number;
  costs: number[][]; // [source][destination]
  supply: number[]; // [source]
  demand: number[]; // [destination]
  objectiveType: "MIN" | "MAX";
}

export function transformTransportToSimplex(tp: TransportProblem): LinearProgram {
  const numVars = tp.numSources * tp.numDestinations;
  
  // Achatando matriz de custos para vetor 1D do Simplex
  const objCoefs: number[] = [];
  for (let s = 0; s < tp.numSources; s++) {
    for (let d = 0; d < tp.numDestinations; d++) {
      objCoefs.push(tp.costs[s][d] || 0);
    }
  }
  
  const constraints: Constraint[] = [];
  
  // Restrições de Oferta (Soma das remessas de cada origem = Oferta total)
  for (let s = 0; s < tp.numSources; s++) {
    const row = new Array(numVars).fill(0);
    for (let d = 0; d < tp.numDestinations; d++) {
      row[s * tp.numDestinations + d] = 1;
    }
    constraints.push({
      id: `supply-${s}`,
      coefficients: row,
      operator: "=",
      rhs: tp.supply[s] || 0
    });
  }
  
  // Restrições de Demanda (Soma dos recebimentos de cada destino = Demanda total)
  for (let d = 0; d < tp.numDestinations; d++) {
    const row = new Array(numVars).fill(0);
    for (let s = 0; s < tp.numSources; s++) {
      row[s * tp.numDestinations + d] = 1;
    }
    constraints.push({
      id: `demand-${d}`,
      coefficients: row,
      operator: "=",
      rhs: tp.demand[d] || 0
    });
  }
  
  return {
    numVariables: numVars,
    objectiveType: tp.objectiveType,
    objectiveCoefficients: objCoefs,
    constraints: constraints
  };
}
