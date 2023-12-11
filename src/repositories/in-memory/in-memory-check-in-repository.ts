import { randomUUID } from "node:crypto";
import dayjs from "dayjs";
import { CheckIn, Prisma } from "@prisma/client";
import CheckInsRepository from "../check-ins-repository";

class InMemoryCheckInRepository implements CheckInsRepository {
  private items: CheckIn[] = [];

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id);
    if (!checkIn) {
      return null;
    }
    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
      return isOnSameDate && checkIn.user_id === userId;
    });

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20);
    return checkIns;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      gym_id: data.gym_id,
      user_id: data.user_id,
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    };

    this.items.push(checkIn);
    return checkIn;
  }

  async countByUserId(user_id: string) {
    const checkIns = this.items.filter((item) => item.user_id === user_id);
    return checkIns.length;
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);
    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn;
    }
    return checkIn;
  }
}

export default InMemoryCheckInRepository;
