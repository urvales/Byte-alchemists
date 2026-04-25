import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "roamwise-dev-secret";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as { userId: string };
    (req as any).auth = { userId: payload.userId };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
