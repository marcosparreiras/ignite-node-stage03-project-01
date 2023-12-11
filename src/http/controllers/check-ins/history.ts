import makeFectUserCheckInsHistoryUseCase from "@/use-cases/factories/make-fecth-user-check-ins-history-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

async function history(request: FastifyRequest, reply: FastifyReply) {
  const requestQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = requestQuerySchema.parse(request.query);

  const fectUserCheckInsHistoryUseCase = makeFectUserCheckInsHistoryUseCase();
  const { checkIns } = await fectUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(200).send({ checkIns });
}

export default history;
