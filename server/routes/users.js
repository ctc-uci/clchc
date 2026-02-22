import { keysToCamel } from "@/common/utils";
import { admin } from "@/config/firebase";
import { db } from "@/db/db-pgp"; // TODO: replace this db with
import { verifyRole } from "@/middleware";
import { notifyCcmNewUserRequest, notifyApprovedNewUser } from "@/utils/emailService";
import { Router } from "express";

export const usersRouter = Router();

// Rate limit email notifications (1 per user per minute). This will prevent spamming due to react strict mode and
// other excessive calls. We will need to find a more permanent solution in the future.
const recentEmailNotifications = new Map();
const EMAIL_COOLDOWN_MS = 60 * 1000; // 1 minute

const ROLE_MAP = {
  master: "Managers",
  ccm: "Managers",
  ccs: "Staff",
  viewer: "Viewers",
};

const ROLE_ORDER = ["Managers", "Staff", "Viewers"];

// Create new user
usersRouter.post("/", async (req, res) => {
  try {
    const { firebaseUid, firstName, lastName, email } = req.body;

    const existing = await db.query(
      "SELECT * FROM users WHERE firebase_uid = $1",
      [firebaseUid]
    );

    if (existing && existing.length > 0) {
      return res.status(200).json(keysToCamel(existing[0]));
    }

    const result = await db.query(
      `INSERT INTO users (
        firebase_uid,
        first_name,
        last_name,
        email
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [firebaseUid, firstName, lastName, email]
    );

    notifyCcmNewUserRequest(`${firstName} ${lastName}`, email);

    res.status(201).json(keysToCamel(result[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all users w/ optional status filter
usersRouter.get("/", async (req, res) => {
  try {
    const { status, user } = req.query;

    const conditions = [];
    const values = [];

    // Filter by status if provided
    if (status) {
      values.push(String(status));
      conditions.push(`status::text = $${values.length}`);
    }

    // Filter by user search if provided
    if (user) {
      values.push(`%${user}%`);
      conditions.push(`
        (
          first_name ILIKE $${values.length} 
          OR last_name ILIKE $${values.length} 
          OR email ILIKE $${values.length}
        )
      `);
    }

    // Build the WHERE clause dynamically
    const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    const result = await db.query(
      `
        SELECT *
        FROM users
        ${whereClause}
        ORDER BY id ASC
      `,
      values
    );

    return res.status(200).json(keysToCamel(result));
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

// Get statistics of all users
usersRouter.get("/stats", async (req, res) => {
  try {
    const [roleCounts, totalCount] = await db.multi(`
      SELECT role, COUNT(*)::int AS count
      FROM users
      GROUP BY role;

      SELECT COUNT(*)::int AS total
      FROM users;
    `);

    if (!roleCounts || !totalCount) {
      return res.status(404).send("User stats not found");
    }

    const aggregated = {};
    roleCounts.forEach(({ role, count }) => {
      const displayRole = ROLE_MAP[role] || role;
      aggregated[displayRole] = (aggregated[displayRole] || 0) + count;
    });

    const byRole = ROLE_ORDER.map((role) => ({
      role,
      count: aggregated[role] || 0,
    }));

    res.status(200).json({
      total: totalCount[0].total,
      byRole,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get user by ID
usersRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("SELECT * from users WHERE id=$1", [id]);

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get a user by Firebase ID
usersRouter.get("/firebase/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const result = await db.query(
      "SELECT * FROM users WHERE firebase_uid = $1",
      [firebaseUid]
    );

    // Send email if user exists and is still pending (rate limited)
    if (result && result.length > 0 && result[0].status === "pending") {
      const user = result[0];
      const lastNotified = recentEmailNotifications.get(firebaseUid);
      const now = Date.now();

      if (!lastNotified || now - lastNotified > EMAIL_COOLDOWN_MS) {
        recentEmailNotifications.set(firebaseUid, now);
        notifyCcmNewUserRequest(
          `${user.first_name} ${user.last_name}`,
          user.email
        );
      }
    }

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a user by ID, both in Firebase and NPO DB
usersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const users = await db.query(
      "SELECT firebase_uid FROM users WHERE id = $1",
      [id]
    );
    console.log("users", users);
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const { firebaseUid } = keysToCamel(users[0]);

    await admin.auth().deleteUser(firebaseUid);

    const deleted = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    res.status(200).json(keysToCamel(deleted));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a user by Firebase ID, both in Firebase and NPO DB
usersRouter.delete("/firebase/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const checkResult = await db.query(
      "SELECT firebase_uid FROM users WHERE firebase_uid = $1",
      [firebaseUid]
    );

    if (checkResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await admin.auth().deleteUser(firebaseUid);

    const user = await db.query("DELETE FROM users WHERE firebase_uid = $1", [
      firebaseUid,
    ]);

    res.status(204).json(keysToCamel(user));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a user by ID
usersRouter.put(
  "/:id",
  async (req, res, next) => {
    const { role, status, apptCalcFactor } = req.body;

    const isSensitiveUpdate =
      role !== undefined ||
      status !== undefined ||
      apptCalcFactor !== undefined;

    if (isSensitiveUpdate) {
      return verifyRole("ccm")(req, res, next);
    }

    return next();
  },
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        firebaseUid,
        role,
        firstName,
        lastName,
        email,
        status,
        apptCalcFactor,
      } = req.body;

      const result = await db.query(
        `UPDATE users
         SET
           firebase_uid = COALESCE($1, firebase_uid),
           role = COALESCE($2, role),
           first_name = COALESCE($3, first_name),
           last_name = COALESCE($4, last_name),
           email = COALESCE($5, email),
           status = COALESCE($6, status),
           appt_calc_factor = COALESCE($7, appt_calc_factor)
         WHERE id = $8
         RETURNING *`,
        [
          firebaseUid,
          role,
          firstName,
          lastName,
          email,
          status,
          apptCalcFactor,
          id,
        ]
      );

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }
      
      // If user is newly approved, notify them by email.
      if(status === "approved"){
        await notifyApprovedNewUser(`${result[0].first_name} ${result[0].last_name}`, result[[0]].email);
      }

      return res.status(200).json(keysToCamel(result[0]));
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

// Update a user by Firebase ID
usersRouter.put(
  "/firebase/:firebaseUid",
  async (req, res, next) => {
    const { role, status, apptCalcFactor } = req.body;

    const isSensitiveUpdate =
      role !== undefined ||
      status !== undefined ||
      apptCalcFactor !== undefined;

    if (isSensitiveUpdate) {
      // run your existing middleware only when needed
      return verifyRole("ccm")(req, res, next);
    }

    return next();
  },
  async (req, res) => {
    try {
      const { firebaseUid } = req.params;
      const { role, firstName, lastName, email, status, apptCalcFactor } =
        req.body;

      const result = await db.query(
        `UPDATE users
         SET
           role = COALESCE($1, role),
           first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           email = COALESCE($4, email),
           status = COALESCE($5, status),
           appt_calc_factor = COALESCE($6, appt_calc_factor)
         WHERE firebase_uid = $7
         RETURNING *`,
        [role, firstName, lastName, email, status, apptCalcFactor, firebaseUid]
      );

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      return res.status(200).json(keysToCamel(result[0]));
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

// Get all users (as admin)
usersRouter.get("/admin/all", verifyRole("admin"), async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users`);

    res.status(200).json(keysToCamel(users));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

usersRouter.put("/update/set-role", verifyRole("admin"), async (req, res) => {
  try {
    const { role, firebaseUid } = req.body;

    const user = await db.query(
      "UPDATE users SET role = $1 WHERE firebase_uid = $2 RETURNING *",
      [role, firebaseUid]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
