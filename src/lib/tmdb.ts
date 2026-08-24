import {
  Movie,
  TVShow,
  MovieDetails,
  TVShowDetails,
  TMDBResponse,
  SearchResult,
  Genre,
} from '@/types/tmdb';

const API_KEY = '895a21bd83a561eaf341c4eb47d6c972';
const BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: API_KEY!,
    ...params,
  });

  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${searchParams}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`TMDB API Error: ${response.status} for ${endpoint}`);
      return getFallbackForEndpoint<T>(endpoint);
    }

    return response.json();
  } catch (error) {
    console.error(`TMDB fetch failed for ${endpoint}:`, error);
    return getFallbackForEndpoint<T>(endpoint);
  }
}

function getFallbackForEndpoint<T>(endpoint: string): T {
  if (
    endpoint.includes('/trending/') ||
    endpoint.includes('/popular') ||
    endpoint.includes('/top_rated') ||
    endpoint.includes('/now_playing') ||
    endpoint.includes('/upcoming') ||
    endpoint.includes('/discover') ||
    endpoint.includes('/search') ||
    endpoint.includes('/recommendations') ||
    endpoint.includes('/similar')
  ) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    } as unknown as T;
  }
  return {} as unknown as T;
}

export async function getTrending(
  mediaType: 'all' | 'movie' | 'tv' = 'all',
  timeWindow: 'day' | 'week' = 'day'
): Promise<TMDBResponse<Movie | TVShow>> {
  return fetchTMDB(`/trending/${mediaType}/${timeWindow}`);
}

export async function getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB('/movie/popular', { page: String(page) });
}

export async function getPopularTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB('/tv/popular', { page: String(page) });
}

export async function getTopRatedMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB('/movie/top_rated', { page: String(page) });
}

export async function getTopRatedTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB('/tv/top_rated', { page: String(page) });
}

export async function getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB('/movie/now_playing', { page: String(page) });
}

export async function getUpcomingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB('/movie/upcoming', { page: String(page) });
}

export async function getAiringTodayTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB('/tv/airing_today', { page: String(page) });
}

export async function getOnTheAirTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB('/tv/on_the_air', { page: String(page) });
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return fetchTMDB(`/movie/${id}`, { append_to_response: 'credits,similar,recommendations' });
}

export async function getTVShowDetails(id: number): Promise<TVShowDetails> {
  return fetchTMDB(`/tv/${id}`, { append_to_response: 'credits,similar,recommendations' });
}

export async function searchMulti(
  query: string,
  page: number = 1
): Promise<TMDBResponse<SearchResult>> {
  return fetchTMDB('/search/multi', { query, page: String(page) });
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB('/search/movie', { query, page: String(page) });
}

export async function searchTVShows(
  query: string,
  page: number = 1
): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB('/search/tv', { query, page: String(page) });
}

export async function getMovieGenres(): Promise<{ genres: Genre[] }> {
  return fetchTMDB('/genre/movie/list');
}

export async function getTVGenres(): Promise<{ genres: Genre[] }> {
  return fetchTMDB('/genre/tv/list');
}

export async function discoverMovies(
  params: Record<string, string> = {},
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB('/discover/movie', { ...params, page: String(page) });
}

export async function discoverTVShows(
  params: Record<string, string> = {},
  page: number = 1
): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB('/discover/tv', { ...params, page: String(page) });
}

export async function getPersonDetails(id: number): Promise<PersonDetails> {
  return fetchTMDB(`/person/${id}`, { append_to_response: 'combined_credits,images' });
}

export async function getMoviesByCompany(
  companyId: number,
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB('/discover/movie', { with_companies: String(companyId), page: String(page) });
}

export async function getTVByNetwork(
  networkId: number,
  page: number = 1
): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB('/discover/tv', { with_networks: String(networkId), page: String(page) });
}

export async function getMoviesByGenre(
  genreId: number,
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB('/discover/movie', { with_genres: String(genreId), page: String(page) });
}

export async function getTVByGenre(
  genreId: number,
  page: number = 1
): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB('/discover/tv', { with_genres: String(genreId), page: String(page) });
}

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '/placeholder.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(path: string | null): string {
  return getImageUrl(path, 'original');
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  images?: {
    profiles: { file_path: string; aspect_ratio: number }[];
  };
  combined_credits?: {
    cast: Array<{
      id: number;
      title?: string;
      name?: string;
      poster_path: string | null;
      character: string;
      media_type: 'movie' | 'tv';
      vote_average: number;
      release_date?: string;
      first_air_date?: string;
    }>;
  };
}

export const MOVIE_STUDIOS = [
  { id: 420, name: 'Marvel Studios', logo: '/hUzeosd33nzE5MCNsZxCGEKTXaQ.png', preserveColor: true },
  { id: 7135, name: 'Sun Pictures', logo: '/8KsxNPnM0y9Dk3fOcHqKUDw2XUs.png', preserveColor: true },
  { id: 55821, name: '2D Entertainment', logo: '/3H2tgEpC3pRMMoyKEr6YHENgI8E.png', preserveColor: true },
  { id: 35124, name: 'Lyca Productions', logo: '/clz3r0SYNudiGRB10yjvU9ZSgP8.png', preserveColor: true },
  { id: 77110, name: 'Sree Gokulam Movies', logo: '/aveCRL8JTDHiH8gZWUafwO74WuK.png', preserveColor: true },
  { id: 93129, name: 'Ashiq Usman Productions', logo: '/viOe7LjhByej4jThVYcwp9SVNfM.png', preserveColor: false },
  { id: 127162, name: 'Wayfarer Films', logo: '/77iHxiuXJYTXKU4PDQmtRQe3DJx.png', preserveColor: true },
  { id: 16401, name: 'Aashirvad Cinemas', logo: '/khS7G0KzBoCYcLs4xuNjpuZjntR.png', preserveColor: true },
  { id: 75010, name: 'Trident Arts', logo: '/xryPUTxib0ykcr5bwiLUX8u7b4d.png', preserveColor: false },
  { id: 163988, name: 'Mammootty Kampany', logo: '/2Z9qU90XOHAp5DsbH3eEnawlDm4.png', preserveColor: false },
  { id: 99135, name: 'Moonshot Entertainments', logo: '/7vy2vq8P6NmoI6wzwp6YBAgKTUb.png', preserveColor: true },
  { id: 16397, name: 'E4 Entertainments', logo: '/uH4dofySc9WcRnXjpTelKPH4oFh.png', preserveColor: true },
  { id: 16429, name: 'Dream Warrior Pictures', logo: '/8VoXlyno166HSIwMilMLtmb9EBk.png', preserveColor: true },
  { id: 146, name: 'Handmade Films', logo: '/lGxFGh37J2B2NYNNS3eNlVveeFP.png', preserveColor: true },
  { id: 26968, name: 'Grass Root Film Company', logo: '/k5pMGQkP6j62wmlNGSpPf5Formo.png', preserveColor: true },
  { id: 95823, name: 'Stone Bench Creations', logo: '/guoPHeFGMZSXvMnF8zNnOgWPuGO.png', preserveColor: true },
  { id: 106780, name: 'Sivakarthikeyan Productions', logo: '/sX9xyT6EqAmRedxXFRuv6INuDmm.png', preserveColor: true },
  { id: 174, name: 'Warner Bros', logo: '/zhD3hhtKB5qyv7ZeL4uLpNxgMVU.png', preserveColor: true },
  { id: 33, name: 'Universal Pictures', logo: '/8lvHyhjr8oUKOOy2dKXoALWKdp0.png', preserveColor: false },
  { id: 2, name: 'Walt Disney Pictures', logo: '/wdrCwmRnLFJhEoH8GSfymY85KHT.png', preserveColor: false },
  { id: 4, name: 'Paramount', logo: '/gz66EfNoYPqHTYI4q9UEN4CbHRc.png', preserveColor: false },
  { id: 7, name: 'DreamWorks', logo: '/vru2SssLX3FPhnKZGtYw00pVIS9.png', preserveColor: false },
  { id: 25, name: '20th Century Studios', logo: '/qZCc1lty5FzX30aOCVRBLzaVmcp.png', preserveColor: false },
  { id: 34, name: 'Sony Pictures', logo: '/GagSvqWlyPdkFHMfQ3pNq6ix9P.png', preserveColor: false },
  { id: 21, name: 'Metro-Goldwyn-Mayer', logo: '/usUnaYV6hQnlVAXP6r4HwrlLFPG.png', preserveColor: true },
  { id: 3, name: 'Pixar', logo: '/1TjvGVDMYsj6JBxOAkUHpPEwLf7.png', preserveColor: false },
  { id: 521, name: 'Lionsgate', logo: '/cisLn1YAUuptXVBa0xjq7ST9cH0.png', preserveColor: false },
  { id: 5, name: 'Columbia Pictures', logo: '/71BqEFAF4V3qjjMPCpLuyJFB9A.png', preserveColor: false },
  { id: 12, name: 'New Line Cinema', logo: '/iaYpEp3LQmb8AfAtmTvpqd4149c.png', preserveColor: false },
  { id: 9993, name: 'DC Studios', logo: '/2Tc1P3Ac8M479naPp1kYT3izLS5.png', preserveColor: false },
  { id: 41077, name: 'A24', logo: '/1ZXsGaFPgrgS6ZZGS37AqD5uU12.png', preserveColor: false },
  { id: 127928, name: '20th Century', logo: '/h0rjX5vjW5r8yEnUBStFarjcLT4.png', preserveColor: false },
  { id: 923, name: 'Legendary Pictures', logo: '/5UQsZrfbfG2dYJbx8DxfoTr2Bvu.png', preserveColor: false },
  { id: 923, name: 'Lucasfilm', logo: '/o86DbpburjxrqAzEDhXZcyE8pDb.png', preserveColor: false },
];

export const TV_NETWORKS = [
  { id: 213, name: 'Netflix', logo: '/wwemzKWzjKYJFfCeiB57q3r4Bcm.png', preserveColor: true },
  { id: 2739, name: 'Disney+', logo: '/gJ8VX6JSu3ciXHuC2dDGAo2lvwM.png', preserveColor: false },
  { id: 8036, name: 'JioHotstar', logo: '/tBOkiKKBZhiqP8vchvwfpbfNztx.png', preserveColor: true },
  { id: 2590, name: 'ZEE5', logo: '/q6meEcCbZXTb1cDbJ7bl1ITorAa.png', preserveColor: true },
  { id: 2902, name: 'Ullu', logo: '/v5YSGiZxWsQTRQaijkEcUSSBFeQ.png', preserveColor: true },
  { id: 2112, name: 'ALTBalaji', logo: '/zZ8gquIrrBvDGyMMcsSgArRuzyh.png', preserveColor: true }, 
  { id: 49, name: 'HBO', logo: '/tuomPhY2UtuPTqqFnKMVHvSb724.png', preserveColor: false },
  { id: 1024, name: 'Amazon', logo: '/ifhbNuuVnlwYy5oXA5VIb2YR8AZ.png', preserveColor: true },
  { id: 2552, name: 'Apple TV+', logo: '/4KAy34EHvRM25Ih8wb82AuGU7zJ.png', preserveColor: false },
  { id: 67, name: 'Showtime', logo: '/Allse9kbjiP6ExaQrnSpIhkurEi.png', preserveColor: true },
  { id: 16, name: 'CBS', logo: '/nm8d7P7MJNiBLdgIzUK0gkuEA4r.png', preserveColor: false },
  { id: 6, name: 'NBC', logo: '/o3OedEP0f9mfZr33jz2BfXOUK5.png', preserveColor: false },
  { id: 19, name: 'FOX', logo: '/1DSpHrWyOORkL9N2QHX7Adt31mQ.png', preserveColor: false },
  { id: 2, name: 'ABC', logo: '/ndAvF4JLsliGreX87jAc9GdjmJY.png', preserveColor: false },
  { id: 3186, name: 'Hulu', logo: '/pqUTCleNUiTLAVlelGxUgWn1ELh.png', preserveColor: true },
  { id: 4, name: 'BBC One', logo: '/mVn7xESaTNmjBUyUtGNvDQd3CT1.png', preserveColor: false },
  { id: 1, name: 'Fuji TV', logo: '/yS5UJjsSdZXML0YikWTYYHLPKhQ.png', preserveColor: false },
  { id: 174, name: 'AMC', logo: '/pmvRmATOCaDykE6JrVoeYxlFHw3.png', preserveColor: false },
  { id: 318, name: 'Starz', logo: '/8GJjw3HHsAJYwIWKIPBPfqMxlEa.png', preserveColor: false },
  { id: 4353, name: 'Discovery+', logo: '/1D1bS3Dyw4ScYnFWTlBOvJXC3nb.png', preserveColor: true }, 
  { id: 56, name: 'Cartoon Network', logo: '/c5OC6oVCg6QP4eqzW6XIq17CQjI.png', preserveColor: false },
  { id: 80, name: 'Adult Swim', logo: '/9AKyspxVzywuaMuZ1Bvilu8sXly.png', preserveColor: false },
  { id: 359, name: 'Cinemax', logo: '/6mSHSquNpfLgDdv6VnOOvC5Uz2h.png', preserveColor: true },
  { id: 3919, name: 'Hotstar', logo: '/eBa3TplonEHlR6S2wjJ616KnwIh.png', preserveColor: true },
  { id: 8303, name: 'MUBI', logo: '/ltHubSF7YTefDDE62BNlxROYnxc.png', preserveColor: false },
  { id: 5187, name: 'Tubi', logo: '/8OAFRLPQ4w888UDkDtnXpdnRfEQ.png', preserveColor: true },
  { id: 3245, name: 'Pluto TV', logo: '/6xI75dFULiEks0Dqm3Uag7CiC29.png', preserveColor: false },
  { id: 2869, name: 'Viaplay', logo: '/zs2yhnfMzRLoRtZgGRf41mqrLL0.png', preserveColor: false },
  { id: 3353, name: 'Peacock', logo: '/gIAcGTjKKr0KOHL5s4O36roJ8p7.png', preserveColor: false },
  { id: 13, name: 'Nick', logo: '/ikZXxg6GnwpzqiZbRPhJGaZapqB.png', preserveColor: true },
  { id: 453, name: 'Hbo Max', logo: '/6mSHSquNpfLgDdv6VnOOvC5Uz2h.png', preserveColor: true },
];
