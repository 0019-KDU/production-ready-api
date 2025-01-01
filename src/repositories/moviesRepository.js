import Movie from "./schemas/moviesSchema.js";
import mongoose from "mongoose";

export const getAllMovies = async () => {
  const result = await Movie.find()
    .populate("producer", "-_id -role")
    .populate("director", "-_id -role")
    .populate("actors", "-_id -role");

  if (!result) {
    return null;
  }

  return result;
};

export const getSingleMovieById = async (movieId) => {
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    console.log("Invalid object id", movieId);
    return null;
  }
  const result = await Movie.findById(movieId)
    .populate("producer", "-_id -role")
    .populate("director", "-_id -role")
    .populate("actors", "-_id -role");

  if (!result) {
    return null;
  }

  return result;
};

export const createMovie = async (movieObj) => {
  const newMovie = new Movie(movieObj);
  const result = await newMovie.save();

  if (!result) {
    return null;
  }

  return result;
};

export const updateMovieById = async (movieId, movieObj) => {
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    console.log("Invalid object id", movieId);
    return null;
  }

  const result = await Movie.findByIdAndUpdate(movieId, movieObj, {
    new: true,
  });

  if (!result) {
    return null;
  }

  return result;
};

export const deleteMovieById = async (movieId) => {
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    console.log("Invalid object id", movieId);
    return null;
  }

  const result = await Movie.findByIdAndDelete(movieId);

  if (!result) {
    return null;
  }

  return result;
};
