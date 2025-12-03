import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import express from "express";

const providersRouter = express.Router();

providersRouter.post("/", async (req, res) => {
  try {
    const { data, note } = req.body;

    if (!data) return res.status(400).send("Data must not be null");

    const result = await db.one(
      `
      INSERT INTO providers (data, note)
      VALUES ($1, $2)
      RETURNING *`,
      [data, note]
    );

    res.status(201).json(keysToCamel(result));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.get("/", async (req, res) => {
  try {
    const result = await db.any(`SELECT * FROM providers`);
    res.status(200).json(keysToCamel(result));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.get("/:id", async (req, res) => {
  try {
    const result = await db.oneOrNone(
      `
      SELECT * FROM providers 
      WHERE id =  $1`,
      [req.params.id]
    );

    if (!result) return res.status(404).send("Provider not found");

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.put("/:id", async (req, res) => {
  try {
    const { data, note } = req.body;

    if (!data) return res.status(400).send("Data must not be null");

    const result = await db.oneOrNone(
      `
      UPDATE providers
      SET data = $1, note = $2
      WHERE id = $3
      RETURNING *`,
      [data, note, req.params.id]
    );

    if (!result) return res.status(404).send("Provider not found");

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

providersRouter.delete("/:id", async (req, res) => {
  try {
    const result = await db.oneOrNone(
      `
      DELETE FROM providers
      WHERE id = $1
      RETURNING *`,
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
