// import { db } from "../lib/db.js";
// import {
//   getJudge0LanguageId,
//   //  getJudge0Result,
//   pollBatchResults,
//   submitBatch,
// } from "../lib/judge0.js";

// export const createProblem = async (req, res) => {
//   const {
//     title,
//     description,
//     difficulty,
//     tags,
//     examples,
//     constraints,
//     testCases,
//     codeSnippets,
//     referenceSolutions,
//     hints,
//     editorial,
//   } = req.body;

//   try {
//     for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
//       const languageId = getJudge0LanguageId(language);

//       if (!languageId) {
//         return res
//           .status(400)
//           .json({ error: `Unsupported language: ${language}` });
//       }

//       //   Prepare judge0 submission for all testcases
//       const submissions = testCases.map(({ input, output }) => ({
//         source_code: solutionCode,
//         language_id: languageId,
//         stdin: input,
//         expected_output: output,
//       }));

//       const submissionResults = await submitBatch(submissions);

//       const tokens = submissionResults.map((res) => res.token);

//       const results = await pollBatchResults(tokens);

//       for (let i = 0; i < results.length; i++) {
//         const result = results[i];
//         if (result.status.id !== 3) {
//           return res.status(400).json({
//             error: `Validation failed for ${language} on input: ${submissions[i].stdin}`,
//             details: result,
//           });
//         }
//       }
//     }


//     const newProblem = await db.problem.create({
//       data: {
//         title,
//         description,
//         difficulty,
//         tags,
//         examples,
//         constraints,
//         testCases,
//         codeSnippets,
//         referenceSolutions,
//         hints,
//         editorial,
//         userId: req.user.id
//       }
//     })

//     res.status(201).json({
//       success: true,
//       message: 'Problem created successfully',
//       problem: newProblem,
//     });
//   } catch (error) {
//     console.error('Error creating problem:', error);
//     res.status(500).json({ error: 'Failed to create problem' });
//   }
// };

// export const getAllProblems = async (req, res) => {
//   try {
//     // Get all the problem and also check that this is solved by current user or not
//     const problems = await db.problem.findMany({
//       include: {
//         solvedBy: {
//           where: {
//             userId: req.user.id,
//           },
//         },
//       },
//     });
//     res.status(200).json({
//       success: true,
//       message: 'Problems fetched successfully',
//       problems,
//     });
//   } catch (error) {
//     console.error('Error fetching problems:', error);
//     res.status(500).json({ error: 'Failed to fetch problems' });
//   }
// };

// export const getProblemById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const problem = await db.problem.findUnique({ where: { id } });
//     if (!problem) {
//       return res.status(404).json({ error: 'Problem not found' });
//     }
//     res.status(200).json({
//       success: true,
//       message: 'Problem fetched successfully',
//       problem,
//     });
//   } catch (error) {
//     console.error('Error fetching problem:', error);
//     res.status(500).json({ error: 'Failed to fetch problem' });
//   }
// };

// export const updateProblem = async (req, res) => {

//   try {

//     const { id } = req.params;

//     const {
//       title,
//       description,
//       difficulty,
//       tags,
//       examples,
//       constraints,
//       testCases,
//       codeSnippets,
//       referenceSolutions
//     } = req.body;

//     const problem = await db.problem.findUnique({ where: { id } });

//     if (!problem) {
//       return res.status(404).json({ error: "problem was not found" });
//     }

//     if (req.user.role !== "ADMIN") {
//       return res.status(404).json({ error: "Only Admin can update problems" });
//     }


//     for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
//       const languageId = getJudge0LanguageId(language);
//       if (!languageId) {
//         return res.status(400).json({ error: `Unsupporetd language: ${language}` });
//       }

//       const submissions = testCases.map(({ input, output }) => ({
//         source_code: solutionCode,
//         language_id: languageId,
//         stdin: input,
//         expected_output: output,
//       }));

//       console.log("submissions:", submissions)

//       const submissionResults = await submitBatch(submissions);

//       const tokens = submissionResults.map((res) => res.token);

//       const results = await pollBatchResults(tokens);

//       for (let i = 0; i < results.length; i++) {
//         const result = results[i];
//         if (result.status.id !== 3) {
//           return res.status(400).json({
//             error: `Validation failed for ${language} on input: ${submissions[i].stdin}`,
//             details: result,
//           });
//         }
//       }
//     }

//     const updateProblem = await db.problem.update({
//       where: { id },
//       data: {
//         title,
//         description,
//         difficulty,
//         tags,
//         examples,
//         constraints,
//         testCases,
//         codeSnippets,
//         referenceSolutions
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Problem upated successfully",
//       problem: updateProblem,
//     })

//   } catch (error) {
//     console.log("Enter creating problem:", error);
//     res.status(500).json({ error: "Failed to update problem" })
//   }
// };

// export const deleteProblem = async (req, res) => { 
//   try {
//     const {id} = req.params;

//     const problem = await db.problem.findUnique({ where: {id}});

//     if (!problem) { return res.status(404).json({ error: "Problem not found"})}

//     await db.problem.delete({ where: {id}});

//     res.status(200).json({ success: true, message: "Problem delete successfully"})
//   } catch (error) {
//     console.log("Error deleting problem", error);
//   }
//  };

// export const getAllProblemSolvedByUser = async (req, res) => { 
//   try {
//     const problems = await db.problem.findMany({
//       where:{
//         solvedBy:{
//           some:{
//             userId: req.user.id,
//           },
//         },
//       },
//       include: {
//         solvedBy:{
//           where:{
//             userId: req.user.id,
//           },
//         },
//       },
//     });
//     res.status(200).json({ success: true, message: "Problem Fetched successfully", problems});
//   } catch (error) {
//     console.log("Error fetching problem", error);
//     res.status(500).json({ error:"failed to fetch problem"});
//   }
// };


// =========================================================================== //


// Import database connection from the lib folder
import { db } from "../lib/db.js";
// Import Judge0 helper functions for code execution and validation
import {
  getJudge0LanguageId,
  //  getJudge0Result,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.js";

// Function to create a new coding problem
export const createProblem = async (req, res) => {
  // Extract all problem details from request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    referenceSolutions,
    hints,
    editorial,
  } = req.body;

  try {
    // Loop through each reference solution (different programming languages)
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      // Get the Judge0 language ID for the current language
      const languageId = getJudge0LanguageId(language);

      // If language is not supported, return error
      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Unsupported language: ${language}` });
      }

      //   Prepare judge0 submission for all testcases
      // Create submission objects for each test case
      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      // Submit all test cases to Judge0 for execution
      const submissionResults = await submitBatch(submissions);

      // Extract tokens from submission results to track execution
      const tokens = submissionResults.map((res) => res.token);

      // Wait and get the results of all submitted test cases
      const results = await pollBatchResults(tokens);

      // Check each test case result
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        // If status is not 3 (Accepted), validation failed
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Validation failed for ${language} on input: ${submissions[i].stdin}`,
            details: result,
          });
        }
      }
    }

    // If all validations pass, create the problem in database
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
        hints,
        editorial,
        userId: req.user.id
      }
    })

    // Send success response with the newly created problem
    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      problem: newProblem,
    });
  } catch (error) {
    // Log error to console for debugging
    console.error('Error creating problem:', error);
    // Send error response to the client
    res.status(500).json({ error: 'Failed to create problem' });
  }
};


// ============================================================================= //


// Function to get all problems from database
export const getAllProblems = async (req, res) => {
  try {
    // Get all the problem and also check that this is solved by current user or not
    // Fetch all problems and include solved status for current user
    const problems = await db.problem.findMany({
      include: {
        solvedBy: {
          // Filter to show only if current user has solved it
          where: {
            userId: req.user.id,
          },
        },
      },
    });
    // Send success response with all problems
    res.status(200).json({
      success: true,
      message: 'Problems fetched successfully',
      problems,
    });
  } catch (error) {
    // Log error to console for debugging
    console.error('Error fetching problems:', error);
    // Send error response to the client
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
};

// ========================================================================== //

// Function to get a single problem by its ID
export const getProblemById = async (req, res) => {
  // Extract problem ID from URL parameters
  const { id } = req.params;

  try {
    // Find the specific problem by ID in database
    const problem = await db.problem.findUnique({ where: { id } });
    // If problem doesn't exist, return error
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    // Send success response with the problem details
    res.status(200).json({
      success: true,
      message: 'Problem fetched successfully',
      problem,
    });
  } catch (error) {
    // Log error to console for debugging
    console.error('Error fetching problem:', error);
    // Send error response to the client
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
};



// ======================================================================== //


// Function to update an existing problem
export const updateProblem = async (req, res) => {

  try {

    // Extract problem ID from URL parameters
    const { id } = req.params;

    // Extract updated problem details from request body
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions
    } = req.body;

    // Check if problem exists in database
    const problem = await db.problem.findUnique({ where: { id } });

    // If problem doesn't exist, return error
    if (!problem) {
      return res.status(404).json({ error: "problem was not found" });
    }

    // Check if user is an admin (only admins can update problems)
    if (req.user.role !== "ADMIN") {
      return res.status(404).json({ error: "Only Admin can update problems" });
    }

    // Validate reference solutions by running them against test cases
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      // Get Judge0 language ID for the current language
      const languageId = getJudge0LanguageId(language);
      // If language is not supported, return error
      if (!languageId) {
        return res.status(400).json({ error: `Unsupporetd language: ${language}` });
      }

      // Create submission objects for each test case
      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      console.log("submissions:", submissions)

      // Submit all test cases to Judge0 for execution
      const submissionResults = await submitBatch(submissions);

      // Extract tokens from submission results
      const tokens = submissionResults.map((res) => res.token);

      // Wait and get the results of all submitted test cases
      const results = await pollBatchResults(tokens);

      // Check each test case result
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        // If status is not 3 (Accepted), validation failed
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Validation failed for ${language} on input: ${submissions[i].stdin}`,
            details: result,
          });
        }
      }
    }

    // If all validations pass, update the problem in database
    const updateProblem = await db.problem.update({
      where: { id },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions
      },
    });

    // Send success response with updated problem details
    res.status(200).json({
      success: true,
      message: "Problem upated successfully",
      problem: updateProblem,
    })

  } catch (error) {
    // Log error to console for debugging
    console.log("Enter creating problem:", error);
    // Send error response to the client
    res.status(500).json({ error: "Failed to update problem" })
  }
};



// ==================================================================================== //


// Function to delete a problem from database
export const deleteProblem = async (req, res) => { 
  try {
    // Extract problem ID from URL parameters
    const {id} = req.params;

    // Check if problem exists in database
    const problem = await db.problem.findUnique({ where: {id}});

    // If problem doesn't exist, return error
    if (!problem) { return res.status(404).json({ error: "Problem not found"})}

    // Delete the problem from database
    await db.problem.delete({ where: {id}});

    // Send success response
    res.status(200).json({ success: true, message: "Problem delete successfully"})
  } catch (error) {
    // Log error to console for debugging
    console.log("Error deleting problem", error);
  }
 };



// =========================================================================== //


// Function to get all problems solved by the current user
export const getAllProblemSolvedByUser = async (req, res) => { 
  try {
    // Fetch all problems where current user is in the solvedBy list
    const problems = await db.problem.findMany({
      where:{
        solvedBy:{
          // Filter problems that have at least one solve record from current user
          some:{
            userId: req.user.id,
          },
        },
      },
      // Include solve details for current user
      include: {
        solvedBy:{
          where:{
            userId: req.user.id,
          },
        },
      },
    });
    // Send success response with all solved problems
    res.status(200).json({ success: true, message: "Problem Fetched successfully", problems});
  } catch (error) {
    // Log error to console for debugging
    console.log("Error fetching problem", error);
    // Send error response to the client
    res.status(500).json({ error:"failed to fetch problem"});
  }
};