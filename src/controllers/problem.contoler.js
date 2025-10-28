import { db } from "../lib/db.js";

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
        
    } catch (error) {
        
    }
};


export const getAllProblem = async (req, res) => { };

export const getProblemById = async (req, res) => { };

export const updateProblem = async (req, res) => { };

export const deleteProblem = async (req, res) => { };

export const getAllProblemSolvedByUser = async (req, res) => { };