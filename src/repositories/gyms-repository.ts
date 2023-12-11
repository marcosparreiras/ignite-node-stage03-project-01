import { Gym, Prisma } from "@prisma/client";

export interface findManyNearbyParams {
  latitude: number;
  longitude: number;
}

interface GymsRepository {
  findById(gymId: string): Promise<Gym | null>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  findManyNearby(data: findManyNearbyParams): Promise<Gym[]>;
}

export default GymsRepository;
