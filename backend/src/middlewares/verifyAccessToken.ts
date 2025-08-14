import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import prisma from "../config/db";

export type UserJwt = JwtPayload & {
  id: number;
  email: string;
};

export const verifyAccessToken = async ({ request, set }: { request: any; set: any }) => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    set.status = 401;
    return { error: "No token provided" };
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      set.status = 500;
      return { error: "JWT_SECRET not configured" };
    }
    
    const decoded = jwt.verify(token, jwtSecret) as unknown as UserJwt;

    if (!decoded.id) {
      set.status = 401;
      return { error: "Token tidak valid - ID tidak ditemukan" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true
      }
    });

    if (!dbUser) {
      set.status = 404;
      return { error: `User dengan ID ${decoded.id} tidak ditemukan di database` };
    }

    return { user: dbUser };
  } catch (error) {
    console.error("Error in verifyAccessToken:", error);
    set.status = 401;
    return { error: "Invalid or expired token" };
  }
};