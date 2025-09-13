// src/ai/flows/classify-intent-flow.ts
'use server';

/**
 * @fileOverview An AI flow for classifying user intent as a question or an edit request.
 *
 * - classifyIntent - A function that takes user input and determines the intent.
 * - ClassifyIntentInput - The input type for the classifyIntent function.
 * - ClassifyIntentOutput - The return type for the classifyIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ClassifyIntentInputSchema = z.object({
  text: z.string().describe('The user\'s input text.'),
});
export type ClassifyIntentInput = z.infer<typeof ClassifyIntentInputSchema>;

const ClassifyIntentOutputSchema = z.object({
  intent: z.enum(['question', 'edit']).describe("The user's intent. Is it a 'question' or an 'edit' request?"),
});
export type ClassifyIntentOutput = z.infer<typeof ClassifyIntentOutputSchema>;


const classifyIntentFlow = ai.defineFlow(
  {
    name: 'classifyIntentFlow',
    inputSchema: ClassifyIntentInputSchema,
    outputSchema: ClassifyIntentOutputSchema,
  },
  async (input) => {
    const prompt = `
You are an AI assistant that classifies user requests. Your task is to determine if the user's input is a 'question' or a request to 'edit' a document.

- A 'question' seeks information, clarification, or explanation. Examples: "What does this mean?", "Why is step 2 necessary?", "Can you explain the base case?".
- An 'edit' request asks for a change to be made to the document. Examples: "Make the first step more detailed.", "Fix the typo in the conclusion.", "Rephrase this sentence to be simpler."

User Input: "${input.text}"

Based on the input, classify the user's intent. Your response must be a JSON object with a single key "intent", whose value is either "question" or "edit".
`;
    const {output} = await ai.generate({
      prompt: prompt,
      output: {
        schema: ClassifyIntentOutputSchema,
      },
    });

    return output!;
  }
);

export async function classifyIntent(
  input: ClassifyIntentInput
): Promise<ClassifyIntentOutput> {
  const result = await classifyIntentFlow(input);
  return result;
}
