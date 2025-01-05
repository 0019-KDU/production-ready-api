import mongoose from "mongoose";
import Participants from "./schemas/participantsSchema.js";
import { logMsg } from "../lib/logProducer.js";

export const getAllParticipants = async () => {
  const result = await Participants.find();
  if (!result) {
    return [];
  }

  return result;
};

export const getParticipantsById = async (participantId) => {
  if (!mongoose.Types.ObjectId.isValid(participantId)) {
    console.log("invalid object id", participantId);
  }

  const participant = await Participants.findById(participantId);
  if (!participant) {
    console.log("participant not found", participantId);
    return null;
  }
  return participant;
};

export const createParticipantByName = async (name, age, role, logId) => {
  logMsg(logId, "inside createParticipantByName method", { name, age, role });
  const newParticipant = await Participants({ name, age, role });
  const result = await newParticipant.save();
  logMsg(logId, "successfully created participant in the repository", result);
  return result;
};

export const updateParticipantById = async (participantId, name, age, role) => {
  if (!mongoose.Types.ObjectId.isValid(participantId)) {
    console.log("invalid object id", participantId);
    return null;
  }
  const result = await Participants.findByIdAndDelete(participantId, {
    name,
    age,
    role,
  });
  if (!result) {
    console.log("participant not found", participantId);
    return null;
  }
  return result;
};

export const deleteParticipantById = async (participantId) => {
  if (!mongoose.Types.ObjectId.isValid(participantId)) {
    console.log("invalid object id", participantId);
    return false;
  }

  const result = await Participants.findOneAndDelete(participantId);
  if (!result) return false;
  return true;
};
