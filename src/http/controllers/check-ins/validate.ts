import makeValidateCheckInUseCase from "@/use-cases/factories/make-validate-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

async function validate(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });
  const { checkInId } = requestParamsSchema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();
  await validateCheckInUseCase.execute({
    checkInId,
  });
  return reply.status(204).send();
}

export default validate;
