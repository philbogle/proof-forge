import { z } from 'zod';

export const GenerateProofInputSchema = z.object({
  theoremName: z.string().describe('The name of the theorem to prove.'),
  theoremStatement: z.string().describe('The statement of the theorem.'),
  formality: z
    .enum(['informalEnglish', 'semiFormal', 'rigorous'])
    .describe('The desired level of formality for the proof.'),
  userBackground: z
    .string()
    .describe("The user's mathematical background.")
    .optional(),
});
