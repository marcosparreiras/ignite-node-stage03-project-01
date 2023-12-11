import { describe, beforeEach, it, expect } from "vitest";
import GymsRepository from "@/repositories/gyms-repository";
import FetchNearbyGymsUseCase from "./fetch-nearby-gyms";
import InMemoryGymRepository from "@/repositories/in-memory/in-memory-gym-repository";

let gymsRepository: GymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("FetchNearbyGymsUseCase", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("Should be able to fetch neraby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      latitude: -19.9429783,
      longitude: -43.92534,
    });

    await gymsRepository.create({
      title: "Far Gym",
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({
      userLatitude: -19.9453752,
      userLongitude: -43.93268,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
