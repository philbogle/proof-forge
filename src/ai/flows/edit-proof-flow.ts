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
  formality: z.enum(['english', 'informal', 'rigorous']).describe('The formality level of the proof.'),
  proofSection: z.string().optional().describe('The specific section of the proof the user is currently viewing. The edit request likely pertains to this section.'),
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
You are an expert mathematician and a skilled editor. Your task is to edit a mathematical proof based on the user's request, while adhering to strict formatting guidelines.

**Theorem Name:** ${input.theoremName}
**Formality Level:** ${input.formality}

**User's Edit Request:**
${input.request}

**Context:** The user is likely requesting an edit to the following section of the proof:
---
${input.proofSection || 'No specific section provided.'}
---

**Full Original Proof:**
---
${input.proof}
---

**Instructions for Generating the Edited Proof:**
1.  **Incorporate the Edit:** Read the original proof and the user's request carefully. Generate a new version of the **entire proof** that incorporates the requested changes.
2.  **Preserve Anchors and Headers:** You MUST preserve the HTML anchor tags (e.g., \`<a id="step-N"></a>\`) and the Markdown headers (e.g., \`### N. Step Title\`) from the original proof. Do not add new ones, renumber them, or remove them. This is critical for navigation.
3.  **Maintain Formatting:** Your output must be in Markdown format, following the same styling and LaTeX conventions as the original proof.
4.  **Math Rendering:**
    - Always use rendered LaTeX for math: $formula$ for inline math and $$formula$$ for display equations.
    - **ALIGNED EQUATIONS**: For multi-step derivations or a sequence of logical steps, you MUST use the 'aligned' environment within display math blocks. For example:
      $$
      \\begin{aligned}
      A &= B \\\\
        &= C \\\\
        &= D
      \\end{aligned}
      $$
    - Do not use code blocks (\`\`\`) for mathematical formulas.
5.  **Output:** Ensure the final output is ONLY the full, edited proof text. Do not add any commentary before or after the proof.

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
