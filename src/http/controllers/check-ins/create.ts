import makeCheckInUseCase from "@/use-cases/factories/make-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

async function create(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    gymId: z.string().uuid(),
  });
  const requestBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = requestParamsSchema.parse(request.params);
  const { latitude, longitude } = requestBodySchema.parse(request.body);

  const checkInUseCase = makeCheckInUseCase();
  await checkInUseCase.execute({
    userId: request.user.sub,
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
  });
  return reply.status(201).send();
}

export default create;
