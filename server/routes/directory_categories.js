import { keysToCamel } from "@/common/utils";
import { admin } from "@/config/firebase";
import { db } from "@/db/db-pgp"; // TODO: replace this db with
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const usersRouter = Router();

// Get all directory categories
usersRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params;
    const categories = await db.query(`SELECT * FROM directory_categories WHERE id = $1`, [id]);

    res.status(200).json(keysToCamel(categories));
  } catch (err) {
    res.status(400).send(err.message);
  }
});