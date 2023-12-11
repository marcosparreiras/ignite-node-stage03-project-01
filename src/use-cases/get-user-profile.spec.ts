import { describe, beforeEach, it, expect } from "vitest";
import { hash } from "bcryptjs";
import UsersRepository from "@/repositories/users-repository";
import GetUserProfileUseCase from "./get-user-profile";
import InMemoryUserRepository from "@/repositories/in-memory/in-memory-user-repository";
import ResourceNotFoundError from "./errors/resource-not-found";

let usersRepository: UsersRepository;
let sut: GetUserProfileUseCase;

describe("GetUserProfileUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("Should be able to get user profile", async () => {
    const name = "John Doe";
    const email = "johndoe@test.com";
    const createdUser = await usersRepository.create({
      name,
      email,
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
  });

  it("Should not be able to get a user profile with a wrong id", async () => {
    await expect(() => {
      return sut.execute({ userId: "non-existing-id" });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
