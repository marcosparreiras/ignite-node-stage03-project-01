import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import CheckInsRepository from "@/repositories/check-ins-repository";
import CheckInUseCase from "./check-in";
import InMemoryCheckInRepository from "@/repositories/in-memory/in-memory-check-in-repository";
import InMemoryGymRepository from "@/repositories/in-memory/in-memory-gym-repository";
import MaxNumberOfCheckInsError from "./errors/max-number-of-check-ins-error";
import MaxDistanceError from "./errors/max-distance-error";

let checkInsRepository: CheckInsRepository;
let gymsRepository: InMemoryGymRepository;
let sut: CheckInUseCase;

describe("CheckInUseCase", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInRepository();
    gymsRepository = new InMemoryGymRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.create({
      id: "gym-1",
      title: "Academia",
      description: "Academia Fake",
      latitude: 0,
      longitude: 0,
      phone: "",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0));
    await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() => {
      return sut.execute({
        gymId: "gym-1",
        userId: "user-1",
        userLatitude: 0,
        userLongitude: 0,
      });
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("Should be able to check in twice, but in different days", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0));
    await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2023, 0, 2, 8, 0, 0));
    const { checkIn } = await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Shoud not be able to check in on distant gym", async () => {
    gymsRepository.create({
      id: "gym-2",
      title: "Academia 2",
      description: "Academia Fake 2",
      latitude: -19.9429783,
      longitude: 43.92534,
      phone: "",
    });

    await expect(() => {
      return sut.execute({
        gymId: "gym-2",
        userId: "user-1",
        userLatitude: -19.9453752,
        userLongitude: -43.93268,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
