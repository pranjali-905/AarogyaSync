import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "../../hooks/useTranslation";
import { MOCK_PATIENT_MALE } from "../../services/mockData";
import {
  Heart, Activity, Stethoscope, PhoneCall, AlertTriangle, Calendar,
  ShieldCheck, ChevronRight, Pill, UserCheck, MapPin, Video, FileText,
  Thermometer, Droplets, Wind, BellRing, CheckCircle2, Clock, ArrowRight
} from "lucide-react";

// ─── Simple SVG Pie Chart ──────────────────────────────────────────────────────
function PieChart({ segments, size = 120 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;
  const r = 40, cx = 50, cy = 50;

  const getArc = (start, value) => {
    const startAngle = (start / total) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((start + value) / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = value / total > 0.5 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {segments.map((seg, i) => {
        const path = getArc(cumulative, seg.value);
        cumulative += seg.value;
        return <path key={i} d={path} fill={seg.color} opacity={0.9} />;
      })}
      <circle cx={cx} cy={cy} r={22} fill="white" />
    </svg>
  );
}

// ─── Horizontal Progress Bar ───────────────────────────────────────────────────
function HealthBar({ label, value, max, unit, color, icon: Icon, status }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color.bg}`}>
        <Icon className={`w-5 h-5 ${color.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-slate-700">{label}</span>
          <span className={`text-xs font-black ${color.icon}`}>{value} <span className="text-slate-400 font-normal">{unit}</span></span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${color.bar}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">{status}</p>
      </div>
    </div>
  );
}

export default function MalePatientDashboard() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("health");

  const patient = {
    ...MOCK_PATIENT_MALE,
    fullName: currentUser?.fullName || currentUser?.full_name || MOCK_PATIENT_MALE.fullName,
    abhaId: currentUser?.abhaId || currentUser?.abha_id || MOCK_PATIENT_MALE.abhaId,
    village: currentUser?.village || MOCK_PATIENT_MALE.village
  };

  const { upcomingAppointment, healthStatus } = patient;

  const pieSegments = [
    { label: "Good", value: 62, color: "#0d9488" },
    { label: "Monitor", value: 25, color: "#f59e0b" },
    { label: "Attention", value: 13, color: "#ef4444" }
  ];

  const vitals = [
    { label: "Blood Pressure", value: 124, max: 180, unit: "mmHg", icon: Heart, color: { bg: "bg-rose-50", icon: "text-rose-600", bar: "bg-rose-500" }, status: "Slightly high — reduce salt" },
    { label: "Pulse Rate", value: 78, max: 120, unit: "bpm", icon: Activity, color: { bg: "bg-blue-50", icon: "text-blue-600", bar: "bg-blue-500" }, status: "Normal range" },
    { label: "Oxygen Level", value: 97, max: 100, unit: "%", icon: Wind, color: { bg: "bg-emerald-50", icon: "text-emerald-600", bar: "bg-emerald-500" }, status: "Healthy" },
    { label: "Blood Sugar", value: 112, max: 200, unit: "mg/dL", icon: Droplets, color: { bg: "bg-amber-50", icon: "text-amber-600", bar: "bg-amber-500" }, status: "Pre-diabetic range — watch diet" },
    { label: "Temperature", value: 98, max: 104, unit: "°F", icon: Thermometer, color: { bg: "bg-slate-50", icon: "text-slate-600", bar: "bg-slate-400" }, status: "Normal" }
  ];

  const quickActions = [
    { to: "/patient/doctor", icon: Stethoscope, label: "See Doctor", sublabel: "Book appointment", color: "from-blue-600 to-blue-700" },
    { to: "/patient/teleconsult", icon: Video, label: "Video Call", sublabel: "Talk to doctor now", color: "from-teal-600 to-teal-700" },
    { to: "/patient/emergency", icon: PhoneCall, label: "Emergency 108", sublabel: "Ambulance & help", color: "from-rose-600 to-rose-700" },
    { to: "/patient/health", icon: Heart, label: "My Health", sublabel: "Vitals & reports", color: "from-emerald-600 to-emerald-700" },
    { to: "/patient/medicines-followup", icon: Pill, label: "My Medicines", sublabel: "Today's doses", color: "from-violet-600 to-violet-700" },
    { to: "/patient/backpack", icon: FileText, label: "Health Card", sublabel: "All my records", color: "from-amber-600 to-amber-700" }
  ];

  const reminders = [
    { icon: Pill, text: "Take Metformin 500mg after breakfast", time: "Today 9:00 AM", done: true, color: "text-emerald-600 bg-emerald-50" },
    { icon: Calendar, text: "Blood sugar test at PHC Khed", time: "Tomorrow 8:00 AM", done: false, color: "text-blue-600 bg-blue-50" },
    { icon: Stethoscope, text: "Follow-up with Dr. Ramesh Kulkarni", time: "23 Sep, 11:00 AM", done: false, color: "text-violet-600 bg-violet-50" }
  ];

  return (
    <div className="w-full max-w-full space-y-5 pb-8 animate-in fade-in duration-300">

      {/* ── GREETING BANNER ── */}
      <div className="w-full bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-52 h-52 bg-white/5 rounded-full" />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 bg-teal-400/10 rounded-full" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/15 border border-white/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                ABHA: {patient.abhaId}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
                ● Health Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Namaste, {(patient.fullName || "Patient").split(" ")[0]} 🙏
            </h1>
            <p className="text-sm text-teal-200 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />{patient.village} Village
              <span className="mx-1 text-white/30">•</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" />ASHA: {patient.assignedAsha?.name || "Sunita Tai"}
            </p>
          </div>
          {/* Health Score Badge */}
          <div className="text-center shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center mx-auto sm:mx-0">
              <span className="text-2xl font-black text-emerald-300">72</span>
              <span className="text-[10px] text-teal-200 font-semibold">Health Score</span>
            </div>
            <p className="text-[10px] text-teal-300 mt-1">Good ✓</p>
          </div>
        </div>
      </div>

      {/* ── URGENT REMINDER (if any) ── */}
      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start gap-3 shadow-sm">
        <div className="p-2 bg-amber-200 text-amber-800 rounded-xl shrink-0">
          <BellRing className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-amber-900 text-sm">Today's Reminder</p>
          <p className="text-xs text-amber-800 mt-0.5">Blood sugar test tomorrow at PHC Khed — keep fast from midnight. ASHA Sunita Tai will accompany you.</p>
        </div>
        <Link to="/patient/health" className="text-xs font-bold text-amber-700 hover:text-amber-900 whitespace-nowrap pt-0.5">
          View →
        </Link>
      </div>

      {/* ── QUICK ACTION GRID ── */}
      <div>
        <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
          <span>⚡</span> What would you like to do?
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map(({ to, icon: Icon, label, sublabel, color }) => (
            <Link key={to} to={to} className="group flex flex-col items-center gap-2 text-center">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">{label}</p>
                <p className="text-[10px] text-slate-500 leading-tight hidden sm:block">{sublabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── HEALTH OVERVIEW: Tabs ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab header */}
        <div className="flex border-b border-slate-100">
          {[
            { id: "health", label: "🫀 My Vitals" },
            { id: "chart", label: "📊 Health Chart" },
            { id: "medicines", label: "💊 Medicines" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${activeTab === tab.id ? "text-teal-700 border-b-2 border-teal-600 bg-teal-50/50" : "text-slate-500 hover:text-slate-700"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: Vitals ── */}
        {activeTab === "health" && (
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-500 font-medium">Last checked by ASHA Sunita Tai on 20 Sep 2026</p>
            <div className="space-y-4">
              {vitals.map((v) => (
                <HealthBar key={v.label} {...v} />
              ))}
            </div>
            <Link to="/patient/health" className="flex items-center justify-center gap-2 w-full py-2.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-teal-700 text-xs font-bold transition-colors mt-2">
              View Full Health Report <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* ── TAB: Health Chart ── */}
        {activeTab === "chart" && (
          <div className="p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Your Overall Health at a Glance</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Pie Chart */}
              <div className="shrink-0">
                <PieChart segments={pieSegments} size={140} />
              </div>
              {/* Legend */}
              <div className="space-y-3 flex-1">
                {pieSegments.map((seg) => (
                  <div key={seg.label} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          {seg.label === "Good" ? "✅ Healthy (Good)" : seg.label === "Monitor" ? "⚠️ Monitor (Check Soon)" : "🔴 Needs Attention"}
                        </span>
                        <span className="text-sm font-black" style={{ color: seg.color }}>{seg.value}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${seg.value}%`, backgroundColor: seg.color }} />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mt-2">
                  <p className="text-[11px] text-amber-800 font-semibold">💡 BP and Blood Sugar need attention. Eat less salt & sugar. Walk 30 min daily.</p>
                </div>
              </div>
            </div>

            {/* Monthly trend bars */}
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-700 mb-3">Health Score — Last 6 Months</p>
              <div className="flex items-end gap-2 h-20">
                {[
                  { month: "Apr", score: 58 }, { month: "May", score: 63 }, { month: "Jun", score: 60 },
                  { month: "Jul", score: 67 }, { month: "Aug", score: 70 }, { month: "Sep", score: 72 }
                ].map(({ month, score }) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-slate-500 font-bold">{score}</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-teal-600 to-teal-400 transition-all"
                      style={{ height: `${(score / 100) * 72}px` }}
                    />
                    <span className="text-[9px] text-slate-400">{month}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-2">📈 Your health score improved by 14 points in 6 months. Keep it up!</p>
            </div>
          </div>
        )}

        {/* ── TAB: Medicines ── */}
        {activeTab === "medicines" && (
          <div className="p-5 space-y-3">
            <p className="text-xs text-slate-500 mb-1">Prescribed by Dr. Ramesh Kulkarni • Tap to mark as taken</p>
            {[
              { name: "Metformin 500mg", time: "After Breakfast", status: "taken", icon: "💊", note: "For blood sugar" },
              { name: "Amlodipine 5mg", time: "After Dinner", status: "pending", icon: "💊", note: "For blood pressure" },
              { name: "Vitamin D3", time: "After Lunch (Sunday)", status: "pending", icon: "🌞", note: "Once a week" }
            ].map((med, i) => (
              <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border ${med.status === "taken" ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"}`}>
                <span className="text-2xl">{med.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{med.name}</p>
                  <p className="text-[11px] text-slate-500">{med.time} <span className="text-slate-400">•</span> {med.note}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${med.status === "taken" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {med.status === "taken" ? "✓ Taken" : "⏰ Pending"}
                </span>
              </div>
            ))}
            <Link to="/patient/medicines-followup" className="flex items-center justify-center gap-2 w-full py-2.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl text-violet-700 text-xs font-bold transition-colors">
              View All Medicines & Refill <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* ── UPCOMING APPOINTMENT ── */}
      {upcomingAppointment && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Upcoming Appointment</p>
              <p className="font-bold text-slate-900 text-sm">{upcomingAppointment.doctor}</p>
              <p className="text-xs text-slate-600">{upcomingAppointment.date} at {upcomingAppointment.time} • {upcomingAppointment.facility}</p>
            </div>
          </div>
          <Link to="/patient/doctor" className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl whitespace-nowrap">
            View →
          </Link>
        </div>
      )}

      {/* ── TODAY'S REMINDERS ── */}
      <div>
        <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-700" /> Today's Tasks
        </h2>
        <div className="space-y-2.5">
          {reminders.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border ${r.done ? "bg-slate-50 border-slate-100 opacity-70" : "bg-white border-slate-200 shadow-xs"}`}>
                <div className={`w-9 h-9 rounded-xl ${r.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${r.done ? "line-through text-slate-400" : "text-slate-800"}`}>{r.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{r.time}</p>
                </div>
                {r.done && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── EMERGENCY HELP ── */}
      <Link to="/patient/emergency" className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg hover:from-rose-700 hover:to-rose-800 transition-all group">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-base">Emergency Help — Call 108</p>
            <p className="text-xs text-rose-100">Ambulance • Doctor on Call • ASHA Alert</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
