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

const REDIS_KEY = "participants";
const REDIS_CACHE = 3600;

export const getParticipants = async (req, res) => {
  const resultFromRedis = await getDataFromRedis(REDIS_KEY);
  if (resultFromRedis) {
    console.log("Found data from Redis", REDIS_KEY);
    res.status(200).json(resultFromRedis);
    return;
  }
  const result = await getAllParticipants();
  console.log("Getting data from database");
  await setDataToRedis(REDIS_KEY, result, REDIS_CACHE);
  res.status(200).json(result);
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
  const { name, age, role } = req.body;
  const result = await createParticipantByName(name, age, role);
  await invalidKey(REDIS_KEY);
  res.status(201).json(result);
};

export const updateParticipant = async (req, res) => {
  const id = req?.params?.id ?? "";
  const { name, age, role } = req.body;
  const result = await updateParticipantById(id, name, age, role);
  if (!result) {
    res.status(404).json({ message: "Participant not found" });
    return;
  }
  await invalidKey(REDIS_KEY);
  res.status(200).json(result);
};

export const deleteParticipant = async (req, res) => {
  const id = req?.params?.id ?? "";
  const result = await deleteParticipantById(id);
  if (!result) {
    res.status(404).json({ message: "Participant not found" });
    return;
  }
  await invalidKey(REDIS_KEY);
  res.status(204).json(result);
};
