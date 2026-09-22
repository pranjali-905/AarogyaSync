import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import FemalePatientDashboard from './FemalePatientDashboard';
import MalePatientDashboard from './MalePatientDashboard';

/**
 * Main Patient Dashboard Router
 * Renders either FemalePatientDashboard (Maternal Care & Child Care + General Health)
 * or MalePatientDashboard (General Health & Chronic Care + Occupational Farm Safety).
 * 
 * Strict architectural rule: Do NOT merge male and female experiences into one identical page.
 */
export default function PatientDashboard() {
  const { isMale } = useAuth();

  return isMale ? <MalePatientDashboard /> : <FemalePatientDashboard />;
}
