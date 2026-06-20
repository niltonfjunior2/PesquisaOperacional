import { z } from "zod";

export const ObjectiveTypeSchema = z.enum(["MAX", "MIN"]);

export const ConstraintOperatorSchema = z.enum(["<=", ">=", "="]);

export const ConstraintSchema = z.object({
  id: z.string(),
  coefficients: z.array(z.number()),
  operator: ConstraintOperatorSchema,
  rhs: z.number(), // Right hand side
});

export const LinearProgramSchema = z.object({
  objectiveType: ObjectiveTypeSchema,
  objectiveCoefficients: z.array(z.number()),
  constraints: z.array(ConstraintSchema),
  numVariables: z.number().positive().int(),
  nonNegativity: z.boolean().default(true).optional(),
  variableBounds: z.array(z.number().nonnegative()).optional(),
});

export type ObjectiveType = z.infer<typeof ObjectiveTypeSchema>;
export type ConstraintOperator = z.infer<typeof ConstraintOperatorSchema>;
export type Constraint = z.infer<typeof ConstraintSchema>;
export type LinearProgram = z.infer<typeof LinearProgramSchema>;
