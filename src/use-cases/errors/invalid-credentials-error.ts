class InvalidCredentialError extends Error {
  constructor() {
    super("Invalid credentials.");
  }
}

export default InvalidCredentialError;
