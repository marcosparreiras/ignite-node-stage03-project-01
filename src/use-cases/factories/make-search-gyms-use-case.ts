import PrismaGymsRepository from "@/repositories/prisma/prisma-gyms-repository";
import SearchGymsUseCase from "../search-gyms";

function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const searchGymsUseCase = new SearchGymsUseCase(gymsRepository);
  return searchGymsUseCase;
}

export default makeSearchGymsUseCase;
