import { Request, Response, NextFunction } from "express";
import { prisma } from "../services/db.service";

// GET /api/users/me
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).auth?.userId as string;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preference: true },
    });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        onboardingComplete: !!user.preference,
        preferences: user.preference?.preferences ?? [],
      },
    });
  } catch (err) {
    next(err);
  }
};
