import dotenv from "dotenv";

import { app } from "./app";
//import schedule from "node-schedule"; // TODO: Keep only if scheduling cronjobs
import {startCron, stopCron} from "@/utils/cron";

dotenv.config();

startCron()
//schedule.scheduleJob("0 0 0 0 0", () => console.info("Hello Cron Job!")); // TODO: delete sample cronjob

const SERVER_PORT =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_SERVER_PORT
    : process.env.PROD_SERVER_PORT;

app.listen(SERVER_PORT, () => {
  console.info(`Server listening on ${SERVER_PORT}`);
});


process.on("SIGTERM", stopCron);
process.on("SIGINT", stopCron);