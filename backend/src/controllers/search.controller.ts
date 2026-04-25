import { Request, Response, NextFunction } from "express";
import { prisma } from "../services/db.service";
import { MOCK_SERVICES, MOCK_GEMS, MOCK_ALERTS, MOCK_TRANSIT, MOCK_SAFETY, MOCK_MEDICAL_COSTS } from "../data/mock";

export const createSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).auth?.userId as string;
    const { destination, date, experience, guests } = req.body as {
      destination: string; date?: string; experience?: string; guests?: string;
    };

    if (!destination?.trim()) return res.status(400).json({ success: false, message: "`destination` is required." });

    const log = await prisma.searchLog.create({
      data: { userId, destination: destination.trim(), date: date ?? null, experience: experience ?? null, guests: guests ?? null },
    });

    return res.status(201).json({
      success: true,
      data: { searchId: log.id, destination, results: { services: MOCK_SERVICES, gems: MOCK_GEMS, alerts: MOCK_ALERTS } },
    });
  } catch (err) {
    next(err);
  }
};

export const getSearchHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).auth?.userId as string;
    const history = await prisma.searchLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 });
    return res.json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query as { category?: string };
    if (category && category in MOCK_SERVICES) {
      return res.json({ success: true, data: MOCK_SERVICES[category as keyof typeof MOCK_SERVICES] });
    }
    return res.json({ success: true, data: MOCK_SERVICES });
  } catch (err) { next(err); }
};

export const getGems = async (_req: Request, res: Response, next: NextFunction) => {
  try { return res.json({ success: true, data: MOCK_GEMS }); } catch (err) { next(err); }
};

export const getAlerts = async (_req: Request, res: Response, next: NextFunction) => {
  try { return res.json({ success: true, data: MOCK_ALERTS }); } catch (err) { next(err); }
};

export const getTransit = async (_req: Request, res: Response, next: NextFunction) => {
  try { return res.json({ success: true, data: MOCK_TRANSIT }); } catch (err) { next(err); }
};

export const getSafety = async (_req: Request, res: Response, next: NextFunction) => {
  try { return res.json({ success: true, data: { ...MOCK_SAFETY, medicalCosts: MOCK_MEDICAL_COSTS } }); } catch (err) { next(err); }
};
