export const executeCode = async(req,res) => {
    const {source_code, language_id, stdin, expected_outputs, problemId} = req.body;

    const userId = req.user.id;

    try {
        if (
            !Array.isArray(stdin) ||
            stdin.length  === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        ) {
            return res.status(400).json({ error: "Invalid or miising test cases"});
        }
    } catch (error) {
        
    }
}