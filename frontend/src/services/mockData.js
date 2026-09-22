import { CLINICAL_PHOTOS } from './clinicalPhotos';


export const MOCK_PATIENT_FEMALE = {
  id: 'usr-pat-female-01',
  fullName: 'Radhika Shinde',
  phone: '9876543210',
  role: 'PATIENT',
  gender: 'female',
  patientType: 'female',
  age: 24,
  bloodGroup: 'B+',
  village: 'Nigdale',
  district: 'Pune',
  abhaId: '91-4521-8890-1234',
  address: 'House #41, Shinde Vasti, Nigdale Village, Ambegaon Taluka, Pune - 410509',
  emergencyContact: {
    name: 'Suresh Shinde (Spouse)',
    phone: '+91-9823112233',
    relation: 'Husband'
  },
  assignedAsha: {
    name: 'Sunita Tai (ASHA Sangini)',
    phone: '+91-9822005566',
    subCentre: 'Nigdale Sub-Centre'
  },
  
  // Health Status & Vitals
  healthStatus: {
    overall: 'HEALTHY',
    triageLevel: 'GREEN',
    label: 'Healthy & Stable',
    maternalRiskLevel: 'LOW_RISK',
    gestationalWeeks: 28,
    trimester: 'Third Trimester (Month 7)',
    vitals: {
      bp: '114/74 mmHg',
      pulse: '78 bpm',
      temp: '98.4 °F',
      spO2: '99%',
      hemoglobin: '11.2 g/dL',
      weight: '55.4 kg',
      weightGain: '+3.4 kg total',
      fundalHeight: '27 cm',
      fetalHeartRate: '142 bpm'
    }
  },

  // Next Action Banner
  nextAction: {
    title: 'Attend 3rd Trimester Antenatal Clinic (ANC-3)',
    date: '18 Sep 2026',
    time: '10:00 AM',
    facility: 'Bhimashankar Primary Health Centre',
    doctor: 'Dr. Sunita Deshmukh (MCH Officer)',
    instructions: 'Carry your ABHA Digital Backpack card and clean urine sample for Albumin check.',
    actionLabel: 'View ANC Checklist',
    actionRoute: '/patient/maternal'
  },

  // Upcoming Appointment
  upcomingAppointment: {
    id: 'apt-fem-01',
    doctorName: 'Dr. Sunita Deshmukh',
    doctorSpecialty: 'Maternal & Child Health Officer',
    facility: 'Bhimashankar PHC',
    date: '18 Sep 2026',
    time: '10:30 AM',
    type: 'In-Person ANC Checkup',
    tokenNumber: 'ANC-04',
    status: 'CONFIRMED'
  },

  // Pending Follow-up
  pendingFollowup: {
    id: 'fup-fem-01',
    title: 'ASHA Home Nutrition & IFA Verification',
    worker: 'Sunita Tai (ASHA Worker)',
    scheduledDate: 'Tomorrow, 17 Sep 2026',
    notes: 'Verify 30-day Iron & Folic Acid tablet intake and check for pedal edema (ankle swelling).',
    actionRequired: 'Confirm Availability'
  },

  // Maternal Track Specifics
  isPregnant: true,
  gravida: 'G1P0 (First Pregnancy)',
  gestationalWeeks: 28,
  lmp: '2026-03-01',
  edd: '2026-12-06',
  highRisk: false,
  ancVisits: [
    { visit: 'ANC 1 (1st Trimester)', date: '2026-04-12', status: 'Completed', bp: '110/70', weight: '52 kg', hb: '11.5 g/dL', facility: 'Nigdale Sub-Centre', doctor: 'Dr. Sunita Deshmukh' },
    { visit: 'ANC 2 (2nd Trimester)', date: '2026-06-25', status: 'Completed', bp: '114/74', weight: '55 kg', hb: '11.2 g/dL', facility: 'Bhimashankar PHC', doctor: 'Dr. Sunita Deshmukh' },
    { visit: 'ANC 3 (3rd Trimester)', date: '2026-09-18', status: 'Upcoming', bp: 'Scheduled', weight: '-', hb: '-', facility: 'Bhimashankar PHC', doctor: 'Dr. Sunita Deshmukh' },
    { visit: 'ANC 4 (Pre-delivery)', date: '2026-11-10', status: 'Upcoming', bp: 'Scheduled', weight: '-', hb: '-', facility: 'Khed CHC Delivery Ward', doctor: 'Dr. Sunita Deshmukh' }
  ],
  maternalChecklist: [
    { item: 'Tetanus Toxoid (TT-1)', completed: true, date: '2026-04-12' },
    { item: 'Tetanus Toxoid (TT-2)', completed: true, date: '2026-05-15' },
    { item: 'Iron & Folic Acid Tablets (180 tablets course)', completed: false, current: 120, total: 180 },
    { item: 'Calcium Carbonate (360 tablets course)', completed: false, current: 160, total: 360 },
    { item: 'Albendazole Deworming (Single dose)', completed: true, date: '2026-06-25' },
    { item: 'Emergency Delivery Hospital Bag Packed', completed: false, note: 'Pack clean clothes, baby blanket & ABHA card' }
  ],

  // Child Track
  childCare: {
    childName: 'Expected Baby Shinde',
    edd: '2026-12-06',
    universalImmunizationDue: [
      { vaccine: 'BCG (Bacillus Calmette-Guérin)', ageDue: 'At Birth (within 24h)', protection: 'Tuberculosis', status: 'Scheduled' },
      { vaccine: 'OPV-0 (Oral Polio Vaccine)', ageDue: 'At Birth', protection: 'Polio', status: 'Scheduled' },
      { vaccine: 'Hepatitis B Birth Dose', ageDue: 'At Birth (within 24h)', protection: 'Hepatitis B', status: 'Scheduled' },
      { vaccine: 'Pentavalent 1 & OPV 1', ageDue: '6 Weeks', protection: 'DPT, Hep B, Hib', status: 'Scheduled' }
    ]
  },

  // Active Medicines
  activeMedicines: [
    { id: 'rx-01', name: 'Iron & Folic Acid (IFA)', dose: '100mg Iron + 500mcg Folic Acid', timing: 'Night (After Dinner)', remainingDays: 60, inStockAtPhc: true, instruction: 'Do not take with tea or milk' },
    { id: 'rx-02', name: 'Calcium Carbonate + Vit D3', dose: '500mg', timing: 'Morning (After Breakfast)', remainingDays: 80, inStockAtPhc: true, instruction: 'Take with clean drinking water' },
    { id: 'rx-03', name: 'Paracetamol 500mg (SOS)', dose: '500mg', timing: 'As needed for fever/headache', remainingDays: 10, inStockAtPhc: true, instruction: 'Maximum 3 tablets a day' }
  ],

  // Medical History
  medicalHistory: {
    chronicIllnesses: ['None documented'],
    pastSurgeries: ['None'],
    allergies: ['No known drug allergies (NKDA)'],
    lifestyle: 'Non-smoker, rural agricultural household, vegetarian diet with dairy'
  },

  // Prescriptions
  prescriptions: [
    { id: 'rx-record-01', date: '2026-06-25', doctor: 'Dr. Sunita Deshmukh', facility: 'Bhimashankar PHC', diagnosis: 'ANC 2nd Trimester Routine Support', medicines: ['IFA 100mg (Daily)', 'Calcium 500mg (Daily)'], notes: 'Hb 11.2g/dL stable. Advised green leafy vegetables and jaggery.' },
    { id: 'rx-record-02', date: '2026-04-12', doctor: 'Dr. Sunita Deshmukh', facility: 'Nigdale Sub-Centre', diagnosis: 'First Trimester Antenatal Registration', medicines: ['Folic Acid 5mg (Daily 1st Trim)', 'Tetanus Toxoid Injection (0.5ml IM)'], notes: 'First pregnancy confirmed, low risk.' }
  ],

  // Diagnostic Lab Reports
  reports: [
    { id: 'rep-01', title: 'Second Trimester Obstetric Ultrasound (USG)', date: '2026-06-25', facility: 'Khed CHC Radiology', result: 'Single live intrauterine fetus, gestational age 18w2d. Normal amniotic fluid index.', doctor: 'Dr. A. K. Joshi (Radiologist)', fileUrl: '#' },
    { id: 'rep-02', title: 'Complete Blood Count & Hemoglobin (CBC)', date: '2026-06-25', facility: 'Bhimashankar PHC Laboratory', result: 'Hemoglobin: 11.2 g/dL (Normal: 11-14). Blood Group: B Positive. Platelets: 240,000.', doctor: 'Lab Tech. P. Shinde', fileUrl: '#' },
    { id: 'rep-03', title: 'Urine Routine & Microscopic (Albumin/Sugar)', date: '2026-06-25', facility: 'Bhimashankar PHC Laboratory', result: 'Albumin: NIL, Sugar: NIL. No pus cells detected.', doctor: 'Lab Tech. P. Shinde', fileUrl: '#' },
    { id: 'rep-04', title: 'HIV, HBsAg & VDRL Antenatal Screening Card', date: '2026-04-12', facility: 'Bhimashankar PHC', result: 'HIV: Non-Reactive, HBsAg: Non-Reactive, VDRL: Non-Reactive', doctor: 'Medical Officer', fileUrl: '#' }
  ],

  // Vaccination Records
  vaccinations: [
    { id: 'vac-01', vaccine: 'Tetanus Toxoid (TT-1)', dateAdministered: '2026-04-12', batch: 'TT26B04', location: 'Nigdale Sub-Centre', administeredBy: 'Sunita Tai (ASHA)', nextDoseDue: 'Completed' },
    { id: 'vac-02', vaccine: 'Tetanus Toxoid (TT-2)', dateAdministered: '2026-05-15', batch: 'TT26C11', location: 'Nigdale Sub-Centre', administeredBy: 'Sunita Tai (ASHA)', nextDoseDue: 'Completed' }
  ],

  // Consultation History
  consultationHistory: [
    { id: 'con-01', date: '2026-06-25', doctor: 'Dr. Sunita Deshmukh', type: 'In-Person PHC Visit', reason: '2nd Trimester ANC Checkup', summary: 'Fetal growth on track, fetal heart sounds clear, vitals normal.', prescriptionId: 'rx-record-01' },
    { id: 'con-02', date: '2026-04-12', doctor: 'Dr. Sunita Deshmukh', type: 'Village Sub-Centre Camp', reason: 'Pregnancy Confirmation & ANC 1', summary: 'Registered under Pradhan Mantri Matru Vandana Yojana, TT-1 given.', prescriptionId: 'rx-record-02' }
  ],

  // Follow-up History
  followupHistory: [
    { id: 'fup-hist-01', date: '2026-08-14', worker: 'Sunita Tai (ASHA)', type: 'Home Visit', outcome: 'Verified 45 IFA tablets consumed, no morning sickness, fetal movements felt well.', status: 'Completed' },
    { id: 'fup-hist-02', date: '2026-05-28', worker: 'Sunita Tai (ASHA)', type: 'Home Visit', outcome: 'Checked blood pressure (112/72), educated family on nutrition and institutional delivery benefits.', status: 'Completed' }
  ],

  // Digital Backpack Documents
  digitalBackpack: [
    { id: 'doc-01', title: 'Second Trimester Ultrasound Scan Report', category: 'LAB_REPORT', date: '2026-06-25', issuer: 'Khed CHC Radiology', verified: true, size: '1.2 MB' },
    { id: 'doc-02', title: 'Hemoglobin & Complete Blood Count (CBC)', category: 'LAB_REPORT', date: '2026-06-25', issuer: 'Bhimashankar PHC Lab', verified: true, size: '420 KB' },
    { id: 'doc-03', title: 'Antenatal Nutrition & Medicine e-Prescription', category: 'PRESCRIPTION', date: '2026-06-25', issuer: 'Dr. Sunita Deshmukh', verified: true, size: '280 KB' },
    { id: 'doc-04', title: 'Mother & Child Protection Card (MCP Card)', category: 'HEALTH_RECORD', date: '2026-04-12', issuer: 'Govt. of Maharashtra NHM', verified: true, size: '850 KB' },
    { id: 'doc-05', title: 'Tetanus Toxoid Vaccination Certificate', category: 'VACCINATION', date: '2026-05-15', issuer: 'Nigdale Health Sub-Centre', verified: true, size: '310 KB' },
    { id: 'doc-06', title: 'ABHA Health ID Digital Card', category: 'UPLOADED_DOCUMENT', date: '2026-04-10', issuer: 'National Health Authority (NHA)', verified: true, size: '150 KB' }
  ]
};

export const MOCK_PATIENT_MALE = {
  id: 'usr-pat-male-02',
  fullName: 'Tukaram Patil',
  phone: '9876543211',
  role: 'PATIENT',
  gender: 'male',
  patientType: 'male',
  age: 48,
  bloodGroup: 'O+',
  village: 'Khed',
  district: 'Pune',
  abhaId: '91-3142-9901-5678',
  address: 'Farm Plot #12, Patil Galli, Khed Village, Pune - 410501',
  emergencyContact: {
    name: 'Santosh Patil (Brother)',
    phone: '+91-9823445566',
    relation: 'Brother'
  },
  assignedAsha: {
    name: 'Pooja Tai (ASHA Worker)',
    phone: '+91-9822448899',
    subCentre: 'Khed Rural Sub-Centre'
  },

  // Health Status & Vitals (General & Chronic Care Focus)
  healthStatus: {
    overall: 'CHRONIC_MANAGEMENT',
    triageLevel: 'GREEN',
    label: 'Stage 1 Hypertension (Controlled)',
    vitals: {
      bp: '138/88 mmHg',
      pulse: '74 bpm',
      temp: '98.2 °F',
      spO2: '98%',
      bloodGlucose: '112 mg/dL (Fasting)',
      weight: '68.0 kg',
      bmi: '24.2 (Normal)',
      cholesterol: '194 mg/dL'
    }
  },

  // Next Action Banner
  nextAction: {
    title: 'Log Morning Blood Pressure & Salt Intake Check',
    date: 'Today',
    time: 'Due before 11:00 AM',
    facility: 'Khed Community Health Centre (CHC)',
    doctor: 'Dr. Ramesh Kulkarni (Senior MO)',
    instructions: 'Rest for 5 minutes before checking BP. Target is under 135/85 mmHg.',
    actionLabel: 'Log Vitals Now',
    actionRoute: '/patient/health'
  },

  // Upcoming Appointment
  upcomingAppointment: {
    id: 'apt-male-01',
    doctorName: 'Dr. Ramesh Kulkarni',
    doctorSpecialty: 'Senior Medical Officer (Family Medicine)',
    facility: 'Khed Community Health Centre',
    date: '22 Sep 2026',
    time: '09:45 AM',
    type: 'Monthly Hypertension & Chronic Follow-up',
    tokenNumber: 'OPD-18',
    status: 'CONFIRMED'
  },

  // Pending Follow-up
  pendingFollowup: {
    id: 'fup-male-01',
    title: 'Fasting Blood Sugar & Lipid Profile Re-test',
    worker: 'Pooja Tai (ASHA Worker) & Khed CHC Lab',
    scheduledDate: '20 Sep 2026 (Fasting morning)',
    notes: 'Maintain 10 hours overnight fasting prior to sample draw at Khed CHC Lab.',
    actionRequired: 'View Test Preparation'
  },

  // Occupational Health & Farm Safety
  occupationalHealth: {
    occupation: 'Agricultural Farmer & Livestock Care',
    riskFactors: ['Pesticide/Chemical Exposure', 'Ergonomic Back & Lumbar Strain', 'Summer Heat Stress'],
    advisories: [
      { title: 'Safe Chemical Spray Mask Protocol', tip: 'Always wear N95 mask and protective eye goggles during crop spraying.' },
      { title: 'Hydration During Peak Sun Hours', tip: 'Drink ORS or boiled water with lemon before entering open field between 11 AM - 3 PM.' },
      { title: 'Ergonomic Lumbar Support', tip: 'Avoid lifting fertilizer bags exceeding 25 kg single-handed to prevent disc compression.' }
    ]
  },

  // Active Medicines
  activeMedicines: [
    { id: 'rx-m-01', name: 'Amlodipine 5mg', dose: '5mg Tablet', timing: 'Morning (After Breakfast)', remainingDays: 14, inStockAtPhc: true, instruction: 'Blood pressure control. Do not skip daily dose.' },
    { id: 'rx-m-02', name: 'Metformin 500mg', dose: '500mg Tablet', timing: 'Night (After Dinner)', remainingDays: 20, inStockAtPhc: true, instruction: 'Blood sugar regulation. Take with food.' },
    { id: 'rx-m-03', name: 'Multivitamin B-Complex', dose: '1 Capsule', timing: 'Afternoon (After Lunch)', remainingDays: 25, inStockAtPhc: true, instruction: 'Nerve health & energy.' }
  ],

  // Medical History
  medicalHistory: {
    chronicIllnesses: ['Stage 1 Essential Hypertension (Diagnosed 2024)', 'Borderline Impaired Fasting Glucose'],
    pastSurgeries: ['Appendectomy (2018 at District Hospital)'],
    allergies: ['Penicillin (develops skin urticaria/rash)'],
    lifestyle: 'Non-smoker, moderate rural field physical activity, daily tea drinker'
  },

  // Prescriptions
  prescriptions: [
    { id: 'rx-record-m01', date: '2026-08-10', doctor: 'Dr. Ramesh Kulkarni', facility: 'Khed CHC', diagnosis: 'Essential Hypertension Review', medicines: ['Amlodipine 5mg (1 tab OD)', 'Metformin 500mg (1 tab OD)'], notes: 'BP improved from 146/94 to 138/88. Continue low-salt diet and morning brisk walk.' },
    { id: 'rx-record-m02', date: '2026-05-12', doctor: 'Dr. Ramesh Kulkarni', facility: 'Khed CHC', diagnosis: 'Routine Chronic Health Screening', medicines: ['Amlodipine 5mg', 'Multivitamins'], notes: 'Initial hypertension prescription issued, baseline ECG normal.' }
  ],

  // Diagnostic Lab Reports
  reports: [
    { id: 'rep-m01', title: 'Fasting Blood Sugar & HbA1c Glycated Panel', date: '2026-08-08', facility: 'Khed CHC Laboratory', result: 'Fasting Blood Glucose: 112 mg/dL. HbA1c: 5.9% (Pre-diabetic/Controlled).', doctor: 'Pathologist Dr. M. G. Joshi', fileUrl: '#' },
    { id: 'rep-m02', title: 'Serum Lipid Profile (Cholesterol & Triglycerides)', date: '2026-08-08', facility: 'Khed CHC Laboratory', result: 'Total Cholesterol: 194 mg/dL. HDL: 44 mg/dL. Triglycerides: 168 mg/dL.', doctor: 'Pathologist Dr. M. G. Joshi', fileUrl: '#' },
    { id: 'rep-m03', title: '12-Lead Electrocardiogram (ECG) Report', date: '2026-05-12', facility: 'Khed CHC Emergency Ward', result: 'Normal sinus rhythm, 74 bpm. No ischemic ST-T changes.', doctor: 'Dr. Ramesh Kulkarni', fileUrl: '#' },
    { id: 'rep-m04', title: 'Serum Creatinine & Kidney Function Panel', date: '2026-05-12', facility: 'District Hospital Lab', result: 'Serum Creatinine: 0.9 mg/dL (Normal: 0.7-1.3). Blood Urea: 24 mg/dL.', doctor: 'Biochemist Dr. K. Patil', fileUrl: '#' }
  ],

  // Vaccination Records
  vaccinations: [
    { id: 'vac-m01', vaccine: 'Tetanus Toxoid (TT Booster)', dateAdministered: '2025-11-20', batch: 'TT25E09', location: 'Khed CHC', administeredBy: 'Staff Nurse Geeta', nextDoseDue: 'Due in 2030' },
    { id: 'vac-m02', vaccine: 'COVID-19 Precautionary Dose (Covishield)', dateAdministered: '2023-04-14', batch: 'COV23X9', location: 'Khed CHC', administeredBy: 'Govt. Vaccination Team', nextDoseDue: 'Completed' }
  ],

  // Consultation History
  consultationHistory: [
    { id: 'con-m01', date: '2026-08-10', doctor: 'Dr. Ramesh Kulkarni', type: 'In-Person CHC Visit', reason: 'Hypertension Follow-up', summary: 'Patient reported good adherence to Amlodipine. No headaches or ankle swelling.', prescriptionId: 'rx-record-m01' },
    { id: 'con-m02', date: '2026-05-12', doctor: 'Dr. Ramesh Kulkarni', type: 'Teleconsultation', reason: 'General Health & Vitals Check', summary: 'Diagnosed mild stage 1 hypertension, initiated baseline blood work and lifestyle diet.', prescriptionId: 'rx-record-m02' }
  ],

  // Follow-up History
  followupHistory: [
    { id: 'fup-hist-m01', date: '2026-07-22', worker: 'Pooja Tai (ASHA)', type: 'Doorstep Vitals Log', outcome: 'Logged BP: 140/88, SpO2: 98%. Patient reminded to collect free Amlodipine refill at CHC.', status: 'Completed' },
    { id: 'fup-hist-m02', date: '2026-06-15', worker: 'Pooja Tai (ASHA)', type: 'Doorstep Visit', outcome: 'Checked fasting sugar with portable glucometer: 114 mg/dL. Advised low sugar in tea.', status: 'Completed' }
  ],

  // Digital Backpack Documents
  digitalBackpack: [
    { id: 'doc-m01', title: 'Hypertension Treatment & Refill e-Prescription', category: 'PRESCRIPTION', date: '2026-08-10', issuer: 'Khed CHC', verified: true, size: '240 KB' },
    { id: 'doc-m02', title: 'Fasting Lipid & Glucose Panel Laboratory Card', category: 'LAB_REPORT', date: '2026-08-08', issuer: 'Khed CHC Pathology Lab', verified: true, size: '510 KB' },
    { id: 'doc-m03', title: '12-Lead Electrocardiogram (ECG) Tracing Strip', category: 'HEALTH_RECORD', date: '2026-05-12', issuer: 'Khed Community Hospital', verified: true, size: '920 KB' },
    { id: 'doc-m04', title: 'Kidney & Liver Biomarker Profile Report', category: 'LAB_REPORT', date: '2026-05-12', issuer: 'District Hospital Lab', verified: true, size: '480 KB' },
    { id: 'doc-m05', title: 'Tetanus Prophylaxis Vaccination Certificate', category: 'VACCINATION', date: '2025-11-20', issuer: 'Khed Health Centre', verified: true, size: '180 KB' },
    { id: 'doc-m06', title: 'ABHA Health Card (Ayushman Bharat)', category: 'UPLOADED_DOCUMENT', date: '2026-04-15', issuer: 'National Health Authority', verified: true, size: '160 KB' }
  ]
};

export const MOCK_DOCTORS = [
  {
    id: 'doc-01',
    fullName: 'Dr. Ramesh Kulkarni',
    qualification: 'MBBS, DNB (Family Medicine)',
    designation: 'Senior Medical Officer',
    specialty: 'General Medicine & Chronic Care',
    facility: 'Khed Community Health Centre',
    experience: '16 years clinical service',
    languages: 'Marathi, Hindi, English',
    availableSlotsToday: ['10:30 AM', '11:45 AM', '02:30 PM', '04:00 PM'],
    teleconsultAvailable: true,
    rating: 4.8,
    phone: '+91-9876543230'
  },
  {
    id: 'doc-02',
    fullName: 'Dr. Sunita Deshmukh',
    qualification: 'MBBS, DGO (Obstetrics & Gynaecology)',
    designation: 'Maternal & Child Health Officer',
    specialty: 'Maternal Care, ANC & Paediatrics',
    facility: 'Bhimashankar Primary Health Centre',
    experience: '12 years maternal health',
    languages: 'Marathi, Hindi, English',
    availableSlotsToday: ['09:30 AM', '11:00 AM', '03:15 PM'],
    teleconsultAvailable: true,
    rating: 4.9,
    phone: '+91-9876543231'
  },
  {
    id: 'doc-03',
    fullName: 'Dr. Anil Jadhav',
    qualification: 'MBBS (Emergency & Trauma Care)',
    designation: 'Emergency Medical Officer',
    specialty: 'Acute Triage, Snakebite & Trauma',
    facility: 'Manchar Sub-District Hospital',
    experience: '9 years rural trauma response',
    languages: 'Marathi, Hindi',
    availableSlotsToday: ['Available on 24x7 Emergency Call'],
    teleconsultAvailable: true,
    rating: 4.7,
    phone: '+91-9876543232'
  }
];

export const MOCK_DIAGNOSTIC_TESTS = [
  { id: 't1', testName: 'Complete Blood Count (CBC & Hemoglobin)', category: 'HEMATOLOGY', indication: 'Anemia, Infection, Maternal Workup', turnaroundTime: '2 Hours', sampleType: 'Whole Blood (2 ml)', inStock: true, facility: 'Bhimashankar PHC' },
  { id: 't2', testName: 'Fasting Blood Glucose (Blood Sugar)', category: 'BIOCHEMISTRY', indication: 'Diabetes Mellitus Monitoring', turnaroundTime: '1 Hour', sampleType: 'Plasma (Fluoride tube)', inStock: true, facility: 'Khed CHC' },
  { id: 't3', testName: 'Urine Routine & Albumin Test', category: 'URINALYSIS', indication: 'Preeclampsia, Kidney Health, UTI', turnaroundTime: '30 Minutes', sampleType: 'Midstream Urine', inStock: true, facility: 'Bhimashankar PHC' },
  { id: 't4', testName: 'Rapid Malaria Antigen Card (Pf / Pv)', category: 'INFECTIOUS', indication: 'Acute Fever with Chills & Rigors', turnaroundTime: '15 Minutes', sampleType: 'Fingerprick Capillary Blood', inStock: true, facility: 'Nigdale Sub-Centre' },
  { id: 't5', testName: 'Obstetric & Abdominal Ultrasound (USG)', category: 'RADIOLOGY', indication: 'Fetal Growth & Organ Imaging', turnaroundTime: 'Same Day', sampleType: 'Imaging Scan', inStock: true, facility: 'Khed CHC' },
  { id: 't6', testName: '12-Lead Electrocardiogram (ECG)', category: 'CARDIOLOGY', indication: 'Chest Pain, Palpitations, Hypertension', turnaroundTime: 'Immediate', sampleType: 'Chest Electrodes', inStock: true, facility: 'Khed CHC' },
  { id: 't7', testName: 'Dengue NS1 & IgM / IgG Rapid Combo', category: 'INFECTIOUS', indication: 'Monsoon High Fever & Thrombocytopenia', turnaroundTime: '20 Minutes', sampleType: 'Serum / Whole Blood', inStock: true, facility: 'Manchar SDH' },
  { id: 't8', testName: 'Sputum AFB for Tuberculosis', category: 'MICROBIOLOGY', indication: 'Persistent Cough exceeding 2 weeks', turnaroundTime: '24 Hours', sampleType: 'Early Morning Sputum', inStock: true, facility: 'Khed CHC' }
];

export const MOCK_NOTIFICATIONS = [
  { id: 'notif-01', title: 'Upcoming ANC Clinic Checkup (ANC 3)', message: 'Your scheduled ANC appointment at Bhimashankar PHC is on 18 Sep 2026 at 10:30 AM. Please bring your MCP card.', type: 'APPOINTMENT', time: '1 hour ago', unread: true, link: '/patient/maternal' },
  { id: 'notif-02', title: 'Daily Iron & Folic Acid Tablet Reminder', message: 'Remember to take your Iron tablet after dinner with clean water. 60 tablets remaining in your supply.', type: 'MEDICINE', time: '5 hours ago', unread: true, link: '/patient/medicines' },
  { id: 'notif-03', title: 'ASHA Home Visit Scheduled', message: 'Sunita Tai will visit your home tomorrow to check vital signs and provide maternal nutrition guidance.', type: 'FOLLOW_UP', time: 'Yesterday', unread: false, link: '/patient/followup' },
  { id: 'notif-04', title: 'Monsoon Safe Drinking Water Advisory', message: 'District Health Advisory: Please boil all drinking water for 10 minutes to protect against waterborne infections.', type: 'ADVISORY', time: '2 days ago', unread: false, link: '/patient/health' }
];

export const MOCK_MEDICINES = [
  { id: 'm1', name: 'Paracetamol 500mg', category: 'MEDICINE', indication: 'Fever & Pain Relief', inStock: true, facility: 'Khed CHC', quantity: '1,200 tablets', distance: '3.4 km' },
  { id: 'm2', name: 'Oral Rehydration Salts (ORS)', category: 'MEDICINE', indication: 'Dehydration & Diarrhea', inStock: true, facility: 'Bhimashankar PHC', quantity: '450 packets', distance: '2.1 km' },
  { id: 'm3', name: 'Iron & Folic Acid (IFA)', category: 'MEDICINE', indication: 'Maternal Anemia Prevention', inStock: true, facility: 'Bhimashankar PHC', quantity: '900 tablets', distance: '2.1 km' },
  { id: 'm4', name: 'Calcium Carbonate 500mg', category: 'MEDICINE', indication: 'Maternal & Bone Health', inStock: true, facility: 'Bhimashankar PHC', quantity: '650 tablets', distance: '2.1 km' },
  { id: 'm5', name: 'Amlodipine 5mg', category: 'MEDICINE', indication: 'Hypertension / High BP', inStock: true, facility: 'Khed CHC', quantity: '800 tablets', distance: '3.4 km' },
  { id: 'm6', name: 'Metformin 500mg', category: 'MEDICINE', indication: 'Diabetes Glycemic Control', inStock: true, facility: 'Khed CHC', quantity: '600 tablets', distance: '3.4 km' },
  { id: 'm7', name: 'Amoxicillin 250mg', category: 'MEDICINE', indication: 'Bacterial Respiratory Infections', inStock: false, facility: 'Nigdale Sub-Centre', quantity: 'Out of Stock', distance: '0.8 km' },
  { id: 'm8', name: 'Anti-Rabies Vaccine (ARV)', category: 'VACCINE', indication: 'Animal Bite Emergency', inStock: true, facility: 'Khed CHC', quantity: '40 vials', distance: '3.4 km' }
];

export const MOCK_ASHA_DATA = {
  worker: {
    id: 'usr-asha-01',
    fullName: 'Sunita Tai (ASHA Sangini)',
    phone: '9876543220',
    village: 'Nigdale & Bhimashankar',
    totalHouseholdsCovered: 142,
    pregnantMothersMonitored: 8,
    infantsTracked: 14,
    monthlyIncentiveEstimated: '₹8,450',
    subCentre: 'Nigdale Sub-Centre (Ambegaon Block)'
  },
  priorityCases: [
    { id: 'case-01', patientName: 'Meena Waghmare', age: 22, village: 'Nigdale', condition: 'High BP (145/95) in 34th Week Pregnancy', priority: 'RED', action: 'Immediate PHC referral recommended', phone: '9822334411', token: 'RED-01' },
    { id: 'case-02', patientName: 'Aarav (Infant, 8mo)', motherName: 'Kavita Gawli', village: 'Bhimashankar', condition: 'Missed Measles-Rubella (MR) Vaccine dose', priority: 'YELLOW', action: 'Home visit scheduled for tomorrow', phone: '9822334422', token: 'YEL-02' },
    { id: 'case-03', patientName: 'Baban Rao', age: 62, village: 'Nigdale', condition: 'Suspected respiratory infection, SpO2 93%', priority: 'YELLOW', action: 'Teleconsultation arranged with Dr. Kulkarni', phone: '9822334433', token: 'YEL-03' },
    { id: 'case-04', patientName: 'Ganesh Shinde', age: 35, village: 'Nigdale', condition: 'Chemical pesticide splash in right eye', priority: 'RED', action: 'Saline irrigation done, emergency CHC transport required', phone: '9822334444', token: 'RED-04' }
  ],
  villageVisitsToday: [
    { id: 'v1', household: 'House #14 (Waghmare)', person: 'Meena Waghmare', reason: 'ANC 3 Checkup & IFA distribution', status: 'Completed', time: '09:30 AM', notes: 'BP 145/95 flagged. Escalated to Dr. Sunita.' },
    { id: 'v2', household: 'House #27 (Gawli)', person: 'Aarav Gawli (8mo)', reason: 'Infant growth chart measurement & MR vaccine recall', status: 'Pending', time: '11:15 AM', notes: 'Weigh baby and counsel mother on complementary feeding.' },
    { id: 'v3', household: 'House #41 (Shinde)', person: 'Radhika Shinde', reason: 'Maternal nutrition counselling & kick counter check', status: 'Completed', time: '01:00 PM', notes: 'Doing well. Consuming 1 IFA daily.' },
    { id: 'v4', household: 'House #55 (Bhil)', person: 'Vimal Bhil', reason: 'Water sanitation & ORS supply', status: 'Pending', time: '03:30 PM', notes: 'Check boiled water compliance in hamlet.' },
    { id: 'v5', household: 'House #68 (Patil)', person: 'Tukaram Patil', reason: 'Hypertension doorstep vitals log', status: 'Pending', time: '04:45 PM', notes: 'Log morning BP and check salt intake.' }
  ],
  patientsList: [
    {
      id: 'p-01',
      fullName: 'Radhika Shinde',
      phone: '9876543210',
      age: 24,
      gender: 'female',
      category: 'PREGNANT_MOTHER',
      categoryLabel: 'Pregnant Mother (ANC)',
      village: 'Nigdale',
      abhaId: '91-4521-8890-1234',
      status: 'Stable / Green',
      details: '28 Weeks Gestation • ANC-3 Scheduled',
      lastVitals: { bp: '114/74', pulse: '78', spO2: '99%', hb: '11.2 g/dL' }
    },
    {
      id: 'p-02',
      fullName: 'Meena Waghmare',
      phone: '9822334411',
      age: 22,
      gender: 'female',
      category: 'HIGH_RISK_ANC',
      categoryLabel: 'High-Risk Pregnancy',
      village: 'Nigdale',
      abhaId: '91-8832-1102-4567',
      status: 'Urgent / Red',
      details: '34 Weeks • Elevated BP (145/95) • Pre-eclampsia warning',
      lastVitals: { bp: '145/95', pulse: '88', spO2: '97%', hb: '9.8 g/dL' }
    },
    {
      id: 'p-03',
      fullName: 'Tukaram Patil',
      phone: '9876543211',
      age: 48,
      gender: 'male',
      category: 'CHRONIC_CARE',
      categoryLabel: 'Chronic Care (HTN)',
      village: 'Khed',
      abhaId: '91-3142-9901-5678',
      status: 'Monitoring / Yellow',
      details: 'Stage 1 Hypertension • Daily Amlodipine 5mg',
      lastVitals: { bp: '138/88', pulse: '74', spO2: '98%', bloodSugar: '112 mg/dL' }
    },
    {
      id: 'p-04',
      fullName: 'Kavita Gawli',
      phone: '9822334422',
      age: 27,
      gender: 'female',
      category: 'LACTATING_MOTHER',
      categoryLabel: 'Lactating Mother',
      village: 'Bhimashankar',
      abhaId: '91-4455-6677-8899',
      status: 'Stable / Green',
      details: 'Mother of Aarav (8mo) • Exclusive breastfeeding completed',
      lastVitals: { bp: '118/76', pulse: '72', spO2: '99%', hb: '11.0 g/dL' }
    },
    {
      id: 'p-05',
      fullName: 'Aarav Gawli',
      phone: '9822334422',
      age: 1,
      gender: 'male',
      category: 'INFANT',
      categoryLabel: 'Infant (0-1 yr)',
      village: 'Bhimashankar',
      abhaId: '91-9988-7766-5544',
      status: 'Vaccine Recall / Yellow',
      details: 'Weight: 8.2 kg • Missed Measles-Rubella 1st dose',
      lastVitals: { weight: '8.2 kg', temp: '98.6 °F' }
    },
    {
      id: 'p-06',
      fullName: 'Baban Rao',
      phone: '9822334433',
      age: 62,
      gender: 'male',
      category: 'ELDERLY',
      categoryLabel: 'Senior Citizen (60+)',
      village: 'Nigdale',
      abhaId: '91-2233-4455-6677',
      status: 'Respiratory Alert / Yellow',
      details: 'Chronic cough for 10 days • SpO2 93% • Teleconsult booked',
      lastVitals: { bp: '130/84', pulse: '86', spO2: '93%', temp: '99.8 °F' }
    }
  ],
  followupsList: [
    {
      id: 'fup-01',
      patientName: 'Meena Waghmare',
      dueDate: 'Today, 2:00 PM',
      task: 'Blood Pressure Re-check & Proteinuria Urine Dipstick',
      notes: 'Verify if headache has subsided. If BP > 140/90, call 102 transit immediately.',
      status: 'PENDING',
      priority: 'RED'
    },
    {
      id: 'fup-02',
      patientName: 'Aarav Gawli (Infant)',
      dueDate: 'Tomorrow Morning',
      task: 'Administer MR-1 Vaccine at Village Anganwadi Session',
      notes: 'Check vaccine cold chain carrier. Mother notified.',
      status: 'PENDING',
      priority: 'YELLOW'
    },
    {
      id: 'fup-03',
      patientName: 'Radhika Shinde',
      dueDate: '18 Sep 2026',
      task: 'Escort to Bhimashankar PHC for ANC-3 Clinic',
      notes: 'Ensure MCP card and ultrasound scan report are packed.',
      status: 'SCHEDULED',
      priority: 'GREEN'
    },
    {
      id: 'fup-04',
      patientName: 'Tukaram Patil',
      dueDate: '20 Sep 2026',
      task: 'Fasting Blood Glucose Draw at Sub-Centre',
      notes: 'Remind patient to arrive fasting for 10 hours.',
      status: 'SCHEDULED',
      priority: 'GREEN'
    }
  ],
  referralsList: [
    {
      id: 'ref-01',
      patientName: 'Meena Waghmare',
      referralTo: 'Dr. Sunita Deshmukh (MCH Officer)',
      facility: 'Bhimashankar PHC',
      reason: 'Severe Pre-eclampsia Alert (BP 145/95, blurred vision)',
      priority: 'RED',
      transport: '102 Janani Shishu Vahan Dispatched',
      date: '2026-09-16',
      status: 'IN_TRANSIT'
    },
    {
      id: 'ref-02',
      patientName: 'Ganesh Shinde',
      referralTo: 'Dr. Anil Jadhav (Emergency MO)',
      facility: 'Manchar Sub-District Hospital',
      reason: 'Agricultural Pesticide Eye Splash & Corneal Irritation',
      priority: 'RED',
      transport: '108 Ambulance Dispatch',
      date: '2026-09-16',
      status: 'TRANSFERRED'
    },
    {
      id: 'ref-03',
      patientName: 'Baban Rao',
      referralTo: 'Dr. Ramesh Kulkarni (Senior MO)',
      facility: 'Khed CHC',
      reason: 'Sub-acute Respiratory Infection (SpO2 93%, 10-day cough)',
      priority: 'YELLOW',
      transport: 'OPD Visit Scheduled',
      date: '2026-09-15',
      status: 'REVIEWED'
    }
  ],
  photoCasesList: [
    {
      id: 'photo-01',
      patientName: 'Ganesh Shinde',
      category: 'EYE_INJURY',
      title: 'Pesticide Spray Chemical Eye Irritation',
      description: 'Right eye acute conjunctival redness and tearing after spraying organophosphate without goggles.',
      urgency: 'RED',
      date: '2026-09-16',
      doctorNotes: 'Irrigated with normal saline. Referred to Manchar SDH Ophthalmology.',
      status: 'Doctor Reviewed',
      photoUrl: CLINICAL_PHOTOS.EYE_INJURY
    },
    {
      id: 'photo-02',
      patientName: 'Baby of Kavita (Aarav)',
      category: 'DERMATOLOGY',
      title: 'Neonatal Heat & Prickly Miliaria Rash',
      description: 'Mild red papular rash on neck and upper chest. No fever, feeding normally.',
      urgency: 'GREEN',
      date: '2026-09-14',
      doctorNotes: 'Advised loose cotton clothing and calamine application. Avoid thick oils.',
      status: 'Doctor Reviewed',
      photoUrl: CLINICAL_PHOTOS.DERMATOLOGY
    }
  ],
  performanceMetrics: {
    monthlyIncentiveEstimated: '₹8,450',
    incentivesBreakdown: [
      { scheme: 'JSY Institutional Delivery Promotion (2 cases)', amount: '₹1,200' },
      { scheme: 'Complete Full Immunization Verification (4 infants)', amount: '₹1,000' },
      { scheme: 'Early Antenatal Registration within 12 Weeks (3 mothers)', amount: '₹900' },
      { scheme: 'Routine Village Household Surveys & Vitals Logging (142 homes)', amount: '₹3,500' },
      { scheme: 'Water Sanitation & Chlorination Surveillance', amount: '₹750' },
      { scheme: 'NCD Screening & Blood Pressure Village Camps', amount: '₹1,100' }
    ],
    coverageMetrics: {
      householdsCovered: 142,
      ancTrackingRate: '98%',
      immunizationRate: '95%',
      institutionalDeliveriesRate: '100%',
      ncdScreeningRate: '91%'
    }
  }
};

export const MOCK_DOCTOR_DATA = {
  doctor: {
    id: 'usr-doc-01',
    fullName: 'Dr. Ramesh Kulkarni',
    qualification: 'MBBS, DNB (Family Medicine)',
    designation: 'Senior Medical Officer & In-Charge',
    facility: 'Khed Community Health Centre (CHC)',
    subCentreNetwork: 'Ambegaon & Khed Block Primary Care Cluster',
    hprId: '91-8842-1920-3341 (ABDM Registered)',
    registrationNo: 'MCI-2012-044812',
    specialty: 'Family Medicine, Rural Emergency & Tele-Triage',
    experience: '14 years rural public health service',
    languages: 'Marathi, Hindi, English',
    phone: '+91-9876543230',
    email: 'dr.kulkarni@aarogyasync.gov.in',
    digitalSignatureStatus: 'Active (ABDM Cryptographic e-Sign Ready)',
    avatarInitials: 'RK'
  },
  overviewStats: {
    priorityCases: 6,
    appointmentsToday: 14,
    urgentConsultations: 3,
    pendingReviews: 5,
    followupsScheduled: 9,
    prescriptionsIssuedToday: 18,
    activePatientsInCluster: 1420
  },
  consultationQueue: [
    {
      id: 'cq-01',
      patientId: 'p-02',
      patientName: 'Meena Waghmare',
      age: 22,
      gender: 'Female',
      village: 'Nigdale (Hamlet 2)',
      abhaId: '91-8832-1102-4567',
      priority: 'RED',
      priorityLabel: 'Urgent (RED)',
      chiefComplaint: 'Severe Throbbing Headache, Blurred Vision, Elevated BP in 34th Gestational Week',
      vitals: { bp: '150/98', pulse: '92', spO2: '97%', temp: '98.8 °F', hb: '9.8 g/dL', bloodSugar: '104 mg/dL' },
      source: 'ASHA Field Triage Escalation',
      ashaWorker: 'Sunita Tai (ASHA Sangini)',
      waitingTime: '8 mins ago',
      timeReceived: '10:45 AM',
      type: 'URGENT_TELECONSULT',
      status: 'WAITING',
      notes: 'Urine albumin positive 2+. Patient complaining of sudden scotoma. Suspected Severe Pre-Eclampsia.',
      hasAttachment: true,
      attachmentType: 'LAB_DIPSTICK'
    },
    {
      id: 'cq-02',
      patientId: 'p-07',
      patientName: 'Ganesh Shinde',
      age: 35,
      gender: 'Male',
      village: 'Nigdale',
      abhaId: '91-6655-4433-2211',
      priority: 'RED',
      priorityLabel: 'Urgent (RED)',
      chiefComplaint: 'Direct Pesticide Splash in Right Eye with Severe Conjunctival Redness & Chemical Burn',
      vitals: { bp: '136/86', pulse: '96', spO2: '99%', temp: '98.6 °F' },
      source: 'Sub-Centre Emergency Dispatch',
      ashaWorker: 'Sunita Tai (ASHA Sangini)',
      waitingTime: '18 mins ago',
      timeReceived: '10:35 AM',
      type: 'PHOTO_CASE',
      status: 'WAITING',
      notes: 'Initial copious irrigation with normal saline completed. Corneal epithelial staining required.',
      hasAttachment: true,
      attachmentType: 'CLINICAL_PHOTO'
    },
    {
      id: 'cq-03',
      patientId: 'p-05',
      patientName: 'Aarav Gawli',
      age: 1,
      gender: 'Male',
      village: 'Bhimashankar',
      motherName: 'Kavita Gawli',
      abhaId: '91-9988-7766-5544',
      priority: 'HIGH',
      priorityLabel: 'High (ORANGE)',
      chiefComplaint: 'High Spiking Fever (102.4 °F) for 48 Hours, Poor Oral Intake, Missed MR-1 Vaccine',
      vitals: { temp: '102.4 °F', pulse: '128', spO2: '96%', weight: '8.2 kg' },
      source: 'ASHA Doorstep Visit',
      ashaWorker: 'Sunita Tai (ASHA Sangini)',
      waitingTime: '32 mins ago',
      timeReceived: '10:20 AM',
      type: 'TELECONSULT',
      status: 'WAITING',
      notes: 'Mild dehydration signs noted (sunken fontanelle borderline). ORS initiated.',
      hasAttachment: false
    },
    {
      id: 'cq-04',
      patientId: 'p-06',
      patientName: 'Baban Rao',
      age: 62,
      gender: 'Male',
      village: 'Nigdale',
      abhaId: '91-2233-4455-6677',
      priority: 'HIGH',
      priorityLabel: 'High (ORANGE)',
      chiefComplaint: 'Sub-acute Productive Cough with Mucopurulent Sputum (10 days) & SpO2 93% on Room Air',
      vitals: { bp: '130/84', pulse: '86', spO2: '93%', temp: '99.8 °F' },
      source: 'Telemedicine Village Kiosk',
      ashaWorker: 'Sunita Tai (ASHA Sangini)',
      waitingTime: '45 mins ago',
      timeReceived: '10:05 AM',
      type: 'STORE_AND_FORWARD',
      status: 'WAITING',
      notes: 'Bilateral basal crackles on chest examination. Sputum sample collected for TB AFB testing.',
      hasAttachment: true,
      attachmentType: 'CHEST_SOUNDS'
    },
    {
      id: 'cq-05',
      patientId: 'p-03',
      patientName: 'Tukaram Patil',
      age: 48,
      gender: 'Male',
      village: 'Khed',
      abhaId: '91-3142-9901-5678',
      priority: 'MODERATE',
      priorityLabel: 'Moderate (YELLOW)',
      chiefComplaint: 'Hypertension Follow-up & Medication Titration (BP 142/90 on Amlodipine 5mg)',
      vitals: { bp: '142/90', pulse: '74', spO2: '98%', bloodSugar: '138 mg/dL' },
      source: 'PHC Chronic Care Clinic',
      ashaWorker: 'Sunita Tai (ASHA Sangini)',
      waitingTime: '1 hour ago',
      timeReceived: '09:50 AM',
      type: 'OPD_WALK_IN',
      status: 'WAITING',
      notes: 'Patient reports mild ankle edema in evenings. Consuming moderate dietary salt.',
      hasAttachment: false
    },
    {
      id: 'cq-06',
      patientId: 'p-08',
      patientName: 'Sharda Bai Jadhav',
      age: 55,
      gender: 'Female',
      village: 'Ambegaon',
      abhaId: '91-7788-9900-1122',
      priority: 'MODERATE',
      priorityLabel: 'Moderate (YELLOW)',
      chiefComplaint: 'Type-2 Diabetes Follow-up & Bilateral Foot Paresthesia with Minor Skin Fissure',
      vitals: { bp: '134/82', pulse: '76', spO2: '98%', bloodSugar: '194 mg/dL' },
      source: 'Sub-Centre NCD Camp',
      ashaWorker: 'Pooja Tai',
      waitingTime: '1.5 hours ago',
      timeReceived: '09:20 AM',
      type: 'STORE_AND_FORWARD',
      status: 'WAITING',
      notes: 'Monofilament test shows reduced sensation on plantar surface. Early diabetic neuropathy.',
      hasAttachment: true,
      attachmentType: 'CLINICAL_PHOTO'
    },
    {
      id: 'cq-07',
      patientId: 'p-01',
      patientName: 'Radhika Shinde',
      age: 24,
      gender: 'Female',
      village: 'Nigdale',
      abhaId: '91-4521-8890-1234',
      priority: 'ROUTINE',
      priorityLabel: 'Routine (GREEN)',
      chiefComplaint: 'ANC-3 Routine Antenatal Checkup & Fetal Wellbeing Review (28 Weeks)',
      vitals: { bp: '114/74', pulse: '78', spO2: '99%', hb: '11.2 g/dL' },
      source: 'ASHA Scheduled ANC Clinic',
      ashaWorker: 'Sunita Tai (ASHA Sangini)',
      waitingTime: '2 hours ago',
      timeReceived: '08:50 AM',
      type: 'TELECONSULT',
      status: 'WAITING',
      notes: 'Fundal height corresponds to gestational age (28 cm). FHR 144 bpm regular. Fetal kicks active.',
      hasAttachment: false
    },
    {
      id: 'cq-08',
      patientId: 'p-09',
      patientName: 'Maruti Jadhav',
      age: 42,
      gender: 'Male',
      village: 'Khed',
      abhaId: '91-1122-3344-5566',
      priority: 'ROUTINE',
      priorityLabel: 'Routine (GREEN)',
      chiefComplaint: 'Seasonal Allergic Rhinitis, Sneezing & Routine IFA Supply Refill',
      vitals: { bp: '122/78', pulse: '72', spO2: '99%', temp: '98.4 °F' },
      source: 'Patient Direct Booking',
      ashaWorker: 'None (Direct Booking)',
      waitingTime: '2.5 hours ago',
      timeReceived: '08:20 AM',
      type: 'TELECONSULT',
      status: 'WAITING',
      notes: 'No fever or breathlessness. Mild nasal turbinate hypertrophy.',
      hasAttachment: false
    }
  ],
  patientsList: [
    {
      id: 'p-01',
      fullName: 'Radhika Shinde',
      phone: '9876543210',
      age: 24,
      gender: 'Female',
      category: 'PREGNANT_MOTHER',
      categoryLabel: 'Pregnant Mother (ANC)',
      village: 'Nigdale',
      abhaId: '91-4521-8890-1234',
      status: 'Stable / Green',
      lastVisit: '2026-09-14',
      diagnosis: '28 Weeks Gravida 1 (Normal Progress)',
      assignedAsha: 'Sunita Tai',
      lastVitals: { bp: '114/74', pulse: '78', spO2: '99%', hb: '11.2 g/dL' }
    },
    {
      id: 'p-02',
      fullName: 'Meena Waghmare',
      phone: '9822334411',
      age: 22,
      gender: 'Female',
      category: 'HIGH_RISK_ANC',
      categoryLabel: 'High-Risk Pregnancy',
      village: 'Nigdale',
      abhaId: '91-8832-1102-4567',
      status: 'Urgent / Red',
      lastVisit: '2026-09-16 (Today)',
      diagnosis: 'Severe Pre-Eclampsia in 34th Week',
      assignedAsha: 'Sunita Tai',
      lastVitals: { bp: '150/98', pulse: '92', spO2: '97%', hb: '9.8 g/dL' }
    },
    {
      id: 'p-03',
      fullName: 'Tukaram Patil',
      phone: '9876543211',
      age: 48,
      gender: 'Male',
      category: 'CHRONIC_CARE',
      categoryLabel: 'Chronic Care (HTN)',
      village: 'Khed',
      abhaId: '91-3142-9901-5678',
      status: 'Monitoring / Yellow',
      lastVisit: '2026-09-10',
      diagnosis: 'Essential Hypertension Stage 1',
      assignedAsha: 'Sunita Tai',
      lastVitals: { bp: '142/90', pulse: '74', spO2: '98%', bloodSugar: '138 mg/dL' }
    },
    {
      id: 'p-04',
      fullName: 'Kavita Gawli',
      phone: '9822334422',
      age: 27,
      gender: 'Female',
      category: 'LACTATING_MOTHER',
      categoryLabel: 'Lactating Mother',
      village: 'Bhimashankar',
      abhaId: '91-4455-6677-8899',
      status: 'Stable / Green',
      lastVisit: '2026-09-08',
      diagnosis: 'Postpartum Lactation & Maternal Nutrition',
      assignedAsha: 'Sunita Tai',
      lastVitals: { bp: '118/76', pulse: '72', spO2: '99%', hb: '11.0 g/dL' }
    },
    {
      id: 'p-05',
      fullName: 'Aarav Gawli (Infant)',
      phone: '9822334422',
      age: 1,
      gender: 'Male',
      category: 'INFANT',
      categoryLabel: 'Infant (0-1 yr)',
      village: 'Bhimashankar',
      abhaId: '91-9988-7766-5544',
      status: 'Vaccine Recall / Yellow',
      lastVisit: '2026-09-12',
      diagnosis: 'Acute Febrile Illness & Delayed Immunization',
      assignedAsha: 'Sunita Tai',
      lastVitals: { temp: '102.4 °F', pulse: '128', spO2: '96%', weight: '8.2 kg' }
    },
    {
      id: 'p-06',
      fullName: 'Baban Rao',
      phone: '9822334433',
      age: 62,
      gender: 'Male',
      category: 'ELDERLY',
      categoryLabel: 'Senior Citizen (60+)',
      village: 'Nigdale',
      abhaId: '91-2233-4455-6677',
      status: 'Respiratory Alert / Yellow',
      lastVisit: '2026-09-15',
      diagnosis: 'Chronic Bronchitis / Suspected Pulmonary TB',
      assignedAsha: 'Sunita Tai',
      lastVitals: { bp: '130/84', pulse: '86', spO2: '93%', temp: '99.8 °F' }
    },
    {
      id: 'p-07',
      fullName: 'Ganesh Shinde',
      phone: '9822334444',
      age: 35,
      gender: 'Male',
      village: 'Nigdale',
      abhaId: '91-6655-4433-2211',
      status: 'Urgent / Red',
      category: 'EMERGENCY',
      categoryLabel: 'Occupational Trauma',
      lastVisit: '2026-09-16 (Today)',
      diagnosis: 'Pesticide Chemical Splash in Right Eye',
      assignedAsha: 'Sunita Tai',
      lastVitals: { bp: '136/86', pulse: '96', spO2: '99%' }
    }
  ],
  patientTimelines: {
    'p-02': [
      { id: 'tl-01', date: '2026-09-16 10:45 AM', type: 'EMERGENCY_TRIAGE', title: 'Doorstep Triage Alert by ASHA Sunita Tai', details: 'BP 150/98 mmHg, pulse 92 bpm, severe headache. Albuminuria 2+ dipstick. Flagged RED urgency.', actor: 'Sunita Tai (ASHA)', priority: 'RED' },
      { id: 'tl-02', date: '2026-09-16 10:55 AM', type: 'DOCTOR_TELECONSULT', title: 'Emergency Video Teleconsult Initiated by Dr. Kulkarni', details: 'Confirmed scotoma and hyperreflexia. Administered oral Labetalol 100mg stat. Dispatched 102 ambulance to Nigdale.', actor: 'Dr. Ramesh Kulkarni (Medical Officer)', priority: 'RED' },
      { id: 'tl-03', date: '2026-09-16 11:10 AM', type: 'REFERRAL_DISPATCH', title: '102 Janani Shishu Vahan Dispatched to Bhimashankar PHC', details: 'Patient placed in left lateral recumbent position for transit with ASHA worker escort.', actor: '102 Emergency Dispatch', priority: 'RED' },
      { id: 'tl-04', date: '2026-09-02 11:00 AM', type: 'OPD_CHECKUP', title: 'ANC-2 Clinic Checkup at Bhimashankar PHC', details: 'BP 132/84 mmHg, weight 54 kg, fundal height 32 cm. Prescribed Iron & Calcium tablets.', actor: 'Dr. Sunita Deshmukh', priority: 'GREEN' },
      { id: 'tl-05', date: '2026-08-10 10:30 AM', type: 'LAB_TEST', title: 'Complete Blood Count & Hemoglobin Test', details: 'Hb 9.8 g/dL (Mild Anemia), Platelet count 210,000 /uL. Urine routine normal.', actor: 'Khed CHC Pathology Lab', priority: 'YELLOW' }
    ],
    'p-03': [
      { id: 'tl-11', date: '2026-09-16 09:50 AM', type: 'OPD_CHECKUP', title: 'Routine Hypertension Follow-up Visit', details: 'BP 142/90 mmHg. Patient experiencing mild bilateral dependent ankle swelling.', actor: 'Dr. Ramesh Kulkarni', priority: 'YELLOW' },
      { id: 'tl-12', date: '2026-09-10 03:00 PM', type: 'ASHA_VISIT', title: 'Home Vitals Check by ASHA Sunita Tai', details: 'Morning BP 138/88 mmHg. Verified daily Amlodipine 5mg adherence.', actor: 'Sunita Tai', priority: 'GREEN' },
      { id: 'tl-13', date: '2026-08-15 10:00 AM', type: 'PRESCRIPTION_ISSUED', title: 'Refill: Tab Amlodipine 5mg Once Daily', details: 'Dispensed 30-day supply from Khed CHC free pharmacy dispensary.', actor: 'Dr. Ramesh Kulkarni', priority: 'GREEN' }
    ]
  },
  medicalRecords: [
    {
      id: 'rec-01',
      patientName: 'Meena Waghmare',
      patientId: 'p-02',
      title: 'Urine Dipstick Proteinuria & Albumin Test',
      type: 'LAB_REPORT',
      category: 'URINALYSIS',
      facility: 'Bhimashankar PHC Lab',
      date: '2026-09-16',
      status: 'Requires Review',
      findings: 'Albumin: Positive 2+ (approx 100 mg/dL). Specific gravity 1.020. Ketones negative.',
      doctorSigned: false
    },
    {
      id: 'rec-02',
      patientName: 'Radhika Shinde',
      patientId: 'p-01',
      title: 'Obstetric Ultrasound (USG) Scan - 2nd Trimester Anomaly',
      type: 'ULTRASOUND',
      category: 'RADIOLOGY',
      facility: 'Khed CHC Radiology Suite',
      date: '2026-09-01',
      status: 'Verified',
      findings: 'Single live intrauterine gestation. Gestational age: 26w 2d. Placenta fundal anterior, grade I maturity. Amniotic fluid index (AFI): 13.4 cm (normal). No gross anomalies.',
      doctorSigned: true
    },
    {
      id: 'rec-03',
      patientName: 'Baban Rao',
      patientId: 'p-06',
      title: '12-Lead Electrocardiogram (ECG) Tracing',
      type: 'ECG',
      category: 'CARDIOLOGY',
      facility: 'Khed CHC Emergency Care',
      date: '2026-09-15',
      status: 'Verified',
      findings: 'Normal sinus rhythm at 84 bpm. PR interval 152 ms, QRS duration 86 ms. No acute ST-T elevation or pathological Q waves.',
      doctorSigned: true
    },
    {
      id: 'rec-04',
      patientName: 'Tukaram Patil',
      patientId: 'p-03',
      title: 'Fasting Blood Glucose & Serum Lipid Profile',
      type: 'LAB_REPORT',
      category: 'BIOCHEMISTRY',
      facility: 'Khed CHC Lab',
      date: '2026-09-10',
      status: 'Verified',
      findings: 'Fasting Glucose: 138 mg/dL (Impaired). Total Cholesterol: 198 mg/dL. Triglycerides: 165 mg/dL. HDL: 42 mg/dL.',
      doctorSigned: true
    }
  ],
  prescriptionsList: [
    {
      id: 'rx-2026-0901',
      rxNumber: 'RX-MH-KHED-08912',
      date: '2026-09-16',
      patientName: 'Meena Waghmare',
      patientId: 'p-02',
      age: 22,
      gender: 'Female',
      diagnosis: 'Severe Pre-Eclampsia in 34th Gestational Week',
      doctorName: 'Dr. Ramesh Kulkarni',
      facility: 'Khed Community Health Centre',
      medicines: [
        { name: 'Tab Labetalol 100mg', dosage: '1 tablet', frequency: 'Twice Daily (BD)', duration: '5 days', instructions: 'Take orally after meals. Monitor BP every 4 hours.' },
        { name: 'Inj Magnesium Sulfate (MgSO4) 50%', dosage: '4g IV loading + 10g IM', frequency: 'Immediate Stat Dose', duration: 'Stat dose', instructions: 'Eclampsia prophylaxis protocol prior to hospital transfer.' },
        { name: 'Tab Calcium Carbonate 500mg', dosage: '1 tablet', frequency: 'Once Daily (OD)', duration: '30 days', instructions: 'Take with clean water.' }
      ],
      clinicalAdvice: 'Strict bed rest in left lateral tilt. Transfer immediately to Bhimashankar PHC / Khed CHC via 102 Janani Shishu Vahan. Keep emergency airway ready.',
      status: 'Active',
      qrToken: 'ABDM-RX-918832-KHED-0916'
    },
    {
      id: 'rx-2026-0902',
      rxNumber: 'RX-MH-KHED-08904',
      date: '2026-09-15',
      patientName: 'Baban Rao',
      patientId: 'p-06',
      age: 62,
      gender: 'Male',
      diagnosis: 'Acute Exacerbation of Chronic Bronchitis / Suspected Lower RTI',
      doctorName: 'Dr. Ramesh Kulkarni',
      facility: 'Khed Community Health Centre',
      medicines: [
        { name: 'Cap Amoxicillin 500mg', dosage: '1 capsule', frequency: 'Three Times Daily (TDS)', duration: '7 days', instructions: 'Complete full 7-day antibiotic course.' },
        { name: 'Syp Ambroxol HCl (30mg/5ml)', dosage: '10 ml', frequency: 'Three Times Daily (TDS)', duration: '5 days', instructions: 'Take with warm water after meals.' },
        { name: 'Tab Paracetamol 500mg', dosage: '1 tablet', frequency: 'SOS (as needed)', duration: '3 days', instructions: 'Take if body temperature > 100 °F.' }
      ],
      clinicalAdvice: 'Steam inhalation twice daily. Avoid cold exposure and biomass cooking smoke. Attend Khed CHC for chest X-ray and sputum AFB test if symptoms persist.',
      status: 'Active',
      qrToken: 'ABDM-RX-912233-KHED-0915'
    },
    {
      id: 'rx-2026-0903',
      rxNumber: 'RX-MH-KHED-08882',
      date: '2026-09-10',
      patientName: 'Tukaram Patil',
      patientId: 'p-03',
      age: 48,
      gender: 'Male',
      diagnosis: 'Essential Hypertension Stage 1 & Impaired Fasting Glucose',
      doctorName: 'Dr. Ramesh Kulkarni',
      facility: 'Khed Community Health Centre',
      medicines: [
        { name: 'Tab Telmisartan 40mg', dosage: '1 tablet', frequency: 'Once Daily in Morning (OD)', duration: '30 days', instructions: 'Swallow whole with morning meal. Switched from Amlodipine.' },
        { name: 'Tab Metformin 500mg', dosage: '1 tablet', frequency: 'Twice Daily with Meals (BD)', duration: '30 days', instructions: 'Take with breakfast and dinner.' }
      ],
      clinicalAdvice: 'Strict low salt diet (< 5g/day). 30 minutes daily brisk walking. Doorstep weekly BP logging with Sunita Tai.',
      status: 'Active',
      qrToken: 'ABDM-RX-913142-KHED-0910'
    }
  ],
  referralsList: [
    {
      id: 'ref-doc-01',
      patientName: 'Meena Waghmare',
      patientId: 'p-02',
      age: 22,
      referredToFacility: 'Manchar Sub-District Hospital (Specialist Obs/Gyn Unit)',
      referringDoctor: 'Dr. Ramesh Kulkarni',
      attendingSpecialist: 'Dr. S. Deshmukh (MCH Specialist)',
      reason: 'Imminent Severe Pre-Eclampsia at 34 Weeks requiring NICU backup & operative delivery capability',
      priority: 'RED',
      transport: '102 Janani Shishu Vahan Dispatched with Oxygen & Suction kit',
      date: '2026-09-16',
      status: 'IN_TRANSIT',
      dispatchTime: '11:15 AM'
    },
    {
      id: 'ref-doc-02',
      patientName: 'Ganesh Shinde',
      patientId: 'p-07',
      age: 35,
      referredToFacility: 'Manchar Sub-District Hospital (Ophthalmology Unit)',
      referringDoctor: 'Dr. Ramesh Kulkarni',
      attendingSpecialist: 'Dr. Anil Jadhav (Emergency MO)',
      reason: 'Organophosphate Pesticide Eye Burn requiring Slit-lamp evaluation & topical steroid titration',
      priority: 'RED',
      transport: '108 Emergency Ambulance',
      date: '2026-09-16',
      status: 'DISPATCHED',
      dispatchTime: '10:50 AM'
    },
    {
      id: 'ref-doc-03',
      patientName: 'Baban Rao',
      patientId: 'p-06',
      age: 62,
      referredToFacility: 'Khed Community Health Centre (Pulmonology OPD)',
      referringDoctor: 'Dr. Ramesh Kulkarni',
      attendingSpecialist: 'Chest Physician / Senior Medical Officer',
      reason: 'Persistent Cough with SpO2 93% requiring Sputum GeneXpert (CBNAAT) & Digital Chest Radiography',
      priority: 'HIGH',
      transport: 'Public OPD Transport with Family',
      date: '2026-09-15',
      status: 'APPOINTMENT_CONFIRMED',
      dispatchTime: 'Scheduled for 18 Sep 2026'
    }
  ],
  scheduleSlots: [
    { id: 'sch-01', time: '08:30 AM - 10:30 AM', title: 'Emergency Triage & Red Case Tele-Consults', type: 'EMERGENCY', location: 'Telemedicine Console', attendees: '3 urgent cases queued' },
    { id: 'sch-02', time: '10:30 AM - 01:30 PM', title: 'Khed CHC Physical OPD Clinic & Minor Procedures', type: 'OPD_CLINIC', location: 'OPD Room #4, Khed CHC', attendees: '28 registered patients' },
    { id: 'sch-03', time: '02:00 PM - 03:30 PM', title: 'Frontline ASHA Doorstep Teleconsultation Link', type: 'TELEMEDICINE', location: 'Remote Video/Audio Link', attendees: 'Sunita Tai (Nigdale Hamlet)' },
    { id: 'sch-04', time: '03:30 PM - 04:30 PM', title: 'Store-and-Forward Photo Review & Digital e-Rx Signing', type: 'REVIEW', location: 'Clinical Console', attendees: '4 photo cases awaiting review' },
    { id: 'sch-05', time: '04:30 PM - 05:30 PM', title: 'High-Risk Maternal (ANC) & Chronic Care Board', type: 'CASE_CONFERENCE', location: 'Maternal Health Committee', attendees: 'Block Medical Officer & CHO' }
  ],
  treatmentTracking: [
    {
      patientId: 'p-02',
      patientName: 'Meena Waghmare',
      condition: 'High-Risk Gestational Hypertension & Pre-Eclampsia',
      gestationalAge: '34 Weeks',
      riskTier: 'CRITICAL_RED',
      adherenceRate: '95%',
      lastVitalsRecorded: 'BP 150/98 mmHg (Today 10:45 AM)',
      targetParameters: 'Systolic < 140 mmHg, Diastolic < 90 mmHg',
      status: 'Escalated to Inpatient Referral',
      trajectory: 'Worsening (Prompt delivery required)',
      assignedAsha: 'Sunita Tai'
    },
    {
      patientId: 'p-03',
      patientName: 'Tukaram Patil',
      condition: 'Essential Hypertension & Impaired Fasting Glucose',
      riskTier: 'MODERATE_YELLOW',
      adherenceRate: '88%',
      lastVitalsRecorded: 'BP 142/90 mmHg, Blood Sugar 138 mg/dL',
      targetParameters: 'BP < 130/80 mmHg, Fasting Glucose < 110 mg/dL',
      status: 'Medication Switched to Telmisartan 40mg',
      trajectory: 'Sub-optimally controlled (Improving with new Rx)',
      assignedAsha: 'Sunita Tai'
    },
    {
      patientId: 'p-06',
      patientName: 'Baban Rao',
      condition: 'Sub-acute Respiratory Infection & Suspected Pulmonary TB',
      riskTier: 'MODERATE_YELLOW',
      adherenceRate: '92%',
      lastVitalsRecorded: 'SpO2 93%, Respiratory Rate 22/min',
      targetParameters: 'SpO2 > 95% on room air, Sputum AFB Negative',
      status: 'Pending GeneXpert Result',
      trajectory: 'Guarded (Under active antibiotic therapy)',
      assignedAsha: 'Sunita Tai'
    },
    {
      patientId: 'p-08',
      patientName: 'Sharda Bai Jadhav',
      condition: 'Type-2 Diabetes Mellitus with Peripheral Neuropathy',
      riskTier: 'MODERATE_YELLOW',
      adherenceRate: '82%',
      lastVitalsRecorded: 'Blood Sugar 194 mg/dL',
      targetParameters: 'Fasting Sugar < 120 mg/dL, HbA1c < 7.0%',
      status: 'Daily Metformin 500mg BD + Foot hygiene guidance',
      trajectory: 'Stable with active ASHA foot inspection',
      assignedAsha: 'Pooja Tai'
    }
  ],
  storeAndForwardCases: [
    {
      id: 'sfc-01',
      patientName: 'Ganesh Shinde',
      patientId: 'p-07',
      age: 35,
      village: 'Nigdale',
      category: 'EYE_INJURY',
      title: 'Pesticide Spray Chemical Eye Irritation & Corneal Erythema',
      symptoms: 'Right eye acute conjunctival redness, tearing, photophobia after spraying organophosphate without protective goggles.',
      urgency: 'RED',
      date: '2026-09-16 10:35 AM',
      ashaName: 'Sunita Tai',
      status: 'Awaiting Doctor Review',
      doctorNotesDraft: 'Copious saline wash confirmed. Administered Moxifloxacin 0.5% eye drops stat. Dispatched to Ophthalmology.',
      photoUrl: CLINICAL_PHOTOS.EYE_INJURY
    },
    {
      id: 'sfc-02',
      patientName: 'Baby of Kavita (Aarav)',
      patientId: 'p-05',
      age: 1,
      village: 'Bhimashankar',
      category: 'DERMATOLOGY',
      title: 'Neonatal Heat Rash & Prickly Miliaria Papules',
      symptoms: 'Mild erythematous pinpoint papular eruption across neck creases and anterior chest. Infant afebrile at submission, feeds normally.',
      urgency: 'YELLOW',
      date: '2026-09-15 04:15 PM',
      ashaName: 'Sunita Tai',
      status: 'Doctor Reviewed',
      doctorNotesDraft: 'Advised loose breathable cotton wear. Apply calamine lotion twice daily. Keep area dry. Review if pustules emerge.',
      photoUrl: CLINICAL_PHOTOS.DERMATOLOGY
    },
    {
      id: 'sfc-03',
      patientName: 'Sharda Bai Jadhav',
      patientId: 'p-08',
      age: 55,
      village: 'Ambegaon',
      category: 'WOUND_ULCER',
      title: 'Diabetic Plantar Skin Fissure & Callus Formation',
      symptoms: 'Heel skin cracking with localized erythema. No purulent exudate or foul odor. Monofilament test reduced.',
      urgency: 'YELLOW',
      date: '2026-09-15 02:30 PM',
      ashaName: 'Pooja Tai',
      status: 'Awaiting Doctor Review',
      doctorNotesDraft: 'Recommend 10% Urea cream application, customized cushioned micro-cellular rubber footwear. Maintain strict glycemic control.',
      photoUrl: CLINICAL_PHOTOS.WOUND_ULCER
    }
  ],
  followupsList: [
    {
      id: 'fup-doc-01',
      patientName: 'Meena Waghmare',
      dueDate: 'Today, 02:00 PM',
      task: 'Blood Pressure Post-Labetalol Titration & Urine Dipstick Re-test',
      notes: 'Verify headache and vision changes. Ensure patient reaches Bhimashankar PHC safely.',
      priority: 'RED',
      status: 'PENDING',
      assignedAsha: 'Sunita Tai'
    },
    {
      id: 'fup-doc-02',
      patientName: 'Aarav Gawli (Infant)',
      dueDate: 'Tomorrow Morning',
      task: 'Fever Resolution Check & Administration of Missed MR-1 Vaccine',
      notes: 'Confirm temperature < 99 °F before immunization. Mother notified by ASHA.',
      priority: 'HIGH',
      status: 'PENDING',
      assignedAsha: 'Sunita Tai'
    },
    {
      id: 'fup-doc-03',
      patientName: 'Tukaram Patil',
      dueDate: '19 Sep 2026',
      task: 'Telmisartan Tolerability & Blood Pressure Check',
      notes: 'Check for dizziness or orthostatic drops on standing.',
      priority: 'MODERATE',
      status: 'SCHEDULED',
      assignedAsha: 'Sunita Tai'
    },
    {
      id: 'fup-doc-04',
      patientName: 'Radhika Shinde',
      dueDate: '22 Sep 2026',
      task: 'Follow-up for ANC-3 Routine Laboratory Evaluation',
      notes: 'Review repeat Hemoglobin and blood grouping report.',
      priority: 'ROUTINE',
      status: 'SCHEDULED',
      assignedAsha: 'Sunita Tai'
    }
  ],
  notifications: [
    {
      id: 'notif-doc-01',
      title: 'CRITICAL TRIAGE ALERT: Severe Pre-Eclampsia',
      message: 'Meena Waghmare (34w) flagged RED by ASHA Sunita Tai. BP 150/98 with severe scotoma.',
      priority: 'RED',
      time: '8 mins ago',
      unread: true,
      actionLink: '/doctor/queue?filter=RED'
    },
    {
      id: 'notif-doc-02',
      title: 'New Clinical Photo Case Submitted',
      message: 'Agricultural pesticide eye splash for Ganesh Shinde submitted for store-and-forward review.',
      priority: 'RED',
      time: '18 mins ago',
      unread: true,
      actionLink: '/doctor/photo-cases'
    },
    {
      id: 'notif-doc-03',
      title: 'Lab Report Ready: Khed CHC Pathology',
      message: 'Complete Blood Count & Hemoglobin ready for Radhika Shinde (Hb: 11.2 g/dL).',
      priority: 'ROUTINE',
      time: '1 hour ago',
      unread: false,
      actionLink: '/doctor/records'
    },
    {
      id: 'notif-doc-04',
      title: 'Scheduled Teleconsultation In 30 Minutes',
      message: 'Frontline village link scheduled with Bhimashankar Sub-Centre at 02:00 PM.',
      priority: 'HIGH',
      time: '1.5 hours ago',
      unread: false,
      actionLink: '/doctor/consult'
    }
  ]
};

export const MOCK_ADMIN_DATA = {
  healthMetrics: {
    totalRegisteredCitizens: 8420,
    activeAshaWorkers: 42,
    totalMedicalOfficers: 16,
    totalConsultationsCompleted: 1390,
    maternalRiskAlertsActive: 5,
    phcReportingRate: '98.2%',
    districtReferralsThisMonth: 128,
    medicineAvailabilityRate: '92.4%',
    abhaCardIssuanceRate: '89.6%'
  },
  citizensRegistry: [
    {
      id: 'cit-001',
      abhaId: '91-4521-8890-1234',
      fullName: 'Radhika Shinde',
      age: 26,
      gender: 'Female',
      village: 'Nigdale',
      hamlet: 'Thakarwadi',
      contactNumber: '+91-9876543210',
      assignedAsha: 'Sunita Tai (ASHA-04)',
      healthStatus: 'Maternal ANC 3rd Trimester (High BP Watch)',
      registrationStatus: 'Verified',
      registrationDate: '2026-01-14',
      lastAssessmentDate: '2026-03-12',
      vitalsSummary: 'BP: 142/90 | Pulse: 84 | SpO2: 98%'
    },
    {
      id: 'cit-002',
      abhaId: '91-8842-1093-5678',
      fullName: 'Tukaram Patil',
      age: 54,
      gender: 'Male',
      village: 'Bhimashankar',
      hamlet: 'Koliwada',
      contactNumber: '+91-9822114455',
      assignedAsha: 'Sunita Tai (ASHA-04)',
      healthStatus: 'Type 2 Diabetes & Hypertension Review',
      registrationStatus: 'Verified',
      registrationDate: '2026-01-20',
      lastAssessmentDate: '2026-03-10',
      vitalsSummary: 'Blood Sugar: 168 mg/dL | BP: 134/86'
    },
    {
      id: 'cit-003',
      abhaId: 'Pending ABHA Linking',
      fullName: 'Aarav Sandeep Gaikwad',
      age: 2,
      gender: 'Male',
      village: 'Khed',
      hamlet: 'Peth Ward 3',
      contactNumber: '+91-9811223344',
      assignedAsha: 'Meena Tai (ASHA-12)',
      healthStatus: 'Routine Immunization (Pentavalent-3 Due)',
      registrationStatus: 'Pending Verification',
      registrationDate: '2026-03-01',
      lastAssessmentDate: '2026-03-05',
      vitalsSummary: 'Weight: 11.2 kg | Height: 84 cm'
    },
    {
      id: 'cit-004',
      abhaId: '91-3312-9901-4432',
      fullName: 'Savita Baburao Jadhav',
      age: 48,
      gender: 'Female',
      village: 'Nigdale',
      hamlet: 'Bhil Pada',
      contactNumber: '+91-9765432190',
      assignedAsha: 'Sunita Tai (ASHA-04)',
      healthStatus: 'Chronic Joint Pain & Mild Anemia (Hb 9.8)',
      registrationStatus: 'Verified',
      registrationDate: '2026-02-11',
      lastAssessmentDate: '2026-03-14',
      vitalsSummary: 'Hb: 9.8 g/dL | BP: 120/78'
    },
    {
      id: 'cit-005',
      abhaId: '91-7765-4321-9801',
      fullName: 'Ganesh Maruti Kadam',
      age: 38,
      gender: 'Male',
      village: 'Manchar',
      hamlet: 'Station Road',
      contactNumber: '+91-9421008877',
      assignedAsha: 'Anita Tai (ASHA-08)',
      healthStatus: 'Post-OP Fracture Recovery Monitoring',
      registrationStatus: 'Verified',
      registrationDate: '2026-02-28',
      lastAssessmentDate: '2026-03-15',
      vitalsSummary: 'Mobility Improving | Pain Scale 2/10'
    },
    {
      id: 'cit-006',
      abhaId: 'Pending ABHA Linking',
      fullName: 'Parvati Shriram Thorat',
      age: 67,
      gender: 'Female',
      village: 'Bhimashankar',
      hamlet: 'Bhoir Vasti',
      contactNumber: '+91-9850112233',
      assignedAsha: 'Sunita Tai (ASHA-04)',
      healthStatus: 'Cataract Screening & Osteoarthritis',
      registrationStatus: 'Pending Verification',
      registrationDate: '2026-03-04',
      lastAssessmentDate: '2026-03-11',
      vitalsSummary: 'BP: 130/82 | Vision acuity impaired'
    }
  ],
  workforceRoster: {
    ashaWorkers: [
      {
        id: 'asha-001',
        name: 'Sunita Sakharam Gawande',
        employeeId: 'MH-PUN-ASHA-042',
        village: 'Nigdale & Bhimashankar Hamlet',
        householdsCovered: 164,
        activeMaternalCases: 8,
        contactNumber: '+91-9822119900',
        joiningDate: '2021-06-15',
        verificationStatus: 'Verified',
        incentiveStatus: 'Disbursed (₹3,400)',
        performanceScore: '98.5%'
      },
      {
        id: 'asha-002',
        name: 'Meena Eknath More',
        employeeId: 'MH-PUN-ASHA-018',
        village: 'Ambegaon Tribal Pocket',
        householdsCovered: 142,
        activeMaternalCases: 5,
        contactNumber: '+91-9822334411',
        joiningDate: '2022-09-10',
        verificationStatus: 'Verified',
        incentiveStatus: 'Disbursed (₹3,100)',
        performanceScore: '95.0%'
      },
      {
        id: 'asha-003',
        name: 'Rekha Anand Shinde',
        employeeId: 'MH-PUN-ASHA-089',
        village: 'Khed North Hamlet',
        householdsCovered: 110,
        activeMaternalCases: 3,
        contactNumber: '+91-9822556677',
        joiningDate: '2026-02-01',
        verificationStatus: 'Pending Review',
        incentiveStatus: 'Pending Verification',
        performanceScore: '89.2%'
      },
      {
        id: 'asha-004',
        name: 'Anita Shantaram Bhor',
        employeeId: 'MH-PUN-ASHA-112',
        village: 'Manchar Outskirts',
        householdsCovered: 155,
        activeMaternalCases: 6,
        contactNumber: '+91-9822667788',
        joiningDate: '2023-01-20',
        verificationStatus: 'Verified',
        incentiveStatus: 'Disbursed (₹3,250)',
        performanceScore: '96.8%'
      }
    ],
    doctors: [
      {
        id: 'doc-001',
        name: 'Dr. Ramesh Kulkarni, MD',
        qualification: 'MBBS, MD (General Medicine)',
        councilRegistration: 'MMC-2012-08-3412',
        hprId: 'hpr-doc-990123',
        facility: 'Khed Community Health Centre (CHC)',
        contactNumber: '+91-9822001122',
        verificationStatus: 'Verified',
        teleconsultationsCompleted: 642,
        rating: '4.9/5.0'
      },
      {
        id: 'doc-002',
        name: 'Dr. Sunita Deshmukh, MS',
        qualification: 'MBBS, DGO (Obstetrics & Gynaecology)',
        councilRegistration: 'MMC-2015-11-8976',
        hprId: 'hpr-doc-881245',
        facility: 'Bhimashankar Primary Health Centre (PHC)',
        contactNumber: '+91-9822003344',
        verificationStatus: 'Verified',
        teleconsultationsCompleted: 512,
        rating: '4.8/5.0'
      },
      {
        id: 'doc-003',
        name: 'Dr. Vikramaditya Joshi',
        qualification: 'MBBS (Rural Medical Officer)',
        councilRegistration: 'MMC-2024-04-1290',
        hprId: 'hpr-doc-771109',
        facility: 'Manchar Sub-District Hospital',
        contactNumber: '+91-9822778899',
        verificationStatus: 'Pending Verification',
        teleconsultationsCompleted: 84,
        rating: '4.6/5.0'
      }
    ]
  },
  facilitiesNetwork: [
    {
      id: 'fac-01',
      name: 'Khed Community Health Centre (CHC)',
      type: 'CHC',
      block: 'Rajgurunagar (Khed)',
      bedsTotal: 30,
      bedsOccupied: 22,
      oxygenCylinders: 12,
      ambulanceReady: true,
      ambulanceFleet: '108-ALS (MH-14-AZ-2041)',
      doctorInCharge: 'Dr. Ramesh Kulkarni',
      phone: '+91-9822001122',
      distanceKm: '12 km',
      medicineStockRating: '96% (Optimal)',
      diagnosticLabStatus: 'Operational (X-Ray, CBC, Malaria, Hb, Biochemistry)',
      keyMedicines: ['Paracetamol 500mg (1,200 tabs)', 'ORS (450 pkts)', 'Amoxicillin (600 caps)', 'IFA Tablets (900 tabs)'],
      availableTests: ['Complete Blood Count (CBC)', 'Malaria Antigen Test', 'Pregnancy Rapid Strip', 'Urine Routine', 'Chest X-Ray']
    },
    {
      id: 'fac-02',
      name: 'Bhimashankar Primary Health Centre (PHC)',
      type: 'PHC',
      block: 'Ambegaon',
      bedsTotal: 6,
      bedsOccupied: 4,
      oxygenCylinders: 4,
      ambulanceReady: true,
      ambulanceFleet: '102-BLS Janani Express (MH-14-BQ-1102)',
      doctorInCharge: 'Dr. Sunita Deshmukh',
      phone: '+91-9822003344',
      distanceKm: '8 km',
      medicineStockRating: '88% (Adequate)',
      diagnosticLabStatus: 'Operational (Rapid Tests, Blood Sugar, Hb)',
      keyMedicines: ['Paracetamol 500mg (350 tabs)', 'ORS (120 pkts)', 'Zinc Sulfate 20mg (500 tabs)', 'Methergine Inj (15 ampoules)'],
      availableTests: ['Hemoglobin Rapid Strip', 'Random Blood Sugar (Glucometer)', 'Malaria Rapid Test Kit', 'Sputum Smear for TB']
    },
    {
      id: 'fac-03',
      name: 'Nigdale Sub-Centre Health Post',
      type: 'SUB_CENTRE',
      block: 'Ambegaon',
      bedsTotal: 2,
      bedsOccupied: 1,
      oxygenCylinders: 1,
      ambulanceReady: false,
      ambulanceFleet: 'On-Call via Bhimashankar PHC (108)',
      doctorInCharge: 'Sunita Tai (CHO / ASHA In-Charge)',
      phone: '+91-9822005566',
      distanceKm: '1.5 km',
      medicineStockRating: '82% (Restock Requested for Amoxicillin)',
      diagnosticLabStatus: 'Basic PoC (Urine Albumin, Glucometer, Hb Strip)',
      keyMedicines: ['Paracetamol (150 tabs)', 'ORS Packets (80 pkts)', 'Iron Folic Acid (300 tabs)', 'Povidone Iodine 5% (10 bottles)'],
      availableTests: ['Pregnancy Rapid Test', 'Urine Albumin/Sugar Dipstick', 'Hb Color Scale', 'Rapid Blood Glucose']
    },
    {
      id: 'fac-04',
      name: 'Manchar Sub-District Hospital (SDH)',
      type: 'HOSPITAL',
      block: 'Ambegaon / Manchar',
      bedsTotal: 60,
      bedsOccupied: 48,
      oxygenCylinders: 28,
      ambulanceReady: true,
      ambulanceFleet: '108-ALS & Trauma Ambulance Standby',
      doctorInCharge: 'Dr. V. Joshi (Superintendent)',
      phone: '+91-9822778899',
      distanceKm: '22 km',
      medicineStockRating: '99% (Full Critical Supply)',
      diagnosticLabStatus: 'Advanced Lab, Digital Sonography & Trauma Ward Online',
      keyMedicines: ['IV Fluids (500 bottles)', 'Anti-Snake Venom (ASV - 45 vials)', 'Anti-Rabies Vaccine (80 vials)', 'Emergency Epinephrine'],
      availableTests: ['12-Lead Digital ECG', 'Ultrasound / Sonography (USG)', 'Electrolyte Analyzer', 'Microbiology Culture', 'Trauma CT']
    }
  ],
  analyticsData: {
    healthTrends: [
      { month: 'Oct 2025', consultations: 920, maternalCheckups: 310, ncdScreenings: 450 },
      { month: 'Nov 2025', consultations: 1050, maternalCheckups: 340, ncdScreenings: 510 },
      { month: 'Dec 2025', consultations: 1180, maternalCheckups: 375, ncdScreenings: 580 },
      { month: 'Jan 2026', consultations: 1290, maternalCheckups: 410, ncdScreenings: 640 },
      { month: 'Feb 2026', consultations: 1340, maternalCheckups: 425, ncdScreenings: 710 },
      { month: 'Mar 2026', consultations: 1390, maternalCheckups: 460, ncdScreenings: 780 }
    ],
    priorityDistribution: [
      { level: 'Red (Urgent Emergency)', count: 112, percentage: 8.1, color: 'bg-red-500', textColor: 'text-red-700' },
      { level: 'Orange (High Priority)', count: 250, percentage: 18.0, color: 'bg-orange-500', textColor: 'text-orange-700' },
      { level: 'Yellow (Moderate Risk)', count: 472, percentage: 34.0, color: 'bg-amber-500', textColor: 'text-amber-700' },
      { level: 'Green (Routine Normal)', count: 556, percentage: 39.9, color: 'bg-emerald-500', textColor: 'text-emerald-700' }
    ],
    followupStatistics: {
      scheduledTotal: 840,
      completedOnTime: 742,
      adherenceRate: '88.4%',
      overdueCases: 24,
      avgDaysToFollowup: 3.2,
      missedFollowupsResolved: 74
    },
    facilityActivity: [
      { name: 'Khed CHC', type: 'CHC', bedOccupancy: '73.3%', teleconsultations: 642, avgResponseMins: 7.4, rating: '4.9/5' },
      { name: 'Bhimashankar PHC', type: 'PHC', bedOccupancy: '66.7%', teleconsultations: 512, avgResponseMins: 8.9, rating: '4.8/5' },
      { name: 'Manchar SDH', type: 'HOSPITAL', bedOccupancy: '80.0%', teleconsultations: 152, avgResponseMins: 6.2, rating: '4.7/5' },
      { name: 'Nigdale Sub-Centre', type: 'SUB_CENTRE', bedOccupancy: '50.0%', teleconsultations: 84, avgResponseMins: 11.5, rating: '4.8/5' }
    ],
    workforceActivity: {
      totalHomeVisitsLogged: 2410,
      digitalAssessmentsCompleted: 1390,
      doorstepImmunizationsRecorded: 618,
      activeAshaReportingPercent: '100%',
      avgSyncDelayMins: 4.8
    },
    qualityMonitoring: {
      prescriptionCompliance: '94.2%',
      emergencyReferralTransitMins: 14.5,
      patientSatisfactionScore: '4.8 / 5.0',
      abhaLinkageCoverage: '89.4%',
      antibioticStewardshipRating: '96.1%'
    }
  },
  referrals: [
    {
      id: 'ref-01',
      patientName: 'Radhika Shinde',
      fromFacility: 'Nigdale Sub-Centre',
      toFacility: 'Bhimashankar PHC / Khed CHC',
      reason: 'Pregnancy ANC 3rd Trimester - High Blood Pressure Watch (148/94)',
      urgency: 'HIGH (Orange)',
      urgencyClass: 'bg-orange-100 text-orange-800 border-orange-200',
      assignedVehicle: '102 Janani Express (MH-14-BQ-1102)',
      driverName: 'Santosh Pawar (+91-9822445566)',
      transferStatus: 'En Route',
      timestamp: '2026-03-16 11:30'
    },
    {
      id: 'ref-02',
      patientName: 'Sanjay Tukaram More',
      fromFacility: 'Bhimashankar PHC',
      toFacility: 'Manchar Sub-District Hospital',
      reason: 'Acute Severe Chest Discomfort - ECG ST-Elevation Screening',
      urgency: 'URGENT (Red)',
      urgencyClass: 'bg-red-100 text-red-800 border-red-200',
      assignedVehicle: '108 Advanced Life Support (MH-14-AZ-2041)',
      driverName: 'Vikas Jadhav (+91-9822771122)',
      transferStatus: 'Admitted',
      timestamp: '2026-03-16 09:15'
    },
    {
      id: 'ref-03',
      patientName: 'Aarav Sandeep Gaikwad',
      fromFacility: 'Khed CHC',
      toFacility: 'Sassoon General Hospital Pune',
      reason: 'Pediatric Persistent High Grade Pyrexia with Dehydration',
      urgency: 'MODERATE (Yellow)',
      urgencyClass: 'bg-amber-100 text-amber-800 border-amber-200',
      assignedVehicle: '108 Ambulance BLS (MH-14-CK-8890)',
      driverName: 'Deepak Kale (+91-9822339900)',
      transferStatus: 'Completed',
      timestamp: '2026-03-15 16:45'
    }
  ],
  diseaseSurveillance: [
    {
      id: 'surv-01',
      condition: 'Viral Fever & Suspected Dengue Clusters',
      block: 'Ambegaon (Bhimashankar Valley)',
      clusterCases: 14,
      alertLevel: 'ELEVATED',
      levelBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      detectionSource: 'ASHA Household Vitals Checkup Logs',
      responseStatus: 'Field Inspection Dispatched',
      actionTaken: 'Entomological vector survey and larvicide spraying initiated in Nigdale and Bhimashankar hamlets.',
      dispatchActive: true
    },
    {
      id: 'surv-02',
      condition: 'Acute Diarrheal Disease (Suspected Water Contamination)',
      block: 'Khed Sub-Division (Rajgurunagar)',
      clusterCases: 6,
      alertLevel: 'MONITORING',
      levelBadgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
      detectionSource: 'Sub-Centre Water Quality Reports & Doorstep Triage',
      responseStatus: 'Chlorination Enforced',
      actionTaken: 'Super-chlorination of 4 village open wells; 120 ORS packets and chlorine tablets distributed.',
      dispatchActive: false
    },
    {
      id: 'surv-03',
      condition: 'Seasonal Viral Respiratory Infections (Pediatric)',
      block: 'Junnar Border Sub-Block',
      clusterCases: 9,
      alertLevel: 'LOW / ROUTINE',
      levelBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      detectionSource: 'PHC Outpatient Surveillance Data',
      responseStatus: 'Routine Symptomatic Care',
      actionTaken: 'Pediatric syrups stock replenished; ASHA monitoring young infants.',
      dispatchActive: false
    }
  ],
  reportsTemplates: [
    {
      id: 'rep-01',
      title: 'National Health Mission (NHM) Monthly District Health Bulletin',
      code: 'NHM-MH-PUN-M12',
      frequency: 'Monthly',
      category: 'Public Health Governance',
      format: 'PDF / CSV / JSON',
      lastGenerated: '2026-03-01',
      summary: 'Aggregated monthly performance of maternal ANC, child immunization, institutional deliveries, and teleconsultation volume across all 14 PHCs.'
    },
    {
      id: 'rep-02',
      title: 'Maternal & Child Health Audit (ANC/PNC & Immunization Registry)',
      code: 'RCH-AUDIT-2026-Q1',
      frequency: 'Quarterly',
      category: 'Maternal Care',
      format: 'CSV / JSON',
      lastGenerated: '2026-03-10',
      summary: 'Tracking high-risk pregnant mothers, severe anemia cases (Hb < 7 g/dL), pre-eclampsia screening, and 100% full immunization compliance.'
    },
    {
      id: 'rep-03',
      title: 'Integrated Disease Surveillance Programme (IDSP) Weekly Form P & L',
      code: 'IDSP-W11-2026',
      frequency: 'Weekly',
      category: 'Epidemic Surveillance',
      format: 'JSON / CSV',
      lastGenerated: '2026-03-15',
      summary: 'Syndromic, presumptive and laboratory-confirmed disease reporting for fever with rash, acute diarrhea, malaria, and acute jaundice.'
    },
    {
      id: 'rep-04',
      title: 'Essential Drug List (EDL-2026) Stock Availability & Stockout Index',
      code: 'EDL-INDEX-03',
      frequency: 'Real-Time / Daily',
      category: 'Supply Chain Logistics',
      format: 'CSV / Excel',
      lastGenerated: '2026-03-16 08:00',
      summary: 'Facility-wise stock levels of lifesaving drugs, IV fluids, anti-rabies vaccines, anti-snake venoms, and rapid test consumables.'
    }
  ]
};
