import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../services/db.service";

const JWT_SECRET = process.env.JWT_SECRET || "roamwise-dev-secret";
const JWT_EXPIRES = "7d";

function makeToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function safeUser(user: { id: string; email: string; firstName: string | null; lastName: string | null }) {
  return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
}

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
    if (password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ success: false, message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, firstName: firstName || null, lastName: lastName || null },
    });

    return res.status(201).json({
      success: true,
      data: { token: makeToken(user.id), user: safeUser(user) },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    return res.json({
      success: true,
      data: { token: makeToken(user.id), user: safeUser(user) },
    });
  } catch (err) {
    next(err);
  }
};
