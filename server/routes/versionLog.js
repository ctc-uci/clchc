import { Router } from "express";
import { db } from "@/db/db-pgp";
import { keysToCamel } from "@/common/utils";


export const versionLogRouter = Router();


versionLogRouter.post("/create", async (req, res) => {
  try {
    const { user_id, quota_id, action } = req.body;
    const result = await db.query(
      `INSERT INTO version_log (user_id, quota_id, action)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, quota_id, action]
    );

    res.status(201).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

versionLogRouter.get("/", async (req, res) => {
  try {
    const versionLogs = await db.query(`SELECT * FROM version_log ORDER BY id ASC`);

    res.status(200).json(keysToCamel(versionLogs));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

versionLogRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const versionLog = await db.query("SELECT * FROM version_log WHERE id = $1", [
      id,
    ]);

    res.status(200).json(keysToCamel(versionLog));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

versionLogRouter.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, quota_id, action } = req.body;
    const updated = await db.query(
      `UPDATE version_log
       SET user_id = $1,
           quota_id = $2,
           action = $3
       WHERE id = $4
       RETURNING *`,
      [user_id, quota_id, action, id]
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

versionLogRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.query(
      `DELETE FROM version_log WHERE id = $1 RETURNING *`,
      [id]
    );

    res.status(200).json(deleted);
  } catch (err) {
    res.status(400).send(err.message);
  }
});