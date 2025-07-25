'use server';
/**
 * @fileOverview A movie search AI agent.
 *
 * - searchMovies - A function that handles searching for movies.
 * - SearchMoviesInput - The input type for the searchMovies function.
 * - SearchMoviesOutput - The return type for the searchMovies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { v4 as uuidv4 } from 'uuid';

const SearchMoviesInputSchema = z.object({
  query: z.string().describe('The search query for the movie or TV series.'),
});
export type SearchMoviesInput = z.infer<typeof SearchMoviesInputSchema>;

const MovieResultSchema = z.object({
    id: z.string().describe('A unique ID for the movie or TV series, preferably from a database like IMDb (e.g., tt0111161).'),
    title: z.string().describe('The full title of the movie or TV series.'),
    type: z.enum(['movie', 'tv']).describe("The type of media, either 'movie' or 'tv' series."),
    year: z.string().describe('The release year or range of years for a TV series.'),
    director: z.string().describe('The director or creator of the work.'),
    actors: z.array(z.string()).describe('A list of the main actors.'),
    imdbRating: z.string().describe('The IMDb rating, as a string.'),
    genre: z.array(z.string()).describe('A list of genres.'),
    plot: z.string().describe('A brief summary of the plot.'),
    poster: z.string().describe('A publicly accessible URL for the movie poster image. Prioritize finding a URL from http://www.impawards.com. If no poster is available, use "https://placehold.co/300x450.png".'),
});

const SearchMoviesOutputSchema = z.array(MovieResultSchema);
export type SearchMoviesOutput = z.infer<typeof SearchMoviesOutputSchema>;


export async function searchMovies(input: SearchMoviesInput): Promise<SearchMoviesOutput> {
  const result = await searchMoviesFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'searchMoviesPrompt',
  input: {schema: SearchMoviesInputSchema},
  output: {schema: SearchMoviesOutputSchema},
  prompt: `You are a movie and TV show database expert.
  
  A user will provide a search query. Find up to 5 of the most relevant movies or TV shows matching this query.
  
  For each result, provide the requested information. Make sure to accurately identify if it's a "movie" or a "tv" series. 
  
  It is very important to find a real, publicly accessible URL for the poster image. Prioritize finding a poster from http://www.impawards.com. If you cannot find a poster from that site or any other, you must use "https://placehold.co/300x450.png" as the poster URL.
  
  The ID should be the IMDb ID.

  User Query: {{{query}}}`,
});

const searchMoviesFlow = ai.defineFlow(
  {
    name: 'searchMoviesFlow',
    inputSchema: SearchMoviesInputSchema,
    outputSchema: SearchMoviesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output || [];
  }
);
