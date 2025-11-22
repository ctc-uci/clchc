import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const tagsRouter = Router();

// Get all Tags
tagsRouter.get("/", async (req, res) => {
  try {
    const tags = await db.query("SELECT * FROM tags ORDER BY id ASC");

    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Get Tag by ID
tagsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tags = await db.query("SELECT * FROM tags where id = $1", [id]);

    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Delete Tag by ID
tagsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await db.query("DELETE FROM tags WHERE id = $1 RETURNING *", [
      id,
    ]);

    res.status(200).json(keysToCamel(tag));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create Tag
tagsRouter.post("/", async (req, res) => {
  try {
    const { id, category_id, tag_value } = req.body;
    const tag = await db.query(
      "INSERT INTO tags (id, category_id, tag_value) VALUES ($1, $2, $3) RETURNING *",
      [id, category_id, tag_value]
    );

    res.status(200).json(keysToCamel(tag));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update Tag
tagsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, tag_value } = req.body;
    const tag = await db.query(
      "UPDATE tags SET category_id = $2, tag_value = $3 WHERE id = $1 RETURNING *",
      [id, category_id, tag_value]
    );
    res.status(200).json(keysToCamel(tag));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
