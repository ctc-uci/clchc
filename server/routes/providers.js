import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import express from "express";
import { verifyRole } from "@/middleware";

const providersRouter = express.Router();

providersRouter.post("/", verifyRole("ccm"), async (req, res) => {
  try {
    const { name, degree, license, phoneNumber, dea, data, notes } = req.body;

    if (!data) return res.status(400).send("Data must not be null");

    const result = await db.one(
      `
      INSERT INTO providers (name, degree, license, phone_number, dea, data, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [name, degree, license, phoneNumber, dea, data, notes]
    );

    res.status(201).json(keysToCamel(result));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.get("/", verifyRole("viewer"), async (req, res) => {
  try {
    const { search } = req.query;

    let whereClause = "";
    const values = [];
    const conditions = [];

    if (search) {
      conditions.push(`name ILIKE $${values.length + 1}`);
      values.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    const result = await db.any(
      `
      SELECT * FROM providers
      ${whereClause}
      ORDER BY id ASC
      `,
      values
    );

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.get("/summary", verifyRole("viewer"), async (req, res) => {
  try {
    const result = await db.any(
      `SELECT id, name FROM providers;`
    );
    res.status(200).json(keysToCamel(result));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.put("/:id", verifyRole("ccm"), async (req, res) => {
  try {
    const { name, degree, license, phoneNumber, dea, data, notes } = req.body;

    if (!data) return res.status(400).send("Data must not be null");

    const result = await db.oneOrNone(
      `
      UPDATE providers
      SET name = $1, degree = $2, license = $3, phone_number = $4, dea = $5, data = $6, notes = $7
      WHERE id = $8
      RETURNING *`,
      [name, degree, license, phoneNumber, dea, data, notes, req.params.id]
    );

    if (!result) return res.status(404).send("Provider not found");

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.delete("/:id", verifyRole("ccm"), async (req, res) => {
  try {
    const result = await db.oneOrNone(
      `DELETE FROM providers WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (!result) return res.status(404).send("Provider not found");

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

export { providersRouter };