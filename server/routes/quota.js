import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp"; // TODO: replace this db with
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const quotaRouter = Router();

// create quota
quotaRouter.post("/", async (req, res) => {
  try {
    const {
      providerId,
      locationId,
      quota,
      progress,
      date,
      startTime,
      endTime,
      appointmentType,
      notes,
    } = req.body;

    const result = await db.query(
      `INSERT INTO quota (provider_id, location_id, quota, progress, date, start_time, end_time, appointment_type, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
      [
        providerId,
        locationId,
        quota,
        progress,
        date,
        startTime,
        endTime,
        appointmentType,
        notes,
      ]
    );
    res.status(200).json(keysToCamel(result));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// get all quotas
quotaRouter.get("/", async (req, res) => {
  try {
    const quotas = await db.query(`SELECT * FROM quota ORDER BY id ASC`);

    res.status(200).json(keysToCamel(quotas));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// get quota data with location and provider name
quotaRouter.get("/details", async (req, res) => {
  try {
    const { provider } = req.query;
    const values = [];
    let whereClause = "";

    if (provider) {
      whereClause = "WHERE p.data->>'Name' ILIKE $1";
      values.push(`%${provider}%`);
    }

    const results = await db.query(
      `
        SELECT q.*, p.data->>'Name' AS provider_name, l.tag_value AS location_name 
        FROM quota q 
        JOIN providers p ON q.provider_id = p.id 
        JOIN location l ON q.location_id = l.id
        ${whereClause}
        ORDER BY q.id ASC`,
      values
    );
    res.status(200).json(keysToCamel(results));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// get quotas by id
quotaRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const quotas = await db.query(`SELECT * FROM quota WHERE id = $1`, [id]);

    if (quotas.length === 0) {
      return res.status(404).json({ error: `Quota with id ${id} not found.` });
    } else {
      res.status(200).json(keysToCamel(quotas));
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// update quota by id
quotaRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      providerId,
      locationId,
      quota,
      progress,
      date,
      startTime,
      endTime,
      appointmentType,
      notes,
    } = req.body;
    const result = await db.query(
      `UPDATE quota
            SET
            provider_id = COALESCE($1, provider_id),
            location_id = COALESCE($2, location_id),
            quota = COALESCE($3, quota),
            progress = COALESCE($4, progress),
            date = COALESCE($5, date),
            start_time = COALESCE($6, start_time),
            end_time = COALESCE($7, end_time),
            appointment_type = COALESCE($8, appointment_type),
            notes = COALESCE($9, notes)
            WHERE id = $10
            RETURNING *`,
      [
        providerId,
        locationId,
        quota,
        progress,
        date,
        startTime,
        endTime,
        appointmentType,
        notes,
        id,
      ]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: `Quota with id ${id} not found.` });
    } else {
      res.status(200).json(keysToCamel(result));
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// delete quota by id
quotaRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM quota WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: `Quota with id ${id} not found.` });
    } else {
      res.status(200).json(keysToCamel(result));
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});
