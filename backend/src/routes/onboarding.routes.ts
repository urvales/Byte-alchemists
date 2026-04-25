import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getOnboarding, saveOnboarding } from "../controllers/onboarding.controller";

const router = Router();

router.use(requireAuth);

router.get("/", getOnboarding);
router.post("/", saveOnboarding);

export default router;
