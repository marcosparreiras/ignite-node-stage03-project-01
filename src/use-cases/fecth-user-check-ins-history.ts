import CheckInsRepository from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";

interface FecthUserCheckInsHistoryUseCaseRequest {
  userId: string;
  page: number;
}

interface FecthUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

class FecthUserCheckInsHistoryUseCase {
  constructor(private checkInsRespository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FecthUserCheckInsHistoryUseCaseRequest): Promise<FecthUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRespository.findManyByUserId(
      userId,
      page
    );
    return { checkIns };
  }
}

export default FecthUserCheckInsHistoryUseCase;
