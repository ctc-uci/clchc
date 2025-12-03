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
            hours,
            appointmentType,
            notes
        } = req.body;

        const result = await db.query(
            `INSERT INTO quota (providerId, locationId, quota, progress, hours, appointmentType, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`, 
            [providerId, locationId, quota, progress, hours, appointmentType, notes]
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
  
// get quotas by id
quotaRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const quotas = await db.query(`SELECT * FROM quota WHERE id = $1`, [id]);

    if (quotas.length === 0) {
       return res.status(404).json({ error: `Quota with id ${id} not found.`}); 
    }
    else {
        res.status(200).json(keysToCamel(quotas));
    }
    
  } catch (err) {
    res.status(400).send(err.message);
  }
});


// update quota by id
quotaRouter.put("/:id", async (req, res) => {
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
            provider_id = COALESCE($1, provider_id),
            location_id = COALESCE($2, location_id),
            quota = COALESCE($3, quota),
            progress = COALESCE($4, progress),
            hours = COALESCE($5, hours),
            appointment_type = COALESCE($6, appointment_type),
            notes = COALESCE($7, notes)
            WHERE id = $8
            RETURNING *`, 
            [provider_id, location_id, quota, progress, hours, appointment_type, notes, id]
        )

        if (result.length === 0) {
            return res.status(404).json({ error: `Quota with id ${id} not found.`}); 
        }
        else {
            res.status(200).json(keysToCamel(result));
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// delete quota by id
quotaRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const result = await db.query("DELETE FROM quota WHERE id = $1 RETURNING *", [id]);

        if (result.length === 0) {
            return res.status(404).json({ error: `Quota with id ${id} not found.`}); 
        }
        else {
            res.status(200).json(keysToCamel(result));
        }
    }
    catch (err) {
        res.status(400).send(err.message)
    }
});

