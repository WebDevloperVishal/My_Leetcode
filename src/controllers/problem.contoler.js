import { db } from "../lib/db.js";
import { getJudge0LanguageId } from "../lib/judge0.js";

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
        editorial
    } = req.body;

    try {
        // 2 loop throught each reference solution for different language
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            // 2.1 language Id
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({ error: `Unsupporetd language: ${language}` });
            }

            // 2.2 Prepare judge) subbmission for all testcase
            const submission = testCases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }))

            
        }
    } catch (error) {

    }
};


export const getAllProblem = async (req, res) => { };

export const getProblemById = async (req, res) => { };

export const updateProblem = async (req, res) => { };

export const deleteProblem = async (req, res) => { };

export const getAllProblemSolvedByUser = async (req, res) => { };