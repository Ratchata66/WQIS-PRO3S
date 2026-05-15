/* global React, Icons, Charts, WQIS_DATA */

// ============== WELDERS =============================================
const WelderProfile = ({ w, onBack }) => (
  <div className="page" style={{ padding: 24 }}>
    <div className="bg-grid"/>
    <div className="row" style={{ marginBottom: 16 }}>
      <button className="btn ghost sm" onClick={onBack}><Icons.ChevL size={14}/> Welders</button>
      <span className="mono" style={{ fontSize: 10.5, color: "var(--t-4)", letterSpacing: "0.1em" }}>
        WELDERS / <b style={{ color: "var(--amber-2)" }}>{w.id}</b>
      </span>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 14 }}>
      {/* profile card */}
      <div className="panel glass">
        <div className="panel-body" style={{ textAlign: "center" }}>
          <div className="avatar lg" style={{ width: 88, height: 88, fontSize: 28, margin: "8px auto 14px",
                background: "linear-gradient(135deg, var(--amber), #c75300)" }}>
            {w.initials}
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>{w.name}</div>
          <div className="mono" style={{ fontSize: 11, color: "var(--amber-2)", letterSpacing: "0.12em", marginTop: 4 }}>
            {w.code} · {w.id}
          </div>
          <div className="row" style={{ justifyContent: "center", marginTop: 12, gap: 6 }}>
            {w.status === "active"   && <span className="chip ok"><span className="dot"/>ACTIVE</span>}
            {w.status === "training" && <span className="chip warn"><span className="dot"/>TRAINING</span>}
            <span className="chip amber">RANK #{w.rank}</span>
          </div>

          <div style={{ marginTop: 18, borderTop: "1px solid var(--border-1)", paddingTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { l: "Pass rate", tl: "อัตราผ่าน", v: `${w.pass}%`, c: "var(--ok)", bg: "var(--ok-soft)", bd: "var(--ok-line)" },
                { l: "Repair rate", tl: "อัตราซ่อม", v: `${w.repair}%`, c: "var(--warn)", bg: "var(--warn-soft)", bd: "var(--warn-line)" },
                { l: "Total jobs", tl: "งานทั้งหมด", v: w.jobs, c: "var(--amber)", bg: "var(--amber-soft)", bd: "var(--amber-line)" },
                { l: "Avg conf.", tl: "ความมั่นใจ AI", v: "96.4%", c: "var(--info)", bg: "var(--info-soft)", bd: "var(--info-line)" },
              ].map(m => (
                <div key={m.l} style={{ padding: "10px 12px", borderRadius: 8, background: m.bg, border: `1px solid ${m.bd}` }}>
                  <div className="mono" style={{ fontSize: 9, color: "var(--t-4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{m.l}</div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--t-5)" }}>{m.tl}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: m.c, marginTop: 4 }}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* details */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="panel glass">
          <div className="panel-header"><h3>Qualifications</h3><span className="sub">ASME IX · ISO 9606</span></div>
          <div className="panel-body">
            <table className="tbl">
              <thead><tr><th>Cert</th><th>Process</th><th>Position</th><th>Material</th><th>Issued</th><th>Expires</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td className="mono">CERT-A-014</td><td>{w.proc[0]}</td><td>6G</td><td>SS316L</td><td className="mono">2024-08-12</td><td className="mono">2026-08-11</td><td><span className="chip ok"><span className="dot"/>VALID</span></td></tr>
                <tr><td className="mono">CERT-A-027</td><td>{w.proc.slice(-1)[0]}</td><td>5G</td><td>CS A36</td><td className="mono">2024-11-04</td><td className="mono">2026-11-03</td><td><span className="chip ok"><span className="dot"/>VALID</span></td></tr>
                <tr><td className="mono">CERT-B-009</td><td>GTAW</td><td>2G</td><td>P91</td><td className="mono">2023-04-22</td><td className="mono">2026-04-21</td><td><span className="chip warn"><span className="dot"/>EXP. SOON</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="panel glass">
            <div className="panel-header"><h3>Pass rate trend</h3><span className="sub">90D</span></div>
            <div className="panel-body" style={{ paddingTop: 8 }}>
              <Charts.Area data={[91,93,92,94,95,96,95,97,96,98,97,98.4].map((v,i)=>({label:`W${i+1}`,value:v}))}
                           width={500} height={140} color="var(--ok)"/>
            </div>
          </div>
          <div className="panel glass">
            <div className="panel-header"><h3>Defect breakdown</h3><span className="sub">SELF</span></div>
            <div className="panel-body" style={{ paddingTop: 8 }}>
              <Charts.Bars data={[{label:"Por.",value:8},{label:"Und.",value:5},{label:"IF",value:3},{label:"Crk",value:0},{label:"IP",value:1},{label:"BT",value:1}]}
                           width={400} height={140} color="var(--warn)"/>
            </div>
          </div>
        </div>

        <div className="panel glass">
          <div className="panel-header"><h3>Recent inspections</h3></div>
          <div className="panel-body flush">
            {WQIS_DATA.joints.slice(0, 6).map(j => (
              <div key={j.id} style={{ display: "flex", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--border-1)", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--t-1)", width: 70, fontWeight: 600 }}>{j.id}</span>
                <span className="chip">{j.spool}</span>
                <span className="chip amber">{j.wps}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--t-3)", flex: 1 }}>{j.date}</span>
                {j.verdict === "pass"   && <span className="chip ok"><span className="dot"/>PASS · {j.conf}%</span>}
                {j.verdict === "review" && <span className="chip warn"><span className="dot"/>REVIEW · {j.conf}%</span>}
                {j.verdict === "fail"   && <span className="chip bad"><span className="dot"/>FAIL · {j.conf}%</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WeldersScreen = () => {
  const [open, setOpen] = React.useState(null);
  if (open) return <WelderProfile w={open} onBack={() => setOpen(null)}/>;
  return (
    <div className="page">
      <div className="bg-grid"/>
      <div className="page-head">
        <div>
          <span className="kicker">WORKFORCE · 142 ACTIVE WELDERS</span>
          <h1 style={{ marginTop: 8 }}>Welder management</h1>
          <div className="sub">AI-ranked performance, qualification tracking and certification renewals.</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn ghost sm"><Icons.Filter size={14}/> All processes</button>
          <button className="btn ghost sm"><Icons.Download size={14}/> Export CSV</button>
          <button className="btn primary sm"><Icons.Plus size={14}/> Add welder</button>
        </div>
      </div>

      {/* small KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
        {[
          { l: "Active welders",  tl: "ช่างเชื่อมที่ใช้งาน", v: 142,  u: "",      c: "var(--amber)",  icon: "Welder",   bg: "var(--amber-soft)",  bd: "var(--amber-line)" },
          { l: "Avg pass rate",   tl: "อัตราผ่านเฉลี่ย",     v: 96.1, u: "%",     c: "var(--ok)",     icon: "Tick",     bg: "var(--ok-soft)",     bd: "var(--ok-line)" },
          { l: "Certs expiring",  tl: "ใบรับรองหมดอายุ",     v: 8,    u: " in 30d",c: "var(--warn)",  icon: "Calendar", bg: "var(--warn-soft)",   bd: "var(--warn-line)" },
          { l: "Re-qualification",tl: "อยู่ระหว่าง Re-qual",  v: 3,    u: "",      c: "var(--bad)",    icon: "Refresh",  bg: "var(--bad-soft)",    bd: "var(--bad-line)" },
        ].map(k => {
          const Ico = Icons[k.icon];
          return (
          <div key={k.l} className="panel glass" style={{ padding: "14px 16px", borderTop: `2px solid ${k.bd}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--t-4)", textTransform: "uppercase" }}>{k.l}</div>
                <div className="mono" style={{ fontSize: 9.5, color: "var(--t-5)", marginTop: 2 }}>{k.tl}</div>
              </div>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: k.bg, border: `1px solid ${k.bd}`,
                            display: "grid", placeItems: "center", color: k.c, flexShrink: 0 }}>
                <Ico size={15}/>
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, color: k.c, fontWeight: 600 }}>
              {k.v}<span style={{ fontSize: 13, color: "var(--t-3)", marginLeft: 3, fontWeight: 400 }}>{k.u}</span>
            </div>
          </div>
          );
        })}
      </div>

      <div className="panel glass" style={{ overflow: "hidden" }}>
        <div className="panel-header">
          <h3>Workforce ranking</h3>
          <div className="row" style={{ gap: 8 }}>
            <div className="seg">
              <button className="on">All</button>
              <button>GTAW</button>
              <button>GMAW</button>
              <button>SMAW</button>
              <button>FCAW</button>
            </div>
            <div className="seg">
              <button className="on">30D</button>
              <button>90D</button>
              <button>YTD</button>
            </div>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Rank</th><th>Welder</th><th>Code</th><th>Qualification</th>
              <th>Processes</th><th>Positions</th><th>Jobs (30D)</th>
              <th>Pass rate</th><th>Repair</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {WQIS_DATA.welders.map(w => (
              <tr key={w.id} onClick={() => setOpen(w)} style={{ cursor: "pointer" }}>
                <td>
                  <div style={{ width: 26, height: 26, display: "grid", placeItems: "center",
                                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
                                background: w.rank === 1 ? "var(--amber-soft)" : w.rank <= 3 ? "var(--bg-3)" : "transparent",
                                border: `1px solid ${w.rank === 1 ? "var(--amber-line)" : "var(--border-2)"}`,
                                color: w.rank === 1 ? "var(--amber-2)" : "var(--t-2)",
                                borderRadius: 4 }}>#{w.rank}</div>
                </td>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="avatar sm">{w.initials}</div>
                    <div>
                      <div style={{ color: "var(--t-1)", fontWeight: 600 }}>{w.name}</div>
                      <div className="mono" style={{ fontSize: 10, color: "var(--t-4)", letterSpacing: "0.06em", marginTop: 2 }}>{w.id}</div>
                    </div>
                  </div>
                </td>
                <td className="mono" style={{ color: "var(--amber-2)" }}>{w.code}</td>
                <td className="mono" style={{ fontSize: 11.5, color: "var(--t-2)" }}>{w.qual}</td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    {w.proc.map(p => <span key={p} className="chip">{p}</span>)}
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    {w.pos.map(p => <span key={p} className="chip amber" style={{ fontSize: 10 }}>{p}</span>)}
                  </div>
                </td>
                <td className="mono nums">{w.jobs}</td>
                <td style={{ width: 160 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <div className="bar ok grow"><i style={{ width: `${w.pass}%` }}/></div>
                    <span className="mono nums" style={{ color: "var(--ok)", fontSize: 12 }}>{w.pass}</span>
                  </div>
                </td>
                <td className="mono nums" style={{ color: w.repair < 1.5 ? "var(--ok)" : w.repair < 2.5 ? "var(--warn)" : "var(--bad)" }}>
                  {w.repair}%
                </td>
                <td>
                  {w.status === "active"   && <span className="chip ok"><span className="dot"/>ACTIVE</span>}
                  {w.status === "training" && <span className="chip warn"><span className="dot"/>TRAINING</span>}
                </td>
                <td><Icons.ChevR size={14} stroke="var(--t-4)"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============== WPS / PQR ===========================================
const WpsScreen = () => (
  <div className="page">
    <div className="bg-grid"/>
    <div className="page-head">
      <div>
        <span className="kicker">WPS · PQR · WPQ</span>
        <h1 style={{ marginTop: 8 }}>Welding procedures</h1>
        <div className="sub">Revision-controlled WPS / PQR with material and thickness compatibility checks.</div>
      </div>
      <div className="row" style={{ gap: 8 }}>
        <button className="btn ghost sm"><Icons.Upload size={14}/> Import</button>
        <button className="btn ghost sm"><Icons.Download size={14}/> Export</button>
        <button className="btn primary sm"><Icons.Plus size={14}/> New WPS</button>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
      <div className="panel glass" style={{ overflow: "hidden" }}>
        <div className="panel-header"><h3>WPS register</h3><span className="sub">6 WPS · 5 PQR</span></div>
        <table className="tbl">
          <thead>
            <tr><th>ID</th><th>Process</th><th>Material</th><th>Thickness</th><th>Gas</th><th>Rev</th><th>PQR</th><th>Status</th></tr>
          </thead>
          <tbody>
            {WQIS_DATA.wps.map(w => (
              <tr key={w.id}>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <Icons.Doc size={16} stroke="var(--amber-2)"/>
                    <div>
                      <div className="mono" style={{ color: "var(--t-1)", fontWeight: 600 }}>{w.id}</div>
                      <div className="mono" style={{ fontSize: 10, color: "var(--t-4)", marginTop: 2 }}>{w.date}</div>
                    </div>
                  </div>
                </td>
                <td><span className="chip amber">{w.proc}</span></td>
                <td className="mono" style={{ color: "var(--t-1)" }}>{w.mat}</td>
                <td className="mono">{w.thk}</td>
                <td className="mono" style={{ fontSize: 11, color: "var(--t-3)" }}>{w.gas}</td>
                <td><span className="chip" style={{ fontWeight: 600 }}>{w.rev}</span></td>
                <td className="mono" style={{ color: "var(--info)" }}>{w.pqr}</td>
                <td>
                  {w.status === "approved" && <span className="chip ok"><span className="dot"/>APPROVED</span>}
                  {w.status === "review"   && <span className="chip warn"><span className="dot"/>IN REVIEW</span>}
                  {w.status === "draft"    && <span className="chip"><span className="dot"/>DRAFT</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="panel accent" style={{ borderTop: "2px solid var(--amber-line)" }}>
          <div className="panel-header">
            <div>
              <h3 style={{ marginBottom: 2 }}>WPS-001 · GTAW · SUS316L</h3>
              <div className="mono" style={{ fontSize: 9.5, color: "var(--t-4)", letterSpacing: "0.1em" }}>
                ข้อกำหนดวิธีการเชื่อม · ระบบท่อ Hygienic
              </div>
            </div>
            <span className="chip ok"><span className="dot"/>APPROVED · REV C</span>
          </div>
          {/* 4 quick badges */}
          <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--border-1)", display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span className="chip amber"><Icons.Zap size={11}/> GTAW Orbital</span>
            <span className="chip info">SUS316L · P-No 8</span>
            <span className="chip">5G · 6G · 2G</span>
            <span className="chip">1.5 – 6.0 mm</span>
            <span className="chip ok">PWHT: N/A</span>
          </div>
          <div className="panel-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {[
                ["Process",        "GTAW (141) — Orbital"],
                ["Base material",  "ASTM A270 SUS316L · P-No 8"],
                ["Filler",         "ER316L · Ø 1.6 mm · F-No 6"],
                ["Position",       "5G · 6G · 2G"],
                ["Thickness",      "1.5 – 6.0 mm"],
                ["Shielding gas",  "Ar 99.99% · 14 L/min"],
                ["Backing gas",    "Ar 99.99% · 6 L/min"],
                ["Current",        "DCEN · 75 – 110 A"],
                ["Travel speed",   "60 – 110 mm/min"],
                ["Preheat",        "Ambient · 15 °C min"],
                ["Interpass max",  "150 °C"],
                ["PWHT",           "Not required"],
              ].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0",
                                       borderBottom: "1px solid var(--border-1)", gap: 12 }}>
                  <span className="mono" style={{ fontSize: 10, color: "var(--t-4)", letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 12, color: "var(--t-1)", textAlign: "right", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel glass">
          <div className="panel-header"><h3>PQR-001 traceability</h3></div>
          <div className="panel-body">
            <Charts.WorkflowSteps current={3}
              steps={[
                { label: "Mechanical", sub: "PASS · 580 MPa" },
                { label: "Bend",       sub: "PASS · 4t · no crack" },
                { label: "Macro",      sub: "PASS · ISO 17639" },
                { label: "Approved",   sub: "2025-08-12" },
              ]}/>
          </div>
        </div>

        <div className="panel glass">
          <div className="panel-header"><h3>Compatibility check</h3><span className="sub">vs. current weld</span></div>
          <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { l: "Material P-No",      v: "P-8 vs P-8",      ok: true  },
              { l: "Thickness range",    v: "2.0 mm in 1.5–6", ok: true  },
              { l: "Position",           v: "5G qualified",    ok: true  },
              { l: "Filler F-No",        v: "F-6 vs F-6",      ok: true  },
              { l: "Preheat min",        v: "15 °C ≥ ambient", ok: true  },
              { l: "PWHT requirement",   v: "Not required",    ok: true  },
            ].map(c => (
              <div key={c.l} className="row" style={{ gap: 8 }}>
                {c.ok ? <Icons.Tick size={14} stroke="var(--ok)"/> : <Icons.Cross size={14} stroke="var(--bad)"/>}
                <span style={{ fontSize: 12, color: "var(--t-2)", flex: 1 }}>{c.l}</span>
                <span className="mono" style={{ fontSize: 11, color: c.ok ? "var(--ok)" : "var(--bad)" }}>{c.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============== APPROVAL WORKFLOW ===================================
const WorkflowScreen = () => {
  const stages = [
    { id: "inspector", label: "Inspector", color: "var(--amber)" },
    { id: "qa",        label: "QA Engineer", color: "var(--info)" },
    { id: "client",    label: "Client", color: "var(--purple)" },
    { id: "approved",  label: "Approved", color: "var(--ok)" },
  ];

  const items = [
    { id: "AP-2148", item: "Daily QA Report — 2026-05-13",      proj: "SYN-L3",   sub: "Manop K.",   age: "4 hr",  stage: "client",    severity: "ok" },
    { id: "AP-2147", item: "WPS-004 Rev. B (SMAW · P91)",         proj: "TPA-CIP",  sub: "Wirot C.",   age: "8 hr",  stage: "qa",        severity: "warn" },
    { id: "AP-2146", item: "Batch SP-A-12 · 24 joints",           proj: "SYN-L3",   sub: "AI Engine",  age: "1 hr",  stage: "qa",        severity: "ok" },
    { id: "AP-2145", item: "Batch SP-B-04 · 24 joints",           proj: "RB25-P91", sub: "Boonmee S.", age: "1 d",   stage: "qa",        severity: "warn" },
    { id: "AP-2144", item: "Repair report J-1594 (Crack)",        proj: "RB25-P91", sub: "WD-019",     age: "1 d",   stage: "inspector", severity: "bad" },
    { id: "AP-2143", item: "Welder WD-019 — re-qualification",    proj: "—",        sub: "AI Engine",  age: "1 d",   stage: "inspector", severity: "warn" },
    { id: "AP-2142", item: "PQR-005 (Duplex 2205)",               proj: "—",        sub: "Manop K.",   age: "2 d",   stage: "qa",        severity: "ok" },
    { id: "AP-2141", item: "Daily QA Report — 2026-05-12",        proj: "SYN-L3",   sub: "Manop K.",   age: "2 d",   stage: "approved",  severity: "ok" },
    { id: "AP-2140", item: "Project SYN-L3 — kickoff sign-off",   proj: "SYN-L3",   sub: "Client",     age: "3 d",   stage: "approved",  severity: "ok" },
    { id: "AP-2139", item: "Repair report J-1581 (Undercut)",     proj: "TPA-CIP",  sub: "WD-022",     age: "3 d",   stage: "approved",  severity: "ok" },
  ];

  const byStage = stages.map(s => ({ ...s, items: items.filter(i => i.stage === s.id) }));

  return (
    <div className="page">
      <div className="bg-grid"/>
      <div className="page-head">
        <div>
          <span className="kicker">APPROVAL FLOW · ASME IX · BPE 2024</span>
          <h1 style={{ marginTop: 8 }}>Approval workflow</h1>
          <div className="sub">Inspector → QA Engineer → Client → Approved · {items.length} active items</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="seg">
            <button className="on">Kanban</button>
            <button>Timeline</button>
            <button>Table</button>
          </div>
          <button className="btn ghost sm"><Icons.Filter size={14}/> All projects</button>
        </div>
      </div>

      {/* Kanban */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {byStage.map(s => (
          <div key={s.id} className="panel glass" style={{ display: "flex", flexDirection: "column", minHeight: 600 }}>
            <div className="panel-header" style={{ borderBottom: `1px solid ${s.color}55` }}>
              <h3>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, boxShadow: `0 0 8px ${s.color}` }}/>
                {s.label}
              </h3>
              <span className="chip" style={{ borderColor: s.color, color: s.color }}>{s.items.length}</span>
            </div>
            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {s.items.map(it => {
                const sevColor = it.severity === "bad" ? "var(--bad)" : it.severity === "warn" ? "var(--warn)" : "var(--ok)";
                const sevIcon = it.severity === "bad" ? "Cross" : it.severity === "warn" ? "Warn" : "Tick";
                const SevIco = Icons[sevIcon];
                return (
                <div key={it.id} style={{
                  padding: "10px 12px",
                  background: "var(--bg-2)",
                  border: "1px solid var(--border-2)",
                  borderLeft: `3px solid ${sevColor}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg-3)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--bg-2)"}>
                  <div className="row" style={{ justifyContent: "space-between", marginBottom: 6, gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <SevIco size={12} stroke={sevColor}/>
                      <span className="mono" style={{ fontSize: 10, color: "var(--amber-2)", fontWeight: 600 }}>{it.id}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 9.5, color: "var(--t-5)" }}>{it.age}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--t-1)", fontWeight: 500, lineHeight: 1.4 }}>{it.item}</div>
                  <div className="row" style={{ marginTop: 8, gap: 6, flexWrap: "wrap" }}>
                    {it.proj !== "—" && <span className="chip amber" style={{ fontSize: 9.5 }}>{it.proj}</span>}
                    <span style={{ marginLeft: "auto", fontSize: 10.5, color: "var(--t-4)", fontFamily: "var(--font-mono)" }}>
                      {it.sub}
                    </span>
                  </div>
                </div>
                );
              })}
              {s.items.length === 0 && (
                <div style={{ padding: 24, textAlign: "center", color: "var(--t-5)", fontSize: 11.5 }}>
                  No items
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Flow legend */}
      <div className="panel glass" style={{ marginTop: 14, padding: 16 }}>
        <div className="row">
          <span className="kicker" style={{ color: "var(--t-3)" }}>STAGE LEGEND</span>
          <div style={{ flex: 1 }}/>
        </div>
        <div style={{ marginTop: 14 }}>
          <Charts.WorkflowSteps current={4}
            steps={[
              { label: "Inspector",   sub: "AI + human" },
              { label: "QA Engineer", sub: "Manop K." },
              { label: "Client",      sub: "ext. sign-off" },
              { label: "Approved",    sub: "released" },
            ]}/>
        </div>
        <div className="row" style={{ marginTop: 16, gap: 18 }}>
          <span className="chip warn"><span className="dot"/>PENDING · Amber</span>
          <span className="chip info"><span className="dot"/>REVIEWED · Blue</span>
          <span className="chip ok"><span className="dot"/>APPROVED · Green</span>
          <span className="chip bad"><span className="dot"/>REJECTED · Red</span>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { WeldersScreen, WpsScreen, WorkflowScreen });
