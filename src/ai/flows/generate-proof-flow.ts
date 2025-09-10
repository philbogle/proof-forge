'use server';

/**
 * @fileOverview A flow for dynamically generating mathematical proofs.
 *
 * - generateProof - A function that creates a proof for a given theorem.
 * - GenerateProofInput - The input type for the generateProof function.
 * - GenerateProofOutput - The return type for the generateProof function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateProofInputSchema = z.object({
  theoremName: z.string().describe('The name of the theorem to prove.'),
  theoremStatement: z.string().describe('The statement of the theorem.'),
  formality: z
    .enum(['plainEnglish', 'englishDescription', 'semiFormal', 'rigorousFormal'])
    .describe('The desired level of formality for the proof.'),
  userBackground: z
    .string()
    .describe("The user's mathematical background.")
    .optional(),
});
export type GenerateProofInput = z.infer<typeof GenerateProofInputSchema>;

const GenerateProofOutputSchema = z.object({
  proof: z
    .string()
    .describe('The generated proof in Markdown format, including LaTeX for mathematical expressions.'),
});
export type GenerateProofOutput = z.infer<typeof GenerateProofOutputSchema>;

export async function generateProof(
  input: GenerateProofInput
): Promise<GenerateProofOutput> {
  const generateProofFlow = ai.defineFlow(
    {
      name: 'generateProofFlow',
      inputSchema: GenerateProofInputSchema,
      outputSchema: GenerateProofOutputSchema,
    },
    async (input) => {
      const prompt = `
You are an expert mathematician and a skilled teacher. Your task is to generate a proof for the given theorem at the specified level of formality.

**Theorem Name:** ${input.theoremName}
**Theorem Statement:** ${input.theoremStatement}
**Formality Level:** ${input.formality}
${input.userBackground ? `**Target Audience Background:** ${input.userBackground}` : ''}

**Instructions:**
1.  Generate a clear, correct, and well-structured proof.
2.  The output **must** be in Markdown format.
3.  **Crucially, all mathematical expressions and symbols must be written in LaTeX.**
    -   For **inline** mathematics, enclose the LaTeX code in single dollar signs. For example: \`Let $x$ be a number.\`
    -   For **block-level** or display mathematics, enclose the LaTeX code in double dollar signs. For example: \`$$a^2 + b^2 = c^2$$\`
4.  Adapt the tone, terminology, and level of detail to the specified formality level and target audience. For "plainEnglish", avoid math notation entirely.
5.  At the end of semi-formal and rigorous proofs, include "Q.E.D."

Begin the proof now.
`;

      const { output } = await ai.generate({
        prompt: prompt,
        output: {
          schema: GenerateProofOutputSchema,
        },
      });

      return output!;
    }
  );

  return generateProofFlow(input);
}
