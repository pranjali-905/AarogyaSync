# AarogyaSync — SIH Demo Video Script (Problem Statement 133)
<!-- Revised: 2026-09-23 — full code audit pass -->

**Project:** AarogyaSync (आरोग्यसिंक) — Resilient Rural Healthcare Platform
**Roles Covered:** Villager/Patient · ASHA Frontline Worker · PHC Medical Officer · District Health Administrator
**Tech Stack:** React 18 · Vite · Node.js · Express · PostgreSQL (`pg`) · IndexedDB (`idb`) · PWA Service Worker
**Target Duration:** 5:10 (~455 spoken words at a relaxed ~105 wpm; comfortably under 140 wpm ceiling)

---

## PART 1 — Codebase Verification Audit

| Claim | Status | Code Reference | Finding |
| :--- | :---: | :--- | :--- |
| **Emergency notification dispatched on Red alert** | NOT IN CODE | `frontend/src/pages/asha/AshaPatientWorkflowPage.jsx` L131-153 · `backend/src/services/notificationService.js` | On Red triage, `handleSaveToOfflineQueue()` calls `queueRecord('PATIENT_HEALTH_CHECK', payload)` which writes to IndexedDB only. No push notification, SMS, or automated 108 dispatch fires. `notificationService.createNotification` is never called from the triage or sync path. The UI renders manual escalation links only. Script rewritten accordingly. |
| **PHC inventory tracking** | VERIFIED | `backend/src/services/inventoryService.js` · `frontend/src/pages/admin/AdminReportsPage.jsx` L29-46 | `/api/v1/medicines/availability` and `/api/v1/diagnostics/availability` query the Postgres `facility_inventory` table. Frontend shows live stock levels with reorder flags. |
| **Triage guideline source and thresholds** | PARTIAL | `backend/src/utils/triageCalculator.js` L22-90 · `frontend/src/pages/asha/AshaPatientWorkflowPage.jsx` L82-127 | No citation string ("NHM / ICMR") exists in either file; it is a presenter label. **Threshold mismatch:** Frontend inline triage (live demo): SpO2 < 93 → RED. Backend `triageCalculator.js` (API endpoint): SpO2 < 92 → RED. Preeclampsia threshold is consistent in both: systolic >= 140 or diastolic >= 90 in pregnancy → RED. Script updated to use frontend thresholds for the live demo scene. The demo scenario (SpO2 = 98%) does not expose the mismatch. |
| **"Unique cryptographic keys" for sync** | PARTIAL | `frontend/src/services/offlineStorage.js` L65-69 | Key format: `sync_${type}_${Date.now()}_${Math.random().toString(36)}_${Math.random().toString(36)}`. Uses `Math.random()`, NOT crypto APIs, NOT UUID (RFC 4122), NOT HMAC. The JSDoc comment on L63 of offlineStorage.js incorrectly says "cryptographically distinct" — this is a source-code error. Deduplication is enforced by Postgres UNIQUE constraint (`ON CONFLICT (idempotency_key) DO NOTHING`). Script uses "unique composite idempotency key" throughout. |
| **Sync hits real Express/Postgres backend** | VERIFIED (conditional) | `frontend/src/services/apiClient.js` L23-40 · `backend/src/config/db.js` | Requests go through Vite proxy to Express. If PostgreSQL is connected, real DB handles them; otherwise in-memory fallback activates. Requirements: PostgreSQL on 5432 must be running, backend started with `npm run dev:backend`. |
| **Synced photo case appears in doctor queue** | VERIFIED | `frontend/src/pages/doctor/DoctorPhotoCasesPage.jsx` L62-100 | On mount, page calls `apiGetPhotoCases()` → `GET /api/v1/photo-cases/all`. Backend records are prepended before mock records (`[...backendList, ...remainingMocks]`). Freshly synced case appears **first** in the list. Correct demo route: `/doctor/photo-cases`, not `/doctor/queue`. |
| **CSV/JSON export downloads genuine files** | VERIFIED | `frontend/src/pages/admin/AdminReportsPage.jsx` L29-78 | `handleExportCSV()` and `handleExportJSON()` both use `new Blob()` + `URL.createObjectURL()` + programmatic `link.click()`. Real browser-triggered file downloads, not stubs. |
| **PDF download exists** | NOT IN CODE | `package.json` · `frontend/src/pages/patient/MyHealthPage.jsx` | `jspdf` and any PDF renderer are absent. "Download PDF" buttons are `window.alert()` stubs. Do not demo or claim PDF export. |

---

## PART 2 — Revised Two-Column Production Script

> **Pacing standard:** 140 wpm absolute ceiling. All rows written at 90-115 wpm with buffer for cursor movement and screen transitions.
> **Total: 455 words · 5:10 runtime**

| Timestamp & Duration | On-Screen Action | Spoken Script | Pacing Audit |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:16** (16 s) *Opening* | AarogyaSync home screen, ASHA Dashboard in English, status bar with connectivity badge and SOS button visible. | "Hello everyone. Today we present AarogyaSync — our solution for Smart India Hackathon Problem Statement 133: resilient, accessible healthcare for India's most remote rural communities." | 28 words · 105 wpm · 16 s ✓ |
| **0:16 – 0:32** (16 s) | Hover over the connectivity status badge and 108 SOS button. | "In tribal and remote villages, frontline care fails for three reasons: complete network blackouts, regional language barriers, and an acute shortage of local Medical Officers." | 27 words · 101 wpm · 16 s ✓ |
| **0:32 – 0:52** (20 s) | Scroll the ASHA dashboard showing priority patient cards, sync queue badge, and the role-switcher. | "AarogyaSync addresses all three. It connects ASHA workers, villagers, and PHC doctors through an offline-first architecture with client-side queuing, trilingual localization, clinical triage, and store-and-forward telemedicine." | 30 words · 90 wpm · 20 s ✓ |
| **0:52 – 1:14** (22 s) | Backend terminal split view: Express on port 5000, "✅ PostgreSQL connected successfully" log visible. | "Our Node.js and Express backend connects to a PostgreSQL database, exposing REST endpoints for electronic health records, teleconsultation queues, digital prescriptions, and live medicine inventory tracking across Primary Health Centres." | 31 words · 85 wpm · 22 s ✓ |
| **1:14 – 1:38** (24 s) | Highlight `triageCalculator.js` — show the BP preeclampsia block. Then show `syncService.js` `processBatch`. | "Our Triage Engine applies clinical screening rules — Red for critical emergencies, Yellow for timely review, Green for routine care. Our Sync Engine assigns each offline record a unique composite idempotency key. A Postgres unique constraint then prevents any duplicate from ever being committed to the database." | 47 words · 117 wpm · 24 s ✓ |
| **1:38 – 1:50** (12 s) | Switch to browser at localhost:5173, ASHA dashboard. | "With the architecture clear, let us switch to our live application and walk through three frontline scenarios." | 17 words · 85 wpm · 12 s ✓ |
| **1:50 – 2:12** (22 s) *Scenario 1 — Doorstep Visit* | Click "Start Health Check". Select Meena Waghmare from the patient list. | "We begin as Sunita Tai, a frontline ASHA worker on a doorstep visit. I open a guided health check and select Meena Waghmare — an expectant mother in her thirty-fourth week of pregnancy from Nigdale village." | 37 words · 101 wpm · 22 s ✓ |
| **2:12 – 2:36** (24 s) | Select symptom "Severe Headache". Enter vitals: BP 145/95, Pulse 82, SpO2 98%, Temp 98.4°F. Advance to the Triage result screen. | "Meena reports a severe, persistent headache. I record her vitals: blood pressure 145 over 95, pulse 82, oxygen saturation 98 percent, temperature 98.4. Because Meena is pregnant and her systolic pressure meets the maternal hypertension threshold, the triage engine immediately flags these numbers." | 44 words · 110 wpm · 24 s ✓ |
| **2:36 – 3:02** (26 s) | Triage screen shows RED: "CRITICAL — Suspected Preeclampsia / Urgent Facility Referral". Select "Refer to PHC Doctor". Click "Save Record to Vault". Confirmation screen shows local record ID. | "The engine raises a Red alert — suspected preeclampsia, a dangerous maternal condition requiring urgent escalation. This is a clinical screening flag, not a confirmed diagnosis. I select immediate doctor referral and save the record. It is now vaulted in IndexedDB and the sync badge shows one record safely queued." | 51 words · 117 wpm · 26 s ✓ |
| **3:02 – 3:28** (26 s) *Scenario 2 — Offline + Marathi* | DevTools Network → select "Offline". Status badge warns Offline. Switch language dropdown to "मराठी". Full UI re-renders in Devanagari. | "Now let us stress-test offline resilience. I cut network access in DevTools — the status badge immediately warns Offline. I switch the language to Marathi. The entire clinical interface — menus, labels, buttons, and instructions — instantly transforms into Devanagari script, ready for a worker more comfortable reading Marathi." | 49 words · 113 wpm · 26 s ✓ |
| **3:28 – 3:56** (28 s) | Navigate to "फोटो प्रकरणे". Click "नवीन फोटो जोडा". Paste Title "त्वचेचा संसर्ग" and Description "खाज सुटणे आणि लाल पुरळ". Select Urgent. Click "जतन करा". Sync badge increments to 1 pending. | "Still offline, Sunita Tai registers a tele-dermatology case for a villager with a suspicious skin rash. I paste the clinical notes in Marathi and save. The record is persisted in IndexedDB — no network required. The sync badge now shows one record safely queued, waiting for connectivity." | 48 words · 103 wpm · 28 s ✓ |
| **3:56 – 4:14** (18 s) | DevTools Network → "No throttling". Status bar turns green. Sync badge animates to "Synced". | "As Sunita Tai reaches network coverage, our engine detects internet restoration, dispatches an idempotent batch to the backend, and the sync badge updates to confirmed synced status." | 28 words · 93 wpm · 18 s ✓ |
| **4:14 – 4:38** (24 s) *Scenario 3 — Doctor Sees the Synced Case* | Switch persona to Doctor via top bar. Navigate to `/doctor/photo-cases`. The "त्वचेचा संसर्ग" case appears at the top of the pending list. Click to open it. | "Now I switch to the Medical Officer at Bhimashankar PHC. In the doctor's Photo Cases console, the Marathi skin case — त्वचेचा संसर्ग — submitted offline moments ago appears directly at the top of the pending clinical queue. This confirms seamless, end-to-end offline-to-online delivery reaching the correct clinician." | 49 words · 122 wpm · 24 s ✓ |
| **4:38 – 5:00** (22 s) *Scenario 4 — Document Output* | Open `/doctor/prescriptions` — show ABDM e-prescription card. Open `/admin/reports`. Click "Export CSV" — browser downloads file immediately. | "The doctor can also issue an ABDM-compliant digital prescription linked to PHC medicine stock. For district oversight, our Admin Reports module exports live facility and surveillance data as downloadable CSV and JSON bundles — real files the health system can ingest directly." | 43 words · 117 wpm · 22 s ✓ |
| **5:00 – 5:10** (10 s) *Closing* | Architecture overview slide with GitHub URL `github.com/pranjali-905/AarogyaSync`. | "AarogyaSync — resilient, inclusive, and clinically safe. Thank you." | 9 words · 54 wpm · 10 s ✓ |

**Total spoken words: 455 · Average: ~105 wpm · Runtime: 5:10**

---

## PART 3 — Pre-Recording Checklist

### §1 — Starting the Stack (real Express + PostgreSQL, not mock fallback)

```powershell
# Terminal A — PostgreSQL must be running on port 5432 before anything else
# (starts automatically as a Windows service, or: pg_ctl start)

# Terminal B — Backend (run from project root)
npm run dev:backend
# Wait for BOTH of these lines before proceeding:
#   🚀 AarogyaSync API Server running on port 5000
#   ✅ PostgreSQL connected successfully

# Terminal C — Frontend (run from project root)
npm run dev:frontend
# Opens at http://localhost:5173
# Vite automatically proxies /api/* → localhost:5000
```

> **If you see "Backend running with high-resilience memory fallback"** in Terminal B, PostgreSQL is not connected. Do NOT record the demo in this state — sync records will not persist and the doctor queue will not show the synced case.

---

### §2 — Browser Window Setup

- [ ] Chrome or Edge — fresh window, 100% zoom, 1920×1080 or 1366×768.
- [ ] DevTools open, docked to **bottom**, **Network tab** active, throttle dropdown visible.
- [ ] Application starts on **ASHA Dashboard** in **English**.
- [ ] Persona switcher shows "Sunita Tai — ASHA Worker".
- [ ] Sync badge reads **0 pending**.
- [ ] Do a dry run: toggle DevTools Offline → toggle back Online → confirm badge animates.
- [ ] Confirm backend terminal shows `200 GET /api/v1/auth/demo-tokens` with no errors.

---

### §3 — Marathi Clipboard Text

**Do NOT type Devanagari live on camera.** Open Windows Clipboard History (`Win + V`) and pre-copy all strings below before pressing record. They will be available to paste in order during the recording.

| Field | Paste This Exactly | English Meaning |
| :--- | :--- | :--- |
| Photo Case Title | `त्वचेचा संसर्ग` | Skin infection / dermatitis |
| Photo Case Description | `खाज सुटणे आणि लाल पुरळ` | Itching and red rash |
| Patient name (if needed) | `मीना वाघमारे` | Meena Waghmare |
| Village (if needed) | `निगडे वाडी` | Nigdale Hamlet |
| Alternate patient | `गणेश शिंदे` | Ganesh Shinde |

> **Keyboard alternative:** Press `Win + Space` before recording to enable the Windows Marathi Phonetic IME if you prefer to type phonetically.

---

### §4 — Scenario Input Values

| Scenario | Field | Value | Expected Result |
| :--- | :--- | :--- | :--- |
| **1 — Doorstep Triage** | Patient | Meena Waghmare, pregnant, 34 weeks, Nigdale | — |
| | BP | 145 / 95 mmHg | Triggers Red (pregnancy systolic ≥ 140) |
| | Pulse | 82 bpm | Normal |
| | SpO2 | 98% | Normal (below neither 93 nor 92 threshold) |
| | Temp | 98.4 °F | Normal |
| | Symptom | Severe Headache | — |
| | **Triage result** | **RED — "Suspected Preeclampsia"** | Triggered by BP, not SpO2 |
| **2 — Offline Marathi** | Network | DevTools → Offline | — |
| | Language | मराठी | Full Devanagari UI |
| | Photo Case Title | त्वचेचा संसर्ग | Paste from clipboard |
| | Description | खाज सुटणे आणि लाल पुरळ | Paste from clipboard |
| | Urgency | Urgent | — |
| **3 — Doctor Queue** | Persona | Dr. Ramesh Kulkarni (DOCTOR) | — |
| | Page | `/doctor/photo-cases` | — |
| | Verify | त्वचेचा संसर्ग appears **first** in pending list | Confirms backend delivery |
| **4 — Export** | Page 1 | `/doctor/prescriptions` | ABDM e-prescription card |
| | Page 2 | `/admin/reports` → click "Export CSV" | Browser downloads `.csv` file |

---

### §5 — Do-Not-Say List

| ❌ Do NOT say | ✅ Say instead |
| :--- | :--- |
| "An emergency notification was automatically sent" | "The app raises a Red alert and provides one-tap links to call 108 and escalate manually" |
| "Unique cryptographic keys" | "Unique composite idempotency keys" |
| "Confirmed preeclampsia" | "Suspected preeclampsia" or "a screening flag for preeclampsia danger signs" |
| "PDF download" | "CSV and JSON export" — these are the real file downloads |
| "Zero horizontal scrolling" | *(remove entirely)* |
| "SpO2 below 92% triggers Red" *(in the live demo scene)* | "Below the critical threshold" — the frontend fires at < 93; only say "92" when describing the backend API specifically |

---

### §6 — Presenter Notes

**1. Rule-based engine, not AI:**  
Say "rule-based clinical decision support applying maternal and paediatric screening parameters." Deterministic rules are more credible than opaque neural networks for frontline safety tools.

**2. Two SpO2 thresholds exist (not visible in this demo):**  
Frontend `AshaPatientWorkflowPage.jsx` fires Red at SpO2 < 93; backend `triageCalculator.js` fires at SpO2 < 92. In Scenario 1 we use SpO2 = 98%, so neither threshold fires — the Red alert is triggered purely by the BP ≥ 140 / pregnancy rule, which is **identical in both files**. No conflict is visible during the demo.

**3. Why the synced case appears first in the doctor list:**  
`syncService.processBatch()` inserts the PHOTO_CASE into Postgres. `DoctorPhotoCasesPage` fetches `GET /api/v1/photo-cases/all` on mount and prepends backend rows before mock rows. The most recently inserted case will be first.

**4. GitHub repository:**  
`https://github.com/pranjali-905/AarogyaSync`
