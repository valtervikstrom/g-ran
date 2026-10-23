import "dotenv/config";
import { SignJWT, jwtVerify } from "jose";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET saknas i .env");

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function readToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch {
    return null;
  }
}