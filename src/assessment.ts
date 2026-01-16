import { fetchWithRetry, BASE_URL, parseBloodPressure, parseTemperature, parseAge } from "./utils";
import { Patient, AssessmentResults } from "./types";
import * as fs from "fs";
import fetch from "node-fetch";


async function getAllPatients(): Promise<Patient[]> {
  const patients: Patient[] = [];
  let page = 1;

  while (true) {
    const url = `${BASE_URL}/patients?page=${page}&limit=5`;

    // fetchWithRetry already returns parsed JSON
    const responseData = await fetchWithRetry(url);

    // Stop if no more data
    if (!Array.isArray(responseData) || responseData.length === 0) break;

    // Add to in-memory list
    patients.concat(...responseData);

    // Write to raw_data.json
    fs.writeFileSync("raw_data.json", JSON.stringify(patients, null, 2));
  
    page++;
  }

  return patients;
}

async function runAssessment() {
  const patients = await getAllPatients();

  const highRisk: string[] = [];
  const fever: string[] = [];
  const dataIssues: string[] = [];

  for (const p of patients) {
    const bp = parseBloodPressure(p.blood_pressure);
    const temp = parseTemperature(p.temperature);
    const age = parseAge(p.age);

    const total = bp.score + temp.score + age.score;

    if (!bp.valid || !temp.valid || !age.valid) {
      dataIssues.push(p.patient_id);
    }

    if (temp.valid && parseFloat(p.temperature ?? "") >= 99.6) {
      fever.push(p.patient_id);
    }

    if (total >= 4) {
      highRisk.push(p.patient_id);
    }
  }

  const results: AssessmentResults = {
    high_risk_patients: highRisk,
    fever_patients: fever,
    data_quality_issues: dataIssues
  };

   console.log("Assessment results:", results); // For debugging

  fs.writeFileSync("assessment-results.json", JSON.stringify(results, null, 2));
  console.log("Assessment results saved to assessment-results.json");
}

runAssessment().catch(console.error);
