// src/ai/flows/formalization-tool.ts
'use server';

/**
 * @fileOverview A tool that uses an LLM to determine if certain information will improve the clarity of the output for the user.
 *
 * - shouldIncludeInformation - A function that determines whether to include certain information in the output.
 * - ShouldIncludeInformationInput - The input type for the shouldIncludeInformation function.
 * - ShouldIncludeInformationOutput - The return type for the shouldIncludeInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ShouldIncludeInformationInputSchema = z.object({
  theorem: z.string().describe('The theorem being proven.'),
  proofLevel: z.enum(['semiformal', 'rigorous']).describe('The current level of formality of the proof.'),
  userBackground: z.string().describe('The user’s background in mathematics.'),
  informationType: z.string().describe('The type of information being considered for inclusion, e.g., \"historical context\", \"intuition behind the proof\", \"detailed explanation of a specific step\".'),
});
export type ShouldIncludeInformationInput = z.infer<typeof ShouldIncludeInformationInputSchema>;

const ShouldIncludeInformationOutputSchema = z.object({
  include: z.boolean().describe('Whether the information should be included.'),
  reason: z.string().describe('The reason for the decision.'),
});
export type ShouldIncludeInformationOutput = z.infer<typeof ShouldIncludeInformationOutputSchema>;

export async function shouldIncludeInformation(input: ShouldIncludeInformationInput): Promise<ShouldIncludeInformationOutput> {
  return shouldIncludeInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'shouldIncludeInformationPrompt',
  input: {schema: ShouldIncludeInformationInputSchema},
  output: {schema: ShouldIncludeInformationOutputSchema},
  prompt: `You are an AI assistant that helps decide whether certain information should be included in a mathematical proof presentation based on the user's background and the current formality level of the proof.

You will be given the following information:
- The theorem being proven: {{{theorem}}}
- The current level of formality of the proof: {{{proofLevel}}}
- The user's background in mathematics: {{{userBackground}}}
- The type of information being considered for inclusion: {{{informationType}}}

Based on this information, decide whether the information should be included. Provide a brief reason for your decision.

Respond in JSON format with the following schema:
{
  "include": boolean, // Whether the information should be included.
  "reason": string // The reason for the decision.
}
`,
});

const shouldIncludeInformationFlow = ai.defineFlow(
  {
    name: 'shouldIncludeInformationFlow',
    inputSchema: ShouldIncludeInformationInputSchema,
    outputSchema: ShouldIncludeInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
