const fs = require('fs');
const path = require('path');

const enFile = path.join(__dirname, '../src/translations/en.json');
const hiFile = path.join(__dirname, '../src/translations/hi.json');
const mrFile = path.join(__dirname, '../src/translations/mr.json');

const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiFile, 'utf8'));
const mr = JSON.parse(fs.readFileSync(mrFile, 'utf8'));

// Common additions
const commonAdditionsEN = {
  edit: "Edit",
  delete: "Delete",
  update: "Update",
  confirm: "Confirm",
  dismiss: "Dismiss",
  view: "View",
  viewAll: "View All",
  next: "Next",
  previous: "Previous",
  filter: "Filter",
  all: "All",
  export: "Export",
  print: "Print",
  download: "Download",
  upload: "Upload",
  retry: "Retry",
  retryNow: "Retry Now",
  details: "Details",
  yes: "Yes",
  no: "No",
  inProgress: "In Progress",
  completed: "Completed",
  urgent: "Urgent",
  critical: "Critical",
  normal: "Normal",
  stable: "Stable",
  verified: "Verified",
  unverified: "Pending Verification",
  callDoctor: "Call Doctor",
  fieldMode: "Field Mode",
  deviceVault: "Device Vault",
  recordsQueued: "Record(s) queued in local storage",
  storageUsed: "Storage Used",
  deviceQuota: "Device Quota",
  backToHome: "Back to Home",
  takeAction: "Take Action"
};

const commonAdditionsHI = {
  edit: "संपादित करें",
  delete: "हटाएं",
  update: "अपडेट करें",
  confirm: "पुष्टि करें",
  dismiss: "खारिज करें",
  view: "देखें",
  viewAll: "सभी देखें",
  next: "आगे",
  previous: "पीछे",
  filter: "फ़िल्टर",
  all: "सभी",
  export: "निर्यात करें",
  print: "प्रिंट करें",
  download: "डाउनलोड",
  upload: "अपलोड",
  retry: "पुनः प्रयास करें",
  retryNow: "अभी पुनः प्रयास करें",
  details: "विवरण",
  yes: "हाँ",
  no: "नहीं",
  inProgress: "प्रगति पर",
  completed: "पूर्ण हुआ",
  urgent: "अति आवश्यक",
  critical: "गंभीर",
  normal: "सामान्य",
  stable: "स्थिर",
  verified: "सत्यापित",
  unverified: "सत्यापन लंबित",
  callDoctor: "डॉक्टर को कॉल करें",
  fieldMode: "फील्ड मोड",
  deviceVault: "डिवाइस वॉल्ट",
  recordsQueued: "रिकॉर्ड स्थानीय मेमोरी में कतारबद्ध हैं",
  storageUsed: "प्रयुक्त मेमोरी",
  deviceQuota: "कुल क्षमता",
  backToHome: "मुख्य पृष्ठ पर वापस जाएं",
  takeAction: "कार्रवाई करें"
};

const commonAdditionsMR = {
  edit: "संपादित करा",
  delete: "हटवा",
  update: "अपडेट करा",
  confirm: "पुष्टी करा",
  dismiss: "बंद करा",
  view: "पहा",
  viewAll: "सर्व पहा",
  next: "पुढे",
  previous: "मागे",
  filter: "फिल्टर",
  all: "सर्व",
  export: "निर्यात करा",
  print: "प्रिंट करा",
  download: "डाउनलोड",
  upload: "अपलोड",
  retry: "पुन्हा प्रयत्न करा",
  retryNow: "आता पुन्हा प्रयत्न करा",
  details: "तपशील",
  yes: "होय",
  no: "नाही",
  inProgress: "सुरू आहे",
  completed: "पूर्ण झाले",
  urgent: "अतितातडीचे",
  critical: "गंभीर",
  normal: "सामान्य",
  stable: "स्थिर",
  verified: "प्रमाणित",
  unverified: "पडताळणी प्रलंबित",
  callDoctor: "डॉक्टरांशी बोला",
  fieldMode: "फील्ड मोड",
  deviceVault: "डिव्हाइस व्हॉल्ट",
  recordsQueued: "नोंदी डिव्हाइस मेमरीमध्ये सुरक्षित रांगेत आहेत",
  storageUsed: "वापरलेली जागा",
  deviceQuota: "एकूण मर्यादा",
  backToHome: "मुख्यपृष्ठावर परत जा",
  takeAction: "कृती करा"
};

// Sync & Offline state dictionary
const syncEN = {
  title: "Offline Vault & Sync Center",
  subtitle: "Zero-duplication sync manager with idempotent server confirmation",
  onlineStatus: "ONLINE",
  offlineStatus: "OFFLINE",
  syncingStatus: "SYNCING",
  syncedStatus: "SYNCED",
  failedStatus: "SYNC FAILED",
  onlineDesc: "Connected to PHC Cloud Server. Automatic real-time synchronization active.",
  offlineDesc: "Disconnected from network. All records safely stored in encrypted device storage.",
  syncingDesc: "Transferring batch records with server idempotency key handshake...",
  syncedDesc: "All frontline records verified and confirmed by central database.",
  failedDesc: "Network drop during sync. Queued records retained safely with retry controls.",
  syncNow: "Sync Now",
  syncing: "Syncing...",
  retrySync: "Retry Sync",
  clearSynced: "Clear Synced",
  pipelineTitle: "Queue Pipeline",
  storageStats: "Storage Utilization",
  quotaUsed: "{used} MB of {quota} MB used ({pct}%)",
  installPwaTitle: "Install App for Offline Use",
  installPwaBtn: "Install AarogyaSync PWA",
  noPendingItems: "All records are synchronized! Zero items pending in offline queue.",
  teleconsultWarning: "Live Teleconsultation Unavailable Offline",
  teleconsultWarningDesc: "Real-time audiovisual consultations require active internet connection. Please use offline-ready Store & Forward Photo Cases or record vitals locally.",
  openPhotoCasesCta: "Open Photo Cases (Offline Ready) →"
};

const syncHI = {
  title: "ऑफ़लाइन वॉल्ट एवं सिंक केंद्र",
  subtitle: "बिना किसी दोहराव के सुरक्षित सिंक प्रबंधक",
  onlineStatus: "ऑनलाइन",
  offlineStatus: "ऑफ़लाइन",
  syncingStatus: "सिंक हो रहा है",
  syncedStatus: "सिंक हो गया",
  failedStatus: "सिंक विफल",
  onlineDesc: "पीएचसी क्लाउड सर्वर से जुड़ा हुआ है। स्वचालित सिंक सक्रिय है।",
  offlineDesc: "इंटरनेट बंद है। सभी रिकॉर्ड डिवाइस की सुरक्षित मेमोरी में सहेजे गए हैं।",
  syncingDesc: "सर्वर को रिकॉर्ड सुरक्षित रूप से भेजे जा रहे हैं...",
  syncedDesc: "सभी फील्ड रिकॉर्ड केंद्रीय डेटाबेस द्वारा सत्यापित हो चुके हैं।",
  failedDesc: "नेटवर्क टूट गया। सभी रिकॉर्ड सुरक्षित रखे गए हैं। पुनः प्रयास करें।",
  syncNow: "अभी सिंक करें",
  syncing: "सिंक हो रहा है...",
  retrySync: "पुनः प्रयास करें",
  clearSynced: "सिंक किए गए हटाएं",
  pipelineTitle: "सिंक कतार पाइपलाइन",
  storageStats: "मेमोरी उपयोग",
  quotaUsed: "{quota} MB में से {used} MB प्रयुक्त ({pct}%)",
  installPwaTitle: "ऑफ़लाइन उपयोग के लिए ऐप इंस्टॉल करें",
  installPwaBtn: "आरोग्यसिंक ऐप इंस्टॉल करें",
  noPendingItems: "सभी रिकॉर्ड सिंक हो चुके हैं! कतार में कोई रिकॉर्ड लंबित नहीं है।",
  teleconsultWarning: "ऑफ़लाइन में लाइव वीडियो उपलब्ध नहीं",
  teleconsultWarningDesc: "लाइव ऑडियो/वीडियो परामर्श के लिए इंटरनेट आवश्यक है। ऑफ़लाइन में स्टोर-एंड-फॉरवर्ड फोटो केस का उपयोग करें।",
  openPhotoCasesCta: "फोटो केस खोलें (ऑफ़लाइन उपलब्ध) →"
};

const syncMR = {
  title: "ऑफलाइन व्हॉल्ट व सिंक केंद्र",
  subtitle: "शून्य-पुनरावृत्ती तंत्रज्ञानासह सुरक्षित सिंक व्यवस्थापक",
  onlineStatus: "ऑनलाइन",
  offlineStatus: "ऑफलाइन",
  syncingStatus: "सिंक होत आहे",
  syncedStatus: "सिंक झाले",
  failedStatus: "सिंक अयशस्वी",
  onlineDesc: "आरोग्य केंद्र सर्व्हरशी जोडलेले आहे. स्वयंचलित रिअल-टाइम सिंक सुरू आहे.",
  offlineDesc: "इंटरनेट बंद आहे. सर्व नोंदी मोबाइलच्या सुरक्षित मेमरीमध्ये साठवल्या आहेत.",
  syncingDesc: "सर्व नोंदी सर्व्हरवर सुरक्षित पाठविल्या जात आहेत...",
  syncedDesc: "सर्व नोंदी मुख्य सर्व्हरने यशस्वीरीत्या स्वीकारल्या आहेत.",
  failedDesc: "सिंक करताना इंटरनेट तुटले. नोंदी सुरक्षित ठेवल्या आहेत, पुन्हा प्रयत्न करा.",
  syncNow: "आता सिंक करा",
  syncing: "सिंक होत आहे...",
  retrySync: "पुन्हा प्रयत्न करा",
  clearSynced: "सिंक केलेल्या नोंदी काढा",
  pipelineTitle: "सिंक रांग",
  storageStats: "मेमरी वापर",
  quotaUsed: "{quota} MB पैकी {used} MB वापरले ({pct}%)",
  installPwaTitle: "ऑफलाइन वापरासाठी ॲप इन्स्टॉल करा",
  installPwaBtn: "आरोग्यसिंक ॲप इन्स्टॉल करा",
  noPendingItems: "सर्व नोंदी सिंक झाल्या आहेत! रांगेत कोणतीही नोंद प्रलंबित नाही.",
  teleconsultWarning: "ऑफलाइन असताना थेट व्हिडिओ उपलब्ध नाही",
  teleconsultWarningDesc: "थेट व्हिडिओ किंवा ऑडिओ सल्ल्यासाठी इंटरनेट आवश्यक आहे. ऑफलाइन असताना कृपया फोटो केस वापरा किंवा नोंदी साठवा.",
  openPhotoCasesCta: "फोटो केस वापरा (ऑफलाइन उपलब्ध) →"
};

// Form Validation Dictionary
const validationEN = {
  required: "This field is required",
  invalidPhone: "Please enter a valid 10-digit mobile number",
  invalidAbha: "Please enter a valid 14-digit ABHA ID (e.g. 91-1234-5678-9012)",
  passwordMin: "Password must be at least 6 characters long",
  passwordMismatch: "Passwords do not match",
  selectRole: "Please select an account role",
  selectGender: "Please select a gender",
  enterFullName: "Please enter patient's full name",
  enterVillage: "Please specify village or hamlet",
  invalidNumber: "Please enter a valid number",
  outOfRange: "Value is outside allowable clinical range",
  bpFormat: "Enter Blood Pressure in format 120/80"
};

const validationHI = {
  required: "यह जानकारी भरना आवश्यक है",
  invalidPhone: "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें",
  invalidAbha: "कृपया 14 अंकों की वैध आभा आईडी दर्ज करें (उदा. 91-1234-5678-9012)",
  passwordMin: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
  passwordMismatch: "दोनों पासवर्ड मेल नहीं खाते",
  selectRole: "कृपया खाते की भूमिका चुनें",
  selectGender: "कृपया लिंग चुनें",
  enterFullName: "कृपया मरीज का पूरा नाम दर्ज करें",
  enterVillage: "कृपया गाँव या बस्ती का नाम लिखें",
  invalidNumber: "कृपया एक वैध संख्या दर्ज करें",
  outOfRange: "यह मान चिकित्सीय सीमा से बाहर है",
  bpFormat: "ब्लड प्रेशर 120/80 के प्रारूप में दर्ज करें"
};

const validationMR = {
  required: "ही माहिती भरणे अनिवार्य आहे",
  invalidPhone: "कृपया १० अंकी वैध मोबाईल नंबर टाका",
  invalidAbha: "कृपया १४ अंकी वैध आभा आयडी टाका (उदा. 91-1234-5678-9012)",
  passwordMin: "पासवर्ड किमान ६ अक्षरांचा असावा",
  passwordMismatch: "दोन्ही पासवर्ड जुळत नाहीत",
  selectRole: "कृपया खात्याचा प्रकार निवडा",
  selectGender: "कृपया लिंग निवडा",
  enterFullName: "कृपया रुग्णाचे पूर्ण नाव प्रविष्ट करा",
  enterVillage: "कृपया गाव किंवा वाडीचे नाव लिहा",
  invalidNumber: "कृपया वैध संख्या प्रविष्ट करा",
  outOfRange: "हे मूल्य वैद्यकीय मर्यादेबाहेर आहे",
  bpFormat: "रक्तदाब 120/80 या स्वरूपात प्रविष्ट करा"
};

// Appointments Dictionary
const appointmentsEN = {
  title: "Doctor Appointments",
  subtitle: "Schedule in-person PHC visits or remote rural teleconsultations",
  bookNew: "Book New Appointment",
  selectDoctor: "Select Doctor",
  selectDate: "Consultation Date",
  selectSlot: "Select Time Slot",
  reasonForVisit: "Chief Complaint / Reason for Visit",
  reasonPlaceholder: "e.g. Chronic joint pain, persistent cough for 4 days",
  teleconsultation: "Teleconsultation (Low-Data Video)",
  inPerson: "In-Person PHC Visit",
  confirmBooking: "Confirm Appointment Booking",
  bookingSuccess: "Appointment Booked Successfully!",
  cancelModalTitle: "Cancel Appointment?",
  cancelModalDesc: "Are you sure you want to cancel this scheduled consultation?",
  statusBooked: "CONFIRMED",
  statusCompleted: "COMPLETED",
  statusCancelled: "CANCELLED",
  upcomingTab: "Upcoming",
  pastTab: "Past Consultations",
  noUpcoming: "No upcoming appointments scheduled.",
  bookFirstCta: "Book Your First Appointment"
};

const appointmentsHI = {
  title: "डॉक्टर अपॉइंटमेंट्स",
  subtitle: "प्राथमिक स्वास्थ्य केंद्र में प्रत्यक्ष या ऑनलाइन डॉक्टर परामर्श निश्चित करें",
  bookNew: "नई अपॉइंटमेंट बुक करें",
  selectDoctor: "डॉक्टर चुनें",
  selectDate: "परामर्श की तारीख",
  selectSlot: "समय स्लॉट चुनें",
  reasonForVisit: "परामर्श का कारण / मुख्य लक्षण",
  reasonPlaceholder: "उदा. जोड़ों में दर्द, 4 दिनों से लगातार खांसी",
  teleconsultation: "टेलीकंसल्टेशन (कम डेटा वीडियो परामर्श)",
  inPerson: "स्वास्थ्य केंद्र पर प्रत्यक्ष परामर्श",
  confirmBooking: "अपॉइंटमेंट की पुष्टि करें",
  bookingSuccess: "अपॉइंटमेंट सफलतापूर्वक बुक हो गई!",
  cancelModalTitle: "अपॉइंटमेंट रद्द करें?",
  cancelModalDesc: "क्या आप वाकई इस निर्धारित परामर्श को रद्द करना चाहते हैं?",
  statusBooked: "पुष्टीकृत",
  statusCompleted: "पूर्ण हुआ",
  statusCancelled: "रद्द किया गया",
  upcomingTab: "आगामी",
  pastTab: "पूर्व परामर्श",
  noUpcoming: "कोई आगामी अपॉइंटमेंट निर्धारित नहीं है।",
  bookFirstCta: "अपनी पहली अपॉइंटमेंट बुक करें"
};

const appointmentsMR = {
  title: "डॉक्टर अपॉइंटमेंट्स",
  subtitle: "प्राथमिक आरोग्य केंद्रात प्रत्यक्ष भेट किंवा ऑनलाइन टेलिमेडिसिन सल्ला निश्चित करा",
  bookNew: "नवीन भेट निश्चित करा",
  selectDoctor: "डॉक्टर निवडा",
  selectDate: "भेटीची तारीख",
  selectSlot: "वेळेचा स्लॉट निवडा",
  reasonForVisit: "भेटीचे कारण / मुख्य लक्षणे",
  reasonPlaceholder: "उदा. सांधेदुखी, ४ दिवसांपासून सतत खोकला",
  teleconsultation: "टेलिकन्सल्टेशन (कमी डेटा व्हिडिओ सल्ला)",
  inPerson: "आरोग्य केंद्रात प्रत्यक्ष भेट",
  confirmBooking: "भेट निश्चित करा",
  bookingSuccess: "डॉक्टर भेट यशस्वीरीत्या निश्चित झाली!",
  cancelModalTitle: "भेट रद्द करायची का?",
  cancelModalDesc: "तुम्हाला ही नियोजित डॉक्टर भेट खरंच रद्द करायची आहे का?",
  statusBooked: "निश्चित झाले",
  statusCompleted: "पूर्ण झाले",
  statusCancelled: "रद्द केले",
  upcomingTab: "आगामी भेटी",
  pastTab: "मागील तपासण्या",
  noUpcoming: "कोणतीही आगामी भेट नियोजित नाही.",
  bookFirstCta: "पहिली भेट निश्चित करा"
};

// Consultations & Teleconsult
const consultationsEN = {
  roomTitle: "Doctor Teleconsultation Room",
  roomSubtitle: "Low-Bandwidth National Telemedicine System (eSanjeevani / ABDM)",
  readyToConnect: "Ready to Connect",
  liveCall: "Live Audio/Video Session",
  callEnded: "Consultation Ended",
  startConsultation: "Start Consultation Now",
  endConsultation: "End Call",
  reconnectCall: "Reconnect Call",
  consultingPhysician: "Consulting Physician",
  patientVitalsTransmitted: "Live Transmitted Doorstep Vitals (ASHA Verified)",
  chatTitle: "Clinical Chat & Consultation Notes",
  typeMessage: "Type message to doctor...",
  send: "Send",
  audioQuality: "Audio quality: HD • Low packet loss",
  encryptedAbdm: "ABDM Encrypted",
  lowBandwidthToggle: "Low Bandwidth (2G Audio Mode)"
};

const consultationsHI = {
  roomTitle: "डॉक्टर टेलीकंसल्टेशन कक्ष",
  roomSubtitle: "कम डेटा राष्ट्रीय टेलीमेडिसिन प्रणाली (ई-संजीवनी / आयुष्मान भारत)",
  readyToConnect: "जुड़ने के लिए तैयार",
  liveCall: "लाइव ऑडियो/वीडियो सत्र",
  callEnded: "परामर्श समाप्त हुआ",
  startConsultation: "अभी परामर्श शुरू करें",
  endConsultation: "कॉल समाप्त करें",
  reconnectCall: "कॉल पुनः जोड़ें",
  consultingPhysician: "परामर्शदाता चिकित्सक",
  patientVitalsTransmitted: "आशा कार्यकर्ता द्वारा सत्यापित लाइव महत्वपूर्ण लक्षण",
  chatTitle: "चिकित्सीय संदेश व परामर्श नोट्स",
  typeMessage: "डॉक्टर को संदेश लिखें...",
  send: "भेजें",
  audioQuality: "ध्वनि गुणवत्ता: स्पष्ट • कम डेटा खपत",
  encryptedAbdm: "आयुष्मान भारत सुरक्षित एन्क्रिप्शन",
  lowBandwidthToggle: "कम डेटा मोड (2G केवल ऑडियो)"
};

const consultationsMR = {
  roomTitle: "डॉक्टर टेलिकन्सल्टेशन कक्ष",
  roomSubtitle: "कमी डेटा राष्ट्रीय टेलिमेडिसिन प्रणाली (ई-संजीवनी / आयुष्मान भारत)",
  readyToConnect: "जोडणीसाठी सज्ज",
  liveCall: "थेट ऑडिओ/व्हिडिओ सल्ला",
  callEnded: "सल्ला संपला",
  startConsultation: "आता सल्ला सुरू करा",
  endConsultation: "कॉल संपवा",
  reconnectCall: "कॉल पुन्हा जोडा",
  consultingPhysician: "सल्लागार वैद्यकीय अधिकारी",
  patientVitalsTransmitted: "आशा सेविकेने नोंदविलेले थेट आरोग्य घटक (Vitals)",
  chatTitle: "वैद्यकीय संदेश व सल्ला नोंदी",
  typeMessage: "डॉक्टरांना संदेश पाठवा...",
  send: "पाठवा",
  audioQuality: "आवाज गुणवत्ता: स्पष्ट • कमी डेटा वापर",
  encryptedAbdm: "आयुष्मान भारत सुरक्षित एनक्रिप्टेड",
  lowBandwidthToggle: "कमी डेटा मोड (2G फक्त आवाज)"
};

// Prescriptions Dictionary
const prescriptionsEN = {
  title: "Digital e-Prescriptions (Rx)",
  subtitle: "Authentic, ABDM-compliant digital medical prescriptions with QR verification",
  doctorSign: "Digitally Signed by Medical Officer",
  diagnosis: "Clinical Diagnosis",
  clinicalAdvice: "Advice & Diet Instructions",
  medicinesList: "Prescribed Medicines",
  medicineName: "Medicine Name & Strength",
  dosage: "Dosage",
  frequency: "Frequency",
  duration: "Duration",
  instructions: "Instructions",
  beforeMeals: "Before Meals",
  afterMeals: "After Meals",
  sos: "SOS (Only when fever/pain occurs)",
  qrVerification: "Scan QR at PHC Pharmacy for Instant Dispensing",
  downloadRxPdf: "Download Official Rx (PDF)",
  signAndDispatch: "Digitally Sign & Dispatch Rx",
  rxDispatchedSuccess: "Digital e-Prescription Dispatched Successfully!"
};

const prescriptionsHI = {
  title: "डिजिटल ई-प्रिस्क्रिप्शन (Rx)",
  subtitle: "आयुष्मान भारत प्रमाणित डिजिटल दवा पर्ची (क्यूआर सत्यापन सहित)",
  doctorSign: "चिकित्सा अधिकारी द्वारा डिजिटल हस्ताक्षरित",
  diagnosis: "रोग निदान (डायग्नोसिस)",
  clinicalAdvice: "चिकित्सीय सलाह व परहेज",
  medicinesList: "निर्धारित दवाइयों की सूची",
  medicineName: "दवा का नाम व क्षमता",
  dosage: "खुराक",
  frequency: "लेने का समय",
  duration: "कितने दिन",
  instructions: "विशेष निर्देश",
  beforeMeals: "भोजन से पहले",
  afterMeals: "भोजन के बाद",
  sos: "एसओएस (केवल दर्द या बुखार होने पर)",
  qrVerification: "स्वास्थ्य केंद्र फार्मेसी पर दवा प्राप्त करने के लिए क्यूआर स्कैन करें",
  downloadRxPdf: "आधिकारिक पर्ची डाउनलोड करें (PDF)",
  signAndDispatch: "डिजिटल हस्ताक्षर कर पर्ची भेजें",
  rxDispatchedSuccess: "डिजिटल ई-प्रिस्क्रिप्शन सफलतापूर्वक भेजा गया!"
};

const prescriptionsMR = {
  title: "डिजिटल ई-प्रिस्क्रिप्शन (Rx)",
  subtitle: "आयुष्मान भारत प्रमाणित डिजिटल औषधोपचार चिठ्ठी (क्यूआर कोडसह)",
  doctorSign: "वैद्यकीय अधिकाऱ्यांनी डिजिटल स्वाक्षरी केलेले",
  diagnosis: "आजाराचे निदान (डायग्नोसिस)",
  clinicalAdvice: "वैद्यकीय सल्ला व पथ्य",
  medicinesList: "लिहून दिलेल्या औषधांची यादी",
  medicineName: "औषधाचे नाव व प्रमाण",
  dosage: "डोस (प्रमाण)",
  frequency: "केव्हा घ्यावे",
  duration: "किती दिवस",
  instructions: "विशेष सूचना",
  beforeMeals: "जेवणापूर्वी",
  afterMeals: "जेवणानंतर",
  sos: "गरज असल्यास (केवळ ताप किंवा त्रास झाल्यास)",
  qrVerification: "आरोग्य केंद्र औषधालयात औषध मिळवण्यासाठी क्यूआर स्कॅन करा",
  downloadRxPdf: "औषध चिठ्ठी डाउनलोड करा (PDF)",
  signAndDispatch: "डिजिटल स्वाक्षरी करून पाठवा",
  rxDispatchedSuccess: "डिजिटल ई-प्रिस्क्रिप्शन यशस्वीरीत्या पाठवले गेले!"
};

// Followups Dictionary
const followupsEN = {
  title: "ASHA Doorstep Follow-up Tasks",
  subtitle: "Assigned clinical follow-ups, medication checks & vaccine recalls",
  scheduleFollowup: "Schedule Patient Follow-up",
  scheduleFollowupBtn: "+ Schedule Follow-up",
  patientName: "Citizen / Patient Name",
  priorityLevel: "Priority Level",
  priorityGreen: "GREEN (Routine / Stable)",
  priorityYellow: "YELLOW (Moderate / Watch)",
  priorityRed: "RED (High-Risk / Urgent)",
  dueTimeline: "Due Timeline",
  dueToday: "Today (Immediate)",
  dueTomorrow: "Tomorrow",
  due3Days: "In 3 Days",
  due1Week: "In 1 Week",
  due2Weeks: "In 2 Weeks",
  clinicalTask: "Follow-up Action / Clinical Task",
  clinicalTaskPlaceholder: "e.g. Check BP, Verify IFA tablet compliance",
  clinicalNotes: "Instructions / Clinical Notes",
  saveAndQueue: "Save & Queue Follow-up",
  markCompleted: "Mark Completed",
  examinePatient: "Examine Patient",
  storedLocallyBadge: "Stored Locally (Pending Sync)",
  noFollowupsTitle: "No Follow-up Tasks",
  noFollowupsDesc: "You have no outstanding patient follow-ups or doorstep visits due."
};

const followupsHI = {
  title: "आशा कार्यकर्ता फॉलो-अप कार्य",
  subtitle: "आवंटित फॉलो-अप, दवा अनुपालन जांच एवं टीकाकरण पुनः आह्वान",
  scheduleFollowup: "मरीज फॉलो-अप तय करें",
  scheduleFollowupBtn: "+ फॉलो-अप तय करें",
  patientName: "नागरिक / मरीज का नाम",
  priorityLevel: "प्राथमिकता स्तर",
  priorityGreen: "हरा (सामान्य / स्थिर)",
  priorityYellow: "पीला (मध्यम / निगरानी)",
  priorityRed: "लाल (उच्च जोखिम / अति आवश्यक)",
  dueTimeline: "नियत समय",
  dueToday: "आज (तत्काल)",
  dueTomorrow: "कल",
  due3Days: "3 दिनों में",
  due1Week: "1 सप्ताह में",
  due2Weeks: "2 सप्ताह में",
  clinicalTask: "फॉलो-अप कार्य / जांच",
  clinicalTaskPlaceholder: "उदा. ब्लड प्रेशर जांचें, आयरन की गोलियाँ लेने की पुष्टि करें",
  clinicalNotes: "निर्देश व चिकित्सीय नोट्स",
  saveAndQueue: "सहेजें व कतार में जोड़ें",
  markCompleted: "पूर्ण चिह्नित करें",
  examinePatient: "मरीज की जांच करें",
  storedLocallyBadge: "स्थानीय रूप से सुरक्षित (सिंक लंबित)",
  noFollowupsTitle: "कोई फॉलो-अप कार्य नहीं",
  noFollowupsDesc: "वर्तमान में आपका कोई मरीज फॉलो-अप या गृह भेंट कार्य लंबित नहीं है।"
};

const followupsMR = {
  title: "आशा सेविका गृहभेट व पाठपुरावा कार्य",
  subtitle: "नेमून दिलेला पाठपुरावा, औषध तपासणी व लसीकरण आठवण",
  scheduleFollowup: "रुग्ण पाठपुरावा निश्चित करा",
  scheduleFollowupBtn: "+ पाठपुरावा नोंदवा",
  patientName: "ग्रामस्थ / रुग्णाचे नाव",
  priorityLevel: "प्राधान्य स्तर",
  priorityGreen: "हिरवा (नियमित / स्थिर)",
  priorityYellow: "पिवळा (मध्यम जोखीम / लक्ष ठेवा)",
  priorityRed: "लाल (उच्च जोखीम / अतितातडीचे)",
  dueTimeline: "कधी करावयाचे",
  dueToday: "आज (तातडीने)",
  dueTomorrow: "उद्या",
  due3Days: "३ दिवसांत",
  due1Week: "१ आठवड्यात",
  due2Weeks: "२ आठवड्यात",
  clinicalTask: "करावयाची तपासणी / कार्य",
  clinicalTaskPlaceholder: "उदा. बीपी मोजा, आयर्न गोळ्या घेतल्याची खात्री करा",
  clinicalNotes: "सूचना व नोंदी",
  saveAndQueue: "नोंद साठवा व रांगेत ठेवा",
  markCompleted: "पूर्ण झाले",
  examinePatient: "रुग्ण तपासा",
  storedLocallyBadge: "डिव्हाइसवर सुरक्षित (सिंक प्रलंबित)",
  noFollowupsTitle: "कोणतेही पाठपुरावा कार्य नाही",
  noFollowupsDesc: "सध्या कोणतीही प्रलंबित रुग्ण भेट किंवा तपासणी बाकी नाही."
};

// Emergency SOS Dictionary
const emergencyEN = {
  title: "Emergency Healthcare Help (SOS)",
  subtitle: "Immediate connection with nearest PHC Ambulance & Frontline Emergency Support",
  call108Now: "Call 108 Ambulance Now",
  freeHelpline: "Toll-Free 24x7 Government Ambulance Service",
  alertAsha: "Alert Village ASHA Worker",
  shareLocation: "Share Live GPS Location",
  hospitalTransit: "Nearest Emergency Centre",
  callingAmbulance: "Connecting to 108 Emergency Control Room...",
  ashaAlerted: "Local ASHA worker has been notified of your emergency.",
  firstAidHeader: "Critical First Aid Steps While Ambulance is En Route",
  step1: "Keep patient in comfortable sitting or lying position.",
  step2: "Ensure plenty of fresh air. Do not crowd around the patient.",
  step3: "If pregnant mother with labor pain, keep clean towels ready.",
  step4: "Keep patient's ABHA Card or identification paper ready for admission."
};

const emergencyHI = {
  title: "आपातकालीन स्वास्थ्य सहायता (SOS)",
  subtitle: "निकटतम 108 एम्बुलेंस और गाँव की आशा कार्यकर्ता से तत्काल संपर्क",
  call108Now: "अभी 108 एम्बुलेंस को कॉल करें",
  freeHelpline: "निःशुल्क 24 घंटे शासकीय आपातकालीन सेवा",
  alertAsha: "गाँव की आशा कार्यकर्ता को अलर्ट भेजें",
  shareLocation: "गाँव का स्थान (GPS) साझा करें",
  hospitalTransit: "निकटतम आपातकालीन स्वास्थ्य केंद्र",
  callingAmbulance: "108 आपातकालीन नियंत्रण कक्ष से संपर्क हो रहा है...",
  ashaAlerted: "आपकी स्थानीय आशा कार्यकर्ता को आपातकाल की सूचना दे दी गई है।",
  firstAidHeader: "एम्बुलेंस आने तक महत्वपूर्ण प्राथमिक उपचार निर्देश",
  step1: "मरीज को आरामदायक स्थिति में बैठाएं या लिटाएं।",
  step2: "मरीज के आसपास भीड़ न लगाएं, स्वच्छ हवा आने दें।",
  step3: "यदि गर्भवती माता को प्रसव पीड़ा हो तो साफ कपड़े तैयार रखें।",
  step4: "अस्पताल में भर्ती के लिए आभा कार्ड या पहचान पत्र तैयार रखें।"
};

const emergencyMR = {
  title: "तातडीची वैद्यकीय मदत (SOS)",
  subtitle: "जवळच्या १०८ रुग्णवाहिका व गावातील आशा सेविकेशी त्वरित संपर्क",
  call108Now: "आत्ताच १०८ रुग्णवाहिकेला फोन करा",
  freeHelpline: "मोफत २४ तास शासकीय रुग्णवाहिका सेवा",
  alertAsha: "गावातील आशा सेविकेला त्वरित कळवा",
  shareLocation: "गावाचे नेमके स्थान (GPS) पाठवा",
  hospitalTransit: "जवळचे प्राथमिक आरोग्य केंद्र / ग्रामीण रुग्णालय",
  callingAmbulance: "१०८ नियंत्रण कक्षाशी संपर्क जोडत आहे...",
  ashaAlerted: "तुमच्या गावातील आशा सेविकेला तातडीची सूचना पाठवली आहे.",
  firstAidHeader: "रुग्णवाहिका येईपर्यंत करावयाचे प्राथमिक उपचार",
  step1: "रुग्णाला आरामदायक स्थितीत बसवा किंवा झोपवा.",
  step2: "रुग्णाभोवती गर्दी करू नका, मोकळी हवा मिळू द्या.",
  step3: "गरोदर मातेला प्रसववेदना असल्यास स्वच्छ कपडे तयार ठेवा.",
  step4: "रुग्णालयात दाखल करण्यासाठी आभा कार्ड किंवा ओळखपत्र सोबत ठेवा."
};

// Notifications Dictionary
const notificationsEN = {
  title: "Health Notifications & Alerts",
  subtitle: "Doorstep care reminders, vaccine recalls, and public health advisories",
  markAllAsRead: "Mark All as Read",
  allTab: "All Notifications",
  unreadTab: "Unread",
  vaccinesTab: "Vaccines",
  ancTab: "Maternal ANC",
  emptyTitle: "No New Notifications",
  emptyDesc: "You have reviewed all current health alerts and appointments.",
  systemAlert: "System Notice",
  clinicalReminder: "Clinical Reminder"
};

const notificationsHI = {
  title: "स्वास्थ्य सूचनाएं व अलर्ट",
  subtitle: "टीकाकरण अनुस्मारक, मातृ स्वास्थ्य जांच एवं सरकारी स्वास्थ्य परामर्श",
  markAllAsRead: "सभी को पढ़ा हुआ चिह्नित करें",
  allTab: "सभी सूचनाएं",
  unreadTab: "अपठित",
  vaccinesTab: "टीकाकरण",
  ancTab: "मातृ स्वास्थ्य (ANC)",
  emptyTitle: "कोई नई सूचना नहीं है",
  emptyDesc: "आपने सभी वर्तमान स्वास्थ्य अलर्ट और अपॉइंटमेंट्स देख लिए हैं।",
  systemAlert: "प्रणाली सूचना",
  clinicalReminder: "चिकित्सीय अनुस्मारक"
};

const notificationsMR = {
  title: "आरोग्य सूचना व इशारे",
  subtitle: "लसीकरण आठवण, गरोदरपण तपासणी आणि शासकीय आरोग्य सूचना",
  markAllAsRead: "सर्व वाचल्याचे नोंदवा",
  allTab: "सर्व सूचना",
  unreadTab: "न वाचलेल्या",
  vaccinesTab: "लसीकरण",
  ancTab: "मातृ आरोग्य (ANC)",
  emptyTitle: "कोणतीही नवीन सूचना नाही",
  emptyDesc: "तुम्ही सर्व आरोग्य सूचना व भेटींचे तपशील पाहिले आहेत.",
  systemAlert: "प्रणाली सूचना",
  clinicalReminder: "वैद्यकीय आठवण"
};

// Empty & Error States
const emptyStatesEN = {
  defaultTitle: "No Records Found",
  defaultDesc: "There are no active records in this category currently.",
  noPatients: "No Patients Found",
  noPatientsDesc: "No citizens found matching your search criteria.",
  noAppointments: "No Scheduled Appointments",
  noAppointmentsDesc: "You have no upcoming clinical appointments.",
  noPrescriptions: "No Digital Prescriptions",
  noPrescriptionsDesc: "No e-prescriptions have been issued yet.",
  noQueue: "Queue is Clear",
  noQueueDesc: "There are no patients currently waiting for consultation.",
  noPhotoCases: "No Photo Cases",
  noPhotoCasesDesc: "No store-and-forward cases currently awaiting review."
};

const emptyStatesHI = {
  defaultTitle: "कोई रिकॉर्ड नहीं मिला",
  defaultDesc: "इस श्रेणी में वर्तमान में कोई सक्रिय रिकॉर्ड उपलब्ध नहीं है।",
  noPatients: "कोई मरीज नहीं मिला",
  noPatientsDesc: "आपकी खोज के अनुसार कोई नागरिक या मरीज नहीं मिला।",
  noAppointments: "कोई निर्धारित अपॉइंटमेंट नहीं",
  noAppointmentsDesc: "आपकी कोई आगामी डॉक्टर भेट निर्धारित नहीं है।",
  noPrescriptions: "कोई डिजिटल पर्ची नहीं",
  noPrescriptionsDesc: "अभी तक कोई ई-प्रिस्क्रिप्शन जारी नहीं किया गया है।",
  noQueue: "कतार रिक्त है",
  noQueueDesc: "वर्तमान में परामर्श के लिए कोई मरीज प्रतीक्षा नहीं कर रहा है।",
  noPhotoCases: "कोई फोटो केस नहीं",
  noPhotoCasesDesc: "वर्तमान में समीक्षा के लिए कोई फोटो केस लंबित नहीं है।"
};

const emptyStatesMR = {
  defaultTitle: "कोणतीही नोंद सापडली नाही",
  defaultDesc: "या वर्गात सध्या कोणतीही सक्रिय नोंद उपलब्ध नाही.",
  noPatients: "रुग्ण सापडले नाहीत",
  noPatientsDesc: "तुमच्या शोधानुसार कोणतेही नागरिक किंवा रुग्ण आढळले नाहीत.",
  noAppointments: "कोणतीही नियोजित भेट नाही",
  noAppointmentsDesc: "तुमची कोणतीही आगामी डॉक्टर तपासणी भेट निश्चित नाही.",
  noPrescriptions: "औषध चिठ्ठी उपलब्ध नाही",
  noPrescriptionsDesc: "अद्याप कोणतीही डिजिटल औषधोपचार चिठ्ठी दिलेली नाही.",
  noQueue: "तपासणी रांग रिकामी आहे",
  noQueueDesc: "सध्या सल्ल्यासाठी कोणताही रुग्ण प्रतीक्षेत नाही.",
  noPhotoCases: "कोणतेही फोटो केस नाहीत",
  noPhotoCasesDesc: "सध्या तपासणीसाठी कोणताही फोटो केस प्रलंबित नाही."
};

const errorsEN = {
  defaultTitle: "Unable to Load Healthcare Data",
  defaultDesc: "A network or server communication error occurred.",
  offlineNoticeTitle: "Notice: Working in Offline Mode",
  offlineNoticeDesc: "Live server is disconnected. Displaying cached local records.",
  retryBtn: "Retry Request",
  sessionExpired: "Session Expired",
  sessionExpiredDesc: "Please sign in again to continue accessing your healthcare account.",
  pageNotFound: "Page Not Found",
  pageNotFoundDesc: "The requested healthcare portal resource could not be found or has moved."
};

const errorsHI = {
  defaultTitle: "स्वास्थ्य डेटा लोड करने में असमर्थ",
  defaultDesc: "नेटवर्क या सर्वर संचार में समस्या आई है।",
  offlineNoticeTitle: "सूचना: ऑफ़लाइन मोड में कार्य हो रहा है",
  offlineNoticeDesc: "सर्वर से संपर्क नहीं है। स्थानीय रूप से सहेजे गए रिकॉर्ड दिखाए जा रहे हैं।",
  retryBtn: "पुनः प्रयास करें",
  sessionExpired: "सत्र समाप्त हो गया",
  sessionExpiredDesc: "अपने स्वास्थ्य खाते का उपयोग जारी रखने के लिए कृपया पुनः लॉगिन करें।",
  pageNotFound: "पृष्ठ नहीं मिला",
  pageNotFoundDesc: "अनुरोधित स्वास्थ्य पोर्टल पृष्ठ उपलब्ध नहीं है या स्थानांतरित हो चुका है।"
};

const errorsMR = {
  defaultTitle: "आरोग्य माहिती लोड करता आली नाही",
  defaultDesc: "नेटवर्क किंवा सर्व्हरशी संपर्क साधताना त्रुटी आली.",
  offlineNoticeTitle: "सूचना: ऑफलाइन मोड सुरू आहे",
  offlineNoticeDesc: "सर्व्हरशी थेट संपर्क नाही. डिव्हाइसवरील साठवलेल्या नोंदी दाखविल्या जात आहेत.",
  retryBtn: "पुन्हा प्रयत्न करा",
  sessionExpired: "सत्र संपले आहे",
  sessionExpiredDesc: "तुमच्या खात्याचा वापर सुरू ठेवण्यासाठी कृपया पुन्हा लॉगिन करा.",
  pageNotFound: "पृष्ठ सापडले नाही",
  pageNotFoundDesc: "शोधलेले आरोग्य पोर्टल पृष्ठ अस्तित्वात नाही किंवा हलविले गेले आहे."
};

// Profile & Settings
const profileEN = {
  title: "Patient Profile & Ayushman Card",
  subtitle: "Personal demographic details, verified ABHA identity, and health cards",
  abhaNumber: "14-digit ABHA ID",
  phone: "Registered Mobile",
  village: "Village / Hamlet",
  district: "District",
  bloodGroup: "Blood Group",
  emergencyContact: "Emergency Contact",
  preferredLanguage: "Preferred Language",
  changeLanguage: "Change Language",
  abhaCardDownload: "Download ABHA Card",
  abhaQrCode: "Official ABDM QR Code"
};

const profileHI = {
  title: "मरीज प्रोफ़ाइल एवं आयुष्मान कार्ड",
  subtitle: "व्यक्तिगत जानकारी, सत्यापित आभा पहचान एवं डिजिटल स्वास्थ्य कार्ड",
  abhaNumber: "14 अंकों की आभा आईडी",
  phone: "पंजीकृत मोबाइल",
  village: "गाँव / बस्ती",
  district: "जिला",
  bloodGroup: "रक्त समूह (Blood Group)",
  emergencyContact: "आपातकालीन संपर्क",
  preferredLanguage: "पसंदीदा भाषा",
  changeLanguage: "भाषा बदलें",
  abhaCardDownload: "आभा कार्ड डाउनलोड करें",
  abhaQrCode: "आधिकारिक आयुष्मान भारत क्यूआर कोड"
};

const profileMR = {
  title: "रुग्ण माहिती व आयुष्मान कार्ड",
  subtitle: "वैयक्तिक माहिती, प्रमाणित आभा ओळख व डिजिटल आरोग्य कार्ड",
  abhaNumber: "१४ अंकी आभा आयडी",
  phone: "नोंदणीकृत मोबाईल",
  village: "गाव / वाडी",
  district: "जिल्हा",
  bloodGroup: "रक्तगट",
  emergencyContact: "तातडीचा संपर्क",
  preferredLanguage: "पसंतीची भाषा",
  changeLanguage: "भाषा बदला",
  abhaCardDownload: "आभा कार्ड डाउनलोड करा",
  abhaQrCode: "अधिकृत आयुष्मान भारत क्यूआर कोड"
};

// Merge into main objects
en.common = { ...en.common, ...commonAdditionsEN };
hi.common = { ...hi.common, ...commonAdditionsHI };
mr.common = { ...mr.common, ...commonAdditionsMR };

en.sync = syncEN;
hi.sync = syncHI;
mr.sync = syncMR;

en.validation = validationEN;
hi.validation = validationHI;
mr.validation = validationMR;

en.appointments = appointmentsEN;
hi.appointments = appointmentsHI;
mr.appointments = appointmentsMR;

en.consultations = consultationsEN;
hi.consultations = consultationsHI;
mr.consultations = consultationsMR;

en.prescriptions = prescriptionsEN;
hi.prescriptions = prescriptionsHI;
mr.prescriptions = prescriptionsMR;

en.followups = followupsEN;
hi.followups = followupsHI;
mr.followups = followupsMR;

en.emergency = emergencyEN;
hi.emergency = emergencyHI;
mr.emergency = emergencyMR;

en.notifications = notificationsEN;
hi.notifications = notificationsHI;
mr.notifications = notificationsMR;

en.emptyStates = emptyStatesEN;
hi.emptyStates = emptyStatesHI;
mr.emptyStates = emptyStatesMR;

en.errors = errorsEN;
hi.errors = errorsHI;
mr.errors = errorsMR;

en.profile = profileEN;
hi.profile = profileHI;
mr.profile = profileMR;

// Write back formatted
fs.writeFileSync(enFile, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(hiFile, JSON.stringify(hi, null, 2), 'utf8');
fs.writeFileSync(mrFile, JSON.stringify(mr, null, 2), 'utf8');

console.log('✅ Updated all three translation files: en.json, hi.json, mr.json successfully!');
console.log('EN sections:', Object.keys(en).length);
console.log('HI sections:', Object.keys(hi).length);
console.log('MR sections:', Object.keys(mr).length);
