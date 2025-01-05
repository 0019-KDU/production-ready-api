import {
  getAllParticipants,
  createParticipantByName,
  deleteParticipantById,
  updateParticipantById,
  getParticipantsById,
} from "../repositories/participantsRepository.js";

import {
  getDataFromRedis,
  setDataToRedis,
  invalidKey,
} from "../lib/redisHelper.js";
import { logMsg } from "../lib/logProducer.js";

const REDIS_KEY = "participants";
const REDIS_CACHE = 3600;

export const getParticipants = async (req, res) => {
  try {
    // Check for cached data in Redis
    const resultFromRedis = await getDataFromRedis(REDIS_KEY);
    if (resultFromRedis) {
      console.log("Found data from Redis:", REDIS_KEY);
      return res.status(200).json(resultFromRedis);
    }

    // If no data in Redis, fetch from the database
    console.log("Fetching data from database");
    const result = await getAllParticipants();

    // If no participants are found, respond with a 404
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No participants found" });
    }

    // Store the result in Redis for future requests
    await setDataToRedis(REDIS_KEY, result, REDIS_CACHE);

    // Respond with the fetched data
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getParticipantById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    // Check if data exists in Redis
    const resultFromRedis = await getDataFromRedis(REDIS_KEY);
    if (resultFromRedis) {
      console.log("Found data from Redis:", REDIS_KEY);
      const participant = resultFromRedis.find((result) => result?.id === id);
      if (participant) {
        return res.status(200).json(participant);
      }
    }

    // Fallback to database if not found in Redis
    console.log("Fetching data from database");
    const result = await getParticipantsById(id);
    if (!result) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Return the participant data
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching participant by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createParticipant = async (req, res) => {
  const logId = req?.logId ?? "";
  const { name, age, role } = req.body;
  logMsg(logId, "inside createParticipant method", { name, age, role });
  const result = await createParticipantByName(name, age, role, logId);
  await invalidKey(REDIS_KEY, logId);
  res.status(201).json(result, logId);
};

export const updateParticipant = async (req, res) => {
  try {
    const id = req.params?.id;
    const { name, age, role } = req.body;

    // Validate request data
    if (!id || !name || !age || !role) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Update participant in the database
    const result = await updateParticipantById(id, name, age, role);

    if (!result) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Invalidate Redis cache
    await invalidKey(REDIS_KEY);

    // Respond with the updated participant data
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating participant:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteParticipant = async (req, res) => {
  try {
    const id = req.params?.id;

    // Validate request data
    if (!id) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    // Delete participant in the database
    const result = await deleteParticipantById(id);

    if (!result) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Invalidate Redis cache
    await invalidKey(REDIS_KEY);

    // Respond with no content
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting participant:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
