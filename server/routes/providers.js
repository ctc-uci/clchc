import { db } from "@/db/db-pgp";
import express from "express";

const providersRouter = express.Router();
providersRouter.use(express.json());

providersRouter.post("/", async (req, res) => {
  try {
    const { data, note } = req.body;

    const result = await db.query(
      `INSERT INTO providers (data, note)
            VALUES ($1, $2)
            RETURNING *`,
      [data, note]
    );

    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.get("/", async (req, res) => {
  try {
    const result = await db.query(`
          SELECT * FROM providers`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.get("/:id", async (req, res) => {
  try {
    const result = await db.query(
      `
          SELECT * FROM providers 
          WHERE id =  $1`,
      [req.params.id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.put("/:id", async (req, res) => {
  try {
    const { data, note } = req.body;

    const result = await db.query(
      `UPDATE providers
      SET data = $1, note = $2
      WHERE id = $3
      RETURNING *`,
      [data, note, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("No provider found");
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.delete("/:id", async (req, res) => {
  try {
    const result = await db.query(
      `
        DELETE FROM providers
        WHERE id = $1
        RETURNING *`,
      [req.params.id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

export { providersRouter };
