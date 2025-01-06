import cron from "node-cron";
import { deleteLogs } from "../repositories/logRepository.js";

export const deleteCronJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await deleteLogs;
      console.log("deleted logs from log collection");
    } catch (error) {
      console.log("error in deleting logs from cron job");
    }
  });
};
