'use server';
/**
 * @fileOverview An AI Waste Solutions Architect agent that recommends optimal sanitation systems and schedules.
 *
 * - getWasteSolutionArchitectRecommendation - A function that handles the recommendation process.
 * - WasteSolutionArchitectInput - The input type for the getWasteSolutionArchitectRecommendation function.
 * - WasteSolutionArchitectOutput - The return type for the getWasteSolutionArchitectRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WasteSolutionArchitectInputSchema = z.object({
  businessSector: z
    .string()
    .describe(
      'The business sector of the client (e.g., hospital, school, hotel, residential, industrial).'
    ),
  capacityData: z
    .string()
    .describe(
      'Data related to the client\'s capacity or size (e.g., "50 beds", "300 students", "100 rooms", "daily wastewater volume in cubic meters").'
    ),
});
export type WasteSolutionArchitectInput = z.infer<
  typeof WasteSolutionArchitectInputSchema
>;

const WasteSolutionArchitectOutputSchema = z.object({
  recommendedSystem: z
    .string()
    .describe('The optimal sanitation system recommended for the client.'),
  recommendedSchedule: z
    .string()
    .describe(
      'The recommended maintenance or collection schedule for the sanitation system.'
    ),
  justification: z
    .string()
    .describe('A brief explanation for the recommendations.'),
});
export type WasteSolutionArchitectOutput = z.infer<
  typeof WasteSolutionArchitectOutputSchema
>;

export async function getWasteSolutionArchitectRecommendation(
  input: WasteSolutionArchitectInput
): Promise<WasteSolutionArchitectOutput> {
  return wasteSolutionArchitectRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wasteSolutionArchitectPrompt',
  input: {schema: WasteSolutionArchitectInputSchema},
  output: {schema: WasteSolutionArchitectOutputSchema},
  prompt: `You are an AI Waste Solutions Architect for SANEX Company Ltd, a leading liquid waste management solution provider in Rwanda.
Your goal is to provide optimal sanitation system and schedule recommendations based on the client's business sector and capacity data.

Consider SANEX Company Ltd's services:
- Liquid Waste Collection and Transport: Modern vacuum trucks for efficient waste collection.
- Decentralized Wastewater Treatment Systems (DWTS): Advanced systems for clean water reuse using activated sludge technology.
- Maintenance & Consultancy: Quarterly maintenance services and expert advice.
- Septic Tank Emptying and Maintenance: Affordable and efficient services.
- Industrial and Commercial Waste Management: Tailored solutions for industries, hotels, schools, and hospitals.

Based on the following information, recommend an optimal sanitation system and a suitable maintenance/collection schedule. Provide a clear justification for your recommendations.

Business Sector: {{{businessSector}}}
Capacity Data: {{{capacityData}}}`,
});

const wasteSolutionArchitectRecommendationFlow = ai.defineFlow(
  {
    name: 'wasteSolutionArchitectRecommendationFlow',
    inputSchema: WasteSolutionArchitectInputSchema,
    outputSchema: WasteSolutionArchitectOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
