import { Request, Response, NextFunction } from "express";
import { prisma } from "../services/db.service";

export const listExperiences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city } = req.query as { city?: string };
    const userId = (req as any).auth?.userId as string | undefined;

    const where = city ? { cityName: { equals: city, mode: "insensitive" as const } } : {};

    const experiences = await prisma.experience.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        points: { orderBy: { sortOrder: "asc" } },
        _count: { select: { likes: true } },
        ...(userId ? { likes: { where: { userId }, select: { id: true } } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const data = experiences.map((exp: any) => ({
      ...exp,
      likeCount: exp._count.likes,
      likedByMe: userId ? exp.likes?.length > 0 : false,
      _count: undefined,
      likes: undefined,
    }));

    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).auth?.userId as string | undefined;

    const exp = await prisma.experience.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        points: { orderBy: { sortOrder: "asc" } },
        _count: { select: { likes: true } },
        ...(userId ? { likes: { where: { userId }, select: { id: true } } } : {}),
      },
    });

    if (!exp) return res.status(404).json({ success: false, message: "Experience not found" });

    const data = {
      ...exp,
      likeCount: (exp as any)._count.likes,
      likedByMe: userId ? (exp as any).likes?.length > 0 : false,
      _count: undefined,
      likes: undefined,
    };

    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).auth?.userId as string;
    const { cityName, title, description, overallRating, points } = req.body as {
      cityName: string;
      title: string;
      description: string;
      overallRating: number;
      points: { name: string; description: string; rating: number }[];
    };

    if (!cityName?.trim()) return res.status(400).json({ success: false, message: "`cityName` is required." });
    if (!title?.trim()) return res.status(400).json({ success: false, message: "`title` is required." });
    if (!description?.trim()) return res.status(400).json({ success: false, message: "`description` is required." });
    if (!overallRating || overallRating < 1 || overallRating > 5) {
      return res.status(400).json({ success: false, message: "`overallRating` must be between 1 and 5." });
    }
    if (!points || !Array.isArray(points) || points.length === 0) {
      return res.status(400).json({ success: false, message: "At least one point is required." });
    }

    const exp = await prisma.experience.create({
      data: {
        userId,
        cityName: cityName.trim(),
        title: title.trim(),
        description: description.trim(),
        overallRating,
        points: {
          create: points.map((p, i) => ({
            name: p.name.trim(),
            description: p.description.trim(),
            rating: Math.min(5, Math.max(1, p.rating)),
            sortOrder: i,
          })),
        },
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        points: { orderBy: { sortOrder: "asc" } },
      },
    });

    return res.status(201).json({ success: true, data: { ...exp, likeCount: 0, likedByMe: false } });
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).auth?.userId as string;
    const { id } = req.params;

    const existing = await prisma.experienceLike.findUnique({
      where: { experienceId_userId: { experienceId: id, userId } },
    });

    if (existing) {
      await prisma.experienceLike.delete({ where: { id: existing.id } });
      return res.json({ success: true, liked: false });
    } else {
      await prisma.experienceLike.create({ data: { experienceId: id, userId } });
      return res.json({ success: true, liked: true });
    }
  } catch (err) {
    next(err);
  }
};

export const deleteExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).auth?.userId as string;
    const { id } = req.params;

    const exp = await prisma.experience.findUnique({ where: { id } });
    if (!exp) return res.status(404).json({ success: false, message: "Experience not found" });
    if (exp.userId !== userId) return res.status(403).json({ success: false, message: "Not authorized" });

    await prisma.experience.delete({ where: { id } });
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
