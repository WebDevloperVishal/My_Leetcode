import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getAllSubmissions, getAllSubmissionsFroProblem, getAllTheSubmissionsForProblem,  } from "../controllers/submission.controller.js";


const router = express.Router();

router.get("/get-all-submission" , authenticate, getAllSubmissions);

router.get("/get-submissions/:problemid", authenticate, getAllSubmissionsFroProblem);

router.get("/get-submissions-count/:problemid", authenticate, getAllTheSubmissionsForProblem);

export default router;