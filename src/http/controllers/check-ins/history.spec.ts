import request from "supertest";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import app from "@/app";
import prisma from "@/lib/prisma";
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";

describe("History Check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to list the history of check-ins", async () => {
    const { token } = await createAndAuthenticateUser(app);
    const gym = await prisma.gym.create({
      data: { title: "Gym 01", latitude: 19.22, longitude: 22.17 },
    });

    await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: "19.22",
        longitude: "22.17",
      });

    const response = await request(app.server)
      .get("/check-ins/history")
      .query({
        page: 1,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIns).toHaveLength(1);
  });
});
