// src/ai/flows/edit-proof-flow.ts
'use server';

/**
 * @fileOverview An AI flow for editing a mathematical proof based on user instructions.
 *
 * - editProof - A function that takes a proof and a user's request and returns an edited proof.
 * - EditProofInput - The input type for the editProof function.
 * - EditProofOutput - The return type for the editProof function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const EditProofInputSchema = z.object({
  proof: z.string().describe('The original proof text in Markdown format.'),
  request: z.string().describe('The user\'s instructions for how to edit the proof.'),
  theoremName: z.string().describe('The name of the theorem the proof is for.'),
  formality: z.enum(['informalEnglish', 'semiFormal', 'rigorous']).describe('The formality level of the proof.'),
});
export type EditProofInput = z.infer<typeof EditProofInputSchema>;

const EditProofOutputSchema = z.object({
  editedProof: z.string().describe('The edited proof in Markdown format.'),
});
export type EditProofOutput = z.infer<typeof EditProofOutputSchema>;


const editProofFlow = ai.defineFlow(
  {
    name: 'editProofFlow',
    inputSchema: EditProofInputSchema,
    outputSchema: EditProofOutputSchema,
  },
  async (input) => {
    const prompt = `
You are an expert mathematician and a skilled editor. Your task is to edit a mathematical proof based on the user's request.

**Theorem Name:** ${input.theoremName}
**Formality Level:** ${input.formality}

**User's Edit Request:**
${input.request}

**Original Proof:**
---
${input.proof}
---

**Instructions:**
- Read the original proof and the user's request carefully.
- Generate a new version of the proof that incorporates the requested changes.
- **IMPORTANT ANCHORS:** You MUST preserve the HTML anchor tags like \`<a id="step-N"></a>\` from the original proof. Do not add new ones or renumber existing ones. This is critical for navigation.
- Your output must be in Markdown format, following the same styling and LaTeX conventions as the original proof.
- Ensure the final output is only the full, edited proof text.

Begin the edited proof now.
`;
    const {text} = await ai.generate({
      prompt: prompt,
      output: {
        format: 'text',
      },
    });

    return {editedProof: text};
  }
);

export async function editProof(
  input: EditProofInput
): Promise<EditProofOutput> {
  const result = await editProofFlow(input);
  return result;
}
