import { Router } from "express";
import { db } from "@/db/db-pgp";
import { keysToCamel } from "@/common/utils";


export const versionLogRouter = Router();


versionLogRouter.post("/", async (req, res) => {
  try {
    const { userId, quotaId, action } = req.body;

    if(!userId || !quotaId || !action){
      return res.status(404).json({error: "Parameters not sufficient; userId, quotaId, and action are required."});
    }

    const result = await db.query(
      `INSERT INTO version_log (user_id, quota_id, action)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, quotaId, action]
    );

    res.status(201).json(keysToCamel(result));
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

    if(versionLog.length === 0){
      return res.status(404).json({ error: `id: ${id} was not found.` })
    }

    res.status(200).json(keysToCamel(versionLog));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

versionLogRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, quotaId, action } = req.body;
    const updated = await db.query(
      `UPDATE version_log
       SET user_id = COALESCE($1, user_id),
           quota_id = COALESCE($2, quota_id),
           action = COALESCE($3, action)
       WHERE id = $4
       RETURNING *`,
      [userId, quotaId, action, id]
    );

    if(versionLog.length === 0){
      return res.status(404).json({ error: `id: ${id} was not found.` })
    }

    res.status(200).json(keysToCamel(updated));
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

    if(versionLog.length === 0){
      return res.status(404).json({ error: `id: ${id} was not found.` })
    }

    res.status(200).json(keysToCamel(deleted));
  } catch (err) {
    res.status(400).send(err.message);
  }
});