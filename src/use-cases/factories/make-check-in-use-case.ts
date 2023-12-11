import PrismaCheckInsRepository from "@/repositories/prisma/prisma-check-ins-repository";
import CheckInUseCase from "../check-in";
import PrismaGymsRepository from "@/repositories/prisma/prisma-gyms-repository";

function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository);
  return checkInUseCase;
}

export default makeCheckInUseCase;