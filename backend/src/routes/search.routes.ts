import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  createSearch,
  getSearchHistory,
  getServices,
  getGems,
  getAlerts,
  getTransit,
  getSafety,
} from "../controllers/search.controller";

const router = Router();

router.use(requireAuth);

router.post("/search", createSearch);
router.get("/search/history", getSearchHistory);
router.get("/search/services", getServices);
router.get("/search/services/gems", getGems);
router.get("/search/services/alerts", getAlerts);
router.get("/search/transit", getTransit);
router.get("/search/safety", getSafety);

export default router;
