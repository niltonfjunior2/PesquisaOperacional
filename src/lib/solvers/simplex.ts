// src/lib/solvers/simplex.ts
import { LinearProgram, Constraint } from "../schemas/linear-program";

export interface SimplexResult {
  status: "OPTIMAL" | "UNBOUNDED" | "INFEASIBLE" | "ERROR";
  objectiveValue: number;
  variables: number[];
  slackVariables: number[];
  shadowPrices: number[];
  iterations: number;
  message?: string;
}

export class SimplexSolver {
  private readonly MAX_ITERATIONS = 15000;
  private readonly BIG_M = 10000000; // Penalidade monumental para = e >=
  private numVars: number = 0;
  private numConstraints: number = 0;
  private totalCols: number = 0;
  private slackColMapping: Record<number, number> = {}; 
  private artificialColMapping: Record<number, number> = {}; 

  public solve(model: LinearProgram): SimplexResult {
    try {
      this.numVars = model.numVariables;
      this.numConstraints = model.constraints.length;
      
      const { processedModel, postprocess } = this.preprocessModel(model);
      this.numVars = processedModel.numVariables;
      this.numConstraints = processedModel.constraints.length;

      const tableau = this.buildTableau(processedModel);
      if (!tableau) {
         return this.createErrorResult("Erro fatal na construção do Tableau.");
      }

      const { iterations, unbounded } = this.optimize(tableau);
      
      if (unbounded) {
        return postprocess(this.createUnboundedResult(iterations));
      }
      
      return postprocess(this.extractSolution(tableau, processedModel.objectiveType, iterations));
      
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : "Erro desconhecido no Solver.");
    }
  }

  private preprocessModel(model: LinearProgram): { processedModel: LinearProgram, postprocess: (r: SimplexResult) => SimplexResult } {
    if (model.nonNegativity !== false && (!model.variableBounds || model.variableBounds.every(b => b === 0))) {
      return { processedModel: model, postprocess: r => r };
    }

    const newConstraints: Constraint[] = [...model.constraints];
    let newObjCoefs: number[] = [];
    let numVars = model.numVariables;

    if (model.nonNegativity === false) {
      // Substitute X_j = X_j^+ - X_j^-
      numVars = model.numVariables * 2;
      for (let j = 0; j < model.numVariables; j++) {
        newObjCoefs.push(model.objectiveCoefficients[j]);
        newObjCoefs.push(-model.objectiveCoefficients[j]);
      }
      
      for (let i = 0; i < newConstraints.length; i++) {
        const newCoefs = [];
        for (let j = 0; j < model.numVariables; j++) {
          newCoefs.push(newConstraints[i].coefficients[j]);
          newCoefs.push(-newConstraints[i].coefficients[j]);
        }
        newConstraints[i] = { ...newConstraints[i], coefficients: newCoefs };
      }
    } else {
      newObjCoefs = [...model.objectiveCoefficients];
      if (model.variableBounds) {
        for (let j = 0; j < model.numVariables; j++) {
          const bound = model.variableBounds[j];
          if (bound > 0) {
            const coefs = new Array(model.numVariables).fill(0);
            coefs[j] = 1;
            newConstraints.push({
              id: crypto.randomUUID(),
              coefficients: coefs,
              operator: ">=",
              rhs: bound
            });
          }
        }
      }
    }

    const processedModel: LinearProgram = {
      ...model,
      numVariables: numVars,
      objectiveCoefficients: newObjCoefs,
      constraints: newConstraints
    };

    const postprocess = (res: SimplexResult) => {
      if (model.nonNegativity === false && res.status === "OPTIMAL") {
        const finalVars = [];
        for(let j=0; j<model.numVariables; j++) {
          finalVars.push(res.variables[2*j] - res.variables[2*j+1]);
        }
        res.variables = finalVars;
      }
      return res;
    };

    return { processedModel, postprocess };
  }

  private buildTableau(model: LinearProgram): number[][] | null {
    let numSlacks = 0;
    let numArtificials = 0;
    this.slackColMapping = {};
    this.artificialColMapping = {};
    
    // Contagem de variáveis auxiliares necessárias
    for (const c of model.constraints) {
      if (c.operator === "<=") numSlacks++;
      else if (c.operator === ">=") { numSlacks++; numArtificials++; }
      else if (c.operator === "=") { numArtificials++; }
    }
    
    this.totalCols = this.numVars + numSlacks + numArtificials + 1; // +1 para coluna RHS
    const tableau: number[][] = [];
    
    // Setup Função Objetivo
    const objRow = new Array(this.totalCols).fill(0);
    for (let i = 0; i < this.numVars; i++) {
      objRow[i] = model.objectiveType === "MIN" ? model.objectiveCoefficients[i] : -model.objectiveCoefficients[i];
    }
    
    const artIdxForObj = this.numVars + numSlacks;
    for (let i = 0; i < numArtificials; i++) {
      objRow[artIdxForObj + i] = this.BIG_M; 
    }
    tableau.push(objRow);
    
    let slackIdx = 0;
    let artIdx = 0;
    const artificialRows: number[] = [];
    
    // Setup Restrições
    for (let i = 0; i < this.numConstraints; i++) {
      const c = model.constraints[i];
      const row = new Array(this.totalCols).fill(0);
      
      let rhs = c.rhs;
      let op = c.operator;
      let coefs = [...c.coefficients];
      
      // Normalização se o lado direito for negativo
      if (rhs < 0) {
         rhs = -rhs;
         coefs = coefs.map(val => -val);
         if (op === "<=") op = ">=";
         else if (op === ">=") op = "<=";
      }
      
      for (let j = 0; j < this.numVars; j++) {
        row[j] = coefs[j] || 0;
      }
      
      if (op === "<=") {
        const col = this.numVars + slackIdx;
        row[col] = 1;
        this.slackColMapping[i] = col;
        slackIdx++;
      } else if (op === ">=") {
        const sCol = this.numVars + slackIdx;
        row[sCol] = -1; // Variável de Excesso
        this.slackColMapping[i] = sCol;
        slackIdx++;
        
        const aCol = this.numVars + numSlacks + artIdx;
        row[aCol] = 1;  // Variável Artificial
        this.artificialColMapping[i] = aCol;
        artificialRows.push(i + 1);
        artIdx++;
      } else if (op === "=") {
        const aCol = this.numVars + numSlacks + artIdx;
        row[aCol] = 1;  // Variável Artificial
        this.artificialColMapping[i] = aCol;
        artificialRows.push(i + 1);
        artIdx++;
      }
      
      row[this.totalCols - 1] = rhs;
      tableau.push(row);
    }
    
    // Método BIG-M: Zerar os coeficientes das variáveis artificiais na linha da função objetivo (Row 0)
    for (const r of artificialRows) {
      for (let j = 0; j < this.totalCols; j++) {
        tableau[0][j] -= this.BIG_M * tableau[r][j];
      }
    }
    
    return tableau;
  }

  private optimize(tableau: number[][]): { iterations: number, unbounded: boolean } {
    let iterations = 0;

    while (true) {
      if (iterations++ > this.MAX_ITERATIONS) {
        throw new Error("Timeout do Solver: Máximo de iterações atingido no Simplex.");
      }
      
      const pivotCol = this.getPivotColumn(tableau);
      if (pivotCol === -1) break; // Solução ótima alcançada
      
      const pivotRow = this.getPivotRow(tableau, pivotCol);
      if (pivotRow === -1) return { iterations, unbounded: true };
      
      this.performPivot(tableau, pivotRow, pivotCol);
    }

    return { iterations, unbounded: false };
  }

  private getPivotColumn(tableau: number[][]): number {
    let pivotCol = -1;
    let minVal = -1e-8; // Tolerância para ponto flutuante
    for (let j = 0; j < this.totalCols - 1; j++) {
      if (tableau[0][j] < minVal) {
        minVal = tableau[0][j];
        pivotCol = j;
      }
    }
    return pivotCol;
  }

  private getPivotRow(tableau: number[][], pivotCol: number): number {
    let pivotRow = -1;
    let minRatio = Infinity;
    for (let i = 1; i <= this.numConstraints; i++) {
      if (tableau[i][pivotCol] > 1e-8) {
        const ratio = tableau[i][this.totalCols - 1] / tableau[i][pivotCol];
        if (ratio < minRatio) {
          minRatio = ratio;
          pivotRow = i;
        }
      }
    }
    return pivotRow;
  }

  private performPivot(tableau: number[][], pivotRow: number, pivotCol: number): void {
    const pivotElement = tableau[pivotRow][pivotCol];
    for (let j = 0; j < this.totalCols; j++) {
      tableau[pivotRow][j] /= pivotElement;
    }
    
    for (let i = 0; i <= this.numConstraints; i++) {
      if (i !== pivotRow) {
        const factor = tableau[i][pivotCol];
        for (let j = 0; j < this.totalCols; j++) {
          tableau[i][j] -= factor * tableau[pivotRow][j];
        }
      }
    }
  }

  private extractSolution(tableau: number[][], objType: string, iterations: number): SimplexResult {
    // Checar viabilidade verificando se alguma variável artificial continuou na base com valor > 0
    for (const aCol of Object.values(this.artificialColMapping)) {
      const val = this.getBasicVariableValue(tableau, aCol);
      if (val > 1e-6) {
         return {
            status: "INFEASIBLE",
            objectiveValue: 0,
            variables: [],
            slackVariables: [],
            shadowPrices: [],
            iterations,
            message: "Problema Inviável: Restrições mutuamente excludentes (A variável artificial não saiu da base)."
         };
      }
    }

    let z = tableau[0][this.totalCols - 1];
    if (objType === "MIN") z = -z;
    
    // Arredondar z para evitar resíduos do ponto flutuante
    if (Math.abs(z) < 1e-8) z = 0;

    const vars = new Array(this.numVars).fill(0);
    for (let j = 0; j < this.numVars; j++) {
      vars[j] = this.getBasicVariableValue(tableau, j);
    }
    
    const slackVars = new Array(this.numConstraints).fill(0);
    for (let i = 0; i < this.numConstraints; i++) {
      if (this.slackColMapping[i] !== undefined) {
         const sCol = this.slackColMapping[i];
         slackVars[i] = this.getBasicVariableValue(tableau, sCol);
      } else {
         slackVars[i] = 0; 
      }
    }
    
    const shadowPrices = new Array(this.numConstraints).fill(0);
    for (let i = 0; i < this.numConstraints; i++) {
      if (this.slackColMapping[i] !== undefined) {
         const sCol = this.slackColMapping[i];
         shadowPrices[i] = tableau[0][sCol];
      }
    }

    return {
      status: "OPTIMAL",
      objectiveValue: z,
      variables: vars,
      slackVariables: slackVars,
      shadowPrices: shadowPrices,
      iterations,
    };
  }

  private getBasicVariableValue(tableau: number[][], colIndex: number): number {
    let isBasic = true;
    let ones = 0;
    let oneRow = -1;
    for (let i = 1; i <= this.numConstraints; i++) {
      const val = tableau[i][colIndex];
      if (Math.abs(val - 1) < 1e-6) {
        ones++;
        oneRow = i;
      } else if (Math.abs(val) > 1e-6) {
        isBasic = false;
        break;
      }
    }
    if (isBasic && ones === 1) {
      const val = tableau[oneRow][this.totalCols - 1];
      return Math.abs(val) < 1e-8 ? 0 : val;
    }
    return 0;
  }

  private createErrorResult(message: string): SimplexResult {
    return {
      status: "ERROR",
      objectiveValue: 0,
      variables: [],
      slackVariables: [],
      shadowPrices: [],
      iterations: 0,
      message,
    };
  }

  private createUnboundedResult(iterations: number): SimplexResult {
    return {
      status: "UNBOUNDED",
      objectiveValue: 0,
      variables: [],
      slackVariables: [],
      shadowPrices: [],
      iterations,
      message: "Problema não limitado (Região Viável Aberta)."
    };
  }
}
