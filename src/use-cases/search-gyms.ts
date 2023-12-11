import GymsRepository from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface SearchGymsUseCaseRequest {
  query: string;
  page: number;
}

interface SearchGymsUseCaseRespose {
  gyms: Gym[];
}

class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseRespose> {
    const gyms = await this.gymsRepository.searchMany(query, page);
    return { gyms };
  }
}

export default SearchGymsUseCase;
