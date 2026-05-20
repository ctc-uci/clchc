import { db } from "@/db/db-pgp";

export async function createProvider(overrides = {}) {
  const data = {
    data: {},
    notes: "Test Note",
    ...overrides,
  };

  const rows = await db.query(
    `INSERT INTO providers (data, notes) VALUES ($1, $2) RETURNING *`,
    [data.data, data.notes]
  );
  return rows[0];
}

export async function createUser(overrides = {}) {
  const uid = Math.random().toString(36).slice(2);
  const data = {
    firebase_uid: `firebase_uid_${uid}`,
    role: "ccm",
    first_name: "Test",
    last_name: "User",
    email: `test_${uid}@example.com`,
    status: "approved",
    appt_calc_factor: null,
    ...overrides,
  };

  const rows = await db.query(
    `INSERT INTO users (firebase_uid, role, first_name, last_name, email, status, appt_calc_factor)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      data.firebase_uid,
      data.role,
      data.first_name,
      data.last_name,
      data.email,
      data.status,
      data.appt_calc_factor,
    ]
  );
  return rows[0];
}

export async function createQuota(overrides = {}) {
  const provider_id = overrides.provider_id ?? (await createProvider()).id;

  const data = {
    provider_id,
    location_id: 1,
    quota: 10,
    progress: 0,
    date: new Date().toISOString().split("T")[0],
    appointment_type: "inperson",
    notes: "",
    ...overrides,
  };

  const rows = await db.query(
    `INSERT INTO quota (provider_id, location_id, quota, progress, date, appointment_type, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      data.provider_id,
      data.location_id,
      data.quota,
      data.progress,
      data.date,
      data.appointment_type,
      data.notes,
    ]
  );
  return rows[0];
}

export async function createVersionLog(overrides = {}) {
  const user_id = overrides.user_id ?? (await createUser()).id;
  const quota_id = overrides.quota_id ?? (await createQuota()).id;

  const data = {
    user_id,
    quota_id,
    action: "increment",
    timestamp: new Date(),
    ...overrides,
  };

  const rows = await db.query(
    `INSERT INTO version_log (user_id, quota_id, action, timestamp) VALUES ($1, $2, $3, $4) RETURNING *`,
    [data.user_id, data.quota_id, data.action, data.timestamp]
  );
  return rows[0];
}

export function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}
