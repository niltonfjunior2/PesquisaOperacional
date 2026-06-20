import { SimplexSolver } from "../solvers/simplex";
import { LinearProgram } from "../schemas/linear-program";

self.onmessage = (e: MessageEvent<LinearProgram>) => {
  const model = e.data;
  const solver = new SimplexSolver();
  const result = solver.solve(model);
  self.postMessage(result);
};
