import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PATIENT_FEMALE, MOCK_PATIENT_MALE, MOCK_ASHA_DATA, MOCK_DOCTOR_DATA, MOCK_ADMIN_DATA } from '../services/mockData';
import apiService from '../services/apiService';

const AuthContext = createContext(null);

export const PRESET_USERS = {
  PATIENT_FEMALE: {
    ...MOCK_PATIENT_FEMALE,
    token: 'mock_jwt_patient_female'
  },
  PATIENT_MALE: {
    ...MOCK_PATIENT_MALE,
    token: 'mock_jwt_patient_male'
  },
  ASHA: {
    id: MOCK_ASHA_DATA.worker.id,
    fullName: MOCK_ASHA_DATA.worker.fullName,
    phone: MOCK_ASHA_DATA.worker.phone,
    role: 'ASHA',
    village: MOCK_ASHA_DATA.worker.village,
    token: 'mock_jwt_asha'
  },
  DOCTOR: {
    id: MOCK_DOCTOR_DATA.doctor.id,
    fullName: MOCK_DOCTOR_DATA.doctor.fullName,
    phone: '9876543230',
    role: 'DOCTOR',
    designation: MOCK_DOCTOR_DATA.doctor.designation,
    token: 'mock_jwt_doctor'
  },
  ADMIN: {
    id: 'usr-admin-01',
    fullName: 'Shri S. V. Gaikwad',
    phone: '9876543240',
    role: 'ADMIN',
    designation: 'District Health Officer',
    district: 'Pune Zilla Parishad',
    token: 'mock_jwt_admin'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aarogyasync_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    }
    return null;
  });

  const [activeRole, setActiveRole] = useState(() => currentUser?.role || null);
  const [patientGender, setPatientGender] = useState(() => currentUser?.gender || 'female');
  const [patientType, setPatientType] = useState(() => currentUser?.patientType || currentUser?.patient_type || currentUser?.gender || 'female');
  const [authLoading, setAuthLoading] = useState(false);

  // Synchronize state changes when currentUser updates
  useEffect(() => {
    if (currentUser) {
      setActiveRole(currentUser.role);
      const resolvedType = currentUser.patientType || currentUser.patient_type || currentUser.gender || 'female';
      setPatientType(resolvedType);
      if (currentUser.gender) setPatientGender(currentUser.gender);
    } else {
      setActiveRole(null);
    }
  }, [currentUser]);

  // Validate existing session on mount with backend
  useEffect(() => {
    const token = localStorage.getItem('aarogyasync_token');
    if (token) {
      apiService.auth.getMe()
        .then((res) => {
          if (res && res.success && res.data && res.data.user) {
            const verifiedUser = {
              ...currentUser,
              ...res.data.user,
              patientType: res.data.user.patientType || res.data.user.patient_type || res.data.user.gender || currentUser?.patientType || 'female'
            };
            setCurrentUser(verifiedUser);
            localStorage.setItem('aarogyasync_user', JSON.stringify(verifiedUser));
          }
        })
        .catch(() => {
          // Keep cached session if backend connection fails
        });
    }
  }, []);

  // Quick switch role for testing and demonstration
  const quickSwitchRole = async (roleKey) => {
    const persona = PRESET_USERS[roleKey];
    if (persona) {
      const resolvedType = persona.patientType || persona.gender || (roleKey === 'PATIENT_MALE' ? 'male' : 'female');
      const enrichedPersona = { ...persona, patientType: resolvedType };
      setCurrentUser(enrichedPersona);
      setActiveRole(enrichedPersona.role);
      setPatientType(resolvedType);
      if (enrichedPersona.gender) {
        setPatientGender(enrichedPersona.gender);
      }
      localStorage.setItem('aarogyasync_user', JSON.stringify(enrichedPersona));
      localStorage.setItem('aarogyasync_token', enrichedPersona.token);
      console.log(`[Auth] Switched to persona: ${roleKey} (${persona.fullName})`);

      // Try fetching real JWT from backend demo tokens in background
      try {
        const demoRes = await apiService.auth.getDemoTokens();
        if (demoRes && demoRes.success && demoRes.data) {
          const backendRoleKey = roleKey.includes('PATIENT') ? 'PATIENT' : roleKey;
          const liveToken = demoRes.data[backendRoleKey]?.token;
          if (liveToken) {
            localStorage.setItem('aarogyasync_token', liveToken);
          }
        }
      } catch (e) {
        // Fallback token remains active
      }
    }
  };

  /**
   * Direct login with verified user payload & token
   */
  const login = (userData, token) => {
    const resolvedType = userData.patientType || userData.patient_type || userData.gender || 'female';
    const completeUser = { ...userData, patientType: resolvedType };
    setCurrentUser(completeUser);
    setActiveRole(completeUser.role);
    setPatientType(resolvedType);
    if (completeUser.gender) setPatientGender(completeUser.gender);
    localStorage.setItem('aarogyasync_user', JSON.stringify(completeUser));
    if (token) localStorage.setItem('aarogyasync_token', token);
  };

  /**
   * Role-aware API login with credentials
   */
  const loginWithCredentials = async (credentials) => {
    setAuthLoading(true);
    try {
      const response = await apiService.auth.login(credentials);
      if (response && response.success && response.data) {
        const { user, token } = response.data;
        login(user, token);
        return { success: true, user, token };
      }
      return {
        success: false,
        error: response?.error || response?.message || 'Login failed. Please check your credentials.'
      };
    } catch (err) {
      return { success: false, error: err.message || 'Network error during login' };
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Self-registration with role restriction (no admin)
   */
  const registerWithCredentials = async (userData) => {
    setAuthLoading(true);
    try {
      const response = await apiService.auth.register(userData);
      if (response && response.success && response.data) {
        const { user, token } = response.data;
        login(user, token);
        return { success: true, user, token };
      }
      return {
        success: false,
        error: response?.error || response?.message || 'Registration failed. Please try again.'
      };
    } catch (err) {
      return { success: false, error: err.message || 'Network error during registration' };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveRole(null);
    localStorage.removeItem('aarogyasync_user');
    localStorage.removeItem('aarogyasync_token');
  };

  const setGender = (gender) => {
    if (currentUser && currentUser.role === 'PATIENT') {
      const updated = { ...currentUser, gender, patientType: gender };
      setCurrentUser(updated);
      setPatientGender(gender);
      setPatientType(gender);
      localStorage.setItem('aarogyasync_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        patientGender,
        patientType,
        isFemale: patientType === 'female' || currentUser?.patientType === 'female' || currentUser?.gender === 'female',
        isMale: patientType === 'male' || currentUser?.patientType === 'male' || currentUser?.gender === 'male',
        authLoading,
        quickSwitchRole,
        login,
        loginWithCredentials,
        registerWithCredentials,
        logout,
        setGender,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
