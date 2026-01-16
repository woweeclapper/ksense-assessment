export interface Patient {
  patient_id: string;
  blood_pressure?: string | null;
  temperature?: string | null;
  age?: string | number | null;
}

export interface AssessmentResults {
  high_risk_patients: string[];
  fever_patients: string[];
  data_quality_issues: string[];
}
