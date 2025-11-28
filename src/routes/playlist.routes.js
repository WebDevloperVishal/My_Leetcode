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

router.get("/", authenticate, getPlayAllListDetails);

router.get("/:playlistid", authenticate, getPlayListDetails);

router.post("/create-playlist", authenticate, createPlayList);

router.post("/:playlistId/add-problem", authenticate, addProblemToPlayList);

router.delete("/:playlistId", authenticate, deletePlayList);

router.delete("/:playlistId/remove-problem", authenticate, removeProblemFromPlayList)


export default router;