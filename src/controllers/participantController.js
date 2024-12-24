import express, { Router } from "express";
import {
  getParticipants,
  createParticipant,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} from "../services/participantsService.js";

const router = express.Router();

router.get("/", getParticipants);
router.get("/:id", getParticipantById);
router.post("/", createParticipant);
router.put("/:id", updateParticipant);
router.delete("/:id", deleteParticipant);

export default router;
