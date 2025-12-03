// import { db } from "../lib/db.js";

// export const getAllSubmissions = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const submissions = await db.submission.findMany({
//             where: {
//                 userId: userId
//             },
//         })

//         res.status(200).json({ success: true, message: "Submission Fetch succeddfully", submissions });
//     } catch (error) {
//         console.log("fetch Submissions Error", error);
//         res.status(500).json({ error: "failed to Fetch sudmission" })
//     }
// };

// export const getAllSubmissionsFroProblem = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const problemId = req.params.problemId;
//         const submissions = await db.submission.findMany({
//             where:{
//                 userId: userId,
//                 problemId: problemId
//             },
//         })

//         res.status(200).json({
//             success: true,
//             message: "Submissions fetch successfully", 
//             submissions,
//         })
//     } catch (error) {
//         console.log("Fetch Submittions Error", error);
//         res.status(500).json({ error: "Failed to fetch submissions"})
//     }
//  };

// export const getAllTheSubmissionsForProblem = async (req, res) => {
//     try {
//         const problemId = req.params.problemId;
//         const submissions = await db.submission.count({
//             where:{
//                 problemId: problemId
//             }
//         })

//         res.status(200).json({
//             success: true,
//             message: "submissions fetch successfully",
//             count: submissions,
//         })
//     } catch (error) {
//         console.log("fetch submissions Error", error);
//         res.status(500).json({ error: "Failed to fetch submmittions"})
//     }
//  };


// =========================================================================== //


// Import database connection from the lib folder
import { db } from "../lib/db.js";

// Function to get all submissions made by the current logged-in user
export const getAllSubmissions = async (req, res) => {
    try {
        // Get the logged-in user's ID from the request
        const userId = req.user.id;
        // Fetch all submissions from database that belong to this user
        const submissions = await db.submission.findMany({
            where: {
                userId: userId
            },
        })

        // Send success response with all user's submissions
        res.status(200).json({ success: true, message: "Submission Fetch succeddfully", submissions });
    } catch (error) {
        // Log error to console for debugging
        console.log("fetch Submissions Error", error);
        // Send error response to the client
        res.status(500).json({ error: "failed to Fetch sudmission" })
    }
};


// =========================================================================== //


// Function to get all submissions made by current user for a specific problem
export const getAllSubmissionsFroProblem = async (req, res) => {
    try {
        // Get the logged-in user's ID from the request
        const userId = req.user.id;
        // Extract problem ID from URL parameters
        const problemId = req.params.problemId;
        // Fetch submissions that match both user ID and problem ID
        const submissions = await db.submission.findMany({
            where:{
                userId: userId,
                problemId: problemId
            },
        })

        // Send success response with filtered submissions
        res.status(200).json({
            success: true,
            message: "Submissions fetch successfully", 
            submissions,
        })
    } catch (error) {
        // Log error to console for debugging
        console.log("Fetch Submittions Error", error);
        // Send error response to the client
        res.status(500).json({ error: "Failed to fetch submissions"})
    }
 };


// =========================================================================== //


// Function to get the total count of all submissions for a specific problem (by all users)
export const getAllTheSubmissionsForProblem = async (req, res) => {
    try {
        // Extract problem ID from URL parameters
        const problemId = req.params.problemId;
        // Count total number of submissions for this problem
        const submissions = await db.submission.count({
            where:{
                problemId: problemId
            }
        })

        // Send success response with submission count
        res.status(200).json({
            success: true,
            message: "submissions fetch successfully",
            count: submissions,
        })
    } catch (error) {
        // Log error to console for debugging
        console.log("fetch submissions Error", error);
        // Send error response to the client
        res.status(500).json({ error: "Failed to fetch submmittions"})
    }
 };