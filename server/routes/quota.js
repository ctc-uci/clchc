import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp"; // TODO: replace this db with
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const quotaRouter = Router();

// create quota
quotaRouter.post("/quota", async (req, res) => {
    try {
        const {
            provider_id, 
            location_id,
            quota,
            progress,
            hours,
            appointment_type,
            notes
        } = req.body;

        const result = await db.query(
            `INSERT INTO quota (provider_id, location_id, quota, progress, hours, appointment_type, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`, 
            [provider_id, location_id, quota, progress, hours, appointment_type, notes]
        );
        res.status(200).json(keysToCamel(result));

    } catch (err) {
        res.status(400).send(err.message);
    }
});


// get all quotas
quotaRouter.get("/quota", async (req, res) => {
    try {
      const quotas = await db.query(`SELECT * FROM quota ORDER BY id ASC`);
      res.status(200).json(keysToCamel(quotas));
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
  
// get all quotas by id
quotaRouter.get("/quota/:id", async (req, res) => {
  try {
    const { id } = req.params
    const quotas = await db.query(`SELECT * FROM quota WHERE id = $1`, [id]);

    res.status(200).json(keysToCamel(quotas));
  } catch (err) {
    res.status(400).send(err.message);
  }
});


// update quota by id
quotaRouter.put("/quota/:id", async (req, res) => {
    try {
        const { id } = req.params
        const {
            provider_id, 
            location_id,
            quota,
            progress,
            hours,
            appointment_type,
            notes
        } = req.body;
        const result = await db.query(
            `UPDATE quota
            SET
            provider_int = COALESCE($1, provider_int),
            location_id = COALESCE($2, location_id),
            quota = COALESCE($3, quota),
            progress = COALESCE($4, progress),
            hours = COALESCE($5, hours),
            appointment_type = COALESCE($6, appointment_type),
            notes = COALESCE($7, notes)
            WHERE id = $8
            RETURNING *`, 
            [provider_int, location_id, quota, progress, hours, appointment_type, notes, id]
        )

        res.status(200).json(keysToCamel(result));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// delete quota by id
quotaRouter.delete("/quota/id:", async (req, res) => {
    try {
        const { id } = req.params
        const result = await db.query("DELETE FROM quota WHERE id = $1", [id]);

        res.status(200).json(keysToCamel(result));
    }
    catch (err) {
        res.status(400).send(err.message)
    }
});

