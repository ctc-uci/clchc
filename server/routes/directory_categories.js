import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp"; // TODO: replace this db with
import { Router } from "express";
import { verifyToken, verifyRole } from "@/middleware"; // <-- add this

export const directoryCategoriesRouter = Router();

// Get all directory categories
directoryCategoriesRouter.get("/", async (req, res) => {
  try {
    const categories = await db.query(`SELECT * FROM directory_categories`);

    res.status(200).json(keysToCamel(categories));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get directory categories by id
directoryCategoriesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const categories = await db.query(`SELECT * FROM directory_categories WHERE id = $1`, [id]);

    if (categories.length === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(200).json(keysToCamel(categories));
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Adds a new category
directoryCategoriesRouter.post("/", verifyToken, verifyRole("ccm"), async (req, res) => {
  try {
    const { name, inputType, isRequired, columnOrder } = req.body;
    
    // update all columnOrders >= new columnOrder to shift right
    await db.query(
      "UPDATE directory_categories SET column_order = column_order + 1 WHERE column_order >= $1",
      [columnOrder]
    );

    const categories = await db.query(
      "INSERT INTO directory_categories (name, input_type, is_required, column_order) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, inputType, isRequired, columnOrder]
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

    const categories = await db.query("DELETE FROM directory_categories WHERE id = $1 RETURNING *", 
      [id]
    );

    if (categories.length === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(200).json(keysToCamel(categories));
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Updates only the fields present in the request body
directoryCategoriesRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const {
            name,
            inputType,
            isRequired,
            dateCreated,
            columnOrder
        } = req.body;

        const result = await db.query(
            `UPDATE directory_categories
            SET
            name = COALESCE($1, name),
            input_type = COALESCE($2, input_type),
            is_required = COALESCE($3, is_required),
            date_created = COALESCE($4, date_created),
            column_order = COALESCE($5, column_order)
            WHERE id = $6
            RETURNING *`, 
            [name, inputType, isRequired, dateCreated, columnOrder, id]
        )
        if (result.length === 0) {
            return res.status(404).json({ error: `Category with id ${id} not found.`}); 
        }
        else {
            res.status(200).json(keysToCamel(result));
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// directoryCategoriesRouter.patch("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const fields = req.body;

//         if (Object.keys(req.body).length === 0) {
//             return res.status(200).send({ message: "No fields to update" });
//         }

//         const updates = [];
//         const values = [];
//         values.push(id);
//         let index = 2;

//         for (const key in fields) {
//           updates.push(`${key} = $${index}`);
//           values.push(fields[key]);
//           index++;
//         }

//         const categories = await db.query(`UPDATE directory_categories SET ${updates.join(", ")} WHERE id = $1 RETURNING *`, values);

//         if (categories.length === 0) {
//           res.status(404).json({ error: "Category not found" });
//         } else {
//           res.status(200).json(keysToCamel(categories));
//         }
//     } catch (err) {
//         res.status(400).send(err.message);
//     }
// });
