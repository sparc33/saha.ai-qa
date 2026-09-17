import fs from 'fs';
import path from 'path';

// Loads synthetic patient fixtures from docs/test-data/patients/ for returning-patient
// context-recall scenarios. Enforces the synthetic-data policy in code, not just prose —
// see qa-fleet.config.json -> testData.syntheticDataGenerationRules in the QA fleet repo
// (C:\ARC QA) for the full rule set every fixture is expected to already follow.
export interface SyntheticPatient {
  id: string;
  synthetic: true;
  [key: string]: unknown;
}

const PATIENTS_DIR = path.resolve(__dirname, '../../docs/test-data/patients');

export function loadSyntheticPatients(): SyntheticPatient[] {
  if (!fs.existsSync(PATIENTS_DIR)) return [];

  const files = fs.readdirSync(PATIENTS_DIR).filter((f) => f.endsWith('.json'));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(PATIENTS_DIR, file), 'utf-8');
    const patient = JSON.parse(raw) as Partial<SyntheticPatient>;
    if (patient.synthetic !== true) {
      throw new Error(
        `${file} is missing the required "synthetic": true marker — refusing to load it. ` +
          'Every fixture patient must carry this marker; see testData.syntheticDataGenerationRules ' +
          "in the QA fleet's qa-fleet.config.json."
      );
    }
    return patient as SyntheticPatient;
  });
}

export function loadSyntheticPatient(id: string): SyntheticPatient {
  const found = loadSyntheticPatients().find((p) => p.id === id);
  if (!found) {
    throw new Error(`No synthetic patient fixture found with id "${id}" in ${PATIENTS_DIR}`);
  }
  return found;
}
