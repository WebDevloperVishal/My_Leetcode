import express from "express";
import { authenticate, checkAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/create-problem", authenticate, checkAdmin , createProblem)

export default router;