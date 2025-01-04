import express, { Router } from "express";
import {
  getParticipants,
  createParticipant,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} from "../services/participantsService.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";
import { body } from "express-validator";
import { handleValidationError } from "../middlewares/validationErrorMiddleware.js";

const validateParticipantData = [
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Name must be a string"),
  body("age").isInt({ min: 0 }).withMessage("Age must be a Integer"),
  body("role")
    .isIn([
      "Producer",
      "Actor",
      "Director",
      "Musician",
      "Writer",
      "Cinematographer",
    ])
    .withMessage("Invalid role"),
];

const router = express.Router();

router.get("/", getParticipants);
router.get("/:id", getParticipantById);
router.post(
  "/",
  authMiddleware,
  validateParticipantData,
  handleValidationError,
  checkPermission("create"),
  createParticipant
);
router.put(
  "/:id",
  authMiddleware,
  validateParticipantData,
  handleValidationError,
  checkPermission("update"),
  updateParticipant
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("delete"),
  deleteParticipant
);

export default router;
