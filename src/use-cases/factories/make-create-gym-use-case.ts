import PrismaGymsRepository from "@/repositories/prisma/prisma-gyms-repository";
import CreateGymUseCase from "../create-gym";

function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const createGymUseCase = new CreateGymUseCase(gymsRepository);
  return createGymUseCase;
}

export default makeCreateGymUseCase;
