import PrismaUsersRepository from "@/repositories/prisma/prisma-users-repository";
import AuthenticateUseCase from "../authenticate";

function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUseCase(usersRepository);
  return authenticateUseCase;
}

export default makeAuthenticateUseCase;
