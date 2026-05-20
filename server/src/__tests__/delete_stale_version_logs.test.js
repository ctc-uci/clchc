// ABOUT: this is a test suite using vitest to validate cronjob behavior. While the cronjob is explicitly not
// tested (we don't need to test the library works), we need to test that the auomated deletion functionality that
// the cron job calls works properly

import { db } from "@/db/db-pgp";
import { afterEach, describe, expect, it } from "vitest";

import { cleanVersionLog } from "../jobs/cleanVersionLog";
// import factory functions for seeding test data into neon branch
import {
  createProvider,
  createQuota,
  createUser,
  createVersionLog,
  daysAgo,
} from "./factories";

describe("deleteOldVersionLogs", () => {
  // reset test DB after every test run
  afterEach(async () => {
    await db.query(
      "TRUNCATE version_log, quota, users, providers RESTART IDENTITY CASCADE"
    );
  });

  it("deletes records older than 7 days", async () => {
    await createVersionLog({ timestamp: daysAgo(10) });
    await createVersionLog({ timestamp: daysAgo(8) });
    const recent = await createVersionLog({ timestamp: daysAgo(3) });

    await cleanVersionLog();

    const rows = await db.query("SELECT * FROM version_log");
    expect(rows).toHaveLength(1);
    expect(rows.at(0)?.id).toBe(recent.id);
  });

  it("returns 0 when nothing to delete", async () => {
    await createVersionLog({ timestamp: daysAgo(1) });
    const deleted = await cleanVersionLog();
    expect(deleted).toBe(0);
  });
});
