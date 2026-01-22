import { verifyToken } from "@/middleware";
import { directoryCategoriesRouter } from "@/routes/directory_categories";
import { locationRouter } from "@/routes/location";
import { providersRouter } from "@/routes/providers";
import { quotaRouter } from "@/routes/quota";
import { sampleRouter } from "@/routes/sample"; // TODO: delete sample router

import { tagsRouter } from "@/routes/tags";
import { usersRouter } from "@/routes/users";
import { versionLogRouter } from "@/routes/versionLog";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import schedule from "node-schedule"; // TODO: Keep only if scheduling cronjobs

import { usersJsRouter } from "../routes/userRoutes.js";

dotenv.config();

schedule.scheduleJob("0 0 0 0 0", () => console.info("Hello Cron Job!")); // TODO: delete sample cronjob

const CLIENT_HOSTNAME =
  process.env.NODE_ENV === "development"
    ? `${process.env.DEV_CLIENT_HOSTNAME}:${process.env.DEV_CLIENT_PORT}`
    : process.env.PROD_CLIENT_HOSTNAME;

export const app = express();
app.use(
  cors({
    origin: CLIENT_HOSTNAME,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === "production") {
  app.use(verifyToken);
}

app.use("/", sampleRouter); // TODO: delete sample endpoint
app.use("/users", usersRouter);
app.use("/users-js", usersJsRouter);
app.use("/versionLog", versionLogRouter);
app.use("/tags", tagsRouter);
app.use("/quota", quotaRouter);
app.use("/directoryCategories", directoryCategoriesRouter);
app.use("/location", locationRouter);
app.use("/providers", providersRouter);

// Listening is moved to server.ts to enable importing app in tests
export default app;
