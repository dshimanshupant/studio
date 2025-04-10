// initial-prompt-suggestions.ts
'use server';

/**
 * @fileOverview Provides initial prompt suggestions for new users.
 *
 * - getInitialPrompts - A function that returns a list of suggested prompts.
 * - InitialPromptsInput - The input type for the getInitialPrompts function (empty).
 * - InitialPromptsOutput - The return type for the getInitialPrompts function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const InitialPromptsInputSchema = z.object({});
export type InitialPromptsInput = z.infer<typeof InitialPromptsInputSchema>;

const InitialPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('A list of suggested prompts.'),
});
export type InitialPromptsOutput = z.infer<typeof InitialPromptsOutputSchema>;

export async function getInitialPrompts(input: InitialPromptsInput): Promise<InitialPromptsOutput> {
  return initialPromptSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'initialPromptSuggestionsPrompt',
  input: {
    schema: z.object({}),
  },
  output: {
    schema: z.object({
      prompts: z.array(z.string()).describe('A list of suggested prompts.'),
    }),
  },
  prompt: `You are an AI assistant that provides initial prompt suggestions to new users of a language model application.

  Provide a diverse array of prompts to showcase the capabilities of the application.

  Return a JSON object with a "prompts" key containing an array of strings.

  Example:
  {
    "prompts": [
      "Summarize the plot of Hamlet.",
      "Write a poem about the ocean.",
      "Translate \"Hello, world!\" into Spanish.",
      "What are the main differences between Javascript and Python?",
      "Explain the theory of relativity in simple terms."
    ]
  }
  `
});

const initialPromptSuggestionsFlow = ai.defineFlow<
  typeof InitialPromptsInputSchema,
  typeof InitialPromptsOutputSchema
>({
  name: 'initialPromptSuggestionsFlow',
  inputSchema: InitialPromptsInputSchema,
  outputSchema: InitialPromptsOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
