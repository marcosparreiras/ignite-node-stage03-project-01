import GymsRepository from "@/repositories/gyms-repository";
import { describe, beforeEach, it, expect } from "vitest";
import SearchGymsUseCase from "./search-gyms";
import InMemoryGymRepository from "@/repositories/in-memory/in-memory-gym-repository";

let gymsRepository: GymsRepository;
let sut: SearchGymsUseCase;

describe("SearchGymsUseCase", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("Should be able to search gym by title", async () => {
    await gymsRepository.create({ title: "Gym 01", latitude: 0, longitude: 0 });
    await gymsRepository.create({ title: "Gym 02", latitude: 0, longitude: 0 });
    await gymsRepository.create({
      title: "Super Gym 02",
      latitude: 0,
      longitude: 0,
    });
    await gymsRepository.create({
      title: "Academia 01",
      latitude: 0,
      longitude: 0,
    });
    await gymsRepository.create({
      title: "Academia 02",
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({ query: "gym", page: 1 });
    expect(gyms).toHaveLength(3);
  });

  it("Should be able fetch paginated gyms search", async () => {
    for (let i = 1; i <= 23; i++) {
      await gymsRepository.create({
        title: `Gym-${i}`,
        latitude: 0,
        longitude: 0,
      });
    }

    const { gyms } = await sut.execute({ query: "gym", page: 2 });
    expect(gyms).toHaveLength(3);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Gym-21" }),
      expect.objectContaining({ title: "Gym-22" }),
      expect.objectContaining({ title: "Gym-23" }),
    ]);
  });
});
