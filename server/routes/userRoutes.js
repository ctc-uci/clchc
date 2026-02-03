import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const usersJsRouter = Router();

// Create a new user
usersJsRouter.post("/", async (req, res) => {
  try {
    const {
      firebaseUid,
      role,
      firstName,
      lastName,
      email,
      status,
      apptCalcFactor,
    } = req.body;

    const result = await db.query(
      "INSERT INTO users (firebase_uid, role, first_name, last_name, email, status, appt_calc_factor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [firebaseUid, role, firstName, lastName, email, status, apptCalcFactor]
    );

    res.status(201).json(keysToCamel(result));
  } catch (err) {
    res.status(500).send(err.message);
  }
})

// Get all users w/ optional status filter
usersJsRouter.get("/", async (req, res) => {
  try {
    const { status, user } = req.query;

    const conditions = [];
    const values = [];

    // Filter by status if provided
    if (status) {
      values.push(String(status));
      conditions.push(`status::text = $${values.length}`);
    }

    // Filter by user search if provided
    if (user) {
      values.push(`%${user}%`);
      conditions.push(`
        (
          first_name ILIKE $${values.length} 
          OR last_name ILIKE $${values.length} 
          OR email ILIKE $${values.length}
        )
      `);
    }

    // Build the WHERE clause dynamically
    const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    const result = await db.query(
      `
        SELECT *
        FROM users
        ${whereClause}
        ORDER BY id ASC
      `,
      values
    );

    return res.status(200).json(keysToCamel(result));
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

// Get a user by ID
usersJsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("SELECT * from users WHERE id=$1", [id]);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(keysToCamel(result));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a user by ID
usersJsRouter.put('/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const {firebaseUid, role, firstName, lastName, email, status, apptCalcFactor} = req.body;

        const result = await db.query(
        `UPDATE users
        SET
        firebase_uid = COALESCE($1, firebase_uid),
        role = COALESCE($2, role),
        first_name = COALESCE($3, first_name),
        last_name = COALESCE($4, last_name),
        email = COALESCE($5, email),
        status = COALESCE($6, status),
        appt_calc_factor = COALESCE($7, appt_calc_factor)
        WHERE id=$8 RETURNING *`,
        [firebaseUid, role, firstName, lastName, email, status, apptCalcFactor, id]
        );
        if (!result || result.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(keysToCamel(result));
    } catch(err){
        res.status(500).send(err.message);
    }
});

// Update a user by Firebase ID
usersJsRouter.put("/firebase/:firebaseUid", verifyRole("ccm"), async (req, res) => {
  console.log("ROUTE IS BEING HIT");
  try {
    const { firebaseUid } = req.params;

    const { role, firstName, lastName, email, status, apptCalcFactor } =
      req.body;

    const result = await db.query(
      `UPDATE users
         SET
           role = COALESCE($1, role),
           first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           email = COALESCE($4, email),
           status = COALESCE($5, status),
           appt_calc_factor = COALESCE($6, appt_calc_factor)
         WHERE firebase_uid = $7
         RETURNING *`,
      [role, firstName, lastName, email, status, apptCalcFactor, firebaseUid]
    );

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json(keysToCamel(result[0]));
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// Delete a user by ID
usersJsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("DELETE FROM users WHERE id=$1 RETURNING *", [
      id,
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
