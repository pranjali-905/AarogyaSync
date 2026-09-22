import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { apiService } from '../../services/apiService';
import { MOCK_DIAGNOSTIC_TESTS } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Activity,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  Calendar,
  Filter
} from 'lucide-react';

export default function DiagnosticAvailabilityPage() {
  const { t } = useTranslation();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'HEMATOLOGY', 'BIOCHEMISTRY', 'URINALYSIS', 'INFECTIOUS', 'RADIOLOGY', 'CARDIOLOGY', 'RAPID_TEST', 'MATERNAL'];

  const normalizeDiagnostics = (rawList) => {
    return (rawList || []).map((t) => ({
      id: t.id,
      testName: t.test_name || t.name || t.testName,
      category: t.category || 'GENERAL',
      indication: t.indication || (t.normal_range ? `Ref Range: ${t.normal_range}` : 'Essential Diagnostic Test'),
      turnaroundTime: t.turnaround_hours ? `${t.turnaround_hours} Hours` : t.turnaroundTime || 'Same Day',
      sampleType: t.sample_type || t.sampleType || 'Diagnostic Specimen',
      inStock: t.is_available !== undefined ? t.is_available : (t.inStock ?? true),
      facility: t.facility_name || t.facility || 'Primary Health Centre'
    }));
  };

  const loadDiagnostics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.diagnostics.getAvailability(searchQuery);
      if (response && response.success && response.data) {
        setTests(normalizeDiagnostics(response.data));
      } else if (response && response.data) {
        setTests(normalizeDiagnostics(response.data));
      } else {
        setTests(normalizeDiagnostics(MOCK_DIAGNOSTIC_TESTS));
      }
    } catch (err) {
      console.warn('Using cached diagnostic data:', err);
      setTests(normalizeDiagnostics(MOCK_DIAGNOSTIC_TESTS));
      setError('Live lab directory temporarily unavailable. Displaying local catalogue.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadDiagnostics();
  }, [loadDiagnostics]);

  const filteredTests = tests.filter((test) => {
    const matchesCategory = selectedCategory === 'ALL' || test.category === selectedCategory;
    const matchesSearch =
      (test.testName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.indication || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.facility || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/patient"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-amber-600" />
              {t('patient.diagnosticsTitle', 'Diagnostic Availability')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('patient.diagnosticsSubtitle', 'Live laboratory test availability across PHC, CHC & Sub-Centre network')}
            </p>
          </div>
        </div>

        <Link
          to="/patient/backpack"
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-colors"
        >
          {t('patient.viewPastReports', 'View Past Reports')}
        </Link>
      </div>

      {error && (
        <ErrorState
          compact
          title={t('common.error', 'Notice')}
          error={error}
          onRetry={loadDiagnostics}
        />
      )}

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('patient.searchDiagnosticsPlaceholder', 'Search diagnostic tests by name, indication, or health centre...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL' ? t('common.all', 'All Tests') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Content */}
      {isLoading ? (
        <LoadingState message={t('patient.loadingDiagnostics', 'Checking laboratory diagnostic capacity...')} subtitle={t('patient.connectingLabNetwork', 'Connecting with rural lab network')} />
      ) : filteredTests.length === 0 ? (
        <EmptyState
          icon={Activity}
          title={t('emptyStates.noDiagnostics', 'No Diagnostic Tests Found')}
          description={t('emptyStates.noDiagnosticsDesc', 'No tests match your current search query or filter.')}
          actionLabel={t('common.reset', 'Clear Filter')}
          onAction={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="rural-card p-5 flex flex-col justify-between rural-card-hover border border-slate-200/80"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-200">
                      {test.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{test.testName}</h3>
                  </div>

                  {test.inStock ? (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Available
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-800 text-xs font-bold rounded-lg border border-rose-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Limited Kit
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">Clinical Indication:</span>
                    <span className="font-bold text-slate-800">{test.indication}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">Sample Required:</span>
                    <span className="font-semibold text-slate-800">{test.sampleType}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">Turnaround Time:</span>
                    <span className="font-bold text-emerald-700">{test.turnaroundTime}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  Available at: <strong>{test.facility}</strong>
                </span>

                <Link
                  to="/patient/appointments"
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg transition-colors"
                >
                  Book OPD Slip
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
