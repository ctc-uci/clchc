import { keysToCamel } from "@/common/utils";
import { admin } from "@/config/firebase";
import { db } from "@/db/db-pgp"; // TODO: replace this db with
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const usersRouter = Router();

// Get all users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users ORDER BY id ASC`);

    res.status(200).json(keysToCamel(users));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get a user by ID
usersRouter.get("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await db.query("SELECT * FROM users WHERE firebase_uid = $1", [
      firebaseUid,
    ]);

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a user by ID, both in Firebase and NPO DB
usersRouter.delete("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const checkResult = await db.query(
      "SELECT firebase_uid FROM users WHERE firebase_uid = $1",
      [firebaseUid]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await db.query("DELETE FROM users WHERE firebase_uid = $1", [
      firebaseUid,
    ]);
    await admin.auth().deleteUser(firebaseUid);

    res.status(204).json(keysToCamel(user));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create user
// TODO: add verifyAuth
usersRouter.post("/create", async (req, res) => {
  try {
    const { firebaseUid, firstName, lastName, email } = req.body;

    const existing = await db.query(
      "SELECT * FROM users WHERE firebase_uid = $1",
      [firebaseUid]
    );

    // No action: just return existing user
    if (existing && existing.length > 0) {
      return res.status(200).json(keysToCamel(existing[0]));
    }

    const result = await db.query(
      `INSERT INTO users (firebase_uid, first_name, last_name, email, status, role)
       VALUES ($1, $2, $3, $4, 'pending', 'viewer')
       RETURNING *`,
      [firebaseUid, firstName, lastName, email]
    );

    res.status(201).json(keysToCamel(result));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a user by ID
usersRouter.put("/update", async (req, res) => {
  try {
    const { email, firebaseUid } = req.body;

    const user = await db.query(
      "UPDATE users SET email = $1 WHERE firebase_uid = $2 RETURNING *",
      [email, firebaseUid]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all users (as admin)
usersRouter.get("/admin/all", verifyRole("admin"), async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users`);

    res.status(200).json(keysToCamel(users));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update a user's role
usersRouter.put("/update/set-role", verifyRole("admin"), async (req, res) => {
  try {
    const { role, firebaseUid } = req.body;

    const user = await db.query(
      "UPDATE users SET role = $1 WHERE firebase_uid = $2 RETURNING *",
      [role, firebaseUid]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update appointment calc factor
usersRouter.put("/update/set-calc-factor", verifyRole("ccm"), async(req, res) => {
  try{
    const {factor, firebaseUid} = req.body;
    console.log(firebaseUid);
    const user = await db.query(
      "UPDATE users SET appt_calc_factor = $1 WHERE firebase_uid = $2 RETURNING *",
      [factor, firebaseUid]
    );

    res.status(200).json(keysToCamel(user));
  } catch(err){
    res.status(400).send(err.message);
  }
})

// Update a user's firstName, lastName, email by firebse UID (for user settings)
usersRouter.put("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { firstName, lastName, email } = req.body;
    const result = await db.query(
      `UPDATE users 
        SET 
        first_name = COALESCE($1, first_name), 
        last_name = COALESCE($2, last_name), 
        email = COALESCE($3, email)
        WHERE firebase_uid = $4 RETURNING *`,
      [firstName, lastName, email, firebaseUid]
    );
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(keysToCamel(result));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
