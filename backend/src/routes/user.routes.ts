import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getMe } from "../controllers/user.controller";

const router = Router();

router.use(requireAuth);
router.get("/me", getMe);

export default router;
