# AarogyaSync (आरोग्यसिंक)
> **Resilient Rural Healthcare Progressive Web App (PWA) & Telemedicine Ecosystem**

AarogyaSync bridges the critical healthcare gap in rural India by connecting villagers/patients, frontline ASHA workers, doctors, and public health administrators under a unified, offline-first, multilingual, and low-bandwidth optimized platform.

---

## 🌟 Core Pillars & Key Features

### 1. Four Role-Based Workflows
- **Villager / Patient**:
  - Personalized care path with automatic gender adaptation:
    - **Female Experience**: Unlocks specialized **Maternal Care** (ANC/PNC checkups, high-risk flags) and **Child Care** (Universal Immunization Programme tracker, growth milestones).
    - **Male Experience**: Focused general health, occupational health, and chronic illness management.
  - **Digital Backpack**: Patient-controlled repository of lab reports, prescriptions, vaccination records, and consultation summaries.
  - **Structured Health Assessment & Triage**: Decision assistance providing clinical triage (Red/Yellow/Green) with clear non-diagnostic disclaimers.
  - **Teleconsultation & Appointments**: Live consults, store-and-forward queries, and follow-up schedules.
  - **Local PHC Medicine & Test Availability**: Real-time stock status across nearby Primary Health Centres.
  - **Emergency Escalation**: Single-tap emergency assistance with nearby hospital locator and ASHA alert.

- **ASHA / Frontline Health Worker**:
  - **100% Offline Capability**: Register patients, record vitals, capture symptoms, and log village household visits with zero internet connectivity.
  - **Photo Case Capture**: Store condition photographs offline for subsequent doctor review.
  - **Auto & Manual Sync Engine**: Synchronizes queued records when connectivity resumes with collision prevention and idempotency.

- **Doctor**:
  - **Priority Consultation Queue**: Urgency-sorted triage cases (Red/Yellow/Green).
  - **Store-and-Forward Reviews**: Async diagnosis for photo cases submitted by ASHA workers.
  - **Digital Prescriptions & Referrals**: Seamless prescription issuance linked to PHC inventory.

- **Administrator**:
  - **Public Health Surveillance**: Disease outbreak heatmaps, maternal mortality risk monitoring.
  - **Workforce & PHC Inventory**: ASHA verification, doctor schedules, and medicine supply management.

### 2. Tri-Lingual Scalable Localization
- Full system-wide support for:
  - **English**
  - **Hindi (हिंदी)**
  - **Marathi (मराठी)**
- Zero hardcoded UI strings; centralized JSON dictionary with nested keys and interpolation.

### 3. Progressive Web App & Offline Architecture
- Installable on Android, iOS, and Desktop with minimal footprint.
- Service Worker caching application shell and static assets.
- IndexedDB offline queue with visual status indicators: `Online`, `Offline`, `Syncing`, `Synced`, `Sync Failed`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18+, Vite, Tailwind CSS, Lucide Icons, HTML5 Canvas/Media APIs |
| **PWA** | Web App Manifest, Service Worker (Cache-First + Network-First Fallback) |
| **Storage (Client)** | IndexedDB (`idb`), `localStorage` |
| **Backend** | Node.js, Express.js REST API, JWT Authentication |
| **Database** | PostgreSQL with Relational Schema & Migration Seeders |
| **Architecture** | Clean Monorepo (`frontend/` + `backend/`), Controller-Service-Route separation |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (Optional for initial demo; frontend includes fail-safe mock fallback)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/aarogyasync.git
cd AarogyaSync

# Install root, backend, and frontend dependencies
npm run install:all
```

### Running Locally (Development Mode)
```bash
# Start both backend (Port 5000) and frontend (Port 5173) concurrently:
npm run dev
```

Or start them individually:
```bash
# In terminal 1 (Backend):
npm run dev:backend

# In terminal 2 (Frontend):
npm run dev:frontend
```

---

## 📱 Hackathon Presentation Persona Switcher
For seamless live demonstration during jury evaluation:
- Look at the top navigation bar for the **Role Switcher**.
- Instantly switch between **Patient (Female)**, **Patient (Male)**, **ASHA Worker**, **Doctor**, and **Administrator** without re-authenticating.
- Toggle network offline in DevTools to demonstrate the offline queue and auto-sync!
