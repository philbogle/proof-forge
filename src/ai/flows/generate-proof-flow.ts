'use server';
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type {GenerateProofOutput, GenerateProofInput} from '@/lib/types';
import {GenerateProofInputSchema} from '@/lib/schemas';

const GenerateProofOutputSchema = z.object({
  proof: z.string(),
});

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
- For "informalEnglish": Provide a step-by-step proof using only plain English. Do not use mathematical notation or symbols.
- For "semiFormal": Provide a step-by-step proof that uses mathematical notation but also includes intuitive explanations and more accessible language to clarify complex steps.
- For "rigorous": Provide a traditional, formal, and rigorous mathematical proof.

- Your output must be in Markdown format.
- Always use rendered LaTeX for math: $formula$ for inline (using \\mathbf{} for vectors), and $$formula$$ for display equations. Critically, ensure no whitespace exists immediately inside delimiters (use $E=mc^2$, not $ E = mc^2 $). When display math ($$...$$) appears within lists, start it on a new line with zero leading indentation. Reserve code blocks (\`\`\`) strictly for programming code implementations, never for displaying mathematical formulas. Choose inline math for brevity/flow and display math for complex or emphasized equations, maintaining clean separation and standard paragraph spacing (one blank line after display math) for a professional, scientific document style.
- For "informalEnglish" formality, avoid math notation entirely.
- For "semiFormal" and "rigorous" formality, provide a full proof with all steps.
- At the end of semi-formal and rigorous proofs, include "Q.E.D."

Begin the proof now.
`;

    const {text} = await ai.generate({
      prompt: prompt,
      output: {
        format: 'text',
      },
    });

    return {proof: text};
  }
);

export async function generateProof(
  input: GenerateProofInput
): Promise<GenerateProofOutput> {
  const result = await generateProofFlow(input);
  return {proof: result.proof};
}
