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

    if (tags.length === 0) {
      return res.status(404).send("Tag not found");
    }

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

    if (tag.length === 0) {
      return res.status(404).send("Tag not found");
    }

    res.status(200).json(keysToCamel(tag));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create Tag
tagsRouter.post("/", async (req, res) => {
  try {
    const { categoryId, tagValue } = req.body;
    if (!categoryId || !tagValue) {
      return res
        .status(400)
        .send("Missing one or more required fields: categoryId, tagValue");
    }
    const tag = await db.query(
      "INSERT INTO tags (category_id, tag_value) VALUES ($1, $2) RETURNING *",
      [categoryId, tagValue]
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
    const { categoryId, tagValue } = req.body;
    
    const tag = await db.query(
      `UPDATE tags 
      SET 
      category_id = COALESCE($1, category_id),
      tag_value = COALESCE($2, tag_value)
      WHERE id = $3 RETURNING *`,
      [categoryId, tagValue, id]
    );

    if (tag.length === 0) {
      return res.status(404).send("Tag not found");
    }
    res.status(200).json(keysToCamel(tag));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
