import CheckInsRepository from "@/repositories/check-ins-repository";
import { describe, beforeEach, it, expect } from "vitest";
import GetUserMetricsUseCase from "./get-user-metrics";
import InMemoryCheckInRepository from "@/repositories/in-memory/in-memory-check-in-repository";

let checkInsRepository: CheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("GetUserMetricsUseCase", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("Should be able to get user check-ins count from metrics", async () => {
    for (let i = 1; i <= 18; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-1",
      });
    }

    const { checkInsCount } = await sut.execute({ userId: "user-1" });
    expect(checkInsCount).toEqual(18);
  });
});
