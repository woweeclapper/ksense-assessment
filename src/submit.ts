import { API_KEY, BASE_URL } from "./utils";
import { AssessmentResults } from "./types";
import * as fs from "fs";
import fetch from "node-fetch";

async function submitResults() {
  const raw = fs.readFileSync("assessment-results.json", "utf8");
  const results: AssessmentResults = JSON.parse(raw);

  const res = await fetch(`${BASE_URL}/submit-assessment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY
    },
    body: JSON.stringify(results)
  });

  const data = await res.json();
  console.log("Submission Response:", data);
}

submitResults().catch(console.error);
