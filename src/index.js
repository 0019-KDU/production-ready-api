import express from "express";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";

import participants from "./controllers/participantController.js";

dotenv.config();

import connect from "./config/db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "ping" });
});
app.use("/participants", participants);

await connect(DB_NAME);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
