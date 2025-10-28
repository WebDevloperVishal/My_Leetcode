export function getJudge0LanguageId(language) {
    const languageMap = {
        "PYTHON": 71,
        "JAVASCRIPT": 63,
        "JAVA": 62,
        "CPP": 54,
        "GO": 60,
    }

    return languageMap[language.toUpperCase()]
}

export async function submitBatch(submission) {
    
}