# AarogyaSync (आरोग्यसिंक)
> **Resilient Offline-First Rural Healthcare Platform & Telemedicine Ecosystem**  
> *Designed for Smart India Hackathon (SIH) — Problem Statement 133: Transforming Last-Mile Primary Healthcare Delivery*

[![SIH Problem Statement 133](https://img.shields.io/badge/SIH-Problem%20Statement%20133-orange?style=for-the-badge&logo=target)](https://sih.gov.in)
[![Offline-First PWA](https://img.shields.io/badge/Architecture-100%25%20Offline--First%20PWA-10b981?style=for-the-badge&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Tri-Lingual](https://img.shields.io/badge/Localization-EN%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A4%8B%20%7C%20%E0%A4%AE%E0%A4%B0%E0%A4%BE%E0%A4%A0%E0%A5%80-3b82f6?style=for-the-badge)](frontend/src/translations/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-61dafb?style=for-the-badge&logo=react)](frontend/)
[![Node.js & Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20REST-339933?style=for-the-badge&logo=node.js)](backend/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20Relational-4169e1?style=for-the-badge&logo=postgresql)](backend/src/db/)
[![Test Suite](https://img.shields.io/badge/Tests-42%2F42%20Passing-success?style=for-the-badge&logo=checkmarx)](backend/test_api.js)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

---

## 📌 Executive Summary & Problem Context

In India's remote rural hamlets and tribal belts, primary health delivery faces three critical systemic bottlenecks:
1. **Network Blackouts:** Over 65% of rural sub-centres experience intermittent or zero cellular connectivity, causing digital health tools to crash or lose patient records.
2. **Medical Officer Scarcity:** A single doctor at a Primary Health Centre (PHC) often serves 25,000–30,000 citizens across 20+ scattered villages.
3. **Linguistic & Literacy Divide:** Rural patients and frontline Accredited Social Health Activists (ASHA workers) struggle with English-centric applications, resulting in underreported maternal high-risk signs and delayed emergency interventions.

**AarogyaSync** solves these challenges by combining a **zero-data-loss offline progressive web application**, **localized tri-lingual interfaces (English, हिंदी, मराठी)**, **National Health Mission (NHM) clinical triage algorithms**, and **asynchronous store-and-forward teleconsultations**.

---

## 🏛️ System Architecture

AarogyaSync is built on an **offline-first, 3-tier resilient architecture**:

```mermaid
flowchart LR
    A["📱 Frontend PWA<br/>• React 18 + Vite<br/>• IndexedDB (Offline Store)<br/>• Tri-Lingual (EN / HI / MR)"] 
    -->|Auto-Sync & REST API| B["⚡ Backend API Gateway<br/>• Node.js + Express<br/>• JWT Auth & Role Guards<br/>• NHM Clinical Triage Engine"]
    -->|PostgreSQL / Memory Fallback| C[("🗄️ Database<br/>• PostgreSQL 16<br/>• Patient Records & Vitals<br/>• Idempotent Sync Queue")]
```

| Layer | Technologies | Key Responsibilities |
| :--- | :--- | :--- |
| **Client Tier** | React 18, Vite, Tailwind CSS, Service Workers, IndexedDB | 100% offline functionality, tri-lingual localization, offline data vaulting. |
| **API Tier** | Node.js, Express REST API, JWT Authentication, RBAC | Clinical triage algorithm execution, conflict-free sync ingestion, business logic. |
| **Data Tier** | PostgreSQL 16 (with automated zero-config in-memory fallback) | Relational persistence of patient records, teleconsultations, and PHC inventory. |

---

## 🔄 Core Workflow 1: Offline-First Sync Engine

Frontline ASHA workers can capture clinical checkups and photo cases in remote tribal villages with **zero cell reception**:

```mermaid
sequenceDiagram
    autonumber
    actor ASHA as ASHA Worker (Field)
    participant App as AarogyaSync PWA
    participant Server as Cloud Backend
    actor Doctor as PHC Doctor

    ASHA->>App: 1. Record vitals offline (Zero Internet)
    Note over App: Safely stored in local IndexedDB queue
    App->>Server: 2. Auto-sync batch when 2G/3G connects
    Note over Server: Deduplicates & saves records
    Server->>Doctor: 3. Instant alert in Doctor's inbox
```

1. **Offline Capture:** Health records and photo cases are stored locally in the browser's IndexedDB with a unique idempotency key.
2. **Auto-Detection:** When the mobile device reconnects to a network (2G/3G/4G/Wi-Fi), a background listener automatically batches queued records to the backend.
3. **Conflict-Free Ingestion:** The backend deduplicates records using idempotency keys, updating both the database and the doctor's queue.

---

## 🩺 Core Workflow 2: Clinical Triage Protocol (NHM Guidelines)

Every patient record is evaluated client-side and server-side to detect high-risk maternal signs, respiratory compromise, and vital emergencies:

```mermaid
flowchart LR
    A["🩺 Step 1: Input Vitals<br/>(BP, SpO2, Temp, Pulse, Symptoms)"]
    --> B{"Clinical Check"}
    B -->|Critical Red Flags / SpO2 < 92%| R["🔴 RED Priority<br/>Immediate 108 Emergency Transport"]
    B -->|Borderline Vitals / SpO2 92-94%| Y["🟡 YELLOW Priority<br/>Doctor Teleconsult within 24h"]
    B -->|Normal Limits| G["🟢 GREEN Priority<br/>Routine Home Care & Follow-up"]
```

### Triage Decision Matrix

| Urgency Category | Clinical Triggers | Immediate Action |
| :---: | :--- | :--- |
| 🔴 **RED PRIORITY**<br>*(Emergency)* | • Oxygen (SpO2) **< 92%**<br>• Blood Pressure **≥ 160/100 mmHg** (or **≥ 140/90** if pregnant)<br>• Temperature **≥ 103°F (39.4°C)**<br>• Pulse **> 130** or **< 45 bpm**<br>• Red-flag symptoms: Chest pain, convulsions, vaginal bleeding | Immediate 108 ambulance dispatch and emergency CHC hospital referral |
| 🟡 **YELLOW PRIORITY**<br>*(Urgent Care)* | • Oxygen (SpO2) **92% – 94%**<br>• Blood Pressure **140–159 / 90–99 mmHg**<br>• Temperature **100.4°F – 102.9°F**<br>• Pulse **110–130** or **45–54 bpm** | Scheduled PHC Medical Officer teleconsultation within 24 hours |
| 🟢 **GREEN PRIORITY**<br>*(Routine)* | • All vitals within normal clinical limits<br>• No acute distress symptoms | Routine ASHA home care instructions and regular follow-up |

---

## 👥 Core Workflow 3: Multi-Persona Collaboration

AarogyaSync connects all rural primary healthcare stakeholders in a single seamless loop:

```mermaid
flowchart LR
    P["👤 1. Villager / Patient<br/>• Check symptoms<br/>• Digital Backpack<br/>• View PHC stocks"] 
    --> A["👩‍⚕️ 2. ASHA Worker<br/>• Offline doorstep checks<br/>• Capture photo cases<br/>• Sync when online"]
    --> D["👨‍⚕️ 3. PHC Doctor<br/>• Urgent triage queue<br/>• Video & async diagnosis<br/>• ABDM e-Prescriptions"]
    --> AD["🏛️ 4. Health Admin<br/>• Disease surveillance<br/>• Outbreak heatmaps<br/>• PHC drug replenishment"]
```

---

## 💾 Relational Data Model

The platform organizes data across five primary relational domains:

| Table / Entity | Purpose | Key Fields |
| :--- | :--- | :--- |
| `users` & Profiles | Authentication, role authorization, and ABHA IDs | `id`, `phone`, `role` (`PATIENT`, `ASHA`, `DOCTOR`, `ADMIN`), `village` |
| `patient_health_records` | Clinical vitals, ANC maternal logs, immunization history | `patient_id`, `vitals` (`bp`, `spo2`, `temp`), `triage_priority`, `notes` |
| `photo_cases` | Store-and-forward tele-dermatology and trauma cases | `patient_id`, `asha_id`, `photo_url`, `urgency`, `doctor_notes` |
| `sync_queue` | Zero-loss offline queue with duplicate prevention | `idempotency_key` (UNIQUE), `sync_type`, `payload`, `status` |
| `medicine_inventory` | Real-time PHC pharmacy stock levels and alerts | `facility_id`, `medicine_name`, `current_stock`, `min_reorder_level` |

---

## 🌟 Key Functional Capabilities

| Feature Pillar | Technical Implementation | Hackathon Impact |
| :--- | :--- | :--- |
| **100% Offline Frontline Operation** | HTML5 Service Workers + IndexedDB (`idb`) persistent store with composite idempotency keys | Zero data loss during tribal/rural cellular blackouts. |
| **Tri-Lingual Localization** | Centralized structured JSON dictionary supporting **English**, **हिंदी**, and **मराठी** with dynamic parameter interpolation | Overcomes literacy barriers; empowers Marathi & Hindi-speaking ASHA workers. |
| **NHM Clinical Algorithmic Triage** | Dual-tier evaluation engine (`backend/src/utils/triageCalculator.js` & frontend mirror) | Prevents avoidable maternal mortality and clinical deterioration through deterministic urgency ranking. |
| **Digital Backpack (ABDM Compliant)** | Patient-centric encrypted vault of lab reports, e-Prescriptions, and vaccination passports | Eliminates lost physical papers; ensures continuity of care across PHC, CHC, and District Hospitals. |
| **Asynchronous Tele-Dermatology** | Store-and-forward photo case capture with clinical annotation notes and urgency flags | Enables village workers to photograph trauma/rashes for remote specialist diagnosis. |
| **Real-Time PHC Inventory Tracking** | PostgreSQL inventory relational mapping with low-stock alerts and emergency ambulance locator | Prevents patients from walking miles to empty dispensaries. |
| **Epidemiological Surveillance** | District-level disease outbreak tracking with genuine CSV/JSON export tools | Empowers health administrators to detect seasonal epidemics early. |

---


---

## 🚀 Quick Start Guide for Evaluators & Judges

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Optional for local persistence (The platform includes an automated zero-config in-memory fallback for immediate demonstration).

### 1. Installation
Clone the repository and install all dependencies for root, backend, and frontend with a single command:
```bash
git clone https://github.com/pranjali-905/AarogyaSync.git
cd AarogyaSync
npm run install:all
```

### 2. Run Complete Platform (Concurrent Mode)
Start both the Express Backend (Port `5000`) and the Vite Frontend (Port `5173`) simultaneously:
```bash
npm run dev
```

### 3. Access Web Application
Open your web browser and navigate to:
```text
http://localhost:5173
```

---

## 🧪 Automated Verification & Test Suite

The platform includes an automated end-to-end integration and API test suite verifying 42 critical paths across authentication, role-based access control, maternal algorithms, idempotency, and clinical triage:

```bash
npm --prefix backend run test
```

### Test Suite Execution Output:
```text
🧪 Starting AarogyaSync Backend Test Suite...
🚀 Test server started on http://127.0.0.1:5099

  ✅ [PASS] GET /api/v1/health returns 200 OK
  ✅ [PASS] GET /api/v1/auth/demo-tokens returns personas
  ✅ [PASS] POST /api/v1/auth/login succeeds
  ✅ [PASS] User payload hides password hash
  ✅ [PASS] POST /api/v1/auth/register creates user
  ✅ [PASS] Security: Self-registration as ADMIN is forbidden (403)
  ✅ [PASS] GET /api/v1/patients/profile retrieves patient profile
  ✅ [PASS] GET /api/v1/patients/maternal returns ANC schedule
  ✅ [PASS] GET /api/v1/patients/child-records returns immunization cards
  ✅ [PASS] GET /api/v1/asha/patients returns assigned village cohort
  ✅ [PASS] GET /api/v1/asha/performance returns metrics
  ✅ [PASS] GET /api/v1/doctor/queue returns clinical cases
  ✅ [PASS] GET /api/v1/doctor/schedule returns slots
  ✅ [PASS] POST /api/v1/doctor/prescriptions creates e-Rx with QR token
  ✅ [PASS] GET /api/v1/admin/overview succeeds for ADMIN
  ✅ [PASS] RBAC Guard: Patient cannot access /admin/overview (403)
  ✅ [PASS] GET /api/v1/admin/surveillance returns syndromic data
  ✅ [PASS] POST /api/v1/appointments books appointment
  ✅ [PASS] GET /api/v1/appointments lists user appointments
  ✅ [PASS] POST /api/v1/consultations initiates consultation
  ✅ [PASS] PATCH /api/v1/consultations/:id/complete finalizes consultation
  ✅ [PASS] POST /api/v1/health-records saves to Digital Backpack
  ✅ [PASS] GET /api/v1/health-records lists documents
  ✅ [PASS] GET /api/v1/facilities returns facilities catalogue
  ✅ [PASS] GET /api/v1/medicines/availability returns stock inventory
  ✅ [PASS] GET /api/v1/diagnostics/availability returns test availability
  ✅ [PASS] GET /api/v1/notifications retrieves alerts
  ✅ [PASS] PATCH /api/v1/notifications/read-all marks notifications as read
  ✅ [PASS] POST /api/v1/referrals creates inter-facility referral
  ✅ [PASS] PATCH /api/v1/referrals/:id/status updates referral
  ✅ [PASS] POST /api/v1/follow-ups creates follow-up task
  ✅ [PASS] PATCH /api/v1/follow-ups/:id/status marks task completed
  ✅ [PASS] POST /api/v1/photo-cases creates tele-dermatology case
  ✅ [PASS] PATCH /api/v1/photo-cases/:id/review submits doctor notes
  ✅ [PASS] Triage Engine: SpO2 < 92% and chest pain triggers RED priority
  ✅ [PASS] Triage Engine identifies clinical red flags
  ✅ [PASS] Triage Engine: Normal vitals triggers GREEN priority
  ✅ [PASS] POST /api/v1/sync/batch syncs 1 offline record
  ✅ [PASS] Sync Deduplication: Duplicate idempotency key safely ignored
  ✅ [PASS] GET /api/v1/sync/status returns online status
  ✅ [PASS] Validation Guard: Malformed request body returns 400 Bad Request
  ✅ [PASS] Route Guard: Unknown route returns 404 Not Found

🏁 Test Suite Finished: 42 passed, 0 failed
🎉 ALL BACKEND TESTS PASSED!
```

---

## 🎯 How to Demonstrate to Hackathon Judges (Step-by-Step)

| Step | Action on Screen | Technical Feature Demonstrated |
| :---: | :--- | :--- |
| **1** | Locate the **Persona Switcher** in the top navigation bar. Click **ASHA Worker** (`Sunita Tai`). | Zero-friction role switching without re-logging in during evaluation. |
| **2** | Click **Start Health Check** -> select pregnant patient *Meena Waghmare*. Enter BP `145/95 mmHg`, SpO2 `98%`, and symptom *Severe Headache*. | **Algorithmic Clinical Triage**: Instantly flags RED Alert for suspected preeclampsia per NHM guidelines. |
| **3** | Open browser Developer Tools (`F12`) -> **Network** tab -> toggle dropdown to **Offline**. | **PWA Offline Resilience**: Top status bar turns amber (`Offline`). Application continues running smoothly. |
| **4** | In the top header, switch the language dropdown from `English` to **मराठी**. | **Tri-Lingual Localization**: All clinical UI, prompts, and forms instantly transform into authentic Devanagari script. |
| **5** | Navigate to **फोटो प्रकरणे** (Photo Cases) -> click **नवीन फोटो जोडा** -> submit a case with title `त्वचेचा संसर्ग`. | **IndexedDB Vaulting**: Record is saved with a composite idempotency key in client storage; sync badge shows 1 queued item. |
| **6** | In DevTools Network tab, toggle back to **No throttling** (Online). | **Auto-Sync Engine**: Background listener detects reconnect, issues batch POST, and updates status badge to *Synced*. |
| **7** | Switch persona to **Doctor** (`Dr. Ramesh Kulkarni`) -> open **Doctor Queue** (`/doctor/queue`). | **Bidirectional Handoff**: The newly synced Marathi photo case and Meena's preeclampsia alert are visible in the doctor's prioritized queue. |
| **8** | Switch persona to **Admin** -> open **Reports** -> click **Export CSV**. | **Public Health Surveillance**: Downloads genuine epidemiological surveillance datasets for district audits. |

---

## 📂 Repository Codebase Structure

```text
AarogyaSync/
├── .env.example                     # Root environment variable template
├── .gitignore                       # Strict exclusion for secrets, node_modules, and build outputs
├── DEMO_SCRIPT.md                   # 5-minute SIH presentation script & code audit reference
├── package.json                     # Monorepo orchestration scripts (dev, test, install)
├── README.md                        # Master project documentation & system architecture
│
├── backend/                         # Express.js REST API Backend
│   ├── src/
│   │   ├── config/                  # Environment and database connection pooling
│   │   ├── controllers/             # REST controllers (auth, patients, asha, doctor, sync, etc.)
│   │   ├── db/                      # PostgreSQL relational schema and initial seeders
│   │   ├── middleware/              # JWT auth, RBAC guards, and centralized error handler
│   │   ├── models/                  # Data access objects with fail-safe memory fallback
│   │   ├── routes/                  # Express API route declarations (/api/v1/*)
│   │   ├── services/                # Business logic, sync deduplication, and inventory calculations
│   │   └── utils/                   # Algorithmic triage calculator, logger, and response helpers
│   ├── .env.example                 # Backend environment variable template
│   ├── package.json                 # Backend dependencies (express, pg, bcryptjs, jsonwebtoken)
│   └── test_api.js                  # 42-test automated integration and unit test suite
│
└── frontend/                        # React 18 + Vite + Tailwind CSS Frontend PWA
    ├── public/                      # Static assets, Web App Manifest, Service Worker (sw.js)
    ├── scripts/                     # Translation dictionary update and sync scripts
    ├── src/
    │   ├── components/              # Reusable UI library (Navbar, BottomNav, Modals, Cards, Alerts)
    │   ├── context/                 # React Contexts (AuthContext, OfflineContext, LanguageContext)
    │   ├── hooks/                   # Custom hooks (useOffline, useAuth, useTranslation, usePWAInstall)
    │   ├── layouts/                 # Master application layout with status bar and role navigation
    │   ├── pages/                   # Role-specific views:
    │   │   ├── admin/               # Surveillance, facilities, workforce, and reports
    │   │   ├── asha/                # Patient registry, doorstep workflow, sync queue, photo cases
    │   │   ├── auth/                # Login, registration, role selection, forgot password
    │   │   ├── doctor/              # Urgent queue, photo case diagnosis, prescriptions, schedule
    │   │   └── patient/             # Maternal care, child immunization, digital backpack, triage
    │   ├── routes/                  # Client-side routing with authentication guards
    │   ├── services/                # API client, IndexedDB offline storage engine, clinical visuals
    │   └── translations/            # Tri-lingual dictionaries (en.json, hi.json, mr.json)
    ├── .env.example                 # Frontend environment template
    ├── index.html                   # HTML5 entry with PWA meta headers
    ├── package.json                 # Frontend dependencies (react, react-router-dom, lucide-react, idb)
    ├── tailwind.config.js           # Design system configuration
    └── vite.config.js               # Vite bundler configuration with backend API proxy
```

---

## 🔒 Security, Data Privacy & Ethics

- **Zero Secret Exposure:** Strict `.gitignore` rules prevent `.env`, credentials, or certificates from entering version control.
- **Role-Based Access Control (RBAC):** Backend enforces strict role authorization; villager or ASHA accounts cannot access administrator or doctor endpoints.
- **Privacy by Design:** All clinical reference photographs in the codebase utilize vector SVG graphics rather than real patient photographs.
- **ABDM Compliance Alignment:** Designed with digital backpack structures aligned with Ayushman Bharat Digital Mission (ABDM) standards.

---

## 👥 Project Team & Acknowledgments

Developed with ❤️ for **Smart India Hackathon (SIH)** to bring reliable, accessible, and resilient healthcare to every village and hamlet across India.
