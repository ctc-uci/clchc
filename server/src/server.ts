import dotenv from "dotenv";

import { app } from "./app";

dotenv.config();

// Use PORT when set (e.g. Railway, Heroku); otherwise use dev/prod config
const SERVER_PORT =
  process.env.PORT ??
  (process.env.NODE_ENV === "development"
    ? process.env.DEV_SERVER_PORT
    : process.env.PROD_SERVER_PORT);

app.listen(SERVER_PORT, () => {
  console.info(`Server listening on ${SERVER_PORT}`);
});
