import { Router } from "express";
import { requireAuth, optionalAuth } from "../middleware/auth";
import {
  listExperiences,
  getExperience,
  createExperience,
  toggleLike,
  deleteExperience,
} from "../controllers/experience.controller";

const router = Router();

// Public routes (optionalAuth lets us check "likedByMe" if logged in)
router.get("/", optionalAuth, listExperiences);
router.get("/:id", optionalAuth, getExperience);

// Protected routes
router.post("/", requireAuth, createExperience);
router.post("/:id/like", requireAuth, toggleLike);
router.delete("/:id", requireAuth, deleteExperience);

export default router;
