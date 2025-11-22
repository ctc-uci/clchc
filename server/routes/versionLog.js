import { Router } from "express";
import { db } from "@/db/db-pgp";


export const versionLogRouter = Router();


usersRouter.get("/VersionLog", async (req, res) => {
  try {
    const versionLogs = await db.query(`SELECT * FROM version_log ORDER BY id ASC`);

    res.status(200).json(keysToCamel(versionLogs));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

usersRouter.get("/VersionLog/:id", async (req, res) => {
  try {
    const { versionLogID } = req.params;
    const user = await db.query("SELECT * FROM version_log WHERE id = $1", [
      versionLogID,
    ]);

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});