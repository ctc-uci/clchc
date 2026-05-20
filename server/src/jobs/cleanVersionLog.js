import { db } from "@/db/db-pgp";

export async function cleanVersionLog() {
  const { rowCount } = await db.query(`
    DELETE FROM version_log
    WHERE timestamp < NOW() - INTERVAL '7 days'
  `);
  return rowCount ?? 0;
}
