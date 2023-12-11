import CheckInsRepository from "@/repositories/check-ins-repository";
import { describe, beforeEach, it, expect } from "vitest";
import FecthUserCheckInsHistoryUseCase from "./fecth-user-check-ins-history";
import InMemoryCheckInRepository from "@/repositories/in-memory/in-memory-check-in-repository";

let checkInsRespository: CheckInsRepository;
let sut: FecthUserCheckInsHistoryUseCase;

describe("FecthUserCheckInsHistoryUseCase", () => {
  beforeEach(() => {
    checkInsRespository = new InMemoryCheckInRepository();
    sut = new FecthUserCheckInsHistoryUseCase(checkInsRespository);
  });

  it("Should be able to fetch a user check-ins history", async () => {
    await checkInsRespository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    await checkInsRespository.create({
      gym_id: "gym-2",
      user_id: "user-1",
    });

    const { checkIns } = await sut.execute({ userId: "user-1", page: 1 });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-1" }),
      expect.objectContaining({ gym_id: "gym-2" }),
    ]);
  });

  it("Should be able to fecth paginated user check-ins history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRespository.create({
        gym_id: `gym-${i}`,
        user_id: "user-1",
      });
    }

    const { checkIns } = await sut.execute({ userId: "user-1", page: 2 });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
