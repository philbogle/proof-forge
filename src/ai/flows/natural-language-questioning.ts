// natural-language-questioning.ts
'use server';
/**
 * @fileOverview A natural language question answering AI agent for mathematical theorems.
 *
 * - answerQuestion - A function that answers user questions about a theorem.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {FormalityLevel} from '@/lib/types';
import {createStreamableValue} from 'ai/rsc';
import {StreamablePromise} from 'ai/rsc';

const ConversationTurnSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const AnswerQuestionInputSchema = z.object({
  theoremName: z.string().describe('The name of the theorem.'),
  theoremText: z.string().describe('The text of the theorem.'),
  question: z.string().describe('The user question about the theorem.'),
  formalityLevel: z
    .enum(['english', 'semiformal', 'rigorous'])
    .describe('The current formality level of the proof.'),
  proofSection: z.string().optional().describe('The specific section of the proof the user is currently viewing. This should be considered the primary context for the question.'),
  history: z.array(ConversationTurnSchema).optional().describe('The history of the conversation so far.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(
  input: AnswerQuestionInput
): Promise<StreamablePromise<string>> {
  const stream = createStreamableValue();
  (async () => {
    const result = await answerQuestionFlow(input);
    for await (const chunk of result.stream) {
      stream.update(chunk.text());
    }
    stream.done();
  })();
  return stream.value;
}

const prompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {schema: AnswerQuestionInputSchema},
  prompt: `You are an expert mathematician and a helpful AI assistant. Your goal is to answer the user's questions about a mathematical proof.

You should use the provided proof text and conversation history as the primary context. However, you are encouraged to draw upon your broad mathematical knowledge to provide deeper insights, clarify concepts, and offer explanations that may go beyond the literal text of the proof.

Answer clearly and concisely, adapting your explanation to the current formality level.

{{#if history}}
**Conversation History:**
{{#each history}}
User: {{{this.question}}}
You: {{{this.answer}}}
---
{{/each}}
{{/if}}

**Primary Context (Current Proof Section):**
---
{{{proofSection}}}
---

**Full Proof Context:**
---
{{{theoremText}}}
---

Theorem Name: {{{theoremName}}}
Current Formality Level: {{{formalityLevel}}}

User Question: {{{question}}}`,
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
  },
  async (input) => {
    return await prompt.stream(input);
  }
);
