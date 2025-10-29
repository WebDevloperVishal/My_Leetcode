import express from "express";
import { authenticate, checkAdmin } from "../middlewares/auth.middleware.js";
import {
    createProblem,
    deleteProblem,
    getAllProblems,
    getAllProblemSolvedByUser,
    getProblemById,
    updateProblem
} from "../controllers/problem.contoler.js";

const router = express.Router();

router.post("/create-problem", authenticate, checkAdmin, createProblem);

router.get("/get-all-problems", authenticate, getAllProblems);

router.get("/get-problem/:id", getProblemById);

router.put("/update-problem/:id", authenticate, checkAdmin, updateProblem);

router.delete("/delete-problem/:id", authenticate, checkAdmin, deleteProblem);

router.get("/get-solved-problem", authenticate, getAllProblemSolvedByUser);
export default router;