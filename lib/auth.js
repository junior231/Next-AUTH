import { hash, compare } from "bcryptjs";

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);

  return hashedPassword;
}

export async function verifyPassword(password, hashedPasssword) {
  const isValid = await compare(password, hashedPasssword);

  return isValid;
}
