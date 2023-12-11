import PrismaCheckInsRepository from "@/repositories/prisma/prisma-check-ins-repository";
import FecthUserCheckInsHistoryUseCase from "../fecth-user-check-ins-history";

function makeFectUserCheckInsHistoryUseCase() {
  const checkInsRespository = new PrismaCheckInsRepository();
  const fecthUserCheckInsHistoryUseCase = new FecthUserCheckInsHistoryUseCase(
    checkInsRespository
  );
  return fecthUserCheckInsHistoryUseCase;
}

export default makeFectUserCheckInsHistoryUseCase;
