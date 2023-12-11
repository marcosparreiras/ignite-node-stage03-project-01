import request from "supertest";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import app from "@/app";
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";

describe("Seacrh Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to search gyms by title", async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 01",
        latitude: "19.08",
        longitude: "45.48",
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Academia 01",
        latitude: "19.08",
        longitude: "45.48",
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        q: "Gym",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Gym 01",
      }),
    ]);
  });
});
