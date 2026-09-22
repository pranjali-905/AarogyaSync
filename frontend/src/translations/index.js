import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';

export const translations = {
  en,
  hi,
  mr
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', short: 'EN' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', short: 'हिं' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', short: 'मरा' }
];

/**
 * Resolves dot-notated key strings with string interpolation and default fallback text support.
 * Examples:
 *   getTranslation('mr', 'patient.welcome', { name: 'Radhika' })
 *   getTranslation('hi', 'doctor.todayQueue', 'Consultation Queue')
 *   getTranslation('mr', 'sync.pendingQueue', '{count} in queue', { count: 3 })
 */
export function getTranslation(lang = 'en', path = '', fallbackOrParams = null, maybeParams = {}) {
  if (!path || typeof path !== 'string') return '';

  const activeLang = translations[lang] ? lang : 'en';
  const dictionary = translations[activeLang] || translations.en;
  const keys = path.split('.');

  let defaultFallback = null;
  let interpolationParams = {};

  if (typeof fallbackOrParams === 'string') {
    defaultFallback = fallbackOrParams;
    if (typeof maybeParams === 'object' && maybeParams !== null) {
      interpolationParams = maybeParams;
    }
  } else if (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) {
    interpolationParams = fallbackOrParams;
  }

  let value = dictionary;
  let found = true;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      found = false;
      break;
    }
  }

  // Fallback to English if translation key is missing in selected non-English language
  if (!found && activeLang !== 'en') {
    let fallbackValue = translations.en;
    let fallbackFound = true;
    for (const fKey of keys) {
      if (fallbackValue && typeof fallbackValue === 'object' && fKey in fallbackValue) {
        fallbackValue = fallbackValue[fKey];
      } else {
        fallbackFound = false;
        break;
      }
    }
    if (fallbackFound) {
      value = fallbackValue;
      found = true;
    }
  }

  // If still not found, return the inline fallback string or the raw key path
  let finalResult = found ? value : (defaultFallback !== null ? defaultFallback : path);

  // Handle parameter interpolation: {name}, {count}, {date} on resolved or fallback string
  if (typeof finalResult === 'string' && Object.keys(interpolationParams).length > 0) {
    let result = finalResult;
    for (const [paramKey, paramVal] of Object.entries(interpolationParams)) {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    }
    return result;
  }

  return finalResult || defaultFallback || path;
}

/**
 * Helper to localize patient triage status badges cleanly in UI without altering database enums.
 */
export function formatLocalizedStatus(status = '', t) {
  if (!status) return '';
  const s = String(status).trim();
  if (s.includes('Red') || s.toLowerCase() === 'urgent' || s.toLowerCase() === 'critical') {
    return t ? t('asha.urgentRed', 'Urgent / Red') : 'Urgent / Red';
  }
  if (s.includes('Yellow') || s.toLowerCase() === 'monitoring' || s.toLowerCase() === 'high priority') {
    return t ? t('asha.monitoringYellow', 'Monitoring / Yellow') : 'Monitoring / Yellow';
  }
  if (s.includes('Green') || s.toLowerCase() === 'stable' || s.toLowerCase() === 'routine') {
    return t ? t('asha.stableGreen', 'Stable / Green') : 'Stable / Green';
  }
  if (s.toLowerCase() === 'completed') {
    return t ? t('common.completed', 'Completed') : 'Completed';
  }
  if (s.toLowerCase() === 'pending') {
    return t ? t('common.pending', 'Pending') : 'Pending';
  }
  return s;
}

/**
 * Helper to localize patient categories cleanly in UI without altering database values.
 */
export function formatLocalizedCategory(category = '', t) {
  if (!category) return '';
  switch (category) {
    case 'ALL':
      return t ? t('asha.allPatients', 'All Patients') : 'All Patients';
    case 'PREGNANT_MOTHER':
      return t ? t('asha.pregnantMothers', 'Pregnant Mothers (ANC)') : 'Pregnant Mothers (ANC)';
    case 'HIGH_RISK_ANC':
      return t ? t('asha.highRiskMothers', 'High-Risk Mothers') : 'High-Risk Mothers';
    case 'INFANT':
      return t ? t('asha.infants', 'Infants (0-1 yr)') : 'Infants (0-1 yr)';
    case 'CHRONIC_CARE':
      return t ? t('asha.chronicCare', 'Chronic Care (HTN/Diabetes)') : 'Chronic Care (HTN/Diabetes)';
    case 'ELDERLY':
      return t ? t('asha.elderly', 'Elderly (60+)') : 'Elderly (60+)';
    default:
      return category;
  }
}

/**
 * Helper to localize numbers or status badges cleanly.
 */
export function formatLocalizedNumber(num, lang = 'en') {
  if (num === null || num === undefined) return '';
  return new Intl.NumberFormat(lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN').format(num);
}
