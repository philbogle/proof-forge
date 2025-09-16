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
import { PROOF_FORMATTING_INSTRUCTIONS } from '../prompts';

const EditProofInputSchema = z.object({
  proof: z.string().describe('The original proof text in Markdown format.'),
  request: z.string().describe('The user\'s instructions for how to edit the proof.'),
  theoremName: z.string().describe('The name of the theorem the proof is for.'),
  formality: z.enum(['english', 'semiformal', 'rigorous']).describe('The formality level of the proof.'),
  proofSection: z.string().optional().describe('The specific section of the proof the user is currently viewing. The edit request likely pertains to this section.'),
});
export type EditProofInput = z.infer<typeof EditProofInputSchema>;

const EditProofOutputSchema = z.object({
  editedProof: z.string().describe('The edited proof in Markdown format.'),
  summary: z.string().describe('A brief summary of the changes made and their benefits.'),
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
You are an expert mathematician and a skilled editor. Your task is to edit a mathematical proof based on the user's request, while adhering to strict formatting guidelines. After editing, you will provide the full edited proof and a short summary of what you changed.

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

**Instructions:**
1.  **Incorporate the Edit:** Read the original proof and the user's request carefully. Generate a new version of the **entire proof** that incorporates the requested changes.
2.  **Preserve Headers:** You MUST preserve the Markdown headers (e.g., \`### N. Step Title\`) from the original proof. Do not add new ones, renumber them, or remove them. This is critical for navigation.
3.  **Maintain Formatting:** Your output must be in Markdown format, following the same styling and LaTeX conventions as the original proof.
4.  **Handle Long Definitions:** If you are adding or expanding on a definition and it becomes lengthy (more than a sentence or two), use the HTML <details> and <summary> tags to create a collapsible block. The <summary> should contain the term being defined.
5.  **Embed YouTube Videos:** If the user's request includes a YouTube URL, you MUST embed it as an iframe. Identify the video ID from the URL (e.g., from \`https://www.youtube.com/watch?v=VIDEO_ID\` or \`https://youtu.be/VIDEO_ID\`) and use the following responsive HTML structure. Place it on its own line with blank lines before and after.

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto; margin-bottom: 1rem; margin-top: 1rem;">
  <iframe
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    src="https://www.youtube.com/embed/VIDEO_ID"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    title="Embedded YouTube video">
  </iframe>
</div>

6.  **Generate Summary:** After generating the proof, create a brief, one or two-sentence summary of the edit you performed and its likely benefit to the user. For example: "I've expanded on the explanation for the base case to make the induction clearer." or "I've corrected the algebraic manipulation in step 3 to ensure the derivation is accurate."
7.  **Output JSON:** Your final output must be a single JSON object with two keys: "editedProof" (containing the full new proof text) and "summary" (containing your summary sentence). Do not add any other commentary.

**Formatting Rules for the Proof:**
${PROOF_FORMATTING_INSTRUCTIONS}

Begin your JSON output now.
`;
    const {output} = await ai.generate({
      prompt: prompt,
      output: {
        schema: EditProofOutputSchema,
      },
    });

    return output!;
  }
);

export async function editProof(
  input: EditProofInput
): Promise<EditProofOutput> {
  const result = await editProofFlow(input);
  return result;
}
