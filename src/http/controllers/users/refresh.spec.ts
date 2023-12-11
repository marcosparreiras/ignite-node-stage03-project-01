import request from "supertest";
import app from "@/app";
import { describe, beforeAll, afterAll, it, expect } from "vitest";

describe("Refresh Token (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to refresh user token", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "johndoe@test.com",
      password: "123456",
    });
    const cookies = authResponse.get("Set-Cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
