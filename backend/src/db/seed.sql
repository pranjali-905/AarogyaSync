-- ==========================================================
-- AarogyaSync Seed Data for PostgreSQL
-- Rural Healthcare Platform Demonstrations & Testing
-- Password for all demo accounts: demo123 ($2a$08$UeJ107G2uK3s5K... hash)
-- ==========================================================

-- 1. Users Seed
INSERT INTO users (id, full_name, phone, role, gender, preferred_language, village, district, password_hash)
VALUES
  ('usr-pat-female-01', 'Radhika Suresh Shinde', '9876543210', 'PATIENT', 'female', 'mr', 'Nigdale', 'Pune', '$2a$08$y2sIqGZ.6hHk9Uv0z8L6..j8YJbH9R74Z6x5aYV4s8c.u6U/6F.Vq'),
  ('usr-pat-male-02', 'Tukaram Maruti Patil', '9876543211', 'PATIENT', 'male', 'hi', 'Khed', 'Pune', '$2a$08$y2sIqGZ.6hHk9Uv0z8L6..j8YJbH9R74Z6x5aYV4s8c.u6U/6F.Vq'),
  ('usr-asha-01', 'Sunita Tai Gawande (ASHA Sangini)', '9876543220', 'ASHA', 'female', 'mr', 'Nigdale & Bhimashankar', 'Pune', '$2a$08$y2sIqGZ.6hHk9Uv0z8L6..j8YJbH9R74Z6x5aYV4s8c.u6U/6F.Vq'),
  ('usr-doc-01', 'Dr. Ramesh Kulkarni (MBBS, DNB)', '9876543230', 'DOCTOR', 'male', 'en', 'Khed', 'Pune', '$2a$08$y2sIqGZ.6hHk9Uv0z8L6..j8YJbH9R74Z6x5aYV4s8c.u6U/6F.Vq'),
  ('usr-admin-01', 'Shri S. V. Gaikwad (District Health Officer)', '9876543240', 'ADMIN', 'male', 'en', 'Pune Zilla Parishad', 'Pune', '$2a$08$y2sIqGZ.6hHk9Uv0z8L6..j8YJbH9R74Z6x5aYV4s8c.u6U/6F.Vq')
ON CONFLICT (id) DO NOTHING;

-- 2. Facilities Seed
INSERT INTO facilities (id, name, facility_type, village, block, district, contact_phone, doctor_in_charge, ambulance_available, operating_hours, total_beds, icu_beds)
VALUES
  ('fac-phc-01', 'Khed Community Health Centre (CHC)', 'CHC', 'Khed', 'Rajgurunagar', 'Pune', '+91-9822001122', 'Dr. Ramesh Kulkarni', true, '24x7', 30, 4),
  ('fac-phc-02', 'Bhimashankar Primary Health Centre (PHC)', 'PHC', 'Bhimashankar', 'Ambegaon', 'Pune', '+91-9822003344', 'Dr. Sunita Deshmukh', true, '24x7', 12, 0),
  ('fac-sub-03', 'Nigdale Sub-Centre Health Post', 'SUB_CENTRE', 'Nigdale', 'Ambegaon', 'Pune', '+91-9822005566', 'Sunita Tai (ASHA Sangini)', false, '08:00 AM - 04:00 PM', 2, 0),
  ('fac-dh-04', 'Aundh District Hospital', 'DISTRICT_HOSPITAL', 'Aundh', 'Haveli', 'Pune', '+91-9822007788', 'Dr. Sanjay Deshpande (Civil Surgeon)', true, '24x7', 350, 40)
ON CONFLICT (id) DO NOTHING;

-- 3. Patient Profiles Seed
INSERT INTO patient_profiles (id, user_id, abha_id, dob, age, blood_group, emergency_contact_phone, emergency_contact_name, emergency_contact_relation, is_pregnant, gravida, lmp_date, edd_date, gestational_weeks, high_risk_flag, chronic_conditions, allergies, assigned_asha_id)
VALUES
  ('pat-01', 'usr-pat-female-01', '91-4521-8890-1234', '2002-05-14', 24, 'B+', '+91-9823112233', 'Suresh Shinde', 'Husband', true, 'G1P0', '2026-03-01', '2026-12-06', 28, false, '{}', '{"Penicillin"}', 'usr-asha-01'),
  ('pat-02', 'usr-pat-male-02', '91-3142-9901-5678', '1978-08-20', 48, 'O+', '+91-9822114455', 'Parvati Patil', 'Wife', false, NULL, NULL, NULL, NULL, false, '{"Hypertension", "Impaired Fasting Glucose"}', '{}', 'usr-asha-01')
ON CONFLICT (id) DO NOTHING;

-- 4. ASHA Profile Seed
INSERT INTO asha_profiles (id, user_id, employee_id, assigned_villages, sub_centre, households_covered, active_maternal_cases, supervisor_name, qualification, verification_status)
VALUES
  ('asha-prof-01', 'usr-asha-01', 'MH-PUN-ASHA-042', '{"Nigdale", "Thakarwadi", "Bhimashankar Hamlet"}', 'Nigdale Sub-Centre', 164, 8, 'Meena Tai (Block Coordinator)', '12th Pass + ASHA Module 6 & 7 Certified', 'VERIFIED')
ON CONFLICT (id) DO NOTHING;

-- 5. Doctor Profile Seed
INSERT INTO doctor_profiles (id, user_id, registration_number, specialization, designation, facility_id, opd_timings, available_for_teleconsult, verification_status)
VALUES
  ('doc-prof-01', 'usr-doc-01', 'MCI-MH-2012-45892', 'General Medicine & Maternal Health', 'Senior Medical Officer, Khed CHC', 'fac-phc-01', '09:00 AM - 02:00 PM', true, 'VERIFIED')
ON CONFLICT (id) DO NOTHING;

-- 6. Child Records Seed
INSERT INTO child_records (id, mother_id, name, dob, gender, birth_weight_kg, immunization_status)
VALUES
  ('child-01', 'pat-01', 'Expected Baby Shinde', '2026-12-06', 'other', 3.0, '[{"vaccine": "BCG", "status": "Scheduled", "dueAge": "At Birth"}, {"vaccine": "OPV-0", "status": "Scheduled", "dueAge": "At Birth"}, {"vaccine": "Hepatitis B", "status": "Scheduled", "dueAge": "At Birth"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7. Master Medicines Catalogue
INSERT INTO medicines (id, name, generic_name, category, dosage_form, strength, is_essential, description)
VALUES
  ('med-01', 'Paracetamol 500mg', 'Paracetamol', 'ANALGESIC', 'TABLET', '500mg', true, 'Analgesic and antipyretic for fever and mild to moderate pain.'),
  ('med-02', 'Oral Rehydration Salts (ORS)', 'Oral Electrolyte Powder', 'NUTRITIONAL', 'SACHET', '21.8g', true, 'WHO formula for rapid rehydration in diarrhea and dehydration.'),
  ('med-03', 'Iron & Folic Acid (IFA)', 'Ferrous Sulfate + Folic Acid', 'NUTRITIONAL', 'TABLET', '100mg Fe + 0.5mg FA', true, 'Prophylaxis and treatment of nutritional anemia in pregnancy.'),
  ('med-04', 'Calcium Carbonate + Vitamin D3', 'Calcium 500mg + Vit D3 250IU', 'NUTRITIONAL', 'TABLET', '500mg', true, 'Skeletal support and preeclampsia risk reduction during pregnancy.'),
  ('med-05', 'Amlodipine 5mg', 'Amlodipine Besylate', 'ANTIHYPERTENSIVE', 'TABLET', '5mg', true, 'Calcium channel blocker for essential hypertension management.'),
  ('med-06', 'Telmisartan 40mg', 'Telmisartan', 'ANTIHYPERTENSIVE', 'TABLET', '40mg', true, 'Angiotensin receptor blocker for primary hypertension.'),
  ('med-07', 'Metformin 500mg', 'Metformin Hydrochloride', 'ANTIDIABETIC', 'TABLET', '500mg', true, 'First-line oral antidiabetic biguanide for type 2 diabetes.'),
  ('med-08', 'Amoxicillin 250mg', 'Amoxicillin Trihydrate', 'ANTIBIOTIC', 'CAPSULE', '250mg', true, 'Broad-spectrum penicillin antibiotic for respiratory and skin infections.'),
  ('med-09', 'Zinc Sulfate 20mg', 'Zinc Sulfate Monohydrate', 'NUTRITIONAL', 'TABLET', '20mg dispersible', true, 'Adjunct therapy with ORS in childhood acute diarrhea.'),
  ('med-10', 'Calamine Lotion 100ml', 'Calamine + Zinc Oxide', 'OTHER', 'LOTION', '15% w/v', false, 'Soothing topical application for prickly heat, sunburn, and skin irritation.')
ON CONFLICT (id) DO NOTHING;

-- 8. Master Diagnostic Tests Catalogue
INSERT INTO diagnostic_tests (id, name, code, category, sample_type, turnaround_hours, normal_range, description)
VALUES
  ('diag-01', 'Rapid Antigen Malaria Test (Pf/Pv)', 'MAL-RDT', 'RAPID_TEST', 'BLOOD', 1, 'Negative for Pf/Pv antigen', 'Point-of-care capillary whole blood rapid cassette test.'),
  ('diag-02', 'Digital Hemoglobin Strip Test (Hb)', 'HB-STRIP', 'RAPID_TEST', 'BLOOD', 1, '12.0 - 15.5 g/dL', 'Frontline microcuvette strip test for screening maternal and child anemia.'),
  ('diag-03', 'Urine Albumin & Sugar Dipstick', 'URINE-DIP', 'URINE', 'URINE', 1, 'Nil / Negative', 'Screening for gestational preeclampsia and glycosuria.'),
  ('diag-04', 'Fasting Blood Glucose (Glucometer)', 'FBG-POC', 'BIOCHEMISTRY', 'BLOOD', 1, '70 - 99 mg/dL', 'Rapid finger-prick capillary blood sugar evaluation.'),
  ('diag-05', 'Sputum Smear for AFB / CBNAAT', 'TB-CBNAAT', 'PATHOLOGY', 'SPUTUM', 24, 'No acid-fast bacilli detected', 'Tuberculosis molecular diagnostic surveillance.'),
  ('diag-06', 'Rapid Urine Pregnancy Test (UPT)', 'UPT-POC', 'MATERNAL', 'URINE', 1, 'Positive / Negative hCG', 'Early pregnancy detection cassette test.')
ON CONFLICT (id) DO NOTHING;

-- 9. Facility Medicine Availability
INSERT INTO medicine_availability (facility_id, medicine_id, current_stock, unit, is_available, min_reorder_level)
VALUES
  ('fac-phc-01', 'med-01', 1200, 'tablets', true, 200),
  ('fac-phc-01', 'med-02', 450, 'packets', true, 100),
  ('fac-phc-01', 'med-03', 900, 'tablets', true, 150),
  ('fac-phc-01', 'med-05', 600, 'tablets', true, 100),
  ('fac-phc-01', 'med-06', 400, 'tablets', true, 80),
  ('fac-phc-02', 'med-01', 350, 'tablets', true, 100),
  ('fac-phc-02', 'med-02', 200, 'packets', true, 50),
  ('fac-phc-02', 'med-03', 420, 'tablets', true, 100),
  ('fac-phc-02', 'med-08', 0, 'capsules', false, 50),
  ('fac-sub-03', 'med-01', 150, 'tablets', true, 50),
  ('fac-sub-03', 'med-02', 80, 'packets', true, 30),
  ('fac-sub-03', 'med-03', 250, 'tablets', true, 50)
ON CONFLICT (facility_id, medicine_id) DO NOTHING;

-- 10. Facility Diagnostic Availability
INSERT INTO diagnostic_availability (facility_id, test_id, is_available, daily_capacity, equipment_status)
VALUES
  ('fac-phc-01', 'diag-01', true, 150, 'FUNCTIONAL'),
  ('fac-phc-01', 'diag-02', true, 200, 'FUNCTIONAL'),
  ('fac-phc-01', 'diag-03', true, 100, 'FUNCTIONAL'),
  ('fac-phc-01', 'diag-04', true, 100, 'FUNCTIONAL'),
  ('fac-phc-02', 'diag-01', true, 80, 'FUNCTIONAL'),
  ('fac-phc-02', 'diag-02', true, 100, 'FUNCTIONAL'),
  ('fac-phc-02', 'diag-03', true, 60, 'FUNCTIONAL'),
  ('fac-sub-03', 'diag-02', true, 30, 'FUNCTIONAL'),
  ('fac-sub-03', 'diag-03', true, 40, 'FUNCTIONAL'),
  ('fac-sub-03', 'diag-06', true, 50, 'FUNCTIONAL')
ON CONFLICT (facility_id, test_id) DO NOTHING;

-- 11. Triage Records Seed
INSERT INTO triage_records (id, idempotency_key, patient_id, recorded_by, systolic_bp, diastolic_bp, pulse_rate, body_temp_f, spo2_pct, blood_glucose_mg_dl, symptoms, triage_priority, red_flags, clinical_notes, recorded_offline)
VALUES
  ('tri-01', 'idemp-seed-01', 'usr-pat-female-01', 'usr-asha-01', 114, 74, 78, 98.4, 99, 94, '["Mild ankle tiredness"]'::jsonb, 'GREEN', '[]'::jsonb, 'ANC 3rd trimester routine home check. Fetal movements normal.', false),
  ('tri-02', 'idemp-seed-02', 'usr-pat-male-02', 'usr-asha-01', 138, 88, 74, 98.2, 98, 112, '["Occasional mild headache after field work"]'::jsonb, 'GREEN', '[]'::jsonb, 'Blood pressure within controlled boundary. Advised low dietary sodium.', false)
ON CONFLICT (id) DO NOTHING;

-- 12. Appointments Seed
INSERT INTO appointments (id, patient_id, doctor_id, facility_id, appointment_date, time_slot, token_number, appointment_type, status, reason)
VALUES
  ('apt-01', 'usr-pat-female-01', 'usr-doc-01', 'fac-phc-02', '2026-09-18', '10:30 AM', 'ANC-04', 'ANC_CHECKUP', 'CONFIRMED', 'Third Trimester ANC Routine Follow-up & Ultrasound Review'),
  ('apt-02', 'usr-pat-male-02', 'usr-doc-01', 'fac-phc-01', '2026-09-22', '09:45 AM', 'OPD-18', 'CHRONIC_FOLLOWUP', 'CONFIRMED', 'Monthly Essential Hypertension Review & Lipid Profile')
ON CONFLICT (id) DO NOTHING;

-- 13. Consultations Seed
INSERT INTO consultations (id, appointment_id, patient_id, doctor_id, asha_id, consultation_type, status, priority, chief_complaint, doctor_diagnosis, prescription_notes, clinical_examination)
VALUES
  ('con-01', 'apt-01', 'usr-pat-female-01', 'usr-doc-01', 'usr-asha-01', 'IN_PERSON', 'SCHEDULED', 'GREEN', 'Routine 3rd Trimester Gestational Assessment', NULL, NULL, 'Fundal height 27cm, fetal heart rate 142 bpm regular. No pedal edema.')
ON CONFLICT (id) DO NOTHING;

-- 14. Prescriptions Seed
INSERT INTO prescriptions (id, consultation_id, patient_id, doctor_id, diagnosis, medicines, advice, qr_token, status)
VALUES
  ('rx-01', 'con-01', 'usr-pat-female-01', 'usr-doc-01', 'Antenatal Care - 28 Weeks Gestation (Normal Progress)', '[{"name": "Iron & Folic Acid (IFA)", "dosage": "1 tablet", "frequency": "Once daily after food", "duration": "60 days"}, {"name": "Calcium Carbonate 500mg", "dosage": "1 tablet", "frequency": "Twice daily after food", "duration": "60 days"}]'::jsonb, 'Take IFA with water or lemon juice. Avoid tea/milk within 1 hour of tablet.', 'qr-rx-pat01-202609', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 15. Digital Backpack Health Records Seed
INSERT INTO health_records (id, patient_id, doc_title, doc_type, file_url, issued_by, doc_date, metadata)
VALUES
  ('rec-01', 'usr-pat-female-01', 'ANC 2nd Trimester Ultrasound & Lab Report', 'LAB_REPORT', '/backpack/docs/anc2_ultrasound.pdf', 'Dr. Sunita Deshmukh (Bhimashankar PHC)', '2026-06-25', '{"singleLiveIntrauterine": true, "placenta": "Fundal Anterior", "hb": "11.2 g/dL"}'::jsonb),
  ('rec-02', 'usr-pat-female-01', 'Tetanus Toxoid TT-2 Certificate', 'VACCINE_CERT', '/backpack/docs/tt2_vaccine.pdf', 'Sunita Tai (Nigdale Sub-Centre)', '2026-05-15', '{"vaccine": "TT-2", "batchNo": "TT-9842"}'::jsonb),
  ('rec-03', 'usr-pat-male-02', 'Annual Lipid Profile & HbA1c Lab Report', 'LAB_REPORT', '/backpack/docs/lipid_profile.pdf', 'Khed CHC Central Laboratory', '2026-08-10', '{"cholesterol": 194, "hba1c": 5.8, "fastingGlucose": 108}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 16. Follow-ups Seed
INSERT INTO follow_ups (id, patient_id, created_by, assigned_to, title, notes, due_date, priority, status)
VALUES
  ('fup-01', 'usr-pat-female-01', 'usr-doc-01', 'usr-asha-01', 'ASHA Home Nutrition & IFA Verification', 'Verify 30-day Iron & Folic Acid intake. Check for pedal edema.', '2026-09-17 10:00:00+05:30', 'GREEN', 'PENDING'),
  ('fup-02', 'usr-pat-male-02', 'usr-doc-01', 'usr-asha-01', 'Fasting Blood Sugar & BP Re-test', 'Maintain 10 hours overnight fasting prior to morning sample check.', '2026-09-20 08:30:00+05:30', 'YELLOW', 'PENDING')
ON CONFLICT (id) DO NOTHING;

-- 17. Referrals Seed
INSERT INTO referrals (id, patient_id, referring_user_id, from_facility_id, to_facility_id, attending_specialist, reason, urgency, transport_needed, status, referral_date)
VALUES
  ('ref-01', 'usr-pat-male-02', 'usr-doc-01', 'fac-phc-01', 'fac-dh-04', 'Cardiologist / Echo Doppler Specialist', 'Echocardiogram and ambulatory 24h blood pressure monitoring evaluation.', 'YELLOW', 'Public Transport with family escort', 'INITIATED', '2026-09-15')
ON CONFLICT (id) DO NOTHING;

-- 18. Photo Cases Seed
INSERT INTO photo_cases (id, patient_id, submitted_by, reviewing_doctor_id, category, title, symptoms, urgency, status, doctor_notes, doctor_treatment_plan)
VALUES
  ('pc-01', 'usr-pat-male-02', 'usr-asha-01', 'usr-doc-01', 'DERMATOLOGY', 'Agricultural Contact Dermatitis on Forearm', 'Erythematous pruritic papules on bilateral forearms following crop harvest. No blistering.', 'YELLOW', 'REVIEWED', 'Contact allergic phytodermatitis. Normal vitals.', 'Wash with cool boiled water. Apply Calamine lotion twice daily. Keep covered from direct sunlight.')
ON CONFLICT (id) DO NOTHING;

-- 19. Notifications Seed
INSERT INTO notifications (id, user_id, title, message, category, priority, is_read, action_route)
VALUES
  ('notif-01', 'usr-pat-female-01', 'Upcoming ANC Clinic Tomorrow', 'Your ANC 3 appointment is scheduled for tomorrow at 10:30 AM at Bhimashankar PHC.', 'APPOINTMENT', 'HIGH', false, '/patient/appointments'),
  ('notif-02', 'usr-pat-female-01', 'ASHA Home Visit Reminder', 'Sunita Tai will visit your home tomorrow for nutrition and IFA compliance check.', 'FOLLOW_UP', 'MEDIUM', false, '/patient/followup'),
  ('notif-03', 'usr-doc-01', 'New Teleconsultation Booked', 'Radhika Shinde is confirmed for ANC checkup tomorrow.', 'APPOINTMENT', 'MEDIUM', false, '/doctor/queue')
ON CONFLICT (id) DO NOTHING;
