import { Request, Response, NextFunction } from "express";
import { prisma } from "../services/db.service";

const MIN_PREFERENCES = 5;

export const getOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).auth?.userId as string;
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { preference: true } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      data: { isComplete: !!user.preference, preferences: user.preference?.preferences ?? [] },
    });
  } catch (err) {
    next(err);
  }
};

export const saveOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).auth?.userId as string;
    const { preferences } = req.body as { preferences: string[] };

    if (!Array.isArray(preferences) || preferences.length < MIN_PREFERENCES) {
      return res.status(400).json({ success: false, message: `Select at least ${MIN_PREFERENCES} preferences.` });
    }

    const saved = await prisma.userPreference.upsert({
      where: { userId },
      update: { preferences },
      create: { userId, preferences },
    });

    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
};
