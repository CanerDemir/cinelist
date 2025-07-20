export type MediaItem = {
  id: string;
  title: string;
  type: 'movie' | 'tv';
  poster: string;
  data_ai_hint?: string;
  year: string;
  director: string;
  actors: string[];
  imdbRating: string;
  genre: string[];
  plot: string;
  watched: boolean;
};
