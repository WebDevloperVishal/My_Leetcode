import { db } from "../lib/db.js";

export const createPlayList = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        const playList = await db.playlist.create({
            data: {
                name,
                description,
                userId,
            },
        });
        res.status(200).json({ success: true, message: 'Playlist created successfully', playList, });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ error: 'Failed to create playlist (this playlist allready created)' });
    }
};

export const getPlayAllListDetails = async (req, res) => {
    try {
        const playLists = await db.playlist.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    },
                },
            }
        });

        res.status(200).json({ success: true, message: 'Playlist fetched successfully', playLists });
    } catch (error) {

    }
};

export const getPlayListDetails = async (req, res) => { };

export const addProblemToPlayList = async (req, res) => { };

export const deletePlayList = async (req, res) => { };

export const removeProblemFromPlayList = async (req, res) => { };