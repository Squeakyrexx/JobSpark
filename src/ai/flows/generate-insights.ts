'use server';

/**
 * @fileOverview Generates insights about job postings.
 *
 * - generateInsights - A function that handles the generation of insights from job data.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The return type for the generateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobSchema = z.object({
  job_title: z.string(),
  company: z.string(),
  location: z.string(),
  salary: z.string(),
  requirements: z.array(z.string()),
});

const GenerateInsightsInputSchema = z.object({
  jobs: z.array(JobSchema).describe('An array of job postings to analyze.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  topSkills: z.array(z.string()).describe('The most common skills across all job postings.'),
  commonEducationRequirements: z
    .array(z.string())
    .describe('Common education requirements for the job postings.'),
  salaryTrends: z.string().describe('A summary of salary trends across the job postings.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `You are an expert career advisor, skilled at gleaning insights from job descriptions.

  Analyze the following job postings and identify:
  1.  The most common skills required across all jobs.
  2.  Common education requirements.
  3.  A summary of salary trends.

  Job Postings:
  {{#each jobs}}
  Job Title: {{job_title}}
  Company: {{company}}
  Location: {{location}}
  Salary: {{salary}}
  Requirements: {{#each requirements}}- {{this}}\n{{/each}}
  \n---\n{{/each}}
  \n  Present the insights in a concise manner.
  `,
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
