// Clinical Reference Visuals & Image Utilities for AarogyaSync
// Realistic SVG Data-URIs for dermatology, ophthalmology trauma, and wound inspection

export const CLINICAL_PHOTOS = {
  EYE_INJURY: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <defs>
        <radialGradient id="skin" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#dfb190"/>
          <stop offset="80%" stop-color="#ca9b78"/>
          <stop offset="100%" stop-color="#af7e5b"/>
        </radialGradient>
        <radialGradient id="sclera" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stop-color="#ffffff"/>
          <stop offset="85%" stop-color="#ffdede"/>
          <stop offset="100%" stop-color="#f8a5a5"/>
        </radialGradient>
        <radialGradient id="iris" cx="45%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#1e3a8a"/>
          <stop offset="50%" stop-color="#172554"/>
          <stop offset="90%" stop-color="#090d16"/>
        </radialGradient>
        <radialGradient id="cornealReflection" cx="35%" cy="35%" r="30%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <filter id="blurFilter" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
      </defs>
      <!-- Background Skin -->
      <rect width="600" height="400" fill="url(#skin)"/>
      
      <!-- Upper Orbital Fold Shadow -->
      <path d="M 120 150 Q 300 80 480 150" fill="none" stroke="#78350f" stroke-width="6" opacity="0.35"/>
      <path d="M 140 160 Q 300 110 460 160" fill="none" stroke="#522509" stroke-width="2" opacity="0.4"/>
      
      <!-- Eye Aperture / Sclera Base -->
      <path d="M 130 200 Q 300 120 470 200 Q 300 270 130 200 Z" fill="url(#sclera)" stroke="#991b1b" stroke-width="3"/>
      
      <!-- Conjunctival Hyperaemia (Ciliary & Conjunctival Injection Vessels) -->
      <!-- Medial Redness -->
      <path d="M 140 200 Q 180 180 230 195" fill="none" stroke="#dc2626" stroke-width="2.5" opacity="0.75"/>
      <path d="M 145 205 Q 190 210 235 202" fill="none" stroke="#ef4444" stroke-width="1.8" opacity="0.7"/>
      <path d="M 150 195 Q 175 190 210 193" fill="none" stroke="#b91c1c" stroke-width="2" opacity="0.8"/>
      <path d="M 170 185 Q 200 175 240 185" fill="none" stroke="#ef4444" stroke-width="1.2" opacity="0.6"/>
      <path d="M 160 215 Q 200 220 245 210" fill="none" stroke="#dc2626" stroke-width="1.5" opacity="0.7"/>
      
      <!-- Lateral Redness -->
      <path d="M 460 200 Q 420 185 370 195" fill="none" stroke="#dc2626" stroke-width="2.2" opacity="0.75"/>
      <path d="M 455 205 Q 410 215 365 205" fill="none" stroke="#b91c1c" stroke-width="2" opacity="0.8"/>
      <path d="M 440 190 Q 405 180 360 190" fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.6"/>
      
      <!-- Chemosis / Diffuse Conjunctival Flush Overlay -->
      <path d="M 135 200 Q 210 160 250 180 Q 210 230 135 200 Z" fill="#ef4444" opacity="0.2" filter="url(#blurFilter)"/>
      <path d="M 465 200 Q 390 160 350 180 Q 390 230 465 200 Z" fill="#ef4444" opacity="0.22" filter="url(#blurFilter)"/>
      
      <!-- Iris -->
      <circle cx="300" cy="198" r="62" fill="url(#iris)"/>
      <!-- Limbal Ring -->
      <circle cx="300" cy="198" r="62" fill="none" stroke="#0f172a" stroke-width="3"/>
      <!-- Perilimbal Ciliary Flush (Chemical/Trauma sign) -->
      <circle cx="300" cy="198" r="66" fill="none" stroke="#dc2626" stroke-width="4" opacity="0.5" filter="url(#blurFilter)"/>
      
      <!-- Pupil -->
      <circle cx="300" cy="198" r="24" fill="#030712"/>
      
      <!-- Corneal Highlight / Tear Film Sheen -->
      <ellipse cx="285" cy="182" rx="14" ry="9" fill="url(#cornealReflection)"/>
      <circle cx="278" cy="178" r="4" fill="#ffffff" opacity="0.85"/>
      
      <!-- Lower Eyelid Margin & Waterline -->
      <path d="M 130 200 Q 300 270 470 200" fill="none" stroke="#fca5a5" stroke-width="4" opacity="0.8"/>
      <path d="M 125 201 Q 300 278 475 201" fill="none" stroke="#78350f" stroke-width="3" opacity="0.5"/>
      
      <!-- Upper Eyelid Margin & Lashes -->
      <path d="M 130 200 Q 300 120 470 200" fill="none" stroke="#331405" stroke-width="4.5"/>
      
      <!-- Clinical Macro Watermark / Grid -->
      <g opacity="0.3">
        <circle cx="300" cy="198" r="90" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4,4"/>
        <line x1="300" y1="90" x2="300" y2="120" stroke="#38bdf8" stroke-width="1.5"/>
        <line x1="300" y1="280" x2="300" y2="310" stroke="#38bdf8" stroke-width="1.5"/>
        <line x1="190" y1="198" x2="220" y2="198" stroke="#38bdf8" stroke-width="1.5"/>
        <line x1="380" y1="198" x2="410" y2="198" stroke="#38bdf8" stroke-width="1.5"/>
      </g>
      
      <!-- Metadata Tag -->
      <rect x="20" y="355" width="230" height="28" rx="6" fill="#0f172a" opacity="0.85"/>
      <text x="32" y="373" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">MACRO-CAM • CORNEA 1920x1080</text>
    </svg>
  `)}`,

  DERMATOLOGY: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <defs>
        <radialGradient id="infantSkin" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#fdd7bd"/>
          <stop offset="60%" stop-color="#f9c4a5"/>
          <stop offset="100%" stop-color="#e8a883"/>
        </radialGradient>
        <radialGradient id="erythemaPatch" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.35"/>
          <stop offset="70%" stop-color="#f87171" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#f87171" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="papule" cx="35%" cy="35%" r="45%">
          <stop offset="0%" stop-color="#ff8585"/>
          <stop offset="50%" stop-color="#dc2626"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </radialGradient>
      </defs>
      <!-- Infant Neck / Upper Torso Skin Canvas -->
      <rect width="600" height="400" fill="url(#infantSkin)"/>
      
      <!-- Natural Crease / Flexure Line -->
      <path d="M 0 160 Q 280 230 600 150" fill="none" stroke="#d97706" stroke-width="4" opacity="0.25"/>
      <path d="M 20 165 Q 290 238 580 155" fill="none" stroke="#b45309" stroke-width="1.5" opacity="0.35"/>
      
      <!-- Erythematous Flush Patches (Miliaria Base) -->
      <circle cx="280" cy="190" r="140" fill="url(#erythemaPatch)"/>
      <circle cx="180" cy="220" r="90" fill="url(#erythemaPatch)"/>
      <circle cx="390" cy="210" r="110" fill="url(#erythemaPatch)"/>
      
      <!-- Pinpoint Miliaria Rubra Papules (Cluster) -->
      <g>
        <!-- Cluster 1: Central Neck Crease -->
        <circle cx="270" cy="180" r="4.5" fill="url(#papule)"/>
        <circle cx="285" cy="175" r="3.5" fill="url(#papule)"/>
        <circle cx="260" cy="195" r="4" fill="url(#papule)"/>
        <circle cx="295" cy="190" r="5" fill="url(#papule)"/>
        <circle cx="278" cy="205" r="3.8" fill="url(#papule)"/>
        <circle cx="310" cy="182" r="4.2" fill="url(#papule)"/>
        <circle cx="250" cy="175" r="3" fill="url(#papule)"/>
        <circle cx="325" cy="195" r="4" fill="url(#papule)"/>
        <circle cx="290" cy="215" r="3.5" fill="url(#papule)"/>
        <circle cx="308" cy="208" r="4.8" fill="url(#papule)"/>
        
        <!-- Cluster 2: Left Anterior -->
        <circle cx="210" cy="190" r="3.5" fill="url(#papule)"/>
        <circle cx="225" cy="205" r="4.5" fill="url(#papule)"/>
        <circle cx="195" cy="215" r="4" fill="url(#papule)"/>
        <circle cx="230" cy="225" r="3.2" fill="url(#papule)"/>
        <circle cx="215" cy="240" r="4" fill="url(#papule)"/>
        <circle cx="180" cy="235" r="3" fill="url(#papule)"/>
        
        <!-- Cluster 3: Right Anterior & Chest -->
        <circle cx="350" cy="195" r="4.2" fill="url(#papule)"/>
        <circle cx="370" cy="210" r="3.8" fill="url(#papule)"/>
        <circle cx="340" cy="225" r="4" fill="url(#papule)"/>
        <circle cx="385" cy="220" r="4.5" fill="url(#papule)"/>
        <circle cx="360" cy="240" r="3.5" fill="url(#papule)"/>
        <circle cx="405" cy="230" r="3" fill="url(#papule)"/>
        <circle cx="330" cy="250" r="4.2" fill="url(#papule)"/>
        
        <!-- Pinpoint Vesicular / Clear Head Highlights -->
        <circle cx="269" cy="179" r="1" fill="#ffffff" opacity="0.8"/>
        <circle cx="294" cy="189" r="1.2" fill="#ffffff" opacity="0.9"/>
        <circle cx="307" cy="207" r="1.2" fill="#ffffff" opacity="0.85"/>
        <circle cx="224" cy="204" r="1" fill="#ffffff" opacity="0.8"/>
        <circle cx="369" cy="209" r="1" fill="#ffffff" opacity="0.85"/>
      </g>
      
      <!-- Diagnostic Scale / Measurement Ruler -->
      <g transform="translate(470, 310)" opacity="0.85">
        <rect x="0" y="0" width="105" height="34" rx="4" fill="#0f172a"/>
        <line x1="10" y1="20" x2="95" y2="20" stroke="#f8fafc" stroke-width="1.5"/>
        <line x1="10" y1="12" x2="10" y2="28" stroke="#f8fafc" stroke-width="1.5"/>
        <line x1="52" y1="15" x2="52" y2="25" stroke="#f8fafc" stroke-width="1"/>
        <line x1="95" y1="12" x2="95" y2="28" stroke="#f8fafc" stroke-width="1.5"/>
        <text x="35" y="11" fill="#38bdf8" font-family="sans-serif" font-size="9" font-weight="bold">10 mm</text>
      </g>
      
      <!-- Metadata Stamp -->
      <rect x="20" y="355" width="220" height="28" rx="6" fill="#0f172a" opacity="0.85"/>
      <text x="32" y="373" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">DERM-HD • POLARIZED 10X</text>
    </svg>
  `)}`,

  WOUND_ULCER: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <defs>
        <radialGradient id="plantarSkin" cx="40%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#dfbfa3"/>
          <stop offset="70%" stop-color="#ca9a78"/>
          <stop offset="100%" stop-color="#9a6e4d"/>
        </radialGradient>
        <radialGradient id="callus" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="60%" stop-color="#eab308"/>
          <stop offset="90%" stop-color="#ca8a04"/>
          <stop offset="100%" stop-color="#a16207"/>
        </radialGradient>
        <linearGradient id="fissureDepth" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#7f1d1d"/>
          <stop offset="40%" stop-color="#450a0a"/>
          <stop offset="70%" stop-color="#7f1d1d"/>
          <stop offset="100%" stop-color="#b91c1c"/>
        </linearGradient>
      </defs>
      <!-- Plantar Heel Surface -->
      <rect width="600" height="400" fill="url(#plantarSkin)"/>
      
      <!-- Heel Contour Shadow -->
      <path d="M 80 50 Q 520 70 500 350 Q 250 420 80 340 Z" fill="#b45309" opacity="0.12"/>
      
      <!-- Hyperkeratotic Callus Border -->
      <ellipse cx="300" cy="210" rx="150" ry="110" fill="url(#callus)" opacity="0.75"/>
      <ellipse cx="300" cy="210" rx="120" ry="85" fill="#fef9c3" opacity="0.45"/>
      
      <!-- Surrounding Erythematous Margin -->
      <ellipse cx="300" cy="210" rx="170" ry="125" fill="none" stroke="#ef4444" stroke-width="8" opacity="0.35"/>
      
      <!-- Main Deep Skin Fissure Crack -->
      <path d="M 230 150 Q 270 190 290 215 Q 320 250 360 270" fill="none" stroke="url(#fissureDepth)" stroke-width="9" stroke-linecap="round"/>
      <path d="M 230 150 Q 270 190 290 215 Q 320 250 360 270" fill="none" stroke="#450a0a" stroke-width="4" stroke-linecap="round"/>
      
      <!-- Secondary Minor Fissure Branches -->
      <path d="M 285 205 Q 325 190 350 185" fill="none" stroke="#991b1b" stroke-width="4" stroke-linecap="round"/>
      <path d="M 270 230 Q 240 255 220 260" fill="none" stroke="#991b1b" stroke-width="3" stroke-linecap="round"/>
      
      <!-- Skin Desquamation / Peeling Flakes -->
      <path d="M 225 145 Q 235 140 240 148" fill="none" stroke="#fef08a" stroke-width="2.5"/>
      <path d="M 355 265 Q 365 275 375 268" fill="none" stroke="#fef08a" stroke-width="2.5"/>
      
      <!-- Monofilament Sensory Test Marker Point -->
      <circle cx="210" cy="200" r="7" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3,3"/>
      <circle cx="210" cy="200" r="2.5" fill="#2563eb"/>
      <text x="175" y="185" fill="#1e3a8a" font-family="sans-serif" font-size="10" font-weight="bold">10g Semmes-Weinstein Pt</text>
      
      <!-- Metric Calibration -->
      <g transform="translate(460, 310)" opacity="0.85">
        <rect x="0" y="0" width="115" height="34" rx="4" fill="#0f172a"/>
        <line x1="10" y1="20" x2="105" y2="20" stroke="#f8fafc" stroke-width="1.5"/>
        <line x1="10" y1="12" x2="10" y2="28" stroke="#f8fafc" stroke-width="1.5"/>
        <line x1="57" y1="15" x2="57" y2="25" stroke="#f8fafc" stroke-width="1"/>
        <line x1="105" y1="12" x2="105" y2="28" stroke="#f8fafc" stroke-width="1.5"/>
        <text x="38" y="11" fill="#facc15" font-family="sans-serif" font-size="9" font-weight="bold">20 mm</text>
      </g>
      
      <!-- Metadata Tag -->
      <rect x="20" y="355" width="235" height="28" rx="6" fill="#0f172a" opacity="0.85"/>
      <text x="32" y="373" fill="#facc15" font-family="monospace" font-size="11" font-weight="bold">WOUND-CAM • DEPTH GRADE 1</text>
    </svg>
  `)}`,

  ANIMAL_BITE: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <defs>
        <radialGradient id="legSkin" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#dfb190"/>
          <stop offset="80%" stop-color="#ca9b78"/>
          <stop offset="100%" stop-color="#af7e5b"/>
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill="url(#legSkin)"/>
      <!-- Edema & Erythema Halo -->
      <ellipse cx="300" cy="200" rx="140" ry="100" fill="#ef4444" opacity="0.3" filter="blur(6px)"/>
      <!-- Puncture Wounds (Canine bite teeth marks) -->
      <ellipse cx="260" cy="170" rx="9" ry="6" fill="#450a0a" stroke="#b91c1c" stroke-width="2"/>
      <ellipse cx="340" cy="170" rx="9" ry="6" fill="#450a0a" stroke="#b91c1c" stroke-width="2"/>
      <ellipse cx="270" cy="230" rx="8" ry="5" fill="#450a0a" stroke="#b91c1c" stroke-width="2"/>
      <ellipse cx="330" cy="230" rx="8" ry="5" fill="#450a0a" stroke="#b91c1c" stroke-width="2"/>
      <!-- Laceration Scratch -->
      <path d="M 265 175 Q 285 195 272 225" fill="none" stroke="#991b1b" stroke-width="3" stroke-linecap="round"/>
      <rect x="20" y="355" width="220" height="28" rx="6" fill="#0f172a" opacity="0.85"/>
      <text x="32" y="373" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold">TRAUMA-CAM • BITE GRADE 2</text>
    </svg>
  `)}`
};

/**
 * Returns a clinical photo preview URL for a given category or fallback
 */
export function getClinicalPhoto(category, customPhotoUrl = null) {
  if (customPhotoUrl && typeof customPhotoUrl === 'string' && customPhotoUrl.trim().length > 0) {
    return customPhotoUrl;
  }
  const key = (category || 'DERMATOLOGY').toUpperCase();
  return CLINICAL_PHOTOS[key] || CLINICAL_PHOTOS.DERMATOLOGY;
}
