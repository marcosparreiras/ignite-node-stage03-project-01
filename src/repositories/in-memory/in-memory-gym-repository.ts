import { randomUUID } from "node:crypto";
import { Gym, Prisma } from "@prisma/client";
import GymsRepository, { findManyNearbyParams } from "../gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import getDistanceBetweenCordinates from "@/utils/get-distance-between-coordinates";

class InMemoryGymRepository implements GymsRepository {
  private items: Gym[] = [];

  async findById(gymId: string) {
    const gym = this.items.find((item) => item.id === gymId);

    if (!gym) {
      return null;
    }
    return gym;
  }

  async findManyNearby(data: findManyNearbyParams) {
    const gyms = this.items.filter((item) => {
      const distance = getDistanceBetweenCordinates(
        { latitude: data.latitude, longitude: data.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      );

      return distance < 10; // 10 km
    });

    return gyms;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.items.push(gym);

    return gym;
  }

  async searchMany(query: string, page: number) {
    const gyms = this.items
      .filter((item) => item.title.toLocaleLowerCase().includes(query))
      .slice((page - 1) * 20, page * 20);
    return gyms;
  }
}

export default InMemoryGymRepository;
