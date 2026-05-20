import dotenv from "dotenv";

import { app } from "./app";
import {startCron, stopCron} from "@/utils/cron";

dotenv.config();

startCron()

const SERVER_PORT =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_SERVER_PORT
    : process.env.PROD_SERVER_PORT;

app.listen(SERVER_PORT, () => {
  console.info(`Server listening on ${SERVER_PORT}`);
});

const handleShutdown = () => {
  stopCron();
  process.exit(0);
};

process.on("SIGTERM", handleShutdown);
process.on("SIGINT", handleShutdown);