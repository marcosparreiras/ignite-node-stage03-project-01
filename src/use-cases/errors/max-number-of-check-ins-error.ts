class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super("Max number o check-ins reached.");
  }
}

export default MaxNumberOfCheckInsError;
