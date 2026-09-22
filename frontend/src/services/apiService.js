import * as client from './apiClient';

/**
 * Centralized AarogyaSync Frontend API Service
 * Encapsulates all domain-specific REST API calls.
 */
export const apiService = {
  // Authentication & Profile
  auth: {
    login: (credentials) => client.apiLogin(credentials),
    register: (userData) => client.apiRegister(userData),
    forgotPassword: (data) => client.apiForgotPassword(data),
    resetPassword: (data) => client.apiResetPassword(data),
    getMe: () => client.apiGetMe(),
    getDemoTokens: () => client.apiGetDemoTokens(),
  },

  // Patients Domain
  patients: {
    getProfile: (id) => client.apiGetPatientProfile(id),
    updateProfile: (data) => client.apiUpdatePatientProfile(data),
    getVitals: (id) => client.apiGetPatientVitals(id),
    getMaternalCare: (id) => client.apiGetMaternalCare(id),
    getChildRecords: (id) => client.apiGetChildRecords(id),
  },

  // Frontline ASHA Workers Domain
  asha: {
    getProfile: () => client.apiGetAshaProfile(),
    getPatients: () => client.apiGetAshaPatients(),
    registerPatient: (data) => client.apiRegisterAshaPatient(data),
    recordVisit: (data) => client.apiRecordAshaVisit(data),
    getPriorityCases: () => client.apiGetAshaPriorityCases(),
    getPerformance: () => client.apiGetAshaPerformance(),
  },

  // Medical Officers / Doctors Domain
  doctor: {
    getProfile: () => client.apiGetDoctorProfile(),
    getQueue: () => client.apiGetDoctorQueue(),
    getSchedule: () => client.apiGetDoctorSchedule(),
    getTreatmentTracking: () => client.apiGetDoctorTreatmentTracking(),
    issuePrescription: (data) => client.apiIssuePrescription(data),
  },

  // District Health Administration Domain
  admin: {
    getOverview: () => client.apiGetAdminOverview(),
    getCitizens: (search) => client.apiGetAdminCitizens(search),
    getWorkforce: () => client.apiGetAdminWorkforce(),
    verifyWorkforce: (id, status) => client.apiVerifyWorkforce(id, status),
    getFacilities: () => client.apiGetAdminFacilities(),
    getAnalytics: () => client.apiGetAdminAnalytics(),
    getSurveillance: () => client.apiGetAdminSurveillance(),
    getReferrals: () => client.apiGetAdminReferrals(),
    exportReports: (format) => client.apiExportAdminReports(format),
  },

  // Appointments
  appointments: {
    getAll: () => client.apiGetAppointments(),
    book: (data) => client.apiBookAppointment(data),
    updateStatus: (id, status) => client.apiUpdateAppointmentStatus(id, status),
  },

  // Consultations & Telemedicine
  consultations: {
    getAll: () => client.apiGetConsultations(),
    create: (data) => client.apiCreateConsultation(data),
    complete: (id, data) => client.apiCompleteConsultation(id, data),
  },

  // Health Records & Digital Backpack
  healthRecords: {
    getAll: (type) => client.apiGetHealthRecords(type),
    create: (data) => client.apiCreateHealthRecord(data),
    delete: (id) => client.apiDeleteHealthRecord(id),
  },

  // Medicine Inventory & Availability
  medicines: {
    getAll: (query) => client.apiGetMedicines(query),
    getAvailability: (query) => client.apiGetMedicineAvailability(query),
  },

  // Diagnostic Tests & Equipment
  diagnostics: {
    getAll: (query) => client.apiGetDiagnostics(query),
    getAvailability: (query) => client.apiGetDiagnosticAvailability(query),
  },

  // Facilities
  facilities: {
    getAll: (query) => client.apiGetFacilities(query),
    getInventory: (id) => client.apiGetFacilityInventory(id),
  },

  // Notifications & Alerts
  notifications: {
    getAll: () => client.apiGetNotifications(),
    getUnreadCount: () => client.apiGetUnreadNotificationsCount(),
    markAsRead: (id) => client.apiMarkNotificationRead(id),
    markAllAsRead: () => client.apiMarkAllNotificationsRead(),
  },

  // Inter-facility Referrals
  referrals: {
    getAll: () => client.apiGetReferrals(),
    create: (data) => client.apiCreateReferral(data),
    updateStatus: (id, status) => client.apiUpdateReferralStatus(id, status),
  },

  // Patient & Clinical Follow-ups
  followUps: {
    getAll: () => client.apiGetFollowUps(),
    create: (data) => client.apiCreateFollowUp(data),
    updateStatus: (id, status) => client.apiUpdateFollowUpStatus(id, status),
  },

  // Store & Forward Tele-Dermatology Cases
  photoCases: {
    getAll: () => client.apiGetPhotoCases(),
    create: (data) => client.apiCreatePhotoCase(data),
    review: (id, data) => client.apiReviewPhotoCase(id, data),
  },

  // Digital Clinical Triage
  triage: {
    assess: (data) => client.apiAssessTriage(data),
  },

  // Offline Sync Queue
  sync: {
    processBatch: (payload) => client.apiProcessBatchSync(payload),
    getStatus: () => client.apiGetSyncStatus(),
  },
};

export default apiService;
