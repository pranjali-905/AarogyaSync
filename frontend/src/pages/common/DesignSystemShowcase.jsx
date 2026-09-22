import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  StatCard, 
  ActionCard,
  Badge, 
  Alert, 
  Input, 
  Textarea, 
  SearchInput, 
  Select, 
  Modal, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell, 
  LoadingSpinner, 
  Skeleton, 
  CardSkeleton, 
  TableSkeleton, 
  EmptyState, 
  ErrorState 
} from '../../components/ui';
import { 
  Sparkles, 
  HeartPulse, 
  PhoneCall, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Pill, 
  Baby, 
  Stethoscope, 
  Users, 
  Activity, 
  Send, 
  Search,
  FileText
} from 'lucide-react';

export default function DesignSystemShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const samplePatients = [
    { name: 'Radhika Shinde', age: 24, abha: '91-4521-8890-1234', village: 'Nigdale', status: 'ANC 3 Due', priority: 'GREEN' },
    { name: 'Meena Waghmare', age: 22, abha: '91-8821-3310-9871', village: 'Nigdale', status: 'BP >= 145/95', priority: 'RED' },
    { name: 'Tukaram Patil', age: 48, abha: '91-3142-9901-5678', village: 'Khed', status: 'Hypertension Check', priority: 'YELLOW' },
    { name: 'Baban Rao', age: 62, abha: '91-7761-0021-4412', village: 'Bhimashankar', status: 'SpO2 93% Review', priority: 'YELLOW' }
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-2 animate-in fade-in duration-300">
      {/* Hero Title */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-ruralTeal-100 text-ruralTeal-900 border border-ruralTeal-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-ruralTeal-700" />
            Healthcare Component Specification
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-ruralTeal-100 text-ruralTeal-800">
            AarogyaSync UI/UX v1.0
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          AarogyaSync Design System & Component Library
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Accessible, trustworthy, high-contrast healthcare design tokens and atomic components engineered for rural smartphone users, frontline ASHA workers, and clinical practitioners.
        </p>
      </div>

      {/* 1. Visual Identity & Color Tokens */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-ruralTeal-700 rounded-full inline-block"></span>
          1. Healthcare Color Tokens & Semantics
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Curated clinical palette conforming to WCAG 2.1 AAA contrast on key elements:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="h-14 rounded-lg bg-ruralTeal-700"></div>
            <div className="text-xs font-bold text-slate-800">Rural Teal (Primary)</div>
            <div className="text-[11px] font-mono text-slate-500">#0f766e • Brand Trust</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="h-14 rounded-lg bg-emerald-600"></div>
            <div className="text-xs font-bold text-slate-800">Clinical Emerald</div>
            <div className="text-[11px] font-mono text-slate-500">#059669 • Synced / Normal</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="h-14 rounded-lg bg-amber-600"></div>
            <div className="text-xs font-bold text-slate-800">Warm Saffron</div>
            <div className="text-[11px] font-mono text-slate-500">#d97706 • Pending / Alert</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="h-14 rounded-lg bg-rose-600"></div>
            <div className="text-xs font-bold text-slate-800">Emergency Red</div>
            <div className="text-[11px] font-mono text-slate-500">#dc2626 • 108 Ambulance</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="h-14 rounded-lg bg-rose-500"></div>
            <div className="text-xs font-bold text-slate-800">Maternal Rose</div>
            <div className="text-[11px] font-mono text-slate-500">#f43f5e • ANC Tracking</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="h-14 rounded-lg bg-slate-900"></div>
            <div className="text-xs font-bold text-slate-800">Clinical Slate</div>
            <div className="text-[11px] font-mono text-slate-500">#0f172a • High Contrast</div>
          </div>
        </div>
      </section>

      {/* 2. Typography Scale */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-ruralTeal-700 rounded-full inline-block"></span>
          2. Typography Scale
        </h2>

        <Card className="p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xs text-slate-400 font-mono">.type-display</span>
            <span className="type-display">National Rural Health Mission</span>
          </div>
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xs text-slate-400 font-mono">.type-h1</span>
            <span className="type-h1">Primary Health Centre Consultation</span>
          </div>
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xs text-slate-400 font-mono">.type-h2</span>
            <span className="type-h2">Antenatal Care (ANC) Trimester Schedule</span>
          </div>
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xs text-slate-400 font-mono">.type-body</span>
            <span className="type-body">Essential drugs such as ORS, Paracetamol, and Iron Folic Acid are stocked locally.</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xs text-slate-400 font-mono">.type-mono-id</span>
            <span className="type-mono-id">ABHA ID: 91-4521-8890-1234</span>
          </div>
        </Card>
      </section>

      {/* 3. Button Component Matrix */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-ruralTeal-700 rounded-full inline-block"></span>
          3. Button Variants & Touch Targets
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Supports 48px minimum touch targets for elderly villagers and one-tap emergency access:
        </p>

        <Card className="p-5 sm:p-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Variants</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="danger" leftIcon={<PhoneCall className="w-4 h-4" />}>
                Emergency 108
              </Button>
              <Button variant="warning">Sync Alert</Button>
              <Button variant="maternal" leftIcon={<HeartPulse className="w-4 h-4" />}>
                Maternal Care
              </Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sizes (Large has 48px touch target)</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small (sm)</Button>
              <Button size="md">Medium (md)</Button>
              <Button size="lg">Large Touch Target (48px)</Button>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">States</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                isLoading={buttonLoading}
                onClick={() => {
                  setButtonLoading(true);
                  setTimeout(() => setButtonLoading(false), 2000);
                }}
              >
                Click to Test Loader
              </Button>
              <Button variant="primary" disabled>Disabled Button</Button>
              <Button variant="outline" rightIcon={<Send className="w-4 h-4" />}>With Right Icon</Button>
            </div>
          </div>
        </Card>
      </section>

      {/* 4. Badges & Indicators */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-ruralTeal-700 rounded-full inline-block"></span>
          4. Semantic Badges & Live Status Indicators
        </h2>

        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="success" pulse>Online Synced</Badge>
            <Badge variant="warning" pulse>Offline Queued (3)</Badge>
            <Badge variant="danger" pulse>Critical RED Triage</Badge>
            <Badge variant="info">Teleconsult Scheduled</Badge>
            <Badge variant="maternal">Trimester 3 (PMSMA)</Badge>
            <Badge variant="teal">ABHA Verified</Badge>
            <Badge variant="neutral">General Villager</Badge>
          </div>
        </Card>
      </section>

      {/* 5. Alerts Component */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-ruralTeal-700 rounded-full inline-block"></span>
          5. Accessible Alerts
        </h2>

        <div className="space-y-3">
          {showAlert && (
            <Alert
              variant="danger"
              title="Urgent Maternal Flag: Severe Preeclampsia Risk"
              onClose={() => setShowAlert(false)}
              action={
                <Button size="sm" variant="danger" leftIcon={<PhoneCall className="w-3.5 h-3.5" />}>
                  Dispatch 108 Ambulance to Nigdale
                </Button>
              }
            >
              Patient BP reading of 152/98 with persistent frontal headache. Immediate Primary Health Centre transfer mandated under PMSMA emergency protocol.
            </Alert>
          )}

          <Alert variant="warning" title="Offline Synchronization Advisory">
            You are operating in offline field mode. All recorded vitals, patient registrations, and triage logs are cryptographically queued in your local IndexedDB storage.
          </Alert>

          <Alert variant="success" title="Mission Indradhanush Vaccine Camp">
            Oral Polio Vaccine (OPV) and Pentavalent vaccine drive successfully concluded at Nigdale Sub-Centre. 100% target infant coverage reached.
          </Alert>

          <Alert variant="info" title="Clinical Decision Disclaimer">
            This digital triage calculation assists frontline healthcare workers and does not replace the diagnosis of a certified Medical Officer.
          </Alert>
        </div>
      </section>

      {/* 6. Form Inputs & Selects */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-ruralTeal-700 rounded-full inline-block"></span>
          6. Inputs, Search, and Selects
        </h2>

        <Card className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Citizen Full Name"
              placeholder="e.g. Radhika Tukaram Shinde"
              required
              helperText="As printed on Aadhaar or Ayushman Bharat Health Account (ABHA)"
            />

            <Input
              label="Mobile Number"
              placeholder="98XXXXXXXX"
              required
              leftIcon={<PhoneCall className="w-4 h-4" />}
            />

            <Input
              label="SpO2 Oxygen Level"
              placeholder="98"
              error="Oxygen saturation below 92% requires immediate medical attention"
              defaultValue="89"
            />

            <Select
              label="Primary Health Centre (PHC)"
              options={[
                { value: 'khed', label: 'Khed Community Health Centre' },
                { value: 'bhimashankar', label: 'Bhimashankar Primary Health Centre' },
                { value: 'nigdale', label: 'Nigdale Sub-Centre Health Post' }
              ]}
              helperText="Nearest 24x7 government healthcare facility"
            />
          </div>

          <div className="pt-2">
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue('')}
              placeholder="Search medicine, tests, or patient by ABHA ID..."
            />
          </div>

          <div className="pt-2">
            <Textarea
              label="Doctor Clinical Examination Notes"
              placeholder="Enter observed symptoms, recommended medications, and dietary guidelines..."
            />
          </div>
        </Card>
      </section>

      {/* 7. Card Components: StatCard & ActionCard */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-ruralTeal-700 rounded-full inline-block"></span>
          7. Card Patterns (StatCard & ActionCard)
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Total Citizens"
            value="8,420"
            icon={<Users className="w-5 h-5" />}
            trend="↑ 124 this week"
            color="teal"
          />
          <StatCard
            label="Maternal Track"
            value="48"
            icon={<Baby className="w-5 h-5" />}
            trend="12 in 3rd trimester"
            color="rose"
          />
          <StatCard
            label="Offline Queue"
            value="3"
            icon={<Clock className="w-5 h-5" />}
            subtext="IndexedDB synced"
            color="amber"
          />
          <StatCard
            label="PHC Paracetamol"
            value="1,200"
            icon={<Pill className="w-5 h-5" />}
            trend="In Stock"
            color="emerald"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <ActionCard
            icon={<HeartPulse className="w-5 h-5" />}
            title="Antenatal Care (ANC)"
            description="Access your scheduled trimester checkups, ultrasound records, and hospital bag checklist."
            badge="Trimester 3"
            onClick={() => alert('Clicked Maternal Care Action Card')}
          />
          <ActionCard
            icon={<Baby className="w-5 h-5" />}
            title="Child Immunization"
            description="Universal Immunization Programme schedule for BCG, OPV, Pentavalent, and Measles vaccines."
            badge="Indradhanush"
            onClick={() => alert('Clicked Child Immunization Action Card')}
          />
          <ActionCard
            icon={<Stethoscope className="w-5 h-5" />}
            title="Teleconsultation"
            description="Direct WebRTC video link with Khed CHC Medical Officer Dr. Ramesh Kulkarni."
            badge="Online"
            onClick={() => alert('Clicked Teleconsultation Action Card')}
          />
        </div>
      </section>

      {/* 8. Responsive Table Component */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-ruralTeal-700 rounded-full inline-block"></span>
          8. Responsive Healthcare Table
        </h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient / Citizen</TableHead>
              <TableHead>ABHA ID</TableHead>
              <TableHead>Village</TableHead>
              <TableHead>Condition / Flag</TableHead>
              <TableHead>Triage Priority</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {samplePatients.map((p, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.age} yrs</div>
                </TableCell>
                <TableCell className="font-mono text-xs">{p.abha}</TableCell>
                <TableCell>{p.village}</TableCell>
                <TableCell className="font-semibold">{p.status}</TableCell>
                <TableCell>
                  <Badge
                    variant={p.priority === 'RED' ? 'danger' : p.priority === 'YELLOW' ? 'warning' : 'success'}
                    pulse={p.priority === 'RED'}
                  >
                    {p.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    View Chart
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* 9. Loaders, Empty States, Error States & Modal */}
      <section className="space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-ruralTeal-700 rounded-full inline-block"></span>
          9. Feedback States & Modal Dialog
        </h2>

        <div className="flex flex-wrap gap-4">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Sample Healthcare Modal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmptyState
            title="No Pending Village Visits"
            description="Sunita Tai has completed all 14 scheduled maternal and infant household visits for Nigdale village today."
            actionLabel="Schedule New House Visit"
            onAction={() => alert('Trigger schedule visit')}
          />

          <ErrorState
            title="PHC Cloud Server Unreachable"
            message="Operating in local offline cache mode. Records are securely queued and will synchronize once connectivity returns."
            onRetry={() => alert('Retrying sync connection...')}
          />
        </div>

        {/* Loading Skeletons */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Loading Skeletons (Card & Table)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <TableSkeleton rows={3} cols={4} />
        </div>
      </section>

      {/* Sample Interactive Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Teleconsultation Appointment"
        description="Book a video or store-and-forward consultation with Primary Health Centre medical staff."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert('Teleconsultation booked successfully!');
                setIsModalOpen(false);
              }}
            >
              Confirm Appointment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Patient Name" defaultValue="Radhika Shinde" disabled />
          <Select
            label="Consulting Medical Officer"
            options={[
              { value: 'dr_kulkarni', label: 'Dr. Ramesh Kulkarni (Senior MO, Khed CHC)' },
              { value: 'dr_deshmukh', label: 'Dr. Sunita Deshmukh (MO, Bhimashankar PHC)' }
            ]}
          />
          <Textarea
            label="Chief Health Complaint"
            placeholder="Describe symptoms, duration, and any home remedies taken..."
            defaultValue="Mild headache and slight pedal edema in 28th week of pregnancy."
          />
        </div>
      </Modal>
    </div>
  );
}
