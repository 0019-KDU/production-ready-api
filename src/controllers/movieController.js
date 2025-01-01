import express from "express";
import {
  getMovies,
  getMovieById,
  createMovieByName,
  updatedMovie,
  deleteMovie,
} from "../services/movieService.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", createMovieByName);
router.put("/:id", updatedMovie);
router.delete("/:id", deleteMovie);

export default router;
