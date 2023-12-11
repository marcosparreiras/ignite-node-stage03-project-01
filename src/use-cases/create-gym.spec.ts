import GymsRepository from "@/repositories/gyms-repository";
import { describe, beforeEach, it, expect } from "vitest";
import CreateGymUseCase from "./create-gym";
import InMemoryGymRepository from "@/repositories/in-memory/in-memory-gym-repository";

let gymsRepository: GymsRepository;
let sut: CreateGymUseCase;

describe("CreateGymUseCase", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("Should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "Gym",
      description: "Fake Gym",
      phone: "31 999999999",
      latitude: -19.9453752,
      longitude: -43.93268,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
