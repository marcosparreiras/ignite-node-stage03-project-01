import PrismaCheckInsRepository from "@/repositories/prisma/prisma-check-ins-repository";
import ValidateCheckInUseCase from "../validate-check-in";

function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository);
  return validateCheckInUseCase;
}

export default makeValidateCheckInUseCase;
