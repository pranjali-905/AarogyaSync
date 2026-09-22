-- ==========================================================
-- AarogyaSync Database Schema (PostgreSQL)
-- Rural Healthcare Progressive Web Platform
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('PATIENT', 'ASHA', 'DOCTOR', 'ADMIN')),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'mr')),
    village VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Pune',
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Facilities (PHC, CHC, Sub-Centre, District Hospital)
CREATE TABLE IF NOT EXISTS facilities (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(150) NOT NULL,
    facility_type VARCHAR(50) NOT NULL CHECK (facility_type IN ('PHC', 'CHC', 'SUB_CENTRE', 'DISTRICT_HOSPITAL')),
    village VARCHAR(100),
    block VARCHAR(100),
    district VARCHAR(100) NOT NULL DEFAULT 'Pune',
    contact_phone VARCHAR(15),
    doctor_in_charge VARCHAR(100),
    ambulance_available BOOLEAN DEFAULT FALSE,
    operating_hours VARCHAR(100) DEFAULT '24x7',
    total_beds INT DEFAULT 10,
    icu_beds INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_facilities_type ON facilities(facility_type);
CREATE INDEX IF NOT EXISTS idx_facilities_district ON facilities(district);

-- 3. Patient Profiles (Maternal / Child / General Extension)
CREATE TABLE IF NOT EXISTS patient_profiles (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(50) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    abha_id VARCHAR(25) UNIQUE,
    dob DATE,
    age INT,
    blood_group VARCHAR(10),
    emergency_contact_phone VARCHAR(15),
    emergency_contact_name VARCHAR(100),
    emergency_contact_relation VARCHAR(50),
    is_pregnant BOOLEAN DEFAULT FALSE,
    gravida VARCHAR(20),
    lmp_date DATE,
    edd_date DATE,
    gestational_weeks INT,
    high_risk_flag BOOLEAN DEFAULT FALSE,
    chronic_conditions TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    assigned_asha_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patients_abha ON patient_profiles(abha_id);
CREATE INDEX IF NOT EXISTS idx_patients_high_risk ON patient_profiles(high_risk_flag);
CREATE INDEX IF NOT EXISTS idx_patients_assigned_asha ON patient_profiles(assigned_asha_id);

-- 4. ASHA Worker Profiles
CREATE TABLE IF NOT EXISTS asha_profiles (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(50) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE,
    assigned_villages TEXT[] DEFAULT '{}',
    sub_centre VARCHAR(100),
    households_covered INT DEFAULT 0,
    active_maternal_cases INT DEFAULT 0,
    supervisor_name VARCHAR(100),
    qualification VARCHAR(100),
    verification_status VARCHAR(20) DEFAULT 'VERIFIED' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_asha_employee_id ON asha_profiles(employee_id);

-- 5. Doctor Profiles
CREATE TABLE IF NOT EXISTS doctor_profiles (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(50) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    registration_number VARCHAR(50) UNIQUE,
    specialization VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE SET NULL,
    opd_timings VARCHAR(100) DEFAULT '09:00 AM - 02:00 PM',
    available_for_teleconsult BOOLEAN DEFAULT TRUE,
    verification_status VARCHAR(20) DEFAULT 'VERIFIED' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doctor_reg ON doctor_profiles(registration_number);
CREATE INDEX IF NOT EXISTS idx_doctor_facility ON doctor_profiles(facility_id);

-- 6. Child Care & Immunization Records
CREATE TABLE IF NOT EXISTS child_records (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    mother_id VARCHAR(50) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10),
    birth_weight_kg NUMERIC(4,2),
    immunization_status JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_child_mother ON child_records(mother_id);

-- 7. Master Catalogue: Medicines
CREATE TABLE IF NOT EXISTS medicines (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(150) NOT NULL,
    generic_name VARCHAR(150),
    category VARCHAR(50) NOT NULL CHECK (category IN ('ANALGESIC', 'ANTIBIOTIC', 'ANTIHYPERTENSIVE', 'ANTIDIABETIC', 'NUTRITIONAL', 'VACCINE', 'ANTIMALARIAL', 'OTHER')),
    dosage_form VARCHAR(50) DEFAULT 'TABLET',
    strength VARCHAR(50),
    is_essential BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);

-- 8. Master Catalogue: Diagnostic Tests
CREATE TABLE IF NOT EXISTS diagnostic_tests (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) UNIQUE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('RAPID_TEST', 'PATHOLOGY', 'BIOCHEMISTRY', 'IMAGING', 'URINE', 'MATERNAL')),
    sample_type VARCHAR(50) DEFAULT 'BLOOD',
    turnaround_hours INT DEFAULT 2,
    normal_range VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Facility Medicine Availability (Stock Inventory)
CREATE TABLE IF NOT EXISTS medicine_availability (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE CASCADE,
    medicine_id VARCHAR(50) REFERENCES medicines(id) ON DELETE CASCADE,
    current_stock INT DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'tablets',
    is_available BOOLEAN DEFAULT TRUE,
    min_reorder_level INT DEFAULT 50,
    last_restocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_facility_medicine UNIQUE (facility_id, medicine_id)
);

CREATE INDEX IF NOT EXISTS idx_med_avail_facility ON medicine_availability(facility_id);
CREATE INDEX IF NOT EXISTS idx_med_avail_medicine ON medicine_availability(medicine_id);

-- 10. Facility Diagnostic Availability
CREATE TABLE IF NOT EXISTS diagnostic_availability (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE CASCADE,
    test_id VARCHAR(50) REFERENCES diagnostic_tests(id) ON DELETE CASCADE,
    is_available BOOLEAN DEFAULT TRUE,
    daily_capacity INT DEFAULT 100,
    equipment_status VARCHAR(50) DEFAULT 'FUNCTIONAL',
    last_calibrated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_facility_diagnostic UNIQUE (facility_id, test_id)
);

CREATE INDEX IF NOT EXISTS idx_diag_avail_facility ON diagnostic_availability(facility_id);

-- 11. Triage & Vitals Records (Offline-capable)
CREATE TABLE IF NOT EXISTS triage_records (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    idempotency_key VARCHAR(100) UNIQUE,
    patient_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    recorded_by VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    systolic_bp INT,
    diastolic_bp INT,
    pulse_rate INT,
    body_temp_f NUMERIC(4,1),
    spo2_pct INT,
    blood_glucose_mg_dl INT,
    symptoms JSONB DEFAULT '[]'::jsonb,
    triage_priority VARCHAR(10) NOT NULL CHECK (triage_priority IN ('GREEN', 'YELLOW', 'RED')),
    red_flags JSONB DEFAULT '[]'::jsonb,
    clinical_notes TEXT,
    photo_evidence_url TEXT,
    recorded_offline BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_triage_patient ON triage_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_triage_priority ON triage_records(triage_priority);
CREATE INDEX IF NOT EXISTS idx_triage_idempotency ON triage_records(idempotency_key);

-- 12. Health Assessments (Frontline periodic screening)
CREATE TABLE IF NOT EXISTS health_assessments (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    patient_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    assessor_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    assessment_type VARCHAR(50) NOT NULL CHECK (assessment_type IN ('ANC_SCREENING', 'PNC_CHECKUP', 'CHRONIC_CARE', 'CHILD_IMMUNIZATION', 'GERIATRIC', 'GENERAL')),
    vitals JSONB DEFAULT '{}'::jsonb,
    findings JSONB DEFAULT '{}'::jsonb,
    risk_tier VARCHAR(20) DEFAULT 'LOW' CHECK (risk_tier IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessments_patient ON health_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON health_assessments(assessment_type);

-- 13. Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    patient_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    doctor_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    token_number VARCHAR(20),
    appointment_type VARCHAR(50) DEFAULT 'IN_PERSON' CHECK (appointment_type IN ('IN_PERSON', 'TELECONSULT', 'ANC_CHECKUP', 'CHRONIC_FOLLOWUP')),
    status VARCHAR(20) DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- 14. Consultations (Teleconsultations & Clinical Encounters)
CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    appointment_id VARCHAR(50) REFERENCES appointments(id) ON DELETE SET NULL,
    patient_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    doctor_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    asha_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    consultation_type VARCHAR(30) NOT NULL CHECK (consultation_type IN ('LIVE_VIDEO', 'STORE_AND_FORWARD', 'IN_PERSON', 'TELEMEDICINE_KIOSK')),
    status VARCHAR(20) DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    priority VARCHAR(10) DEFAULT 'YELLOW' CHECK (priority IN ('GREEN', 'YELLOW', 'RED')),
    chief_complaint TEXT NOT NULL,
    doctor_diagnosis TEXT,
    prescription_notes TEXT,
    clinical_examination TEXT,
    photo_attachments JSONB DEFAULT '[]'::jsonb,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consultations_patient ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);

-- 15. Prescriptions (Digital e-Prescriptions)
CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    consultation_id VARCHAR(50) REFERENCES consultations(id) ON DELETE SET NULL,
    patient_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    doctor_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    diagnosis TEXT NOT NULL,
    medicines JSONB NOT NULL DEFAULT '[]'::jsonb,
    advice TEXT,
    qr_token VARCHAR(100) UNIQUE,
    digital_signature VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DISPENSED', 'EXPIRED')),
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions(doctor_id);

-- 16. Health Records (Digital Backpack Documents)
CREATE TABLE IF NOT EXISTS health_records (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    patient_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    doc_title VARCHAR(150) NOT NULL,
    doc_type VARCHAR(50) CHECK (doc_type IN ('PRESCRIPTION', 'LAB_REPORT', 'VACCINE_CERT', 'DISCHARGE_SUMMARY', 'ANC_CARD', 'TRIAGE_REPORT')),
    file_url TEXT,
    issued_by VARCHAR(100),
    doc_date DATE DEFAULT CURRENT_DATE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_records_patient ON health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_records_type ON health_records(doc_type);

-- 17. Follow-ups
CREATE TABLE IF NOT EXISTS follow_ups (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    patient_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    created_by VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    assigned_to VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    notes TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    priority VARCHAR(10) DEFAULT 'YELLOW' CHECK (priority IN ('GREEN', 'YELLOW', 'RED', 'HIGH', 'MODERATE')),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE')),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_followups_patient ON follow_ups(patient_id);
CREATE INDEX IF NOT EXISTS idx_followups_assigned ON follow_ups(assigned_to);
CREATE INDEX IF NOT EXISTS idx_followups_status ON follow_ups(status);

-- 18. Referrals (Cross-Facility Medical Transfers)
CREATE TABLE IF NOT EXISTS referrals (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    patient_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    referring_user_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    from_facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE SET NULL,
    to_facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE SET NULL,
    attending_specialist VARCHAR(100),
    reason TEXT NOT NULL,
    urgency VARCHAR(20) DEFAULT 'YELLOW' CHECK (urgency IN ('GREEN', 'YELLOW', 'RED', 'EMERGENCY', 'URGENT', 'ROUTINE')),
    transport_needed VARCHAR(100) DEFAULT 'Standard',
    status VARCHAR(30) DEFAULT 'INITIATED' CHECK (status IN ('INITIATED', 'ACCEPTED', 'EN_ROUTE', 'ADMITTED', 'COMPLETED', 'CANCELLED')),
    referral_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_referrals_patient ON referrals(patient_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_urgency ON referrals(urgency);

-- 19. Photo Cases (Store & Forward Dermatology / Wound / Rash)
CREATE TABLE IF NOT EXISTS photo_cases (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    patient_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    submitted_by VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    reviewing_doctor_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('DERMATOLOGY', 'WOUND_ULCER', 'EYE_INJURY', 'ORAL_LESION', 'PEDIATRIC_RASH', 'OTHER')),
    title VARCHAR(150) NOT NULL,
    symptoms TEXT NOT NULL,
    photo_urls TEXT[] DEFAULT '{}',
    urgency VARCHAR(10) DEFAULT 'YELLOW' CHECK (urgency IN ('GREEN', 'YELLOW', 'RED')),
    status VARCHAR(30) DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'UNDER_EVALUATION', 'REVIEWED', 'ESCALATED')),
    doctor_notes TEXT,
    doctor_treatment_plan TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_photocases_patient ON photo_cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_photocases_doctor ON photo_cases(reviewing_doctor_id);
CREATE INDEX IF NOT EXISTS idx_photocases_status ON photo_cases(status);

-- 20. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'SYSTEM' CHECK (category IN ('TRIAGE_ALERT', 'APPOINTMENT', 'PRESCRIPTION', 'FOLLOW_UP', 'REFERRAL', 'SYSTEM')),
    priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    is_read BOOLEAN DEFAULT FALSE,
    action_route VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- 21. Sync Queue & Offline Audit Trail
CREATE TABLE IF NOT EXISTS sync_queue (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    device_id VARCHAR(100),
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'SYNCED' CHECK (status IN ('PENDING', 'SYNCED', 'DUPLICATE_IGNORED', 'FAILED')),
    error_message TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sync_idempotency ON sync_queue(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_sync_user ON sync_queue(user_id);
