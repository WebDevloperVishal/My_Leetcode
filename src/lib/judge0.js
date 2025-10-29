import axios from "axios"

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

export async function submitBatch(submissions) {
  const { data } = await axios.post(
    `${process.env.JUDGEO_API_URL}/submissions/batch?base64_encode=false`,
    { submissions },
    {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    }
  );

  return data;
}

export async function pollBatchResults(tokens) {
  while (true) {
    const { data } = await axios.get(
      `${process.envv.JUDGEO_API_URL}/submittions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        }
      }
    )

    const results = data.submissions;
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status !== 2
    )

    if (isAllDone) return results;
    await sleep(1000);
  }
}
