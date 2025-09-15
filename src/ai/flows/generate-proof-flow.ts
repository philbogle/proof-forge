'use server';
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type {GenerateProofOutput, GenerateProofInput} from '@/lib/types';
import {GenerateProofInputSchema} from '@/lib/schemas';
import { PROOF_FORMATTING_INSTRUCTIONS } from '../prompts';

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
**Formality Level:** ${input.formality}
${input.userBackground ? `**Target Audience Background:** ${input.userBackground}` : ''}

**Instructions:**
- **First Section Requirement:** The very first step of every proof (the content associated with the first \`### 1. ...\` header) MUST state the theorem, give a brief summary of why it matters, and outline the strategy for proving it. This should be done at the appropriate level of formality.
- For "english": Provide a step-by-step intuitive explanation. Use absolutely no math notation except very simple things like $x$ and $A(x)$. Explain everything in plain English, to someone with high-school level math background. **When introducing a mathematical term, please provide a brief, one-sentence definition.**
- For "semiformal": Provide a step-by-step proof but allow for intuition and non-rigorous shortcuts. Use math notation for mathematical concepts where it aids clarity. The formulas should not be overly complex. **When introducing a potentially unfamiliar mathematical term, please provide a brief, one-sentence definition.**
- For "rigorous": Provide a traditional, formal, and rigorous mathematical proof.

${input.structuralProof ? `**IMPORTANT STRUCTURAL GUIDE:** You MUST follow the same logical structure and step numbering (for both the visible text and the Markdown headers) as the provided proof below when you generate your new proof. This is critical for helping the user see how a proof is formalized across different levels.

**Existing Proof to Follow:**
---
${input.structuralProof}
---
` : ''}

**Formatting Rules:**
${PROOF_FORMATTING_INSTRUCTIONS}
- For "rigorous" proofs, provide a full proof with all steps.
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
