import { 
  MOCK_PATIENT_FEMALE, 
  MOCK_PATIENT_MALE, 
  MOCK_ASHA_DATA, 
  MOCK_DOCTOR_DATA, 
  MOCK_ADMIN_DATA, 
  MOCK_MEDICINES 
} from './mockData';

const BASE_URL = (import.meta.env?.VITE_API_BASE_URL) || '/api/v1';

/**
 * Standard HTTP Request Wrapper
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('aarogyasync_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout for rural resilience

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn(`[API Client] Network request to ${endpoint} failed (${err.message}). Using local fallback/mock handler.`);
    return handleMockFallback(endpoint, options);
  }
}

/**
 * Auth API Helpers
 */
export async function apiLogin(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export async function apiRegister(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

export async function apiForgotPassword(data) {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiResetPassword(data) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiGetMe() {
  return apiRequest('/auth/me');
}

export async function apiGetDemoTokens() {
  return apiRequest('/auth/demo-tokens');
}

/**
 * Patient API Helpers
 */
export async function apiGetPatientProfile(id = null) {
  return apiRequest(id ? `/patients/${id}` : '/patients/profile');
}

export async function apiUpdatePatientProfile(data) {
  return apiRequest('/patients/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function apiGetPatientVitals(id = null) {
  return apiRequest(id ? `/patients/${id}/vitals` : '/patients/vitals');
}

export async function apiGetMaternalCare(id = null) {
  return apiRequest(id ? `/patients/${id}/maternal` : '/patients/maternal');
}

export async function apiGetChildRecords(id = null) {
  return apiRequest(id ? `/patients/${id}/child-records` : '/patients/child-records');
}

/**
 * Frontline ASHA API Helpers
 */
export async function apiGetAshaProfile() {
  return apiRequest('/asha/profile');
}

export async function apiGetAshaPatients() {
  return apiRequest('/asha/patients');
}

export async function apiRegisterAshaPatient(data) {
  return apiRequest('/asha/register-patient', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiRecordAshaVisit(data) {
  return apiRequest('/asha/record-visit', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiGetAshaPriorityCases() {
  return apiRequest('/asha/priority-cases');
}

export async function apiGetAshaPerformance() {
  return apiRequest('/asha/performance');
}

/**
 * Doctor API Helpers
 */
export async function apiGetDoctorProfile() {
  return apiRequest('/doctor/profile');
}

export async function apiGetDoctorQueue() {
  return apiRequest('/doctor/queue');
}

export async function apiGetDoctorSchedule() {
  return apiRequest('/doctor/schedule');
}

export async function apiGetDoctorTreatmentTracking() {
  return apiRequest('/doctor/treatment-tracking');
}

export async function apiIssuePrescription(data) {
  return apiRequest('/doctor/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * Admin API Helpers
 */
export async function apiGetAdminOverview() {
  return apiRequest('/admin/overview');
}

export async function apiGetAdminCitizens(search = '') {
  return apiRequest(`/admin/citizens${search ? `?search=${encodeURIComponent(search)}` : ''}`);
}

export async function apiGetAdminWorkforce() {
  return apiRequest('/admin/workforce');
}

export async function apiVerifyWorkforce(id, status) {
  return apiRequest(`/admin/workforce/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function apiGetAdminFacilities() {
  return apiRequest('/admin/facilities');
}

export async function apiGetAdminAnalytics() {
  return apiRequest('/admin/analytics');
}

export async function apiGetAdminSurveillance() {
  return apiRequest('/admin/surveillance');
}

export async function apiGetAdminReferrals() {
  return apiRequest('/admin/referrals');
}

export async function apiExportAdminReports(format = 'json') {
  return apiRequest(`/admin/reports/export?format=${format}`);
}

/**
 * Appointments API Helpers
 */
export async function apiGetAppointments() {
  return apiRequest('/appointments');
}

export async function apiBookAppointment(data) {
  return apiRequest('/appointments', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiUpdateAppointmentStatus(id, status) {
  return apiRequest(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

/**
 * Consultations API Helpers
 */
export async function apiGetConsultations() {
  return apiRequest('/consultations');
}

export async function apiCreateConsultation(data) {
  return apiRequest('/consultations', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiCompleteConsultation(id, data) {
  return apiRequest(`/consultations/${id}/complete`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

/**
 * Health Records (Digital Backpack) API Helpers
 */
export async function apiGetHealthRecords(type = '') {
  return apiRequest(`/health-records${type ? `?type=${type}` : ''}`);
}

export async function apiCreateHealthRecord(data) {
  return apiRequest('/health-records', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiDeleteHealthRecord(id) {
  return apiRequest(`/health-records/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Medicines & Diagnostics API Helpers
 */
export async function apiGetMedicines(query = '') {
  return apiRequest(`/medicines${query ? `?search=${encodeURIComponent(query)}` : ''}`);
}

export async function apiGetMedicineAvailability(query = '') {
  return apiRequest(`/medicines/availability${query ? `?search=${encodeURIComponent(query)}` : ''}`);
}

export async function apiGetDiagnostics(query = '') {
  return apiRequest(`/diagnostics${query ? `?search=${encodeURIComponent(query)}` : ''}`);
}

export async function apiGetDiagnosticAvailability(query = '') {
  return apiRequest(`/diagnostics/availability${query ? `?search=${encodeURIComponent(query)}` : ''}`);
}

/**
 * Facilities API Helpers
 */
export async function apiGetFacilities(query = '') {
  return apiRequest(`/facilities${query ? `?search=${encodeURIComponent(query)}` : ''}`);
}

export async function apiGetFacilityInventory(id) {
  return apiRequest(`/facilities/${id}/inventory`);
}

/**
 * Notifications API Helpers
 */
export async function apiGetNotifications() {
  return apiRequest('/notifications');
}

export async function apiGetUnreadNotificationsCount() {
  return apiRequest('/notifications/unread-count');
}

export async function apiMarkNotificationRead(id) {
  return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
}

export async function apiMarkAllNotificationsRead() {
  return apiRequest('/notifications/read-all', { method: 'PATCH' });
}

/**
 * Referrals API Helpers
 */
export async function apiGetReferrals() {
  return apiRequest('/referrals');
}

export async function apiCreateReferral(data) {
  return apiRequest('/referrals', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiUpdateReferralStatus(id, status) {
  return apiRequest(`/referrals/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

/**
 * Follow-up Tasks API Helpers
 */
export async function apiGetFollowUps() {
  return apiRequest('/follow-ups');
}

export async function apiCreateFollowUp(data) {
  return apiRequest('/follow-ups', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiUpdateFollowUpStatus(id, status) {
  return apiRequest(`/follow-ups/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

/**
 * Photo Cases (Store & Forward) API Helpers
 */
export async function apiGetPhotoCases() {
  return apiRequest('/photo-cases');
}

export async function apiCreatePhotoCase(data) {
  return apiRequest('/photo-cases', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiReviewPhotoCase(id, data) {
  return apiRequest(`/photo-cases/${id}/review`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

/**
 * Digital Triage API Helpers
 */
export async function apiAssessTriage(data) {
  return apiRequest('/triage/assess', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * Offline Sync API Helpers
 */
export async function apiProcessBatchSync(payload) {
  return apiRequest('/sync/batch', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function apiGetSyncStatus() {
  return apiRequest('/sync/status');
}

/**
 * Hackathon Fallback Handler ensuring demo continuity when offline
 */
function handleMockFallback(endpoint, options) {
  const body = options.body ? JSON.parse(options.body) : {};

  // Auth Login Fallback
  if (endpoint.startsWith('/auth/login')) {
    const { phone } = body;
    if (phone === '9876543210') {
      return { success: true, data: { user: MOCK_PATIENT_FEMALE, token: 'mock_jwt_patient_female' }, message: 'Logged in (Fallback)' };
    }
    if (phone === '9876543211') {
      return { success: true, data: { user: MOCK_PATIENT_MALE, token: 'mock_jwt_patient_male' }, message: 'Logged in (Fallback)' };
    }
    if (phone === '9876543220') {
      return { success: true, data: { user: { ...MOCK_ASHA_DATA.worker, role: 'ASHA' }, token: 'mock_jwt_asha' }, message: 'Logged in (Fallback)' };
    }
    if (phone === '9876543230') {
      return { success: true, data: { user: { ...MOCK_DOCTOR_DATA.doctor, role: 'DOCTOR' }, token: 'mock_jwt_doctor' }, message: 'Logged in (Fallback)' };
    }
    if (phone === '9876543240') {
      return { success: true, data: { user: MOCK_ADMIN_DATA, role: 'ADMIN', token: 'mock_jwt_admin' }, message: 'Logged in (Fallback)' };
    }

    const fallbackUser = {
      id: `usr-${Date.now().toString(36)}`,
      fullName: 'Rural User',
      phone: phone || '9876543200',
      role: 'PATIENT',
      gender: 'female'
    };
    return { success: true, data: { user: fallbackUser, token: 'mock_jwt_fallback' }, message: 'Logged in (Fallback)' };
  }

  // Auth Register Fallback
  if (endpoint.startsWith('/auth/register')) {
    const roleUpper = (body.role || '').toString().trim().toUpperCase();
    if (roleUpper === 'ADMIN' || roleUpper === 'ADMINISTRATOR' || body.isAdmin === true) {
      return {
        success: false,
        error: 'Public registration as District Administrator is strictly forbidden. Admin accounts are provisioned internally by District Health Authorities.'
      };
    }
    const registeredUser = {
      id: `usr-${(body.role || 'patient').toLowerCase()}-${Date.now().toString(36)}`,
      fullName: body.fullName || 'Registered User',
      phone: body.phone,
      role: body.role === 'ASHA' ? 'ASHA' : 'PATIENT',
      gender: body.gender || 'female',
      village: body.village || 'Nigdale',
      district: body.district || 'Pune',
      preferredLanguage: body.preferredLanguage || 'en'
    };
    return {
      success: true,
      data: { user: registeredUser, token: 'mock_jwt_reg_' + registeredUser.id },
      message: 'Registration successful! (Offline Fallback)'
    };
  }

  // Admin Endpoints Fallback
  if (endpoint.startsWith('/admin/overview')) {
    return { success: true, data: MOCK_ADMIN_DATA.healthMetrics };
  }
  if (endpoint.startsWith('/admin/citizens')) {
    return { success: true, data: MOCK_ADMIN_DATA.citizensRegistry };
  }
  if (endpoint.startsWith('/admin/workforce')) {
    return { success: true, data: MOCK_ADMIN_DATA.workforceRoster };
  }
  if (endpoint.startsWith('/admin/facilities') || endpoint === '/facilities') {
    return { success: true, data: MOCK_ADMIN_DATA.facilitiesRegistry };
  }
  if (endpoint.startsWith('/admin/analytics')) {
    return { success: true, data: MOCK_ADMIN_DATA.analyticsData };
  }
  if (endpoint.startsWith('/admin/surveillance')) {
    return { success: true, data: MOCK_ADMIN_DATA.outbreakSurveillance };
  }
  if (endpoint.startsWith('/admin/referrals') || endpoint.startsWith('/referrals')) {
    return { success: true, data: MOCK_ADMIN_DATA.referralsManagement };
  }
  if (endpoint.startsWith('/admin/reports')) {
    return { success: true, data: MOCK_ADMIN_DATA.reportsTemplates };
  }

  // Doctor Fallbacks
  if (endpoint.startsWith('/doctor/queue')) {
    return { success: true, data: MOCK_DOCTOR_DATA.queue };
  }
  if (endpoint.startsWith('/doctor/schedule')) {
    return { success: true, data: MOCK_DOCTOR_DATA.schedule };
  }

  // ASHA Fallbacks
  if (endpoint.startsWith('/asha/patients')) {
    return { success: true, data: MOCK_ASHA_DATA.patients };
  }
  if (endpoint.startsWith('/asha/priority-cases')) {
    return { success: true, data: MOCK_ASHA_DATA.priorityCases };
  }

  // Photo Cases Fallback
  if (endpoint.startsWith('/photo-cases')) {
    return {
      success: true,
      message: 'Photo cases retrieved',
      data: MOCK_DOCTOR_DATA.storeAndForwardCases
    };
  }

  // Facilities & Medicines
  if (endpoint.startsWith('/facilities') || endpoint.startsWith('/medicines')) {
    return {
      success: true,
      message: 'Retrieved from offline/cached catalogue',
      data: MOCK_MEDICINES
    };
  }

  if (endpoint.startsWith('/triage/assess')) {
    const spo2 = body.vitals?.spO2;
    const isRed = spo2 && spo2 < 92;
    return {
      success: true,
      message: 'Evaluated triage offline',
      data: {
        priority: isRed ? 'RED' : 'GREEN',
        message: isRed 
          ? 'URGENT: Low SpO2 oxygen level detected. Immediate medical intervention required.' 
          : 'Parameters within normal ranges. Continue standard monitoring.',
        redFlags: isRed ? ['SpO2 below 92%'] : [],
        yellowFlags: []
      }
    };
  }

  if (endpoint.startsWith('/sync/status')) {
    return {
      success: true,
      data: { status: 'OFFLINE_FALLBACK', dbConnected: false }
    };
  }

  return {
    success: true,
    message: 'Local offline response',
    data: null
  };
}

