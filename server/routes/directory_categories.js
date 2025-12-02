import { keysToCamel } from "@/common/utils";
import { admin } from "@/config/firebase";
import { db } from "@/db/db-pgp"; // TODO: replace this db with
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const directoryCategoriesRouter = Router();

// Get all directory categories
directoryCategoriesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const categories = await db.query(`SELECT * FROM directory_categories WHERE id = $1`, [id]);

    res.status(200).json(keysToCamel(categories));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Adds a new category
directoryCategoriesRouter.post("/create", async (req, res) => {
  try {
    const { id, name, input_type, is_required, date_created, column_order } = req.body;
    const categories = await db.query(
      "INSERT INTO directory_categories (id, name, input_type, is_required, date_created, column_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id, name, input_type, is_required, date_created, column_order]
    );

    res.status(200).json(keysToCamel(categories));
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Delete a category
directoryCategoriesRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await admin.auth().deleteUser(id);
    const categories = await db.query("DELETE FROM directory_categories WHERE id = $1", [
      id,
    ]);

    res.status(200).json(keysToCamel(categories));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Updates only the fields present in the request body
directoryCategoriesRouter.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;
        if (Object.keys(req.body).length === 0) {
            return res.status(200).send({ message: "No fields to update" });
        }
        const updates = [];
        const values = [];
        values.push(id);
        let index = 2;
        for (const key in fields) {
          updates.push(`${key} = $${index}`);
          values.push(fields[key]);
          index++;
        }
        const categories = await db.query(`UPDATE directory_categories SET ${updates.join(", ")} WHERE id = $1 RETURNING *`, values);
        
        res.status(200).json(keysToCamel(categories));
    } catch (err) {
        res.status(400).send(err.message);
    }
});
