import { Gym, Prisma } from "@prisma/client";
import GymsRepository, { findManyNearbyParams } from "../gyms-repository";
import prisma from "@/lib/prisma";

class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({ where: { id } });
    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = prisma.gym.create({ data });
    return gym;
  }

  async searchMany(query: string, page: number) {
    const gyms = prisma.gym.findMany({
      where: { title: { contains: query } },
      take: 20,
      skip: (page - 1) * 20,
    });
    return gyms;
  }

  async findManyNearby({ latitude, longitude }: findManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * From gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;
    return gyms;
  }
}

export default PrismaGymsRepository;
