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
- **First Section Requirement:** The very first step of every proof (the content associated with \`<a id="step-1"></a>\`) MUST be a short, factual paragraph explaining the significance of the theorem and what it means. This should be a concise overview before the formal proof begins, written at the requested formality level.
- **IMPORTANT ANCHORS & HEADERS:** At the beginning of each distinct step, paragraph, or logical block of the proof, you MUST do two things:
  1. Insert an HTML anchor tag like \`<a id="step-N"></a>\`, where 'N' is a sequential 1-based integer (step-1, step-2, etc.).
  2. Immediately following the anchor, you MUST include a Markdown header for that step, like \`### Step N\`.
  This is critical for navigation and structure.
- For "informal": Provide a step-by-step proof using only plain English. Do not use mathematical notation or symbols.
- For "rigorous": Provide a traditional, formal, and rigorous mathematical proof.

${input.structuralProof ? `**IMPORTANT STRUCTURAL GUIDE:** You MUST follow the same logical structure and step numbering (for both the visible text and the \`<a id="step-N"></a>\` anchors and headers) as the provided proof below when you generate your new proof. This is critical for helping the user see how a proof is formalized across different levels.

**Existing Proof to Follow:**
---
${input.structuralProof}
---
` : ''}

- Your output must be in Markdown format.
- Always use rendered LaTeX for math: $formula$ for inline (using \\mathbf{} for vectors), and $$formula$$ for display equations. Critically, ensure no whitespace exists immediately inside delimiters (use $E=mc^2$, not $ E = mc^2 $). When display math ($$...$$) appears within lists, start it on a new line with zero leading indentation. Reserve code blocks (\`\`\`) strictly for programming code implementations, never for displaying mathematical formulas. Choose inline math for brevity/flow and display math for complex or emphasized equations, maintaining clean separation and standard paragraph spacing (one blank line after display math) for a professional, scientific document style.
- For "informal" formality, avoid math notation entirely.
- For "rigorous" formality, provide a full proof with all steps.
- At the end of rigorous proofs, include "Q.E.D."

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
