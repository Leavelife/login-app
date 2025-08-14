import jwt from "jsonwebtoken";
import "dotenv/config";

export function generateAccessToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
