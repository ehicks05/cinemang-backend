import { AxiosError } from 'axios';
import tmdb from './tmdb';
import { Language } from './types/base';
import {
  PersonResponse,
  MovieResponse,
  GenreResponse,
  ProviderResponse,
  ShowResponse,
  SeasonResponse,
} from './types/responses';
import { logAxiosError } from './utils';

export const getMovie = async (id: number) => {
  try {
    const appends = ['releases', 'credits', 'watch/providers'];
    const config = {
      params: { append_to_response: appends.join(',') },
    };
    const result = await tmdb.get<MovieResponse>(`/movie/${id}`, config);
    return result.data;
  } catch (e) {
    logAxiosError(e as AxiosError);
  }
};

export const getShow = async (id: number) => {
  try {
    const appends = ['credits', 'watch/providers', 'content_ratings'];
    const config = {
      params: { append_to_response: appends.join(',') },
    };
    const result = await tmdb.get<ShowResponse>(`/tv/${id}`, config);
    return result.data;
  } catch (e) {
    logAxiosError(e as AxiosError);
  }
};

export const getSeason = async (showId: number, season: number) => {
  try {
    const appends = ['credits'];
    const config = {
      params: { append_to_response: appends.join(',') },
    };
    const path = `/tv/${showId}/season/${season}`;
    const result = await tmdb.get<SeasonResponse>(path, config);
    return result.data;
  } catch (e) {
    logAxiosError(e as AxiosError);
  }
};

export const getPerson = async (id: number) => {
  try {
    const subRequests = [''];
    const config = {
      params: { append_to_response: subRequests.join(',') },
    };
    const result = await tmdb.get<PersonResponse>(`/person/${id}`, config);
    return result.data;
  } catch (e) {
    logAxiosError(e as AxiosError);
  }
};

export const getMovieGenres = async () => {
  const result = await tmdb.get<GenreResponse>(`/genre/movie/list`);
  return result.data.genres;
};

export const getShowGenres = async () => {
  const result = await tmdb.get<GenreResponse>(`/genre/tv/list`);
  return result.data.genres;
};

export const getLanguages = async () => {
  const result = await tmdb.get<Language[]>(`/configuration/languages`);
  return result.data;
};

export const getProviders = async () => {
  const url = '/watch/providers/movie';
  const config = { params: { watch_region: 'US' } };
  const result = await tmdb.get<ProviderResponse>(url, config);
  return result.data.results;
};
