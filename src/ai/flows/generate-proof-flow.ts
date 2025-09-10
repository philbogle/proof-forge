'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { GenerateProofOutput, GenerateProofInput } from '@/lib/types';
import { GenerateProofInputSchema } from '@/lib/schemas';

// This internal flow will return the raw ReadableStream.
const generateProofFlow = ai.defineFlow(
  {
    name: 'generateProofFlow',
    inputSchema: GenerateProofInputSchema,
    // The output schema is set to any because we are returning a raw stream,
    // which Genkit will handle.
    outputSchema: z.any(),
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

    const { stream } = await ai.generate({
      prompt: prompt,
      output: {
        format: 'text',
      },
      stream: true,
    });
    
    // The flow returns the raw stream.
    return stream;
  }
);


// This is the exported server action that the client calls.
// It calls the internal flow and wraps the result in the expected object shape.
export async function generateProof(
  input: GenerateProofInput,
): Promise<GenerateProofOutput> {
  const stream = await generateProofFlow(input);
  // We wrap the stream in an object to match the client's expectation.
  return { proofStream: stream as ReadableStream<string> };
}
