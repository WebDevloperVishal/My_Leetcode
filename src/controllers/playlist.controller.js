import { db } from "../lib/db.js";

export const createPlayList = async (req, res) => { 
    try {
        const { name, description } = req.body;
        const userId= req.user.id;

        const PlayList = await db.playlist.create({
            data: {
                name,
                description,
                userId,
            },
        });
    } catch (error) {
        
    }
};

export const getPlayAllListDetails = async (req, res) => { };

export const getPlayListDetails = async (req, res) => { };

export const addProblemToPlayList = async (req, res) => { };

export const deletePlayList = async (req, res) => { };

export const removeProblemFromPlayList = async (req, res) => { };