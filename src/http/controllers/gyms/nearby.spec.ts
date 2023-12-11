import request from "supertest";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import app from "@/app";
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 01",
        latitude: -19.9429783,
        longitude: -43.92534,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Academia 01",
        latitude: 0,
        longitude: 0,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -19.9453752,
        longitude: -43.93268,
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
