import request from "supertest";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import app from "@/app";
import prisma from "@/lib/prisma";
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";

describe("Validate Check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to validate a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: { title: "Gym 01", latitude: 19.22, longitude: 22.17 },
    });

    let checkIn = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gym.id,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/valdiate`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(204);

    checkIn = await prisma.checkIn.findFirstOrThrow({
      where: { id: checkIn.id },
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
