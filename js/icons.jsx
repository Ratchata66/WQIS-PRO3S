/* global React */
// Minimal industrial icon set — outline 1.6px stroke, currentColor.
// All icons accept { size = 18 }.

const I = ({ d, size = 18, fill, stroke = "currentColor", sw = 1.6, vb = "0 0 24 24", children }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill || "none"} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);

const Icons = {
  Dashboard: (p) => <I {...p}><rect x="3" y="3" width="8" height="9" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/></I>,
  Inspect:   (p) => <I {...p}><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/><path d="M9 11h4M11 9v4"/></I>,
  Project:   (p) => <I {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 11h18"/></I>,
  Folder:    (p) => <I {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></I>,
  Welder:    (p) => <I {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/><path d="M12 4.5V3M7.8 5.8 6.7 4.7M16.2 5.8l1.1-1.1"/></I>,
  Doc:       (p) => <I {...p}><path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5"/><path d="M9 13h7M9 17h7M9 9h3"/></I>,
  Report:    (p) => <I {...p}><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 9h8M8 13h8M8 17h5"/></I>,
  Workflow:  (p) => <I {...p}><circle cx="5" cy="6" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="12" r="2.2"/><path d="M7 7l10 4M7 17l10-4"/></I>,
  Settings:  (p) => <I {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06A2 2 0 0 1 4.18 16.94l.06-.06A1.7 1.7 0 0 0 4.58 15a1.7 1.7 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.08A1.7 1.7 0 0 0 4.63 8.89a1.7 1.7 0 0 0-.34-1.87l-.06-.06A2 2 0 0 1 7.06 4.13l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 1 1.51 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.51 1z"/></I>,
  Standard:  (p) => <I {...p}><path d="M4 4h16v6H4zM4 14h16v6H4z"/><path d="M8 7h6M8 17h6"/></I>,
  Chart:     (p) => <I {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></I>,
  Search:    (p) => <I {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></I>,
  Bell:      (p) => <I {...p}><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/></I>,
  Sun:       (p) => <I {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></I>,
  Moon:      (p) => <I {...p}><path d="M21 13.5A9 9 0 1 1 10.5 3a7 7 0 0 0 10.5 10.5z"/></I>,
  Plus:      (p) => <I {...p}><path d="M12 5v14M5 12h14"/></I>,
  Upload:    (p) => <I {...p}><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></I>,
  Download:  (p) => <I {...p}><path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></I>,
  Camera:    (p) => <I {...p}><path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/></I>,
  Zap:       (p) => <I {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></I>,
  ChevR:     (p) => <I {...p}><path d="m9 6 6 6-6 6"/></I>,
  ChevD:     (p) => <I {...p}><path d="m6 9 6 6 6-6"/></I>,
  ChevL:     (p) => <I {...p}><path d="m15 6-6 6 6 6"/></I>,
  Close:     (p) => <I {...p}><path d="M6 6l12 12M6 18 18 6"/></I>,
  Check:     (p) => <I {...p}><path d="M5 12.5 10 17 19 7"/></I>,
  Warn:      (p) => <I {...p}><path d="M12 4 2 20h20Z"/><path d="M12 10v5M12 17.5v.5"/></I>,
  Info:      (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></I>,
  X:         (p) => <I {...p}><path d="M6 6l12 12M6 18 18 6"/></I>,
  Cross:     (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M9 15l6-6"/></I>,
  Tick:      (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></I>,
  Pause:     (p) => <I {...p}><path d="M9 5v14M15 5v14"/></I>,
  Play:      (p) => <I {...p}><path d="M7 4v16l13-8z"/></I>,
  Refresh:   (p) => <I {...p}><path d="M4 12a8 8 0 0 1 14-5l2 2"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5l-2-2"/><path d="M4 20v-5h5"/></I>,
  Filter:    (p) => <I {...p}><path d="M3 5h18l-7 9v6l-4-2v-4z"/></I>,
  Grid:      (p) => <I {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></I>,
  Rows:      (p) => <I {...p}><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/></I>,
  Calendar:  (p) => <I {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></I>,
  User:      (p) => <I {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></I>,
  Users:     (p) => <I {...p}><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M14 14c2.8 0 7 1.5 7 6"/></I>,
  Logout:    (p) => <I {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></I>,
  Drag:      (p) => <I {...p}><circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/></I>,
  More:      (p) => <I {...p}><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></I>,
  Image:     (p) => <I {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 4 4 3-3 4 4"/></I>,
  Layers:    (p) => <I {...p}><path d="M12 3 3 8l9 5 9-5z"/><path d="m3 13 9 5 9-5M3 18l9 5 9-5"/></I>,
  Lock:      (p) => <I {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></I>,
  Mail:      (p) => <I {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></I>,
  Eye:       (p) => <I {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></I>,
  Shield:    (p) => <I {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></I>,
  Scan:      (p) => <I {...p}><path d="M4 7V5a2 2 0 0 1 2-2h2M16 3h2a2 2 0 0 1 2 2v2M20 17v2a2 2 0 0 1-2 2h-2M8 21H6a2 2 0 0 1-2-2v-2"/><path d="M3 12h18"/></I>,
  Cpu:       (p) => <I {...p}><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></I>,
  Activity:  (p) => <I {...p}><path d="M3 12h4l3-8 4 16 3-8h4"/></I>,
  Pin:       (p) => <I {...p}><path d="M12 2v6l4 4-2 2-4-4-3 6-2-2 6-3-4-4 4-2z"/></I>,
  Trash:     (p) => <I {...p}><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"/></I>,
  Compare:   (p) => <I {...p}><rect x="3" y="5" width="8" height="14" rx="1"/><rect x="13" y="5" width="8" height="14" rx="1"/><path d="M7 3v2M7 19v2M17 3v2M17 19v2"/></I>,
  Beaker:    (p) => <I {...p}><path d="M9 3v6L4 19a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 19l-5-10V3"/><path d="M8 3h8M6 14h12"/></I>,
};

window.Icons = Icons;
