/* global window */
// Mock data + helpers for WQIS-PRO3S

const WQIS_DATA = {
  kpis: [
    { id: "welds",   label: "Total Welds",   value: 18742, unit: "", delta: 2.4,  trend: [12,14,15,16,18,17,19,20,22,21,23,24] },
    { id: "pass",    label: "Pass Rate",     value: 96.8,  unit: "%", delta: 1.1, trend: [92,93,93,94,94,95,95,96,96,96,97,97] },
    { id: "reject",  label: "Reject Rate",   value: 3.2,   unit: "%", delta: -1.1, trend: [8,7,7,6,6,5,5,4,4,4,3,3] },
    { id: "pending", label: "Pending Review",value: 47,    unit: "",  delta: 12,  trend: [20,25,28,30,35,38,40,42,45,46,46,47] },
    { id: "active",  label: "Active Projects", value: 23,  unit: "",  delta: 2,   trend: [15,15,17,18,18,19,20,21,21,22,22,23] },
    { id: "ai",      label: "AI Accuracy",   value: 99.2,  unit: "%", delta: 0.3, trend: [97,97,98,98,98,98,99,99,99,99,99,99] },
  ],

  passDist: [
    { label: "Pass",    value: 96.8, color: "var(--ok)" },
    { label: "Review",  value: 1.4,  color: "var(--warn)" },
    { label: "Reject",  value: 1.8,  color: "var(--bad)" },
  ],

  defectMix: [
    { label: "Porosity",              value: 38, severity: "minor" },
    { label: "Undercut",              value: 24, severity: "major" },
    { label: "Incomplete Fusion",     value: 14, severity: "major" },
    { label: "Crack",                 value:  9, severity: "critical" },
    { label: "Incomplete Penetration",value:  8, severity: "major" },
    { label: "Burn Through",          value:  7, severity: "minor" },
  ],

  timeline: [
    { hour: "00", insp: 12, pass: 12, fail: 0 },
    { hour: "02", insp: 8,  pass: 8,  fail: 0 },
    { hour: "04", insp: 6,  pass: 5,  fail: 1 },
    { hour: "06", insp: 24, pass: 23, fail: 1 },
    { hour: "08", insp: 68, pass: 65, fail: 3 },
    { hour: "10", insp: 92, pass: 89, fail: 3 },
    { hour: "12", insp: 78, pass: 74, fail: 4 },
    { hour: "14", insp: 104,pass: 99, fail: 5 },
    { hour: "16", insp: 88, pass: 84, fail: 4 },
    { hour: "18", insp: 42, pass: 41, fail: 1 },
    { hour: "20", insp: 28, pass: 27, fail: 1 },
    { hour: "22", insp: 18, pass: 18, fail: 0 },
  ],

  welders: [
    { id: "WD-014", name: "Somchai Pratchaya",  initials: "SP", code: "TIG-204",  pass: 98.4, repair: 0.8, jobs: 1284, rank: 1, qual: "ASME IX · 6G",   proc: ["GTAW","GMAW"], pos: ["6G","5G","2G"], status: "active" },
    { id: "WD-022", name: "Wirot Chanthorn",    initials: "WC", code: "TIG-188",  pass: 97.9, repair: 1.1, jobs: 1102, rank: 2, qual: "ASME IX · 6G",   proc: ["GTAW"],       pos: ["6G","5G"],      status: "active" },
    { id: "WD-007", name: "Niran Kosolwat",     initials: "NK", code: "MIG-156",  pass: 96.7, repair: 1.6, jobs: 982,  rank: 3, qual: "ISO 9606 · 5G",  proc: ["GMAW","FCAW"],pos: ["5G","2G"],      status: "active" },
    { id: "WD-031", name: "Apinya Rattana",     initials: "AR", code: "TIG-244",  pass: 96.2, repair: 1.9, jobs: 864,  rank: 4, qual: "ASME IX · 6G",   proc: ["GTAW","SMAW"],pos: ["6G","5G","3G"], status: "active" },
    { id: "WD-019", name: "Boonmee Saengthong", initials: "BS", code: "MIG-201",  pass: 95.8, repair: 2.2, jobs: 740,  rank: 5, qual: "ASME IX · 5G",   proc: ["GMAW"],       pos: ["5G","2G"],      status: "training" },
    { id: "WD-042", name: "Kanya Phetcharoen",  initials: "KP", code: "TIG-312",  pass: 95.1, repair: 2.6, jobs: 612,  rank: 6, qual: "ISO 9606 · 5G",  proc: ["GTAW"],       pos: ["5G","3G"],      status: "active" },
    { id: "WD-028", name: "Prasert Inthawong",  initials: "PI", code: "STK-098",  pass: 94.4, repair: 3.0, jobs: 588,  rank: 7, qual: "ASME IX · 3G",   proc: ["SMAW","FCAW"],pos: ["3G","2G","1G"], status: "active" },
    { id: "WD-035", name: "Nattaporn Suksawat", initials: "NS", code: "TIG-289",  pass: 93.9, repair: 3.3, jobs: 524,  rank: 8, qual: "ISO 9606 · 3G",  proc: ["GTAW","GMAW"],pos: ["3G","2G"],      status: "active" },
  ],

  projects: [
    {
      id: "PRJ-2026-014", code: "SYN-L3",
      name: "Synova Aseptic Line 3",
      client: "Synova Foods (TH)",
      industry: "Food & Beverage",
      progress: 87, joints: 1842, joints_done: 1602,
      qa: "in-review", pass: 97.4, lead: "QC-Manop",
      team: 12, due: "2026-06-18",
      desc: "Orbital GTAW build-out of CIP/SIP loop — SUS316L, 1\u20133\" tube, Ra ≤ 0.4 µm.",
    },
    {
      id: "PRJ-2026-021", code: "TPA-CIP",
      name: "TPA CIP Station Retrofit",
      client: "Tetra Pak Asia",
      industry: "Food & Beverage",
      progress: 62, joints: 928, joints_done: 575,
      qa: "approved", pass: 98.1, lead: "QC-Wirot",
      team: 8, due: "2026-07-04",
      desc: "Replacement of CIP supply manifold + valve cluster, full BPE compliance.",
    },
    {
      id: "PRJ-2026-009", code: "AVH-HYG",
      name: "Aseptic Valve Hub",
      client: "Alfa Laval (LKB-F)",
      industry: "Pharmaceutical",
      progress: 34, joints: 612, joints_done: 208,
      qa: "pending", pass: 95.6, lead: "QC-Manop",
      team: 6, due: "2026-08-22",
      desc: "Hygienic mixproof valve assemblies — SUS316L · ASME BPE 2024.",
    },
    {
      id: "PRJ-2026-003", code: "RB25-P91",
      name: "Refinery Block 25 — P91 Headers",
      client: "Bangchak Refining",
      industry: "Oil & Gas",
      progress: 78, joints: 268, joints_done: 209,
      qa: "in-review", pass: 92.8, lead: "QC-Boonmee",
      team: 5, due: "2026-05-30",
      desc: "Cr-Mo P91 high-temp headers — preheat 250 °C, PWHT 760 °C × 4 h.",
    },
    {
      id: "PRJ-2025-088", code: "PCP-08",
      name: "Process Plant 08 — Slurry",
      client: "SCG Chemicals",
      industry: "Process Plant",
      progress: 100, joints: 1456, joints_done: 1456,
      qa: "approved", pass: 96.9, lead: "QC-Niran",
      team: 14, due: "2026-04-20",
      desc: "Carbon steel slurry lines, Sch 80, completed and signed off.",
    },
    {
      id: "PRJ-2026-026", code: "STN-HYG",
      name: "Stainless Hygienic Skid 04",
      client: "Betagro Group",
      industry: "Stainless Hygienic Piping",
      progress: 12, joints: 384, joints_done: 46,
      qa: "pending", pass: 0, lead: "QC-Wirot",
      team: 4, due: "2026-09-12",
      desc: "Pre-fab hygienic skid — orbital GTAW, Ra ≤ 0.4 µm, full borescope log.",
    },
  ],

  joints: [
    { id: "J-1602", spool: "SP-A-12", wps: "WPS-001", welder: "WD-014", dia: '2"', sch: "10S", pos: "5G", date: "2026-05-14 09:42", verdict: "pass", conf: 99.1, defects: [] },
    { id: "J-1601", spool: "SP-A-12", wps: "WPS-001", welder: "WD-014", dia: '2"', sch: "10S", pos: "5G", date: "2026-05-14 09:18", verdict: "pass", conf: 98.6, defects: [] },
    { id: "J-1600", spool: "SP-A-12", wps: "WPS-001", welder: "WD-022", dia: '2"', sch: "10S", pos: "5G", date: "2026-05-14 08:54", verdict: "review", conf: 78.2, defects: ["porosity"] },
    { id: "J-1599", spool: "SP-A-11", wps: "WPS-001", welder: "WD-022", dia: '1.5"', sch: "10S", pos: "2G", date: "2026-05-14 08:30", verdict: "fail",  conf: 94.4, defects: ["undercut","incomplete-fusion"] },
    { id: "J-1598", spool: "SP-A-11", wps: "WPS-001", welder: "WD-007", dia: '1.5"', sch: "10S", pos: "2G", date: "2026-05-14 08:06", verdict: "pass", conf: 97.9, defects: [] },
    { id: "J-1597", spool: "SP-A-11", wps: "WPS-002", welder: "WD-007", dia: '1.5"', sch: "10S", pos: "2G", date: "2026-05-14 07:42", verdict: "pass", conf: 96.5, defects: [] },
    { id: "J-1596", spool: "SP-B-04", wps: "WPS-001", welder: "WD-031", dia: '3"',  sch: "10S", pos: "6G", date: "2026-05-13 17:22", verdict: "pass", conf: 99.4, defects: [] },
    { id: "J-1595", spool: "SP-B-04", wps: "WPS-001", welder: "WD-031", dia: '3"',  sch: "10S", pos: "6G", date: "2026-05-13 16:58", verdict: "review", conf: 81.7, defects: ["oxide-discoloration"] },
    { id: "J-1594", spool: "SP-B-04", wps: "WPS-001", welder: "WD-019", dia: '3"',  sch: "10S", pos: "6G", date: "2026-05-13 16:34", verdict: "fail", conf: 92.1, defects: ["crack"] },
    { id: "J-1593", spool: "SP-B-03", wps: "WPS-001", welder: "WD-019", dia: '3"',  sch: "10S", pos: "6G", date: "2026-05-13 16:10", verdict: "pass", conf: 95.8, defects: [] },
  ],

  activity: [
    { t: "13:51", kind: "ai",     who: "AI Engine",      msg: "Inspected J-1602 — PASS (99.1%)",       proj: "SYN-L3" },
    { t: "13:48", kind: "review", who: "Manop K.",       msg: "Approved batch SP-A-12 (24 joints)",     proj: "SYN-L3" },
    { t: "13:42", kind: "fail",   who: "AI Engine",      msg: "FAIL detected on J-1599 — undercut",     proj: "SYN-L3" },
    { t: "13:35", kind: "upload", who: "WD-014",         msg: "Uploaded 12 images to batch SP-A-12",    proj: "SYN-L3" },
    { t: "13:22", kind: "wps",    who: "Wirot C.",       msg: "Submitted WPS-004 rev. B for approval",  proj: "TPA-CIP" },
    { t: "12:58", kind: "ai",     who: "AI Engine",      msg: "Model cloud-v2 re-trained · acc 99.24%", proj: "system" },
    { t: "12:40", kind: "ok",     who: "Client (Synova)",msg: "Signed daily report 2026-05-13",         proj: "SYN-L3" },
    { t: "12:18", kind: "review", who: "Boonmee S.",     msg: "Returned J-1576 for repair",             proj: "RB25-P91" },
  ],

  defects: [
    { id: "porosity",              label: "Porosity",                severity: "minor",    cls: "warn", desc: "Gas bubbles trapped during solidification." },
    { id: "undercut",              label: "Undercut",                severity: "major",    cls: "bad",  desc: "Groove melted into base metal adjacent to weld toe." },
    { id: "crack",                 label: "Crack",                   severity: "critical", cls: "bad",  desc: "Fracture-type discontinuity — auto-reject." },
    { id: "burn-through",          label: "Burn Through",            severity: "minor",    cls: "warn", desc: "Excessive penetration causing hole in weld root." },
    { id: "incomplete-fusion",     label: "Incomplete Fusion",       severity: "major",    cls: "bad",  desc: "Weld metal did not fuse with base metal or prior pass." },
    { id: "incomplete-penetration",label: "Incomplete Penetration",  severity: "major",    cls: "bad",  desc: "Joint root not fully filled — strength reduced." },
    { id: "oxide-discoloration",   label: "Oxide Discoloration",     severity: "review",   cls: "warn", desc: "Surface oxide level above acceptance \u2014 verify purge." },
  ],

  wps: [
    { id: "WPS-001", proc: "GTAW", mat: "SUS316L", thk: "1.5\u20136 mm", gas: "Ar 99.99%", rev: "C", date: "2026-02-12", status: "approved", pqr: "PQR-001", by: "QC-Manop" },
    { id: "WPS-002", proc: "GMAW", mat: "CS A36",  thk: "3\u201310 mm",  gas: "82/18 Ar/CO2", rev: "B", date: "2026-01-30", status: "approved", pqr: "PQR-002", by: "QC-Wirot" },
    { id: "WPS-003", proc: "GTAW", mat: "SUS304",  thk: "1\u20134 mm",   gas: "Ar 99.99%", rev: "A", date: "2025-12-08", status: "approved", pqr: "PQR-001", by: "QC-Manop" },
    { id: "WPS-004", proc: "SMAW", mat: "P91",     thk: "8\u201320 mm",  gas: "—",          rev: "B", date: "2026-05-12", status: "review",   pqr: "PQR-003", by: "QC-Boonmee" },
    { id: "WPS-005", proc: "FCAW", mat: "CS A106", thk: "5\u201312 mm",  gas: "100% CO2",   rev: "A", date: "2026-03-04", status: "approved", pqr: "PQR-004", by: "QC-Niran" },
    { id: "WPS-006", proc: "GTAW", mat: "Duplex 2205", thk: "2\u20135 mm", gas: "Ar+N2",    rev: "A", date: "2026-04-22", status: "draft",    pqr: "PQR-005", by: "QC-Manop" },
  ],

  // 8 cols × 5 rows defect heatmap (defect intensity per joint cluster)
  heat: (() => {
    const rows = ["SP-A-11","SP-A-12","SP-B-03","SP-B-04","SP-C-01"];
    const cols = 14;
    const seed = [
      [0,1,0,2,1,0,0,3,1,0,2,1,0,1],
      [1,0,2,1,3,4,2,1,0,1,0,2,1,0],
      [0,0,1,0,2,1,0,0,1,2,3,1,0,1],
      [2,1,0,1,5,4,3,2,1,0,0,1,2,1],
      [0,1,1,0,2,1,4,3,2,1,0,1,0,0],
    ];
    return { rows, cols, data: seed };
  })(),

  notifications: [
    { t: "2 min", title: "FAIL — Crack detected", body: "J-1594 / SP-B-04 — Synova Line 3", kind: "bad" },
    { t: "8 min", title: "WPS-004 awaiting your approval", body: "Wirot submitted rev. B", kind: "warn" },
    { t: "24 min", title: "Daily report signed by client", body: "Synova Foods — 2026-05-13", kind: "ok" },
    { t: "1 hr",  title: "AI model updated to cloud-v2", body: "Accuracy 99.24% on validation set", kind: "info" },
    { t: "3 hr",  title: "New welder qualification",     body: "Apinya Rattana — 6G renewed", kind: "info" },
  ],

  pendingApprovals: [
    { id: "AP-2148", item: "Daily QA Report — 2026-05-13", proj: "SYN-L3", stage: "client",    sub: "Manop K.",   age: "4 hr"  },
    { id: "AP-2147", item: "WPS-004 Rev. B",               proj: "TPA-CIP", stage: "qa",       sub: "Wirot C.",   age: "8 hr"  },
    { id: "AP-2145", item: "Batch SP-B-04 — 24 joints",    proj: "RB25-P91",stage: "qa",       sub: "Boonmee S.", age: "1 d"   },
    { id: "AP-2143", item: "Welder WD-019 — re-qualif.",   proj: "—",       stage: "inspector",sub: "AI Engine",  age: "1 d"   },
    { id: "AP-2141", item: "PQR-005 (Duplex 2205)",        proj: "—",       stage: "qa",       sub: "Manop K.",   age: "2 d"   },
  ],

  industries: [
    "Food & Beverage", "Pharmaceutical", "Oil & Gas",
    "Stainless Hygienic Piping", "Process Plant", "Industrial Fabrication",
  ],
};

window.WQIS_DATA = WQIS_DATA;

// helpers
window.WQIS_FMT = {
  num: (n) => new Intl.NumberFormat("en-US").format(n),
  pct: (n, d = 1) => `${n.toFixed(d)}%`,
  d: new Date(),
};
