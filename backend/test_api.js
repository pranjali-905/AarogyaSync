const http = require('http');
const app = require('./src/app');

// Run tests using native Node.js http requests
const TEST_PORT = 5099;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting AarogyaSync Backend Test Suite...\n');
  const server = http.createServer(app);

  await new Promise(resolve => server.listen(TEST_PORT, resolve));
  console.log(`🚀 Test server started on http://127.0.0.1:${TEST_PORT}\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name} ${details}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('GET', '/api/v1/health');
    assert(health.status === 200 && health.body.success, 'GET /api/v1/health returns 200 OK');

    // 2. Demo personas
    const demo = await request('GET', '/api/v1/auth/demo-tokens');
    assert(demo.status === 200 && demo.body.data.PATIENT, 'GET /api/v1/auth/demo-tokens returns personas');

    const patientToken = demo.body.data.PATIENT.token;
    const ashaToken = demo.body.data.ASHA.token;
    const doctorToken = demo.body.data.DOCTOR.token;
    const adminToken = demo.body.data.ADMIN.token;

    // 3. Login
    const login = await request('POST', '/api/v1/auth/login', { phone: '9876543210', password: 'demo123' });
    assert(login.status === 200 && login.body.data.token, 'POST /api/v1/auth/login succeeds');
    assert(!login.body.data.user.password_hash && !login.body.data.user.passwordHash, 'User payload hides password hash');

    // 4. Register new patient
    const regPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    const reg = await request('POST', '/api/v1/auth/register', {
      fullName: 'Sunita Patil',
      phone: regPhone,
      password: 'securePassword123',
      role: 'PATIENT',
      village: 'Nigdale'
    });
    assert(reg.status === 201 && reg.body.data.user.id, 'POST /api/v1/auth/register creates user');

    // 5. Register admin prevention check (SECURITY)
    const adminReg = await request('POST', '/api/v1/auth/register', {
      fullName: 'Hacker Admin',
      phone: '9811223344',
      password: 'password123',
      role: 'ADMIN'
    });
    assert(adminReg.status === 403, 'Security: Self-registration as ADMIN is forbidden (403)');

    // 6. Patient Profile
    const patProfile = await request('GET', '/api/v1/patients/profile', null, patientToken);
    assert(patProfile.status === 200 && patProfile.body.data.full_name, 'GET /api/v1/patients/profile retrieves patient profile');

    // 7. Patient Maternal Care
    const maternal = await request('GET', '/api/v1/patients/maternal', null, patientToken);
    assert(maternal.status === 200 && maternal.body.data.ancSchedule, 'GET /api/v1/patients/maternal returns ANC schedule');

    // 8. Patient Child Records
    const child = await request('GET', '/api/v1/patients/child-records', null, patientToken);
    assert(child.status === 200 && Array.isArray(child.body.data), 'GET /api/v1/patients/child-records returns immunization cards');

    // 9. ASHA Profile & Patients
    const ashaPatients = await request('GET', '/api/v1/asha/patients', null, ashaToken);
    assert(ashaPatients.status === 200 && Array.isArray(ashaPatients.body.data), 'GET /api/v1/asha/patients returns assigned village cohort');

    // 10. ASHA Performance
    const ashaPerf = await request('GET', '/api/v1/asha/performance', null, ashaToken);
    assert(ashaPerf.status === 200 && ashaPerf.body.data.householdsCovered, 'GET /api/v1/asha/performance returns metrics');

    // 11. Doctor Queue & Schedule
    const docQueue = await request('GET', '/api/v1/doctor/queue', null, doctorToken);
    assert(docQueue.status === 200 && docQueue.body.data.scheduledConsultations, 'GET /api/v1/doctor/queue returns clinical cases');

    const docSchedule = await request('GET', '/api/v1/doctor/schedule', null, doctorToken);
    assert(docSchedule.status === 200 && docSchedule.body.data.length > 0, 'GET /api/v1/doctor/schedule returns slots');

    // 12. Doctor Issue Prescription
    const newRx = await request('POST', '/api/v1/doctor/prescriptions', {
      patientId: 'usr-pat-female-01',
      diagnosis: 'Gestational Anemia Review',
      medicines: [{ name: 'Iron & Folic Acid', dosage: '1 tab', frequency: 'OD', duration: '30 days' }],
      advice: 'Take with lemon juice'
    }, doctorToken);
    assert(newRx.status === 201 && newRx.body.data.qr_token, 'POST /api/v1/doctor/prescriptions creates e-Rx with QR token');

    // 13. Admin Overview & Analytics (RBAC Check)
    const adminOverview = await request('GET', '/api/v1/admin/overview', null, adminToken);
    assert(adminOverview.status === 200 && adminOverview.body.data.totalRegisteredCitizens, 'GET /api/v1/admin/overview succeeds for ADMIN');

    // Security RBAC test: Patient attempting Admin overview
    const forbiddenOverview = await request('GET', '/api/v1/admin/overview', null, patientToken);
    assert(forbiddenOverview.status === 403, 'RBAC Guard: Patient cannot access /admin/overview (403)');

    // 14. Admin Surveillance
    const adminSurv = await request('GET', '/api/v1/admin/surveillance', null, adminToken);
    assert(adminSurv.status === 200 && adminSurv.body.data.activeOutbreakAlerts, 'GET /api/v1/admin/surveillance returns syndromic data');

    // 15. Appointments: Booking & Listing
    const newApt = await request('POST', '/api/v1/appointments', {
      doctorId: 'usr-doc-01',
      facilityId: 'fac-phc-01',
      appointmentDate: '2026-09-25',
      timeSlot: '11:00 AM',
      appointmentType: 'IN_PERSON',
      reason: 'General Checkup'
    }, patientToken);
    assert(newApt.status === 201 && newApt.body.data.token_number, 'POST /api/v1/appointments books appointment');

    const myApts = await request('GET', '/api/v1/appointments', null, patientToken);
    assert(myApts.status === 200 && myApts.body.data.length > 0, 'GET /api/v1/appointments lists user appointments');

    // 16. Consultations: Creation & Completion
    const newCon = await request('POST', '/api/v1/consultations', {
      doctorId: 'usr-doc-01',
      consultationType: 'LIVE_VIDEO',
      chiefComplaint: 'Headache and fatigue',
      priority: 'YELLOW'
    }, patientToken);
    assert(newCon.status === 201 && newCon.body.data.id, 'POST /api/v1/consultations initiates consultation');

    const conId = newCon.body.data.id;
    const compCon = await request('PATCH', `/api/v1/consultations/${conId}/complete`, {
      diagnosis: 'Tension headache due to dehydration',
      prescriptionNotes: 'Hydrate well, rest',
      clinicalExamination: 'Vitals stable',
      medicines: [{ name: 'Paracetamol 500mg', dosage: '1 tab', frequency: 'SOS', duration: '3 days' }]
    }, doctorToken);
    assert(compCon.status === 200 && compCon.body.data.status === 'COMPLETED', 'PATCH /api/v1/consultations/:id/complete finalizes consultation');

    // 17. Health Records: Add to Digital Backpack & Retrieve
    const newDoc = await request('POST', '/api/v1/health-records', {
      docTitle: 'Hb Test Result Slip',
      docType: 'LAB_REPORT',
      issuedBy: 'Nigdale Sub-Centre',
      metadata: { hb: '11.8 g/dL' }
    }, patientToken);
    assert(newDoc.status === 201 && newDoc.body.data.id, 'POST /api/v1/health-records saves to Digital Backpack');

    const myDocs = await request('GET', '/api/v1/health-records', null, patientToken);
    assert(myDocs.status === 200 && myDocs.body.data.length > 0, 'GET /api/v1/health-records lists documents');

    // 18. Facilities & Inventory Availability
    const facilities = await request('GET', '/api/v1/facilities');
    assert(facilities.status === 200 && facilities.body.data.length >= 3, 'GET /api/v1/facilities returns facilities catalogue');

    const medicinesAvail = await request('GET', '/api/v1/medicines/availability');
    assert(medicinesAvail.status === 200 && medicinesAvail.body.data.length > 0, 'GET /api/v1/medicines/availability returns stock inventory');

    const diagnosticsAvail = await request('GET', '/api/v1/diagnostics/availability');
    assert(diagnosticsAvail.status === 200 && diagnosticsAvail.body.data.length > 0, 'GET /api/v1/diagnostics/availability returns test availability');

    // 19. Notifications: Fetch & Read
    const notifs = await request('GET', '/api/v1/notifications', null, patientToken);
    assert(notifs.status === 200 && Array.isArray(notifs.body.data), 'GET /api/v1/notifications retrieves alerts');

    const markRead = await request('PATCH', '/api/v1/notifications/read-all', {}, patientToken);
    assert(markRead.status === 200, 'PATCH /api/v1/notifications/read-all marks notifications as read');

    // 20. Referrals: Create & Update
    const newRef = await request('POST', '/api/v1/referrals', {
      patientId: 'usr-pat-female-01',
      fromFacilityId: 'fac-sub-03',
      toFacilityId: 'fac-phc-02',
      attendingSpecialist: 'Obstetrician',
      reason: 'Routine 3rd trimester ultrasound',
      urgency: 'YELLOW',
      transportNeeded: 'Ambulance 108'
    }, ashaToken);
    assert(newRef.status === 201 && newRef.body.data.id, 'POST /api/v1/referrals creates inter-facility referral');

    const refId = newRef.body.data.id;
    const updateRef = await request('PATCH', `/api/v1/referrals/${refId}/status`, { status: 'ACCEPTED' }, doctorToken);
    assert(updateRef.status === 200 && updateRef.body.data.status === 'ACCEPTED', 'PATCH /api/v1/referrals/:id/status updates referral');

    // 21. Follow-ups: Create & Complete
    const newFup = await request('POST', '/api/v1/follow-ups', {
      patientId: 'usr-pat-female-01',
      assignedTo: 'usr-asha-01',
      title: 'Blood Pressure Home Check',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      priority: 'YELLOW'
    }, doctorToken);
    assert(newFup.status === 201 && newFup.body.data.id, 'POST /api/v1/follow-ups creates follow-up task');

    const fupId = newFup.body.data.id;
    const compFup = await request('PATCH', `/api/v1/follow-ups/${fupId}/status`, { status: 'COMPLETED' }, ashaToken);
    assert(compFup.status === 200 && compFup.body.data.status === 'COMPLETED', 'PATCH /api/v1/follow-ups/:id/status marks task completed');

    // 22. Photo Cases: Store & Forward
    const newPhotoCase = await request('POST', '/api/v1/photo-cases', {
      patientId: 'usr-pat-male-02',
      category: 'DERMATOLOGY',
      title: 'Contact rash on arms',
      symptoms: 'Red itchy bumps after farming',
      urgency: 'YELLOW'
    }, ashaToken);
    assert(newPhotoCase.status === 201 && newPhotoCase.body.data.id, 'POST /api/v1/photo-cases creates tele-dermatology case');

    const pcId = newPhotoCase.body.data.id;
    const reviewPc = await request('PATCH', `/api/v1/photo-cases/${pcId}/review`, {
      doctorNotes: 'Consistent with allergic contact dermatitis',
      doctorTreatmentPlan: 'Apply calamine lotion BID and avoid direct sun'
    }, doctorToken);
    assert(reviewPc.status === 200 && reviewPc.body.data.status === 'REVIEWED', 'PATCH /api/v1/photo-cases/:id/review submits doctor notes');

    // 23. Digital Triage: Critical RED Rule Evaluation
    const redTriage = await request('POST', '/api/v1/triage/assess', {
      vitals: { spO2: 89, systolicBp: 155, diastolicBp: 95 },
      symptoms: ['difficulty breathing', 'chest pain'],
      context: { isPregnant: true }
    });
    assert(redTriage.status === 200 && redTriage.body.data.priority === 'RED', 'Triage Engine: SpO2 < 92% and chest pain triggers RED priority');
    assert(redTriage.body.data.redFlags.length >= 2, 'Triage Engine identifies clinical red flags');

    // Normal GREEN evaluation
    const greenTriage = await request('POST', '/api/v1/triage/assess', {
      vitals: { spO2: 99, systolicBp: 118, diastolicBp: 76, temperature: 98.4, pulseRate: 74 },
      symptoms: []
    });
    assert(greenTriage.status === 200 && greenTriage.body.data.priority === 'GREEN', 'Triage Engine: Normal vitals triggers GREEN priority');

    // 24. Offline Batch Sync: Idempotency deduplication
    const idempKey = `test-idemp-${Date.now()}`;
    const syncPayload = {
      deviceId: 'mobile-tab-asha-01',
      records: [
        {
          idempotencyKey: idempKey,
          type: 'TRIAGE_RECORD',
          payload: {
            patientId: 'usr-pat-female-01',
            systolicBp: 120,
            diastolicBp: 80,
            pulseRate: 76,
            temperature: 98.6,
            spO2: 99,
            priority: 'GREEN'
          },
          recordedAt: new Date().toISOString()
        }
      ]
    };

    const sync1 = await request('POST', '/api/v1/sync/batch', syncPayload, ashaToken);
    assert(sync1.status === 200 && sync1.body.data.synced === 1, 'POST /api/v1/sync/batch syncs 1 offline record');

    // Resend identical payload: must be identified as duplicate
    const sync2 = await request('POST', '/api/v1/sync/batch', syncPayload, ashaToken);
    assert(sync2.status === 200 && sync2.body.data.duplicates === 1, 'Sync Deduplication: Duplicate idempotency key safely ignored');

    const syncStatus = await request('GET', '/api/v1/sync/status');
    assert(syncStatus.status === 200 && syncStatus.body.data.status === 'ONLINE', 'GET /api/v1/sync/status returns online status');

    // 25. Input validation error test
    const badApt = await request('POST', '/api/v1/appointments', {}, patientToken);
    assert(badApt.status === 400 && !badApt.body.success, 'Validation Guard: Malformed request body returns 400 Bad Request');

    // 26. 404 Route Test
    const notFound = await request('GET', '/api/v1/non-existent-endpoint');
    assert(notFound.status === 404 && !notFound.body.success, 'Route Guard: Unknown route returns 404 Not Found');

  } catch (err) {
    console.error('💥 Test execution failed with unhandled exception:', err);
    failed++;
  } finally {
    server.close();
    console.log(`\n🏁 Test Suite Finished: ${passed} passed, ${failed} failed`);
    if (failed > 0) {
      process.exit(1);
    } else {
      console.log('🎉 ALL BACKEND TESTS PASSED!\n');
    }
  }
}

runTests();
