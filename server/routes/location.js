import { keysToCamel } from "@/common/utils";
import express from "express";
import { db } from "@/db/db-pgp";

export const locationRouter = express.Router();

//Create (POST /location) - adds a new location to the Location table
locationRouter.post("/", async (req, res) => {
    try {
        const { tagValue } = req.body;

        if(!tagValue){
            return res.status(400).json({ error: "tagValue is required." });
        }

        const newLocation = (await db.query(
            "INSERT INTO location (tag_value) VALUES ($1) RETURNING *",
            [tagValue]
        ))[0];

        res.status(201).json(keysToCamel(newLocation));
    } catch (error) {
        console.error("Error creating location:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

//Read (GET /location, GET /location/:id) - gets all locations and gets location by ID
locationRouter.get("/", async (req, res) => {
  try {
    const allLocations = await db.query("SELECT * FROM location");

    res.status(200).json(allLocations.map(keysToCamel));
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

//Read (GET /location/:id) - gets location by ID (Added error handling for not found)
locationRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const location = await db.query(
        "SELECT * FROM location WHERE id = $1",
        [Number(id)]
    );

    if (location.length === 0) {
      return res.status(404).json({ error: "Location not found." });
    }

    res.status(200).json(keysToCamel(location[0]));
  } catch (error) {
    console.error("Error fetching location by ID:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

//Update (PUT/PATCH /location/:id) - updates the values of a location
locationRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { tagValue } = req.body;

    const updated = await db.query(
      "UPDATE location SET tag_value = $1 WHERE id = $2 RETURNING *",
      [tagValue, Number(id)]
    );

    if (updated.length === 0) {
      return res.status(404).json({ error: "Location not found." });
    }

    res.status(200).json(keysToCamel(updated[0]));
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

//Delete (DELETE /location/:id) - deletes a location from the Location Table
locationRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await db.query(
      "DELETE FROM location WHERE id = $1 RETURNING *",
      [Number(id)]
    );

    //This doesn't work as intended, need to check length of returned array
    if (deletedCount.length === 0) {
      return res.status(404).json({ error: "Location not found." });
    }

    res.status(200).json({ message: "Location deleted successfully." });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});