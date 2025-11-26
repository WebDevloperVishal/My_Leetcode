import { db } from "../lib/db.js";
import {
  getJudge0LanguageId,
  //  getJudge0Result,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.js";

export const createProblem = async (req, res) => {
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
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Unsupported language: ${language}` });
      }

      //   Prepare judge0 submission for all testcases
      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Validation failed for ${language} on input: ${submissions[i].stdin}`,
            details: result,
          });
        }
      }
    }


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

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      problem: newProblem,
    });
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ error: 'Failed to create problem' });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    // Get all the problem and also check that this is solved by current user or not
    const problems = await db.problem.findMany({
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      message: 'Problems fetched successfully',
      problems,
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({ where: { id } });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Problem fetched successfully',
      problem,
    });
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
};

export const updateProblem = async (req, res) => {

  try {

    const { id } = req.body;

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

    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({ error: "problem was not found" });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(404).json({ error : "Only Admin can update problems"});
    }


    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if(!languageId) { return res.status(400). json({ error: "Unsupporetd language: ${language}"});
    }

    const submissions = testCases.map(({input, output}) => ({
      source_code: solutionCode,
      languageId: languageId,
      stdin: input,
      expected_output: output,
    }));

    console.log("submissions:", submissions)

    const submissionResults = await submitBatch(submissions);

    const tokens = submissionResults.map((res) => res.tokens);
    
    const results = await pollBatchResults(tokens);

    for (let i = 0; i< results.length, i++) {
      const result = results[i];
      if (result.status.id !== 3 ){
        return res.status(400).json({
          error: `Validation failed for ${language} on input: ${submissions[i].stdin}`,
          details: result,
        });
      }
    }
  }

  const updateProblem = await db.problem.update({
    where: {id},
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

  res.status(200).json({
    success: true,
    message: "Problem upated successfully",
    problem: updateProblem,
  })



  } catch (error) {
    console.log("Enter creating problem:", error);
      res.status(500).json({ error: "Failed to update problem"})
  }

};

export const deleteProblem = async (req, res) => { };

export const getAllProblemSolvedByUser = async (req, res) => { };