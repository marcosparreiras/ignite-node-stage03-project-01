import { expect, it, describe, beforeEach } from "vitest";
import { compare } from "bcryptjs";
import InMemoryUserRepository from "@/repositories/in-memory/in-memory-user-repository";
import RegisterUseCase from "./register";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import UsersRepository from "@/repositories/users-repository";

let usersRepository: UsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("Should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should hash user password upon registration", async () => {
    const password = "123456";
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@test.com",
      password,
    });

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("Shloud not be able to register with an existing e-mail", async () => {
    const email = "johndoe@test.com";
    await sut.execute({
      name: "John Doe",
      password: "123456",
      email,
    });

    await expect(() => {
      return sut.execute({
        name: "John Doe",
        password: "123456",
        email,
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
