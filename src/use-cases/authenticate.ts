import { compare } from "bcryptjs";
import UsersRepository from "@/repositories/users-repository";
import InvalidCredentialError from "./errors/invalid-credentials-error";
import { User } from "@prisma/client";

interface AuthenticateCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateCaseResponse {
  user: User;
}

class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateCaseRequest): Promise<AuthenticateCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialError();
    }

    return { user };
  }
}

export default AuthenticateUseCase;
