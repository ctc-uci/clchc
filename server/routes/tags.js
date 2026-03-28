import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";
import { verifyToken, verifyRole } from "@/middleware";

export const tagsRouter = Router();

// strip a tag id out of every provider if tag is deleted
async function removeTagFromProviders(tagId) {
  const providers = await db.query("SELECT id, data FROM providers");
  const updates = [];

  const traverse = (obj) => {
    if (Array.isArray(obj)) {
      return obj.filter(
        (x) => x !== tagId && x !== String(tagId) && x !== Number(tagId)
      );
    }
    if (obj !== null && typeof obj === "object") {
      const result = {};
      for (const key in obj) {
        result[key] = traverse(obj[key]);
      }
      return result;
    }
    return obj;
  };

  providers.forEach((p) => {
    const newData = traverse(p.data);
    // quick comparison - if different, propagate new data (without the deleted tags)
    if (JSON.stringify(newData) !== JSON.stringify(p.data)) {
      updates.push(
        db.query("UPDATE providers SET data = $1 WHERE id = $2", [
          newData,
          p.id,
        ])
      );
    }
  });

  await Promise.all(updates);
  return updates.length;
}

// Get all Tags
tagsRouter.get("/", verifyRole("viewer"), async (req, res) => {
  try {
    const tags = await db.query("SELECT * FROM tags ORDER BY id ASC");

    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Get Tag by ID
tagsRouter.get("/:id", verifyRole("viewer"), async (req, res) => {
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
tagsRouter.delete("/:id", verifyRole("ccm"), async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await db.query("DELETE FROM tags WHERE id = $1 RETURNING *", [
      id,
    ]);

    if (tag.length === 0) {
      return res.status(404).send("Tag not found");
    }

    // remove tags from providers when we delete tag
    try {
      await removeTagFromProviders(id);
    } catch (syncErr) {
      console.error("failed to clean providers for deleted tag", syncErr);
    }

    res.status(200).json(keysToCamel(tag));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create Tag
tagsRouter.post("/", verifyRole("ccm"), async (req, res) => {
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
tagsRouter.put("/:id", verifyRole("ccm"), async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, tagValue } = req.body;

    // pull existing row so we can compare changes
    const existing = await db.oneOrNone("SELECT * FROM tags WHERE id = $1", [
      id,
    ]);
    if (!existing) {
      return res.status(404).send("Tag not found");
    }

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

    // purge the tag from every provider
    const updated = tag[0];
    if (existing.category_id !== updated.category_id) {
      try {
        await removeTagFromProviders(id);
      } catch (syncErr) {
        console.error(
          "failed to clean providers after tag category change",
          syncErr
        );
      }
    }

    res.status(200).json(keysToCamel(tag));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
