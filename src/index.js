import express from "express";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";

import participants from "./controllers/participantController.js";
import movies from "./controllers/movieController.js";
import users from "./controllers/userController.js";
import { checkHealthStatus } from "./services/healthService.js";

dotenv.config();

import connect from "./config/db.js";
import uid from "tiny-uid";
import { connectRabbitMQ } from "./config/rabbitMQ.js";

import { removeResHeaders } from "./middlewares/removeResHeaders.js";
import { logMsg } from "./lib/logProducer.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(removeResHeaders);

app.use((req, res, next) => {
  req.logId = uid(7);
  next();
});

app.get("/healthCheck", checkHealthStatus);

app.get("/ping", (req, res) => {
  const logId = req?.logId ?? "";
  logMsg(logId, "inside ping method route handler", { test: "ping" });
  res.status(200).json({ message: "ping" });
});
app.use("/participants", participants);
app.use("/movies", movies);
app.use("/auth", users);

await connect(DB_NAME);
await connectRabbitMQ();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
