import { describe, it, expect, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import AuthenticateUseCase from "./authenticate";
import InMemoryUserRepository from "@/repositories/in-memory/in-memory-user-repository";
import InvalidCredentialError from "./errors/invalid-credentials-error";
import UsersRepository from "@/repositories/users-repository";

let usersRepository: UsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("Should be able to authenticate", async () => {
    const password = "123456";
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password_hash: await hash(password, 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@test.com",
      password,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should not be able to authenticate with wrong e-mail", async () => {
    await expect(() => {
      return sut.execute({
        email: "johndoe@test.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialError);
  });

  it("Should not be able to authenticate with wrong password", async () => {
    const email = "johndoe@test.com";
    await usersRepository.create({
      name: "John Doe",
      email,
      password_hash: await hash("123456", 6),
    });

    await expect(() => {
      return sut.execute({ email, password: "654321" });
    }).rejects.toBeInstanceOf(InvalidCredentialError);
  });
});
