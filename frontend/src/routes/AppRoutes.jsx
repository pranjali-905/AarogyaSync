import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

// Public Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Authenticated Patient Application Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import DoctorDirectoryPage from '../pages/patient/DoctorDirectoryPage';
import MyHealthPage from '../pages/patient/MyHealthPage';
import HealthAssessmentPage from '../pages/patient/HealthAssessmentPage';
import DigitalBackpackPage from '../pages/patient/DigitalBackpackPage';
import PatientMedicinesPage from '../pages/patient/PatientMedicinesPage';
import MedicinesFollowupPage from '../pages/patient/MedicinesFollowupPage';
import FollowupPage from '../pages/patient/FollowupPage';
import AppointmentsPage from '../pages/patient/AppointmentsPage';
import TeleconsultPage from '../pages/patient/TeleconsultPage';
import MedicineAvailabilityPage from '../pages/patient/MedicineAvailabilityPage';
import DiagnosticAvailabilityPage from '../pages/patient/DiagnosticAvailabilityPage';
import EmergencyPage from '../pages/patient/EmergencyPage';
import NotificationsPage from '../pages/patient/NotificationsPage';
import PatientProfilePage from '../pages/patient/PatientProfilePage';
import MaternalCarePage from '../pages/patient/MaternalCarePage';
import ChildCarePage from '../pages/patient/ChildCarePage';

// ASHA, Doctor & Admin Pages
import AshaDashboard from '../pages/asha/AshaDashboard';
import AshaPatientWorkflowPage from '../pages/asha/AshaPatientWorkflowPage';
import AshaPatientRegistryPage from '../pages/asha/AshaPatientRegistryPage';
import AshaRegisterPage from '../pages/asha/AshaRegisterPage';
import AshaVisitsPage from '../pages/asha/AshaVisitsPage';
import AshaFollowupsPage from '../pages/asha/AshaFollowupsPage';
import AshaReferralsPage from '../pages/asha/AshaReferralsPage';
import AshaTelemedicinePage from '../pages/asha/AshaTelemedicinePage';
import AshaPhotoCasePage from '../pages/asha/AshaPhotoCasePage';
import AshaPriorityCasesPage from '../pages/asha/AshaPriorityCasesPage';
import AshaOfflineRecordsPage from '../pages/asha/AshaOfflineRecordsPage';
import AshaSyncQueuePage from '../pages/asha/AshaSyncQueuePage';
import AshaPerformancePage from '../pages/asha/AshaPerformancePage';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorQueuePage from '../pages/doctor/DoctorQueuePage';
import DoctorPatientsPage from '../pages/doctor/DoctorPatientsPage';
import DoctorRecordsPage from '../pages/doctor/DoctorRecordsPage';
import DoctorHistoryPage from '../pages/doctor/DoctorHistoryPage';
import DoctorLiveConsultPage from '../pages/doctor/DoctorLiveConsultPage';
import DoctorStoreForwardPage from '../pages/doctor/DoctorStoreForwardPage';
import DoctorPhotoCasesPage from '../pages/doctor/DoctorPhotoCasesPage';
import DoctorFollowupsPage from '../pages/doctor/DoctorFollowupsPage';
import DoctorPrescriptionsPage from '../pages/doctor/DoctorPrescriptionsPage';
import DoctorReferralsPage from '../pages/doctor/DoctorReferralsPage';
import DoctorSchedulePage from '../pages/doctor/DoctorSchedulePage';
import DoctorTreatmentTrackingPage from '../pages/doctor/DoctorTreatmentTrackingPage';
import DoctorNotificationsPage from '../pages/doctor/DoctorNotificationsPage';
import DoctorProfilePage from '../pages/doctor/DoctorProfilePage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPatientsPage from '../pages/admin/AdminPatientsPage';
import AdminWorkforcePage from '../pages/admin/AdminWorkforcePage';
import AdminFacilitiesPage from '../pages/admin/AdminFacilitiesPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import AdminReferralsPage from '../pages/admin/AdminReferralsPage';
import AdminSurveillancePage from '../pages/admin/AdminSurveillancePage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import DesignSystemShowcase from '../pages/common/DesignSystemShowcase';
import NotFound from '../pages/common/NotFound';

export default function AppRoutes() {
  const { activeRole, currentUser } = useAuth();

  // Helper for direct dashboard redirection
  const getDashboardRedirect = () => {
    switch (activeRole) {
      case 'ASHA':
        return '/asha';
      case 'DOCTOR':
        return '/doctor';
      case 'ADMIN':
        return '/admin';
      case 'PATIENT':
      default:
        return '/patient';
    }
  };

  return (
    <Routes>
      {/* 1. Direct Web App Root: opens dashboard if logged in, else login */}
      <Route
        path="/"
        element={
          currentUser ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 2. Public Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Shortcut redirect to active dashboard */}
      <Route path="/dashboard" element={<Navigate to={getDashboardRedirect()} replace />} />

      {/* 3. Main Authenticated Application Layout Container */}
      <Route element={<AppLayout />}>
        {/* ================= PATIENT ROUTES ================= */}
        {/* 1. Home Dashboard (Male or Female based on profile) */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* 2. Doctor Directory */}
        <Route
          path="/patient/doctor"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <DoctorDirectoryPage />
            </ProtectedRoute>
          }
        />

        {/* 3. My Health (Vitals, history, chronic care) */}
        <Route
          path="/patient/health"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <MyHealthPage />
            </ProtectedRoute>
          }
        />

        {/* 4. Health Assessment (6-stage clinical decision questionnaire) */}
        <Route
          path="/patient/assessment"
          element={
            <ProtectedRoute allowedRoles={['PATIENT', 'ASHA']}>
              <HealthAssessmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/triage"
          element={
            <ProtectedRoute allowedRoles={['PATIENT', 'ASHA']}>
              <HealthAssessmentPage />
            </ProtectedRoute>
          }
        />

        {/* 5. Digital Backpack (6 tabs: records, Rx, lab, vaccines, consult, docs) */}
        <Route
          path="/patient/backpack"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <DigitalBackpackPage />
            </ProtectedRoute>
          }
        />

        {/* 4. Medicines & Follow-up (Active prescriptions, dosage tracking, refills, doctor follow-up visits) */}
        <Route
          path="/patient/medicines-followup"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <MedicinesFollowupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/my-medicines"
          element={<Navigate to="/patient/medicines-followup" replace />}
        />
        <Route
          path="/patient/followup"
          element={<Navigate to="/patient/medicines-followup" replace />}
        />

        {/* Doctor OPD Appointments alias -> /patient/doctor */}
        <Route
          path="/patient/appointments"
          element={<Navigate to="/patient/doctor" replace />}
        />

        {/* 9. Teleconsultation (Video/audio consultation room) */}
        <Route
          path="/patient/teleconsult"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <TeleconsultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/consult"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <TeleconsultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctor/consult"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <TeleconsultPage />
            </ProtectedRoute>
          }
        />

        {/* 10. Medicine Availability (Live PHC/CHC inventory) */}
        <Route
          path="/patient/medicines"
          element={
            <ProtectedRoute allowedRoles={['PATIENT', 'ASHA']}>
              <MedicineAvailabilityPage />
            </ProtectedRoute>
          }
        />

        {/* 11. Diagnostic Availability (Lab test catalog) */}
        <Route
          path="/patient/diagnostics"
          element={
            <ProtectedRoute allowedRoles={['PATIENT', 'ASHA']}>
              <DiagnosticAvailabilityPage />
            </ProtectedRoute>
          }
        />

        {/* 12. Emergency Help (108 SOS, 102 transit, nearby facilities) */}
        <Route
          path="/patient/emergency"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <EmergencyPage />
            </ProtectedRoute>
          }
        />

        {/* 13. Notifications (Inbox & alerts) */}
        <Route
          path="/patient/notifications"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* 14. Profile (ABHA ID, demographic & gender selection) */}
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <PatientProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 15. Maternal Care (Female-specific ANC tracker) */}
        <Route
          path="/patient/maternal"
          element={
            <ProtectedRoute allowedRoles={['PATIENT', 'ASHA']}>
              <MaternalCarePage />
            </ProtectedRoute>
          }
        />

        {/* 16. Child Care (Universal Immunization timetable) */}
        <Route
          path="/patient/child"
          element={
            <ProtectedRoute allowedRoles={['PATIENT', 'ASHA']}>
              <ChildCarePage />
            </ProtectedRoute>
          }
        />

        {/* ================= ASHA ROUTES ================= */}
        <Route
          path="/asha"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/workflow"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaPatientWorkflowPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/patients"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaPatientRegistryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/register"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaRegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/visits"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaVisitsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/followups"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaFollowupsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/referrals"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaReferralsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/telemedicine"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaTelemedicinePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/photo-case"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaPhotoCasePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/photo-cases"
          element={<Navigate to="/asha/photo-case" replace />}
        />
        <Route
          path="/asha/priority"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaPriorityCasesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/offline"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaOfflineRecordsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/sync"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaSyncQueuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/performance"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <AshaPerformancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/medicines"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <MedicineAvailabilityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/diagnostics"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <DiagnosticAvailabilityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/maternal"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <MaternalCarePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asha/child"
          element={
            <ProtectedRoute allowedRoles={['ASHA']}>
              <ChildCarePage />
            </ProtectedRoute>
          }
        />

        {/* ================= DOCTOR ROUTES ================= */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/queue"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorQueuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorPatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/records"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorRecordsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/history"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/consult"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorLiveConsultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/consult/:id"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorLiveConsultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/store-and-forward"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorStoreForwardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/photo-cases"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorPhotoCasesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/photo-review"
          element={<Navigate to="/doctor/photo-cases" replace />}
        />
        <Route
          path="/doctor/followups"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorFollowupsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/prescriptions"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorPrescriptionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/referrals"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorReferralsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/schedule"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorSchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/medicines"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <MedicineAvailabilityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/diagnostics"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DiagnosticAvailabilityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/treatment-tracking"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorTreatmentTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/notifications"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorNotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        {/* 1. Admin Home (Executive District Command Console) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 2. Patients (Citizen Registry, Patient information, search, registration management) */}
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminPatientsPage />
            </ProtectedRoute>
          }
        />

        {/* 3. Workforce (ASHA workers, Doctors, credential verification, account management) */}
        <Route
          path="/admin/workforce"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminWorkforcePage />
            </ProtectedRoute>
          }
        />

        {/* 4. Facilities (PHCs, Hospitals, Clinics, medicine availability, diagnostic test availability) */}
        <Route
          path="/admin/facilities"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminFacilitiesPage />
            </ProtectedRoute>
          }
        />

        {/* 5. Analytics (Health trends, priority cases, follow-up stats, facility activity, workforce activity, quality monitoring) */}
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* 6. Referrals (District emergency referrals, secondary/tertiary transfers, 108/102 fleet) */}
        <Route
          path="/admin/referrals"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminReferralsPage />
            </ProtectedRoute>
          }
        />

        {/* 7. Public Health Surveillance (IDSP outbreak cluster tracking, alert triggers, mobile units) */}
        <Route
          path="/admin/surveillance"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminSurveillancePage />
            </ProtectedRoute>
          }
        />

        {/* 8. Reports / Export (Generate NHM reports, export structured data CSV/JSON) */}
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Catch-All */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 5. Design System Showcase Route */}
        <Route path="/design-system" element={<DesignSystemShowcase />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
