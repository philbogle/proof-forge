'use server';
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
  input: GenerateProofInput,
  onChunk: (chunk: string) => void
): Promise<GenerateProofOutput> {
  const generateProofFlow = ai.defineFlow(
    {
      name: 'generateProofFlow',
      inputSchema: GenerateProofInputSchema,
      outputSchema: z.string(), // We expect a streaming string output
    },
    async (input) => {
      const prompt = `
You are an expert mathematician and a skilled teacher. Your task is to generate a proof for the given theorem at the specified level of formality.

**Theorem Name:** ${input.theoremName}
**Theorem Statement:** ${input.theoremStatement}
**Formality Level:** ${input.formality}
${input.userBackground ? `**Target Audience Background:** ${input.userBackground}` : ''}

**Instructions:**
Your output must be in Markdown format.
Always use rendered LaTeX for math: $formula$ for inline (using \\mathbf{} for vectors), and $$formula$$ for display equations. Critically, ensure no whitespace exists immediately inside delimiters (use $E=mc^2$, not $ E = mc^2 $). When display math ($$...$$) appears within lists, start it on a new line with zero leading indentation. Reserve code blocks (\`\`\`) strictly for programming code implementations, never for displaying mathematical formulas. Choose inline math for brevity/flow and display math for complex or emphasized equations, maintaining clean separation and standard paragraph spacing (one blank line after display math) for a professional, scientific document style.
For "plainEnglish" formality, avoid math notation entirely.
For "semiFormal" and "rigorousFormal" formality, provide a full proof with all steps.
At the end of semi-formal and rigorous proofs, include "Q.E.D."

Begin the proof now.
`;

      const { stream } = ai.generateStream({
        prompt: prompt,
        output: {
          format: 'text',
        },
      });

      let fullProof = '';
      for await (const chunk of stream) {
        fullProof += chunk;
        onChunk(chunk);
      }

      return fullProof;
    }
  );

  const finalProof = await generateProofFlow(input);
  return { proof: finalProof };
}
