import request from "supertest";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import app from "@/app";
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";

describe("Profile (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to get a user profile", async () => {
    const { token } = await createAndAuthenticateUser(app);
    const response = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: "johndoe@example.com",
      })
    );
  });
});
