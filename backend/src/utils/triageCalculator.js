/**
 * Evaluates digital triage rules based on vitals, symptoms, and clinical risk context.
 * Classification:
 * - RED: Critical emergency, immediate escalation or PHC/108 ambulance transfer
 * - YELLOW: Moderate risk, doctor consultation recommended within 24-48 hours
 * - GREEN: Low risk / normal parameters, routine health monitoring
 */
function calculateTriage(vitals = {}, symptoms = [], context = {}) {
  const redFlags = [];
  const yellowFlags = [];

  const systolicBp = Number(vitals.systolicBp || vitals.systolic_bp || vitals.bp?.split('/')[0] || 0);
  const diastolicBp = Number(vitals.diastolicBp || vitals.diastolic_bp || vitals.bp?.split('/')[1] || 0);
  const pulseRate = Number(vitals.pulseRate || vitals.pulse_rate || vitals.pulse || 0);
  const temp = Number(vitals.temperature || vitals.body_temp_f || vitals.temp || 0);
  const spO2 = Number(vitals.spO2 || vitals.spo2_pct || vitals.spo2 || 0);
  const bloodGlucose = Number(vitals.bloodGlucose || vitals.blood_glucose_mg_dl || vitals.bloodSugar || 0);

  const isPregnant = Boolean(context.isPregnant || context.is_pregnant);
  const isChild = Boolean(context.isChild || context.age < 5);

  // 1. Oxygen Saturation (SpO2)
  if (spO2 > 0) {
    if (spO2 < 92) {
      redFlags.push(`Severe Hypoxemia (SpO2: ${spO2}%) - Critical Oxygen Need`);
    } else if (spO2 <= 94) {
      yellowFlags.push(`Mild Hypoxemia (SpO2: ${spO2}%)`);
    }
  }

  // 2. Blood Pressure (Special handling for Preeclampsia in pregnancy)
  if (systolicBp > 0 && diastolicBp > 0) {
    if (isPregnant && (systolicBp >= 140 || diastolicBp >= 90)) {
      redFlags.push(`Hypertension in Pregnancy / Preeclampsia Alert (BP: ${systolicBp}/${diastolicBp} mmHg)`);
    } else if (systolicBp >= 160 || diastolicBp >= 100) {
      redFlags.push(`Severe Stage 2 Hypertension Crisis (BP: ${systolicBp}/${diastolicBp} mmHg)`);
    } else if (systolicBp >= 140 || diastolicBp >= 90) {
      yellowFlags.push(`Stage 1 Hypertension (BP: ${systolicBp}/${diastolicBp} mmHg)`);
    } else if (systolicBp < 90 || diastolicBp < 60) {
      yellowFlags.push(`Hypotension Low Blood Pressure (BP: ${systolicBp}/${diastolicBp} mmHg)`);
    }
  }

  // 3. Fever & Heart Rate
  if (temp > 0) {
    if (temp >= 103) {
      redFlags.push(`High Hyperpyrexia Fever (${temp}°F)`);
    } else if (temp >= 100.4) {
      yellowFlags.push(`Moderate Febrile State (${temp}°F)`);
    }
  }

  if (pulseRate > 0) {
    if (pulseRate > 130 || (pulseRate < 45 && pulseRate > 0)) {
      redFlags.push(`Critical Heart Rate Anomaly (${pulseRate} bpm)`);
    } else if (pulseRate > 110 || pulseRate < 55) {
      yellowFlags.push(`Tachycardia/Bradycardia Pulse (${pulseRate} bpm)`);
    }
  }

  // 4. Blood Glucose
  if (bloodGlucose > 0) {
    if (bloodGlucose < 55) {
      redFlags.push(`Severe Hypoglycemia (${bloodGlucose} mg/dL) - Immediate Glucose/IV`);
    } else if (bloodGlucose > 300) {
      redFlags.push(`Severe Hyperglycemia / Potential DKA (${bloodGlucose} mg/dL)`);
    } else if (bloodGlucose > 180) {
      yellowFlags.push(`Elevated Fasting/Random Blood Glucose (${bloodGlucose} mg/dL)`);
    }
  }

  // 5. Critical symptom keywords
  const criticalSymptomKeywords = [
    'chest pain', 'difficulty breathing', 'breathlessness', 'stridor',
    'convulsions', 'seizures', 'unconscious', 'loss of consciousness',
    'heavy vaginal bleeding', 'antepartum hemorrhage', 'postpartum hemorrhage',
    'severe abdominal pain', 'stiff neck', 'cyanosis', 'severe dehydration'
  ];

  const symptomList = Array.isArray(symptoms) ? symptoms : [symptoms];
  for (const s of symptomList) {
    if (!s) continue;
    const lower = String(s).toLowerCase();
    for (const kw of criticalSymptomKeywords) {
      if (lower.includes(kw)) {
        redFlags.push(`Emergency Symptom Alert: "${s}"`);
        break;
      }
    }
  }

  let priority = 'GREEN';
  let message = 'All recorded vitals within acceptable baseline parameters. Continue routine health follow-up.';

  if (redFlags.length > 0) {
    priority = 'RED';
    message = 'CRITICAL EMERGENCY: Severe vitals or red-flag clinical symptoms detected. Immediate escalation to Primary Health Centre (PHC) or 108 Emergency Medical Service required.';
  } else if (yellowFlags.length > 0) {
    priority = 'YELLOW';
    message = 'MODERATE RISK: Clinical parameters or symptoms require timely medical evaluation by a Medical Officer within 24-48 hours.';
  }

  return {
    priority,
    message,
    redFlags,
    yellowFlags,
    recommendedAction: priority === 'RED'
      ? 'Transfer to nearest CHC/PHC emergency room immediately or contact 108 ambulance'
      : priority === 'YELLOW'
      ? 'Schedule teleconsultation with Medical Officer or attend morning OPD'
      : 'Maintain preventive care and standard ASHA home monitoring',
    disclaimer: 'This assessment is clinical decision assistance based on clinical screening protocols and does not substitute definitive hospital diagnosis.'
  };
}

module.exports = {
  calculateTriage
};
