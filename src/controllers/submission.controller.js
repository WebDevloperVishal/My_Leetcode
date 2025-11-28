import { db } from "../lib/db.js";

export const getAllSubmissions = async (req, res) => {
    try {
        const userId = req.user.id;
        const submissions = await db.submission.findMany({
            where: {
                userId: userId
            },
        })

        res.status(200).json({ success: true, message: "Submission Fetch succeddfully", submissions });
    } catch (error) {
        console.log("fetch Submissions Error", error);
        res.status(500).json({ error: "failed to Fetch sudmission" })
    }
};

export const getAllSubmissionsFroProblem = async (req, res) => {
    try {
        const userId = req.user.id;
        const problemId = req.params.problemId;
        const submissions = await db.submission.findMany({
            where:{
                userId: userId,
                problemId: problemId
            },
        })


        res.status(200).json({
            success: true,
            message: "Submissions fetch successfully", 
            submissions,
        })
    } catch (error) {
        console.log("Fetch Submittions Error", error);
        res.status(500).json({ error: "Failed to fetch submissions"})
    }
 };

export const getAllTheSubmissionsForProblem = async (req, res) => { };