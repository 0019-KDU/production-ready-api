import express, { Router } from "express";
import {
  getParticipants,
  createParticipant,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} from "../services/participantsService.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getParticipants);
router.get("/:id", getParticipantById);
router.post("/", authMiddleware, createParticipant);
router.put("/:id", authMiddleware, updateParticipant);
router.delete("/:id", authMiddleware, deleteParticipant);

export default router;
