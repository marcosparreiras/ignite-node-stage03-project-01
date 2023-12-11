import { describe, beforeEach, it, expect, vi, afterEach } from "vitest";
import CheckInsRepository from "@/repositories/check-ins-repository";
import ValidateCheckInUseCase from "./validate-check-in";
import InMemoryCheckInRepository from "@/repositories/in-memory/in-memory-check-in-repository";
import { CheckIn } from "@prisma/client";
import ResourceNotFoundError from "./errors/resource-not-found";
import LateCheckInValidationError from "./errors/late-check-in-validation-error";

let checkInsRepository: CheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("ValidateCheckInUseCase", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to validate the check-in", async () => {
    let checkIn: CheckIn | null = await checkInsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    const { checkIn: valdiatedCheckIn } = await sut.execute({
      checkInId: checkIn.id,
    });

    expect(valdiatedCheckIn.validated_at).toEqual(expect.any(Date));

    checkIn = await checkInsRepository.findById(checkIn.id);

    expect(checkIn?.validated_at).toEqual(expect.any(Date));
  });

  it("Should not be able to validate an inexistent check-in", async () => {
    await expect(() => {
      return sut.execute({ checkInId: "inexistent-check-in-id" });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should not be able to validate the check-in after 20 minutes os its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));
    const checkIn = await checkInsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() => {
      return sut.execute({ checkInId: checkIn.id });
    }).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
