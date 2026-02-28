import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const versionLogRouter = Router();

versionLogRouter.post("/", async (req, res) => {
  try {
    const { userId, quotaId, action, delta } = req.body;

    if (!userId || !quotaId || !action || !delta) {
      return res.status(404).json({
        error:
          "Parameters not sufficient; userId, quotaId, action, and delta are required.",
      });
    }

    const result = await db.query(
      `INSERT INTO version_log (user_id, quota_id, action, delta)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, quotaId, action, delta]
    );

    res.status(201).json(keysToCamel(result));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

versionLogRouter.get("/", async (req, res) => {
  try {
    const versionLogs = await db.query(
      `SELECT * FROM version_log ORDER BY id ASC`
    );

    res.status(200).json(keysToCamel(versionLogs));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

versionLogRouter.get("/details", async (req, res) => {
  const { q, date } = req.query;

  try {
    // Prepare dynamic conditions
    const conditions = [];
    const values = [];

    if (q) {
      values.push(`%${q}%`);
      conditions.push(`
        "users".first_name ILIKE $${values.length} OR
        "users".last_name ILIKE $${values.length} OR
        providers.data->>'Name' ILIKE $${values.length}
      `);
    }

    if (date) {
      values.push(date);
      values.push(date);

      conditions.push(`
        version_log.timestamp >= $${values.length - 1}::date
        AND version_log.timestamp < ($${values.length}::date + INTERVAL '1 day')
      `);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const results = await db.query(
      `
      SELECT
        version_log.id AS id,
        version_log.*,
        version_log.delta,
        quota.date,
        quota.end_time AS time,
        "users".first_name,
        "users".last_name,
        providers.data AS provider_data
      FROM version_log
      JOIN quota ON version_log.quota_id = quota.id
      JOIN "users" ON version_log.user_id = "users".id
      JOIN providers ON quota.provider_id = providers.id
      ${whereClause}
      ORDER BY version_log.id DESC
      `,
      values
    );

    res.status(200).json(keysToCamel(results));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

versionLogRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const versionLog = await db.query(
      "SELECT * FROM version_log WHERE id = $1",
      [id]
    );

    if (versionLog.length === 0) {
      return res.status(404).json({ error: `id: ${id} was not found.` });
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

    if (updated.length === 0) {
      return res.status(404).json({ error: `id: ${id} was not found.` });
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

    if (deleted.length === 0) {
      return res.status(404).json({ error: `id: ${id} was not found.` });
    }

    res.status(200).json(keysToCamel(deleted));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
