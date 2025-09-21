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
import { FormalityLevel } from '@/lib/types';

const EditProofInputSchema = z.object({
  proof: z.string().describe('The original proof text in Markdown format.'),
  request: z.string().describe('The user\'s instructions for how to edit the proof.'),
  theoremName: z.string().describe('The name of the theorem the proof is for.'),
  currentFormality: z.enum(['english', 'semiformal', 'rigorous']).describe('The formality level of the proof the user is currently viewing.'),
  proofSection: z.string().optional().describe('The specific section of the proof the user is currently viewing. The edit request likely pertains to this section.'),
});
export type EditProofInput = z.infer<typeof EditProofInputSchema>;

const EditProofOutputSchema = z.object({
  editedProof: z.string().describe('The edited proof in Markdown format.'),
  summary: z.string().describe('A brief summary of the changes made and their benefits.'),
  editedFormality: z.enum(['english', 'semiformal', 'rigorous']).describe('The formality level of the proof that was edited.'),
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
You are an expert mathematician and a skilled editor. Your task is to edit a mathematical proof based on the user's request, while adhering to strict formatting guidelines. After editing, you will provide the full edited proof, the formality level you edited, and a short summary of what you changed.

**Theorem Name:** ${input.theoremName}
**Current Formality Level (Default):** ${input.currentFormality}

**User's Edit Request:**
${input.request}

**Context:** The user is likely requesting an edit to the following section of the proof:
---
${input.proofSection || 'No specific section provided.'}
---

**Full Original Proof (at the current formality level):**
---
${input.proof}
---

**Instructions:**
1.  **Determine Target Formality:** Analyze the user's request. Does it explicitly mention a formality level (e.g., "in the rigorous proof...", "make the English version simpler")?
    - If a formality level is mentioned, that is your **target formality**.
    - If no formality level is mentioned, your **target formality** is the current level: \`${input.currentFormality}\`.
2.  **Incorporate the Edit:** Read the original proof and the user's request carefully. Generate a new version of the **entire proof** for the **target formality** that incorporates the requested changes. Even if the user requests an edit for a different formality level, you are only provided the proof for the current level as context. You must generate the new proof from scratch if the target formality is different.
3.  **Preserve Headers:** You MUST preserve the Markdown headers (e.g., \`### N. Step Title\`) from the original proof if possible. Do not add new ones, renumber them, or remove them unless the edit fundamentally requires it. This is critical for navigation.
4.  **Maintain Formatting:** Your output must be in Markdown format, following the same styling and LaTeX conventions as the original proof.
5.  **Handle Long Definitions:** If you are adding or expanding on a definition and it becomes lengthy (more than a sentence or two), use the '<details><summary>...</summary>...</details>' syntax to create a collapsible block. For example:
<details>
<summary>Definition: Set</summary>
A set is a well-defined collection of distinct objects, considered as an object in its own right.
</details>
6.  **Embed YouTube Videos:** If the user's request includes a YouTube URL, you MUST embed it as an iframe. Identify the video ID from the URL (e.g., from \`https://www.youtube.com/watch?v=VIDEO_ID\` or \`https://youtu.be/VIDEO_ID\`) and use the following responsive HTML structure. Place it on its own line with blank lines before and after.

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

7.  **Generate Summary:** After generating the proof, create a brief, one or two-sentence summary of the edit you performed and its likely benefit to the user.
8.  **Output JSON:** Your final output must be a single JSON object with three keys: "editedProof" (containing the full new proof text), "summary" (containing your summary sentence), and "editedFormality" (containing the target formality level you identified). Do not add any other commentary.

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
  return { editedProof: result.editedProof, summary: result.summary, editedFormality: result.editedFormality };
}
