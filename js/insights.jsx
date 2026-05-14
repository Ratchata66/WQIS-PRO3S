/* global React, Icons, Charts, WQIS_DATA */

// ============== REPORTS =============================================
const ReportsScreen = () => {
  const reports = [
    { id: "DR-20260514", kind: "Daily QA/QC",      proj: "SYN-L3", insp: 484, pass: 96.8, sign: "Manop K.", date: "2026-05-14", status: "auto", icon: "Calendar" },
    { id: "WR-W19",      kind: "Weekly Summary",   proj: "All",    insp: 2842,pass: 97.1, sign: "Manop K.", date: "2026-05-12", status: "signed", icon: "Report" },
    { id: "WP-WD-014",   kind: "Welder Perform.",  proj: "—",      insp: 1284,pass: 98.4, sign: "AI Engine",date: "2026-05-13", status: "signed", icon: "Welder" },
    { id: "DF-MAY",      kind: "Defect Analytics", proj: "All",    insp: 18742,pass: 96.8,sign: "Wirot C.", date: "2026-05-01", status: "signed", icon: "Chart" },
    { id: "AU-2026-Q2",  kind: "Audit Pack",       proj: "TPA-CIP",insp: 928, pass: 98.1, sign: "Client",   date: "2026-04-30", status: "signed", icon: "Shield" },
    { id: "NCR-1592",    kind: "Non-Conformance",  proj: "RB25-P91",insp: 1,  pass: 0,    sign: "Boonmee S.",date:"2026-05-13", status: "open",   icon: "Warn" },
  ];

  return (
    <div className="page">
      <div className="bg-grid"/>
      <div className="page-head">
        <div>
          <span className="kicker">QA · QC REPORTING</span>
          <h1 style={{ marginTop: 8 }}>Reports & analytics</h1>
          <div className="sub">PDF / Excel · ASME IX · ISO 5817 · BPE 2024 compliant.</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn ghost sm"><Icons.Calendar size={14}/> Range · 2026-05-01 → 14</button>
          <button className="btn ghost sm"><Icons.Filter size={14}/> All projects</button>
          <button className="btn primary sm"><Icons.Plus size={14}/> Generate report</button>
        </div>
      </div>

      {/* Quick stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 22 }}>
        {[
          { l: "Reports this month", v: 48,   u: "",     c: "var(--amber)" },
          { l: "Auto-generated",     v: 32,   u: "",     c: "var(--info)" },
          { l: "Pending signature",  v: 3,    u: "",     c: "var(--warn)" },
          { l: "Total inspections",  v: "18,742", u: "", c: "var(--ok)" },
          { l: "Avg pass rate",      v: 96.9, u: "%",    c: "var(--ok)" },
        ].map(k => (
          <div key={k.l} className="panel glass" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--t-4)", textTransform: "uppercase", marginBottom: 4 }}>{k.l}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: k.c }}>
                {k.v}<span style={{ fontSize: 12, color: "var(--t-3)", marginLeft: 2 }}>{k.u}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* report templates */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { icon: "Calendar", title: "Daily QA/QC",         thaiTitle: "รายงานประจำวัน",     desc: "Inspection log + verdicts for a single day.", color: "var(--amber)",  freq: "Auto · 06:00" },
          { icon: "Report",   title: "Weekly Summary",      thaiTitle: "รายงานประจำสัปดาห์", desc: "7-day rollup with trend and top defects.",    color: "var(--info)",   freq: "Mon 07:00" },
          { icon: "Welder",   title: "Welder Performance",  thaiTitle: "ผลการปฏิบัติงาน",   desc: "Per-welder pass rate, repair, AI ranking.",   color: "var(--ok)",     freq: "Weekly" },
          { icon: "Chart",    title: "Defect Analytics",    thaiTitle: "วิเคราะห์ข้อบกพร่อง", desc: "Defect type breakdown + cost impact heatmap.", color: "var(--purple)", freq: "Monthly" },
        ].map(t => {
          const Ico = Icons[t.icon];
          return (
            <div key={t.title} className="panel glass"
                 style={{ padding: 16, cursor: "pointer", transition: "all 0.16s", borderTop: `2px solid ${t.color}44` }}
                 onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 0 1px ${t.color}44, 0 14px 30px -14px ${t.color}55`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                 onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
              <div className="row" style={{ marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${t.color}18`, border: `1px solid ${t.color}44`,
                              display: "grid", placeItems: "center", color: t.color }}>
                  <Ico size={19}/>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                  <button className="btn ghost sm icon" title="Generate PDF"><Icons.Doc size={13}/></button>
                  <button className="btn ghost sm icon" title="Generate Excel"><Icons.Download size={13}/></button>
                </div>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--t-1)" }}>{t.title}</div>
              <div className="mono" style={{ fontSize: 9.5, color: "var(--t-5)", letterSpacing: "0.08em", marginTop: 2 }}>{t.thaiTitle}</div>
              <div style={{ fontSize: 12, color: "var(--t-3)", marginTop: 6, lineHeight: 1.45, minHeight: 30 }}>{t.desc}</div>
              <div className="row" style={{ marginTop: 12, justifyContent: "space-between", borderTop: "1px solid var(--border-1)", paddingTop: 10 }}>
                <span className="mono" style={{ fontSize: 9.5, color: "var(--t-5)", letterSpacing: "0.08em" }}>
                  <span style={{ color: t.color }}>●</span> {t.freq}
                </span>
                <span className="mono" style={{ fontSize: 9.5, color: "var(--t-4)" }}>PDF · XLSX</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 14 }}>
        <div className="panel glass">
          <div className="panel-header"><h3>Pass rate · 90 days</h3><span className="sub">3 PROJECTS COMPARED</span></div>
          <div className="panel-body" style={{ paddingTop: 8 }}>
            <Charts.Area data={[91,92.5,93,94,94.5,95,95.2,95.8,96.4,96.8,97.1,96.9].map((v,i)=>({ label: `M${i+1}`, value: v }))}
                         width={700} height={200} color="var(--ok)"/>
            <div className="row" style={{ gap: 16, marginTop: 6 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--ok)" }}/>
                <span style={{ color: "var(--t-3)" }}>All projects · </span>
                <span className="mono" style={{ color: "var(--ok)" }}>96.9%</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--t-4)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--info)" }}/> Synova L3
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--t-4)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--amber)" }}/> TPA CIP
              </span>
            </div>
          </div>
        </div>

        <div className="panel glass">
          <div className="panel-header"><h3>Defect cost impact</h3><span className="sub">REPAIR HOURS</span></div>
          <div className="panel-body" style={{ paddingTop: 8 }}>
            <Charts.Bars data={[
              { label: "Poro", value: 24 },
              { label: "Und.", value: 38 },
              { label: "IF",   value: 52 },
              { label: "Crk",  value: 86 },
              { label: "IP",   value: 44 },
              { label: "BT",   value: 18 },
            ]} width={420} height={200} color="var(--bad)"/>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--t-4)", letterSpacing: "0.1em", marginTop: 6 }}>
              262 REPAIR HOURS · 7D · ฿ 326,420 EST.
            </div>
          </div>
        </div>
      </div>

      <div className="panel glass" style={{ overflow: "hidden" }}>
        <div className="panel-header">
          <h3>Generated reports</h3>
          <span className="sub">{reports.length} TOTAL · LAST 30D</span>
        </div>
        <table className="tbl">
          <thead><tr><th>ID</th><th>Type</th><th>Project</th><th>Insp.</th><th>Pass</th><th>Signed by</th><th>Date</th><th>Status</th><th>Export</th></tr></thead>
          <tbody>
            {reports.map(r => {
              const Ico = Icons[r.icon];
              return (
                <tr key={r.id}>
                  <td>
                    <div className="row" style={{ gap: 10 }}>
                      <Ico size={16} stroke="var(--amber-2)"/>
                      <div>
                        <div className="mono" style={{ color: "var(--t-1)", fontWeight: 600 }}>{r.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{r.kind}</td>
                  <td className="mono" style={{ color: "var(--amber-2)" }}>{r.proj}</td>
                  <td className="mono nums">{r.insp.toLocaleString()}</td>
                  <td className="mono nums" style={{ color: r.pass > 96 ? "var(--ok)" : r.pass ? "var(--warn)" : "var(--bad)" }}>
                    {r.pass ? `${r.pass}%` : "—"}
                  </td>
                  <td>{r.sign}</td>
                  <td className="mono">{r.date}</td>
                  <td>
                    {r.status === "signed" && <span className="chip ok"><span className="dot"/>SIGNED</span>}
                    {r.status === "auto"   && <span className="chip info"><span className="dot"/>AUTO</span>}
                    {r.status === "open"   && <span className="chip bad"><span className="dot"/>OPEN</span>}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn ghost sm icon" title="PDF"><Icons.Doc size={13}/></button>
                      <button className="btn ghost sm icon" title="Excel"><Icons.Download size={13}/></button>
                      <button className="btn ghost sm icon" title="Open"><Icons.Eye size={13}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============== SETTINGS / ADMIN ====================================
const SettingsScreen = () => {
  const [tab, setTab] = React.useState("ai");
  const tabs = [
    { id: "ai",       label: "AI Engine",       icon: "Cpu" },
    { id: "users",    label: "Users & Roles",   icon: "Users" },
    { id: "rules",    label: "Acceptance Rules",icon: "Standard" },
    { id: "integ",    label: "Integrations",    icon: "Layers" },
    { id: "audit",    label: "Audit log",       icon: "Shield" },
    { id: "system",   label: "System",          icon: "Settings" },
  ];

  return (
    <div className="page">
      <div className="bg-grid"/>
      <div className="page-head">
        <div>
          <span className="kicker">ADMINISTRATION</span>
          <h1 style={{ marginTop: 8 }}>Admin · Settings</h1>
          <div className="sub">Model configuration, role-based access, integrations and audit.</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn ghost sm"><Icons.Download size={14}/> Export config</button>
          <button className="btn primary sm"><Icons.Check size={14}/> Save changes</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 14 }}>
        <div className="panel glass" style={{ padding: 8, height: "fit-content" }}>
          {tabs.map(t => {
            const Ico = Icons[t.icon];
            return (
              <div key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`}
                   onClick={() => setTab(t.id)}>
                <span className="ico"><Ico size={16}/></span>
                <span>{t.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tab === "ai" && <AISettings/>}
          {tab === "users" && <UsersSettings/>}
          {tab === "rules" && <RulesSettings/>}
          {tab === "integ" && <IntegrationsSettings/>}
          {tab === "audit" && <AuditLog/>}
          {tab === "system" && <SystemSettings/>}
        </div>
      </div>
    </div>
  );
};

const AISettings = () => (
  <>
    <div className="panel glass">
      <div className="panel-header"><h3><Icons.Cpu size={14}/> AI inspection model</h3><span className="chip ok"><span className="dot"/>cloud-v2 · LIVE</span></div>
      <div className="panel-body">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 18 }}>
          {[
            { l: "Accuracy",   v: "99.24%",    c: "var(--ok)",     icon: "Cpu",    bg: "var(--ok-soft)",    bd: "var(--ok-line)" },
            { l: "Precision",  v: "98.61%",    c: "var(--info)",   icon: "Scan",   bg: "var(--info-soft)",  bd: "var(--info-line)" },
            { l: "Recall",     v: "97.92%",    c: "var(--info)",   icon: "Activity",bg: "var(--info-soft)", bd: "var(--info-line)" },
            { l: "Latency",    v: "1.84 s",    c: "var(--amber)",  icon: "Zap",    bg: "var(--amber-soft)", bd: "var(--amber-line)" },
            { l: "Trained on", v: "284k imgs", c: "var(--t-2)",    icon: "Image",  bg: "var(--bg-3)",       bd: "var(--border-2)" },
            { l: "Last update",v: "2026-05-08",c: "var(--t-2)",    icon: "Calendar",bg: "var(--bg-3)",      bd: "var(--border-2)" },
          ].map(k => {
            const Ico = Icons[k.icon];
            return (
            <div key={k.l} style={{ padding: "12px 14px", background: "var(--bg-2)", borderRadius: 8,
                                     border: `1px solid ${k.bd}`, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: k.bg, border: `1px solid ${k.bd}`,
                            display: "grid", placeItems: "center", color: k.c, flexShrink: 0 }}>
                <Ico size={15}/>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 9.5, color: "var(--t-4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{k.l}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: k.c, marginTop: 2 }}>{k.v}</div>
              </div>
            </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div>
            <div className="label-row"><span>Detection threshold</span><span className="mono nums">0.85</span></div>
            <div className="bar tall"><i style={{ width: "85%" }}/></div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--t-4)", marginTop: 6 }}>
              Below this → manual review queue
            </div>
          </div>
          <div>
            <div className="label-row"><span>Severity escalation</span><span className="mono nums">CRITICAL · MAJOR</span></div>
            <div className="row" style={{ gap: 6, marginTop: 4 }}>
              <span className="chip bad"><span className="dot"/>Critical → auto-reject</span>
              <span className="chip warn"><span className="dot"/>Major → review</span>
              <span className="chip info"><span className="dot"/>Minor → log</span>
            </div>
          </div>
          <div>
            <div className="label-row"><span>Defect classes enabled</span><span className="mono nums">6/7</span></div>
            <div className="row wrap" style={{ gap: 6, marginTop: 4 }}>
              {WQIS_DATA.defects.map(d => (
                <span key={d.id} className={`chip ${d.id === "oxide-discoloration" ? "" : "amber"}`}>
                  {d.id === "oxide-discoloration" ? <Icons.Plus size={10}/> : <Icons.Check size={10}/>}
                  {d.label}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="label-row"><span>Backbone model</span></div>
            <select className="select">
              <option>YOLOv8-x (cloud-v2)</option>
              <option>YOLOv8-l</option>
              <option>YOLOv7-tiny (edge)</option>
            </select>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--t-4)", marginTop: 6 }}>
              GPU · A100 · 40 GB · Roboflow Hosted
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="panel glass">
      <div className="panel-header"><h3>Re-training queue</h3><span className="sub">14 IMAGES PENDING</span></div>
      <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { lbl: "False negatives (missed crack)", n: 3, c: "var(--bad)"  },
          { lbl: "Oxide threshold review",          n: 6, c: "var(--warn)" },
          { lbl: "New material — Duplex 2205",      n: 5, c: "var(--info)" },
        ].map(r => (
          <div key={r.lbl} className="row" style={{ padding: "8px 0", borderBottom: "1px solid var(--border-1)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.c, boxShadow: `0 0 8px ${r.c}` }}/>
            <span style={{ fontSize: 12.5, flex: 1 }}>{r.lbl}</span>
            <span className="chip">{r.n} images</span>
            <button className="btn ghost sm">Annotate</button>
          </div>
        ))}
      </div>
    </div>
  </>
);

const UsersSettings = () => (
  <div className="panel glass">
    <div className="panel-header">
      <h3>Users & roles</h3>
      <button className="btn primary sm"><Icons.Plus size={14}/> Invite user</button>
    </div>
    <table className="tbl">
      <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Projects</th><th>2FA</th><th>Last seen</th><th>Status</th></tr></thead>
      <tbody>
        {[
          { name: "Manop Kosolwong",  email: "manop.k@pro3s.co.th",  role: "QA Manager",   proj: "All",      tfa: true,  last: "now",     act: "active" },
          { name: "Wirot Chanthorn",  email: "wirot.c@pro3s.co.th",  role: "QA Engineer",  proj: "8",        tfa: true,  last: "4m",      act: "active" },
          { name: "Niran Kosolwat",   email: "niran.k@pro3s.co.th",  role: "Inspector",    proj: "6",        tfa: false, last: "22m",     act: "active" },
          { name: "Boonmee Saengtho.",email: "boonmee.s@pro3s.co.th",role: "Inspector",    proj: "4",        tfa: true,  last: "1h",      act: "active" },
          { name: "Client · Synova",  email: "qa@synova.com",        role: "Client View",  proj: "SYN-L3",   tfa: true,  last: "12h",    act: "active" },
          { name: "Apinya R.",        email: "apinya.r@pro3s.co.th", role: "Welder",       proj: "3",        tfa: false, last: "3d",     act: "active" },
          { name: "Audit · External", email: "audit@bvqi.com",       role: "Auditor (R/O)",proj: "Q2 pack",  tfa: true,  last: "20d",    act: "paused" },
        ].map(u => (
          <tr key={u.email}>
            <td>
              <div className="row" style={{ gap: 10 }}>
                <div className="avatar sm">{u.name.split(" ").map(s => s[0]).slice(0,2).join("")}</div>
                <span style={{ fontWeight: 600, color: "var(--t-1)" }}>{u.name}</span>
              </div>
            </td>
            <td className="mono" style={{ fontSize: 11.5, color: "var(--t-3)" }}>{u.email}</td>
            <td><span className="chip amber">{u.role}</span></td>
            <td className="mono">{u.proj}</td>
            <td>{u.tfa ? <Icons.Tick size={14} stroke="var(--ok)"/> : <Icons.Warn size={14} stroke="var(--warn)"/>}</td>
            <td className="mono" style={{ color: "var(--t-3)" }}>{u.last}</td>
            <td>
              {u.act === "active" && <span className="chip ok"><span className="dot"/>ACTIVE</span>}
              {u.act === "paused" && <span className="chip"><span className="dot"/>PAUSED</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RulesSettings = () => (
  <div className="panel glass">
    <div className="panel-header"><h3>Acceptance rules</h3><span className="sub">PER STANDARD</span></div>
    <div className="panel-body">
      <table className="tbl">
        <thead><tr><th>Defect</th><th>ISO 5817 B</th><th>ASME IX</th><th>BPE 2024</th><th>API 1104</th><th>Custom</th></tr></thead>
        <tbody>
          {WQIS_DATA.defects.map(d => (
            <tr key={d.id}>
              <td>
                <div className="row" style={{ gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.cls === "bad" ? "var(--bad)" : "var(--warn)" }}/>
                  <span style={{ color: "var(--t-1)", fontWeight: 500 }}>{d.label}</span>
                </div>
              </td>
              <td className="mono">≤ Ø 1.0 mm</td>
              <td className="mono">≤ Ø 1.5 mm</td>
              <td className="mono">≤ Ø 0.8 mm</td>
              <td className="mono">≤ Ø 2.0 mm</td>
              <td>
                <button className="btn ghost sm">Override</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const IntegrationsSettings = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
    {[
      { name: "Roboflow",   sub: "AI hosting · cloud-v2",      ok: true,  hue: "var(--amber)" },
      { name: "Azure AD",   sub: "SSO · Single sign-on",       ok: true,  hue: "var(--info)" },
      { name: "Power BI",   sub: "Dashboard streaming",        ok: true,  hue: "var(--ok)" },
      { name: "Slack",      sub: "Notifications · #qa-alerts", ok: true,  hue: "var(--purple)" },
      { name: "SAP S/4HANA",sub: "Project · purchase orders",  ok: false, hue: "var(--warn)" },
      { name: "Webhook",    sub: "Custom endpoint",            ok: true,  hue: "var(--t-2)" },
    ].map(i => (
      <div key={i.name} className="panel glass" style={{ padding: 16 }}>
        <div className="row">
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${i.hue}1f`,
                        border: `1px solid ${i.hue}55`, display: "grid", placeItems: "center", color: i.hue }}>
            <Icons.Layers size={18}/>
          </div>
          <div style={{ marginLeft: 12, flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{i.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--t-3)" }}>{i.sub}</div>
          </div>
          {i.ok ? <span className="chip ok"><span className="dot"/>CONNECTED</span> : <span className="chip"><span className="dot"/>NOT LINKED</span>}
        </div>
      </div>
    ))}
  </div>
);

const AuditLog = () => (
  <div className="panel glass">
    <div className="panel-header"><h3>Audit log</h3><span className="sub">SOC 2 · ISO 27001</span></div>
    <div className="panel-body flush">
      {[
        { t: "13:51:02", who: "manop.k", act: "Approved batch SP-A-12", obj: "AP-2146", ip: "10.4.18.92" },
        { t: "13:48:18", who: "wirot.c", act: "Submitted WPS-004 rev B", obj: "WPS-004", ip: "10.4.18.41" },
        { t: "13:35:00", who: "ai-engine", act: "Detected FAIL · crack", obj: "J-1599", ip: "internal" },
        { t: "12:42:11", who: "manop.k", act: "Updated detection threshold", obj: "AI · 0.83 → 0.85", ip: "10.4.18.92" },
        { t: "11:28:54", who: "client.synova", act: "Signed daily report", obj: "DR-20260513", ip: "203.91.4.18" },
        { t: "09:18:02", who: "system", act: "Model cloud-v2 re-trained", obj: "model · 99.24% acc", ip: "internal" },
      ].map((a, i) => (
        <div key={i} className="row" style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-1)", fontFamily: "var(--font-mono)", fontSize: 11.5 }}>
          <span style={{ width: 70, color: "var(--t-4)" }}>{a.t}</span>
          <span className="chip amber" style={{ width: 110, justifyContent: "center" }}>{a.who}</span>
          <span style={{ flex: 1, color: "var(--t-1)", fontFamily: "var(--font-sans)" }}>{a.act}</span>
          <span style={{ color: "var(--amber-2)" }}>{a.obj}</span>
          <span style={{ color: "var(--t-5)", width: 100, textAlign: "right" }}>{a.ip}</span>
        </div>
      ))}
    </div>
  </div>
);

const SystemSettings = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
    <div className="panel glass">
      <div className="panel-header"><h3>System health</h3><span className="chip ok"><span className="dot"/>ALL OK</span></div>
      <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { l: "API uptime",      v: 99.98, max: 100, c: "var(--ok)",   suf: "%" },
          { l: "DB latency",      v: 38,    max: 200, c: "var(--ok)",   suf: " ms" },
          { l: "AI queue",        v: 2,     max: 50,  c: "var(--ok)",   suf: " jobs" },
          { l: "Storage used",    v: 412,   max: 2048,c: "var(--warn)", suf: " GB" },
          { l: "Active sessions", v: 24,    max: 200, c: "var(--info)", suf: "" },
        ].map(m => (
          <div key={m.l}>
            <div className="label-row"><span>{m.l}</span>
              <span className="mono nums" style={{ color: m.c }}>{m.v}{m.suf}</span>
            </div>
            <div className="bar"><i style={{ width: `${(m.v/m.max)*100}%`, background: m.c }}/></div>
          </div>
        ))}
      </div>
    </div>

    <div className="panel glass">
      <div className="panel-header"><h3>Localization & preferences</h3></div>
      <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div className="label-row"><span>Language</span></div>
          <div className="seg" style={{ width: "100%" }}>
            <button className="on" style={{ flex: 1 }}>EN</button>
            <button style={{ flex: 1 }}>TH</button>
            <button style={{ flex: 1 }}>EN + TH</button>
          </div>
        </div>
        <div>
          <div className="label-row"><span>Region / Timezone</span></div>
          <select className="select">
            <option>Asia / Bangkok · UTC+7</option>
            <option>Asia / Singapore · UTC+8</option>
            <option>Europe / Berlin · UTC+1</option>
          </select>
        </div>
        <div>
          <div className="label-row"><span>Units</span></div>
          <div className="seg" style={{ width: "100%" }}>
            <button className="on" style={{ flex: 1 }}>Metric</button>
            <button style={{ flex: 1 }}>Imperial</button>
          </div>
        </div>
        <div>
          <div className="label-row"><span>Date format</span></div>
          <select className="select">
            <option>YYYY-MM-DD (ISO)</option>
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

// ============== INFORMATION =========================================
const InfoScreen = () => (
  <div className="page">
    <div className="bg-grid"/>
    <div className="page-head">
      <div>
        <span className="kicker">SYSTEM · INFORMATION</span>
        <h1 style={{ marginTop: 8 }}>Information</h1>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <div className="panel glass">
        <div className="panel-header"><h3>App Version</h3></div>
        <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[["Version","1.0.0"],["Build","2026-05-14"],["AI Model","cloud-v2 · YOLOv8-x"],["Accuracy","99.24%"],["Environment","Production · TH-1"]].map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--t-3)" }}>{k}</span>
              <span className="mono" style={{ color: "var(--t-1)" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="panel glass">
        <div className="panel-header"><h3>Support & Documentation</h3></div>
        <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { l: "Documentation", u: "#" },
            { l: "API Reference", u: "#" },
            { l: "Support Email", u: "mailto:support@pro3s.co.th" },
            { l: "Release Notes", u: "#" },
          ].map(item => (
            <a key={item.l} href={item.u} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                                                    color: "var(--info)", textDecoration: "none", fontSize: 13 }}>
              <span>{item.l}</span>
              <Icons.ChevR size={14}/>
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { ReportsScreen, SettingsScreen, InfoScreen });
