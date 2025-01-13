import express from 'express';
import {
  getMovies,
  getMovieById,
  createMovieByName,
  updatedMovie,
  deleteMovie,
} from '../services/movieService.js';

import { handleValidationError } from '../middlewares/validationErrorMiddleware.js';

import { body } from 'express-validator';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { MOVIE_GENRE } from '../constants.js';
import { rateLimiter } from '../middlewares/ratelimiter.js';

const router = express.Router();

const validateMovieData = [
  body('movieName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Name must be a string and not empty'),
  body('movieDescription')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Description must be a string and not empty'),
  body('movieDuration')
    .isInt({ min: 0.0 })
    .withMessage('Duration must be a Positive'),
  body('movieRating')
    .isFloat({ min: 0.0, max: 10.0 })
    .withMessage('Rating must be between 0 and 10'),
  body('genre').isIn(MOVIE_GENRE).withMessage('Invalid Genre'),
];

router.get('/', rateLimiter, getMovies);
router.get('/:id', getMovieById);
router.post(
  '/',
  validateMovieData,
  handleValidationError,
  authMiddleware,
  createMovieByName
);
router.put('/:id', validateMovieData, handleValidationError, updatedMovie);
router.delete('/:id', deleteMovie);

export default router;
