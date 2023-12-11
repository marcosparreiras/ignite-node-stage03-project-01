import PrismaUsersRepository from "@/repositories/prisma/prisma-users-repository";
import GetUserProfileUseCase from "../get-user-profile";

function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);
  return getUserProfileUseCase;
}

export default makeGetUserProfileUseCase;
