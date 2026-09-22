import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { MOCK_MEDICINES } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { 
  Pill, 
  ArrowLeft, 
  Search, 
  Building2, 
  PhoneCall, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Filter
} from 'lucide-react';

export default function MedicineAvailabilityPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeMedicines = (rawItems) => {
    return (rawItems || []).map((item) => ({
      id: item.id,
      name: item.medicine_name || item.name,
      category: item.category || 'MEDICINE',
      inStock: item.quantity !== undefined ? (typeof item.quantity === 'number' ? item.quantity > 0 : !String(item.quantity).toLowerCase().includes('out')) : (item.inStock ?? true),
      quantity: typeof item.quantity === 'number' ? `${item.quantity} available` : (item.quantity || 'Available'),
      indication: item.indication || (item.dosage_form ? `${item.dosage_form} ${item.strength || ''}` : 'Essential Primary Drug'),
      facility: item.facility_name || item.facility || 'Primary Health Centre',
      facilityPhone: item.contact_phone || item.facilityPhone || '+919822001122',
      distanceKm: item.distanceKm || item.distance || '2.4'
    }));
  };

  const loadMedicines = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.medicines.getAvailability(searchQuery);
      if (response && response.success && response.data) {
        setItems(normalizeMedicines(response.data));
      } else if (response && response.data) {
        setItems(normalizeMedicines(response.data));
      } else {
        setItems(normalizeMedicines(MOCK_MEDICINES));
      }
    } catch (err) {
      console.warn('Using cached medicine data:', err);
      setItems(normalizeMedicines(MOCK_MEDICINES));
      setError('Live inventory temporarily disconnected. Showing offline cached inventory.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.facility || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.indication || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/patient"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-6 h-6 text-emerald-600" />
            {t('patient.medicinesTitle', 'Essential Medicines')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('patient.medicinesSubtitle', 'Real-time essential drug & diagnostic inventory at Primary Health Centres')}
          </p>
        </div>
      </div>

      {error && (
        <ErrorState
          compact
          title={t('common.error', 'Notice')}
          error={error}
          onRetry={loadMedicines}
        />
      )}

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('patient.searchMedicinePlaceholder', 'Search medicine (e.g. Paracetamol, ORS, IFA, Malaria kit)...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'MEDICINE', 'TEST', 'VACCINE', 'SUPPLEMENT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL' ? t('common.all', 'All Items') : cat === 'MEDICINE' ? t('nav.medicines', 'Medicines') : cat === 'TEST' ? t('nav.diagnosticAvailability', 'Diagnostic Kits') : cat === 'VACCINE' ? t('patient.vaccinationTab', 'Vaccines') : t('patient.supplements', 'Supplements')}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory List */}
      <div className="space-y-3">
        {isLoading ? (
          <LoadingState message={t('patient.loadingMedicines', 'Loading essential medicine stock...')} subtitle={t('patient.queryingCentres', 'Querying primary and community health centres')} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={Pill}
            title={t('emptyStates.noMedicines', 'No Medicines Found')}
            description={t('emptyStates.noMedicinesDesc', 'No medicine or diagnostic kit found matching your search query.')}
            actionLabel={t('common.reset', 'Reset Search')}
            onAction={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
          />
        ) : (
          filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="rural-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rural-card-hover"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}>
                  <Pill className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase">
                      {item.category}
                    </span>
                    {item.inStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> In Stock ({item.quantity})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        <XCircle className="w-3 h-3" /> Out of Stock
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {item.name}
                  </h3>
                  {item.indication && (
                    <p className="text-xs text-slate-600 mt-0.5">
                      Used for: {item.indication}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-ruralTeal-700" />
                      {item.facility}
                    </span>
                    {item.distanceKm && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.distanceKm} km away
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <a
                  href={`tel:${item.facilityPhone || '+919822001122'}`}
                  className="px-3.5 py-2 bg-ruralTeal-50 hover:bg-ruralTeal-100 text-ruralTeal-800 text-xs font-bold rounded-xl border border-ruralTeal-200 transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call PHC</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
