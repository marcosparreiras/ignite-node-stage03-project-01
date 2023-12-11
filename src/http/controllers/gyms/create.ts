import makeCreateGymUseCase from "@/use-cases/factories/make-create-gym-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

async function create(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable().default(null),
    phone: z.string().nullable().default(null),
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { title, description, phone, latitude, longitude } =
    requestBodySchema.parse(request.body);

  const createGymUseCase = makeCreateGymUseCase();
  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  });

  return reply.status(201).send();
}

export default create;
