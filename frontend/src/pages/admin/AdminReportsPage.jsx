import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_ADMIN_DATA } from '../../services/mockData';
import { 
  FileSpreadsheet, 
  Download, 
  FileText, 
  Printer, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  Filter,
  Eye
} from 'lucide-react';

export default function AdminReportsPage() {
  const { t } = useTranslation();
  const templates = MOCK_ADMIN_DATA.reportsTemplates || [];
  const metrics = MOCK_ADMIN_DATA.healthMetrics || {};
  const facilities = MOCK_ADMIN_DATA.facilitiesNetwork || [];

  const [selectedTemplate, setSelectedTemplate] = useState('NHM-MH-PUN-M12');
  const [reportPeriod, setReportPeriod] = useState('2026-03');
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  // 1. Genuine CSV Export Download Trigger
  const handleExportCSV = (templateCode) => {
    let csvContent = 'Facility Name,Facility Type,Block,Total Beds,Occupied Beds,Oxygen Cylinders,Medicine Stock Rating\n';
    facilities.forEach((f) => {
      csvContent += `"${f.name}","${f.type}","${f.block}",${f.bedsTotal},${f.bedsOccupied},${f.oxygenCylinders},"${f.medicineStockRating}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AarogyaSync_${templateCode}_${reportPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`CSV Report for ${templateCode} downloaded successfully.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // 2. Genuine JSON Export Download Trigger
  const handleExportJSON = (templateCode) => {
    const jsonPayload = {
      template: templateCode,
      period: reportPeriod,
      generatedAt: new Date().toISOString(),
      district: 'Pune Zilla Parishad - Rural Health Division',
      metrics,
      facilities: facilities.map((f) => ({
        name: f.name,
        type: f.type,
        beds: `${f.bedsOccupied}/${f.bedsTotal}`,
        oxygenCylinders: f.oxygenCylinders,
        medicineStockRating: f.medicineStockRating,
        doctorInCharge: f.doctorInCharge
      })),
      surveillanceOutbreaks: MOCK_ADMIN_DATA.diseaseSurveillance
    };

    const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AarogyaSync_${templateCode}_${reportPeriod}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Structured JSON data bundle for ${templateCode} exported.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40">
              National Health Mission • Statutory Reporting Engine
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1.5">
              {t('admin.reportsExport')}
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/80 mt-1">
              Generate official National Health Mission (NHM) returns, epidemiological audit datasets, and export structured data in CSV and JSON formats.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bulletin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Download Notification */}
      {downloadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{downloadSuccess}</span>
        </div>
      )}

      {/* 2. Report Generation Configuration Form */}
      <div className="rural-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Generate Custom National Health Mission Report</span>
          </h2>
          <span className="text-xs text-slate-500">ABDM Compliant Exports</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Report Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.code}>
                  {tpl.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Reporting Period</label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
            >
              <option value="2026-03">March 2026 (Current Month)</option>
              <option value="2026-02">February 2026</option>
              <option value="2026-01">January 2026</option>
              <option value="2025-Q4">Q4 2025 (Oct - Dec)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Facility Scope</label>
            <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium">
              <option value="ALL">All 14 PHCs & 68 Sub-Centres</option>
              <option value="KHED">Khed CHC Sub-Division</option>
              <option value="AMBEGAON">Ambegaon Tribal Pocket</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => handleExportCSV(selectedTemplate)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Structured CSV</span>
          </button>
          <button
            onClick={() => handleExportJSON(selectedTemplate)}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Machine JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Executive Brief</span>
          </button>
        </div>
      </div>

      {/* 3. Official NHM Templates Library */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-purple-600" />
          <span>Statutory Health Mission Templates</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="rural-card p-5 space-y-3 hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-900">
                    {tpl.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Frequency: {tpl.frequency}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2">{tpl.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{tpl.summary}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Last Generated: {tpl.lastGenerated}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportCSV(tpl.code)}
                    className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => handleExportJSON(tpl.code)}
                    className="px-3 py-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Structured Preview Table */}
      <div className="rural-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-600" />
            <span>Structured Data Preview (NHM Monthly Consolidation)</span>
          </h2>
          <span className="text-xs text-slate-500">Live Snapshot</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Facility Name</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Block</th>
                <th className="p-2.5">Beds (Occupied / Total)</th>
                <th className="p-2.5">Oxygen Readiness</th>
                <th className="p-2.5">Medicine Stock Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facilities.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-2.5 font-bold text-slate-900">{f.name}</td>
                  <td className="p-2.5 text-slate-600">{f.type}</td>
                  <td className="p-2.5 text-slate-600">{f.block}</td>
                  <td className="p-2.5 font-semibold text-slate-800">{f.bedsOccupied} / {f.bedsTotal}</td>
                  <td className="p-2.5 text-blue-700 font-bold">{f.oxygenCylinders} Cylinders</td>
                  <td className="p-2.5 text-emerald-700 font-bold">{f.medicineStockRating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
