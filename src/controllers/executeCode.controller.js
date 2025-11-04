import { getLanguageName, pollBatchResults, submitBatch } from "../lib/judge0.js";

export const executeCode = async (req, res) => {
    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;

    const userId = req.user.id;

    try {
        if (
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        ) {
            return res.status(400).json({ error: "Invalid or miising test cases" });
        }

        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input,
            base64_encoded: false,
            wait: false,
        }))

        const submitResponse = await submitBatch(submissions);

        const token = submitResponse.map((res) => res.token);

        const result = await pollBatchResults(token);

        let allPassed = true;
        const detailedResults = result.map((result, i) => {
            const stdout = result.stdin?.trim() || null
            const expected_output = expected_outputs[i]?.trim();

            const passed = stdout === expected_output

            if (!passed) allPassed = false;

            return {
                testCase: i + 1,
                passed,
                stdout,
                expected: expected_output,
                stdree: result.stdree || null,
                compile_output: result.compile_output || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory} KB` : undefined,
                time: result.time ? `${result.time} s` : undefined,

            }

        })

        const submission = await db.submission.create({
            data: {
                userId,
                problemId,
                source_Code: source_code,
                langage: getLanguageName(language_id),
                stdin: stdin.join("/n"),
                stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
                stdree: detailedResults.some((r) => r.stdree)
                    ? JSON.stringify(detailedResults.map((r) => r.stdree))
                    : null,
                compile_Output: detailedResults.some((r) => r.compile_output)
                    ? JSON.stringify(detailedResults.map((r) => r.compile_output))
                    : null,
                status: allPassed ? "Accepted" : "Wrong Answer",
                memory: detailedResults.some((r) => r.memory)
                    ? JSON.stringify(detailedResults.map((r) => r.memory))
                    : null,
                time: detailedResults.some((r) => r.time)
                    ? JSON.stringify(detailedResults.map((r) => r.time))
                    : null,
            }
        })

        if (allPassed) {
            await db.problemSolved.upsert({
                where: {
                    userId_problemId: { userId, problemId }
                },
                update: {},
                create: { userId, problemId }

            })
        }

    } catch (error) {

    }
}