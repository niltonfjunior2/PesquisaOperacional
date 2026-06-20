import { LinearProgram } from "../schemas/linear-program";

export interface Point2D {
  x: number;
  y: number;
}

export interface Line2D {
  a: number; // coef for x (X1)
  b: number; // coef for y (X2)
  c: number; // RHS
  operator: "<=" | ">=" | "=";
  originalIndex: number; // -1 for axis constraints
}

export interface GraphicalData {
  feasiblePolygon: Point2D[];
  lines: { p1: Point2D; p2: Point2D; constraintIdx: number }[];
  maxX: number;
  maxY: number;
}

const TOLERANCE = 1e-6;

export function isDuplicate(p1: Point2D, p2: Point2D): boolean {
  return Math.abs(p1.x - p2.x) < TOLERANCE && Math.abs(p1.y - p2.y) < TOLERANCE;
}

export function extractLines(model: LinearProgram): Line2D[] {
  const lines: Line2D[] = [];
  
  // Axes constraints X >= 0, Y >= 0
  lines.push({ a: 1, b: 0, c: 0, operator: ">=", originalIndex: -1 }); // X >= 0
  lines.push({ a: 0, b: 1, c: 0, operator: ">=", originalIndex: -2 }); // Y >= 0

  // Problem constraints
  model.constraints.forEach((c, i) => {
    lines.push({
      a: c.coefficients[0] || 0,
      b: c.coefficients[1] || 0,
      c: c.rhs,
      operator: c.operator,
      originalIndex: i
    });
  });

  return lines;
}

export function findIntersections(lines: Line2D[]): Point2D[] {
  const points: Point2D[] = [];
  const n = lines.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const l1 = lines[i];
      const l2 = lines[j];

      // Cramer's rule for system:
      // a1*x + b1*y = c1
      // a2*x + b2*y = c2
      const det = l1.a * l2.b - l2.a * l1.b;

      if (Math.abs(det) > TOLERANCE) {
        const x = (l1.c * l2.b - l2.c * l1.b) / det;
        const y = (l1.a * l2.c - l2.a * l1.c) / det;
        
        // Avoid adding near-duplicates
        const isDup = points.some(p => isDuplicate(p, {x, y}));
        if (!isDup) {
          points.push({ x: x === 0 ? 0 : x, y: y === 0 ? 0 : y });
        }
      }
    }
  }

  return points;
}

export function isFeasible(p: Point2D, lines: Line2D[]): boolean {
  for (const line of lines) {
    const val = line.a * p.x + line.b * p.y;
    if (line.operator === "<=") {
      if (val > line.c + TOLERANCE) return false;
    } else if (line.operator === ">=") {
      if (val < line.c - TOLERANCE) return false;
    } else if (line.operator === "=") {
      if (Math.abs(val - line.c) > TOLERANCE) return false;
    }
  }
  return true;
}

export function sortCounterClockwise(points: Point2D[]): Point2D[] {
  if (points.length <= 2) return points;

  // Find centroid
  const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  // Sort by angle atan2
  return [...points].sort((A, B) => {
    const a1 = Math.atan2(A.y - cy, A.x - cx);
    const a2 = Math.atan2(B.y - cy, B.x - cx);
    return a1 - a2;
  });
}

export function generateGraphicalData(model: LinearProgram): GraphicalData {
  if (model.numVariables !== 2) {
    throw new Error("Graphical method is only supported for exactly 2 variables.");
  }

  const lines = extractLines(model);
  const allIntersections = findIntersections(lines);
  const feasiblePoints = allIntersections.filter(p => isFeasible(p, lines));
  const polygon = sortCounterClockwise(feasiblePoints);

  // Determine bounds for the chart
  let maxX = 10;
  let maxY = 10;
  if (allIntersections.length > 0) {
    const validX = allIntersections.map(p => p.x).filter(x => x >= 0 && x < 100000);
    const validY = allIntersections.map(p => p.y).filter(y => y >= 0 && y < 100000);
    if (validX.length > 0) maxX = Math.max(10, ...validX) * 1.1; // 10% padding
    if (validY.length > 0) maxY = Math.max(10, ...validY) * 1.1;
  }

  // Generate plottable line segments across the chart view
  const plotLines: { p1: Point2D; p2: Point2D; constraintIdx: number }[] = [];
  
  lines.forEach(line => {
    if (line.originalIndex < 0) return; // Skip axes
    
    // We want the line segment within [0, maxX] and [0, maxY]
    const pts: Point2D[] = [];
    
    if (Math.abs(line.b) > TOLERANCE) {
      // Intersection with x = 0
      pts.push({ x: 0, y: line.c / line.b });
      // Intersection with x = maxX
      pts.push({ x: maxX, y: (line.c - line.a * maxX) / line.b });
    }
    
    if (Math.abs(line.a) > TOLERANCE) {
      // Intersection with y = 0
      pts.push({ x: line.c / line.a, y: 0 });
      // Intersection with y = maxY
      pts.push({ x: (line.c - line.b * maxY) / line.a, y: maxY });
    }

    // Filter points that are within bounds [0, maxX] and [0, maxY]
    const validPts = pts.filter(p => p.x >= -TOLERANCE && p.x <= maxX + TOLERANCE && p.y >= -TOLERANCE && p.y <= maxY + TOLERANCE);
    
    // De-duplicate valid points
    const uniquePts: Point2D[] = [];
    validPts.forEach(vp => {
      if (!uniquePts.some(up => isDuplicate(up, vp))) {
        uniquePts.push(vp);
      }
    });

    if (uniquePts.length >= 2) {
      plotLines.push({
        p1: uniquePts[0],
        p2: uniquePts[1],
        constraintIdx: line.originalIndex
      });
    } else if (uniquePts.length === 1) {
       // se a linha só toca um ponto (ex: tangencia o limite) 
       // vamos forçar o segundo ponto
       plotLines.push({ p1: uniquePts[0], p2: pts[0], constraintIdx: line.originalIndex });
    }
  });

  return {
    feasiblePolygon: polygon,
    lines: plotLines,
    maxX,
    maxY
  };
}
