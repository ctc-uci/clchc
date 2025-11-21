// tests/providers.test.js
import request from "supertest";
import { afterAll, describe, expect, test } from "vitest";

import { app } from "../app";

describe("Providers API", () => {
  let providerId;

  // Clean up after tests
  afterAll(async () => {
    // Only clean up if DELETE is implemented AND we have an ID
    if (providerId) {
      try {
        await request(app).delete(`/providers/${providerId}`);
        console.log(`Cleaned up test provider ${providerId}`);
      } catch (error) {
        console.log(
          `Could not clean up provider ${providerId} - DELETE may not be implemented yet`
        );
        console.log("\n⚠️  Manual cleanup needed:");
        console.log(`   Delete provider with ID ${providerId} from database`);
        console.log(
          `   SQL: DELETE FROM providers WHERE id = ${providerId};\n`
        );
        // Don't fail the test suite if cleanup fails
      }
    }
  });

  describe("POST /providers", () => {
    test("creates provider with valid data", async () => {
      const response = await request(app)
        .post("/providers")
        .send({
          data: {
            // note that these values below are not actually present in
            // directory_categories yet because that route is being
            // implemented by another dev pair. In reality, adding in
            // fields into this data object that are not present in
            // driectory_categories would never happen.
            name: "Dr. Sarah Chen",
            languages: ["English", "Mandarin"],
            specialty: "Pediatrics",
          },
          note: "Dr. Chen is allergic to Pineapple. Dr. Chen is allergic to Apples. Dr. Chen is allergic to Kiwi. Dr. Chen is allergic to Strawberries.",
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("note");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data.name).toBe("Dr. Sarah Chen");
      expect(response.body.data.languages).toEqual(["English", "Mandarin"]);
      expect(response.body.data.specialty).toEqual("Pediatrics");

      // Save ID for later tests
      providerId = response.body.id;
    });

    // Will implement when we add schema validation
    test.skip("rejects missing required field", async () => {
      // Will implement when we add schema validation
      const response = await request(app)
        .post("/providers")
        .send({
          data: {
            languages: ["English"],
            // Missing "name"
          },
        })
        .expect(400);

      expect(response.body.errors).toContain("name is required");
    });

    test.skip("rejects wrong data type", async () => {
      // Will implement when we add schema validation
      const response = await request(app)
        .post("/providers")
        .send({
          data: {
            name: "Dr. Wilson",
            languages: "English", // Should be array
          },
        })
        .expect(400);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([expect.stringContaining("must be an array")])
      );
    });
  });

  describe("GET /providers", () => {
    test("returns all providers", async () => {
      const response = await request(app).get("/providers").expect(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);

      // Verify our provider is in the list
      const ourProvider = response.body.find((p) => p.id === providerId);
      expect(ourProvider).toBeDefined();
      expect(ourProvider.data.name).toBe("Dr. Sarah Chen");
    });

    test("returns single provider by ID", async () => {
      const response = await request(app)
        .get(`/providers/${providerId}`)
        .expect(200);

      expect(response.body.id).toBe(providerId);
      expect(response.body.data.name).toBe("Dr. Sarah Chen");
    });

    test("returns 404 for non-existent provider", async () => {
      const response = await request(app).get("/providers/99999").expect(404);

      expect(response.body.error).toBe("Provider not found");
    });
  });

  describe("PUT /providers/:id", () => {
    test("updates provider with valid data", async () => {
      const response = await request(app)
        .put(`/providers/${providerId}`)
        .send({
          data: {
            name: "Dr. Sarah Chen-Smith",
            languages: ["English", "Mandarin", "Spanish"],
            specialty: "Pediatric Cardiology",
          },
          note: "Dr. Chen-Smith is only allergic to Apples.",
        })
        .expect(200);

      expect(response.body.data.name).toBe("Dr. Sarah Chen-Smith");
      expect(response.body.data.languages).toHaveLength(3);
      expect(response.body.data.specialty).toBe("Pediatric Cardiology");
    });

    test("can explicitly clear note with null", async () => {
      const response = await request(app)
        .put(`/providers/${providerId}`)
        .send({
          data: {
            name: "Dr. Sarah Chen",
            languages: ["English"],
            specialty: "Pediatrics",
          },
          note: null,
        })
        .expect(200);

      expect(response.body.note).toBeNull();
    });

    test.skip("rejects missing required field", async () => {
      const response = await request(app)
        .put(`/providers/${providerId}`)
        .send({
          data: {
            languages: ["English"],
            // Missing required "name"
          },
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    test("returns 404 for non-existent provider", async () => {
      await request(app)
        .put("/providers/99999")
        .send({
          data: {
            name: "Test",
            languages: ["English"],
          },
        })
        .expect(404);
    });
  });

  describe("DELETE /providers/:id", () => {
    test("deletes provider", async () => {
      await request(app).delete(`/providers/${providerId}`).expect(200);

      // Verify it's deleted
      await request(app).get(`/providers/${providerId}`).expect(404);
    });

    test("returns 404 for non-existent provider", async () => {
      await request(app).delete("/providers/99999").expect(404);
    });
  });
});
