import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
    addProblemToPlayList,
    createPlayList,
    deletePlayList,
    getPlayAllListDetails,
    getPlayListDetails,
    removeProblemFromPlayList
} from "../controllers/playlist.controller.js";

const router = express.Router();

router.post("/create-playlist", authenticate, createPlayList);

router.get("/", authenticate, getPlayAllListDetails);

router.get("/:playlistId", authenticate, getPlayListDetails);

router.post("/:playlistId/add-problem", authenticate, addProblemToPlayList);

router.delete("/:playlistId", authenticate, deletePlayList);

router.delete("/:playlistId/remove-problem", authenticate, removeProblemFromPlayList)

export default router;