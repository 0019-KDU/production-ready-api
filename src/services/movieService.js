import {
  getAllMovies,
  getSingleMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
} from '../repositories/moviesRepository.js';

import {
  getDataFromRedis,
  setDataToRedis,
  invalidKey,
} from '../lib/redisHelper.js';

import { validationResult } from 'express-validator';

const REDIS_KEY = 'movies';
const REDIS_CACHE = 3600;

export const getMovies = async (req, res) => {
  const resultFromRedis = await getDataFromRedis(REDIS_KEY);
  if (resultFromRedis) {
    console.log('Found data from Redis:', REDIS_KEY);
    res.status(200).json(resultFromRedis);
    return;
  }

  const result = await getAllMovies();
  console.log('Fetching data from database', result);
  setDataToRedis(REDIS_KEY, result, REDIS_CACHE);
  res.status(200).json(result);
};

export const getMovieById = async (req, res) => {
  const id = req.params?.id ?? 0;
  const resultFromRedis = await getDataFromRedis(REDIS_KEY);
  if (resultFromRedis) {
    console.log('Found data from redis:', resultFromRedis);
    const movie = resultFromRedis?.find((result) => result?.id === id);
    res.status(200).json(movie);
    return;
  }

  const movie = await getSingleMovieById(id);
  if (!movie) {
    console.log('Movie not found in database');
    res.status(404).json({ message: 'Movie not found' });
    return;
  }
  console.log('Fetching data from database:', movie);
  res.status(200).json(movie);
};

export const createMovieByName = async (req, res) => {
  try {
    console.log('Received movie object:', req.body);

    const movieObj = req?.body ?? {};
    const result = await createMovie(movieObj);

    // Invalidate the Redis key if required
    await invalidKey(REDIS_KEY);

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating movie:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updatedMovie = async (req, res) => {
  const id = req?.params?.id ?? 0;
  const movieObj = req?.body ?? {};
  const result = await updateMovieById(id, movieObj);
  if (!result) {
    console.log('Movie not found in database');
    res.status(404).json({ message: 'Movie not found' });
    return;
  }
  await invalidKey(REDIS_KEY);
  res.status(200).json(result);
};

export const deleteMovie = async (req, res) => {
  const id = req?.params.id ?? 0;
  const status = await deleteMovieById(id);
  if (!status) {
    console.log('Movie not found in database');
    res.status(404).json({ message: 'Movie not found' });
    return;
  }
  await invalidKey(REDIS_KEY);
  res.status(204).json();
};
