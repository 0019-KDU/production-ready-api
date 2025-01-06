import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connect from "../config/db.js";
import { LOG_DB_NAME } from "../constants.js";
import { getLogById } from "../repositories/logRepository.js";
import { startLogConsumer } from "../lib/logConsumer.js";

await connect(LOG_DB_NAME);

startLogConsumer().catch((err) => console.log("error in consuming log queue"));

const app = express();

app.get("/log/:logId", async (req, res) => {
  const logId = req?.params?.logId ?? "";
  const result = await getLogById(logId);
  if (!result) {
    return res.status(404).send({ message: "Log not found" });
  }
  res.send(result);
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
