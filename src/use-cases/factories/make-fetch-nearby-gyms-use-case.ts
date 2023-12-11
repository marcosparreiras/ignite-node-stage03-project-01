import PrismaGymsRepository from "@/repositories/prisma/prisma-gyms-repository";
import FetchNearbyGymsUseCase from "../fetch-nearby-gyms";

function makeFecthNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository);
  return fetchNearbyGymsUseCase;
}

export default makeFecthNearbyGymsUseCase;
