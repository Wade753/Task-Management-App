import crypto from "crypto";
import { bcrypt, bcryptVerify } from "hash-wasm";
export const sanitizeEmail = (email: string): string => {
  // Trim white spaces and convert to lowercase
  const sanitizedEmail = email.trim().replace(/\s/g, "").toLowerCase();

  // Validate email format
  const emailRegex =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

  if (!emailRegex.test(sanitizedEmail)) throw new Error("Invalid email format");

  return sanitizedEmail;
};

const COST_FACTOR = 6;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);

  const hash = await bcrypt({
    password,
    salt,
    costFactor: COST_FACTOR,
    outputType: "encoded",
  });

  return hash;
}

export function verifyPassword(
  hashedPassword: string,
  password: string,
): Promise<boolean> {
  return bcryptVerify({
    password,
    hash: hashedPassword,
  });
}
