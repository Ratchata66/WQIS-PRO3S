/* global React, Icons, Charts, WeldImage, WQIS_DATA */

const TeamTab = ({ project }) => {
  const [teams, setTeams] = React.useState([
    { id: 1, name: "Team A", process: "GTAW", lead: "Somchai P." },
    { id: 2, name: "Team B", process: "GMAW", lead: "Wirot C." },
  ]);
  const [welders, setWelders] = React.useState(
    WQIS_DATA.welders.slice(0, 4)
  );
  const [newTeam, setNewTeam] = React.useState("");
  const [newWelder, setNewWelder] = React.useState("");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {/* Teams panel */}
      <div className="panel glass">
        <div className="panel-header">
          <h3>Teams</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="input" style={{ width: 140, height: 30 }}
                   placeholder="Team name…" value={newTeam} onChange={e => setNewTeam(e.target.value)}/>
            <button className="btn primary sm" onClick={() => {
              if (newTeam.trim()) { setTeams(t => [...t, { id: Date.now(), name: newTeam, process: "GTAW", lead: "—" }]); setNewTeam(""); }
            }}>+ Add</button>
          </div>
        </div>
        <div className="panel-body flush">
          {teams.map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--border-1)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--t-4)" }}>{t.process} · Lead: {t.lead}</div>
              </div>
              <button className="btn ghost sm" style={{ color: "var(--bad)" }} onClick={() => setTeams(ts => ts.filter(x => x.id !== t.id))}>Remove</button>
            </div>
          ))}
        </div>
      </div>
      {/* Welders panel */}
      <div className="panel glass">
        <div className="panel-header">
          <h3>Welders</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="input" style={{ width: 140, height: 30 }}
                   placeholder="Welder code…" value={newWelder} onChange={e => setNewWelder(e.target.value)}/>
            <button className="btn primary sm" onClick={() => {
              if (newWelder.trim()) {
                const w = WQIS_DATA.welders.find(x => x.code.toLowerCase().includes(newWelder.toLowerCase()) || x.name.toLowerCase().includes(newWelder.toLowerCase()));
                if (w && !welders.find(x => x.id === w.id)) { setWelders(ws => [...ws, w]); }
                setNewWelder("");
              }
            }}>+ Add</button>
          </div>
        </div>
        <div className="panel-body flush">
          {welders.map(w => (
            <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--border-1)" }}>
              <div className="avatar sm">{w.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{w.name}</div>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--t-4)" }}>{w.code} · {w.proc.join(", ")} · Pass: {w.pass}%</div>
              </div>
              <button className="btn ghost sm" style={{ color: "var(--bad)" }} onClick={() => setWelders(ws => ws.filter(x => x.id !== w.id))}>Remove</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button className="btn ghost sm">Discard changes</button>
        <button className="btn primary sm">Save project data</button>
      </div>
    </div>
  );
};

const AddProjectModal = ({ onClose, onAdd }) => {
  const [form, setForm] = React.useState({ name: "", client: "", industry: "Food & Beverage", wps: "WPS-001", due: "" });
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "grid", placeItems: "center" }}
         onClick={onClose}>
      <div className="panel glass" style={{ width: 480, padding: 24 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>New Project</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
          {[["Project Name","name","text"],["Client","client","text"],["Due Date","due","date"]].map(([l,k,t]) => (
            <div key={k}>
              <div className="label-row"><span>{l}</span></div>
              <input className="input" type={t} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} style={{ width: "100%" }}/>
            </div>
          ))}
          <div>
            <div className="label-row"><span>Industry</span></div>
            <select className="select" style={{ width: "100%" }} value={form.industry} onChange={e => setForm(f => ({...f,industry:e.target.value}))}>
              {WQIS_DATA.industries.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn ghost sm" onClick={onClose}>Cancel</button>
          <button className="btn primary sm" onClick={() => { onAdd(form); onClose(); }}>Save Project</button>
        </div>
      </div>
    </div>
  );
};

const qaChip = (q) => {
  if (q === "approved")  return <span className="chip ok"><span className="dot"/>APPROVED</span>;
  if (q === "in-review") return <span className="chip info"><span className="dot"/>IN REVIEW</span>;
  if (q === "pending")   return <span className="chip warn"><span className="dot"/>PENDING</span>;
  return <span className="chip">—</span>;
};

const IndustryGlyph = ({ industry, size = 64 }) => {
  // Industrial silhouette for project cards — abstract SVG
  const map = {
    "Food & Beverage":            { hue: "#2dd4a4", icon: <><circle cx="32" cy="32" r="20"/><path d="M22 26h20M22 32h20M22 38h20"/></> },
    "Pharmaceutical":             { hue: "#a06bff", icon: <><path d="M18 18h28v28a14 14 0 0 1-28 0z"/><path d="M18 28h28"/></> },
    "Oil & Gas":                  { hue: "#ff8c1a", icon: <><path d="M14 50V18l9 14 9-14v32M40 50V18"/><circle cx="45" cy="14" r="3"/></> },
    "Stainless Hygienic Piping":  { hue: "#4fa8ff", icon: <><rect x="12" y="22" width="40" height="14" rx="3"/><circle cx="22" cy="29" r="3"/><circle cx="42" cy="29" r="3"/></> },
    "Process Plant":              { hue: "#ffb547", icon: <><rect x="14" y="40" width="36" height="12"/><circle cx="22" cy="22" r="8"/><circle cx="42" cy="22" r="8"/></> },
    "Industrial Fabrication":     { hue: "#ff5570", icon: <><path d="M14 50 32 16l18 34zM26 50V36h12v14"/></> },
  };
  const m = map[industry] || map["Process Plant"];
  return (
    <div style={{
      width: size, height: size, borderRadius: 10,
      background: `linear-gradient(135deg, ${m.hue}1f, transparent)`,
      border: `1px solid ${m.hue}40`,
      display: "grid", placeItems: "center",
      boxShadow: `0 0 18px -8px ${m.hue}`,
      flexShrink: 0,
    }}>
      <svg width="36" height="36" viewBox="0 0 64 64" fill="none" stroke={m.hue} strokeWidth="1.6"
           strokeLinecap="round" strokeLinejoin="round">
        {m.icon}
      </svg>
    </div>
  );
};

// =========== PROJECT CARD ===========================================
const ProjectCard = ({ p, onOpen }) => (
  <div className="panel glass" style={{ cursor: "pointer", transition: "transform 0.16s, box-shadow 0.16s" }}
       onClick={onOpen}
       onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 0 1px var(--amber-line), 0 20px 40px -20px var(--amber-glow)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
       onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
    <div className="panel-body">
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <IndustryGlyph industry={p.industry}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="mono" style={{ fontSize: 10, color: "var(--amber-2)", letterSpacing: "0.1em" }}>{p.code}</span>
            <span style={{ flex: 1 }}/>
            {qaChip(p.qa)}
          </div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--t-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {p.name}
          </h3>
          <div style={{ fontSize: 11.5, color: "var(--t-3)", marginTop: 4 }}>{p.client} · {p.industry}</div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "var(--t-3)", marginTop: 14, lineHeight: 1.5, minHeight: 36 }}>
        {p.desc}
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: "var(--t-3)" }}>
          <span className="mono" style={{ letterSpacing: "0.06em" }}>PROGRESS</span>
          <span className="mono nums" style={{ color: "var(--t-1)", fontWeight: 600 }}>
            {p.joints_done}/{p.joints} · {p.progress}%
          </span>
        </div>
        <div className="bar tall"><i style={{ width: `${p.progress}%` }}/></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-1)" }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: "var(--t-5)", textTransform: "uppercase" }}>Pass</div>
          <div className="mono nums" style={{ fontSize: 14, color: p.pass > 96 ? "var(--ok)" : p.pass ? "var(--warn)" : "var(--t-4)", marginTop: 2 }}>
            {p.pass ? `${p.pass.toFixed(1)}%` : "—"}
          </div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: "var(--t-5)", textTransform: "uppercase" }}>Team</div>
          <div style={{ fontSize: 14, color: "var(--t-1)", marginTop: 2 }}>{p.team}</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: "var(--t-5)", textTransform: "uppercase" }}>Due</div>
          <div className="mono" style={{ fontSize: 12, color: "var(--t-1)", marginTop: 4 }}>{p.due}</div>
        </div>
      </div>
    </div>
  </div>
);

// =========== PROJECT DETAIL =========================================
const ProjectDetail = ({ p, onBack }) => {
  const joints = WQIS_DATA.joints;
  const [detailTab, setDetailTab] = React.useState("joints");
  return (
    <div className="page" style={{ padding: 24 }}>
      <div className="bg-grid"/>

      <div className="row" style={{ marginBottom: 16 }}>
        <button className="btn ghost sm" onClick={onBack}>
          <Icons.ChevL size={14}/> All projects
        </button>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--t-4)", letterSpacing: "0.1em" }}>
          PROJECTS / <b style={{ color: "var(--amber-2)" }}>{p.code}</b>
        </span>
      </div>

      <div className="panel glass" style={{ marginBottom: 14 }}>
        <div className="panel-body" style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
          <IndustryGlyph industry={p.industry} size={84}/>
          <div style={{ flex: 1 }}>
            <div className="row" style={{ gap: 10, marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--amber-2)", letterSpacing: "0.12em" }}>{p.code} · {p.id}</span>
              {qaChip(p.qa)}
              <span className="chip">{p.industry}</span>
            </div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>{p.name}</h1>
            <div style={{ fontSize: 13, color: "var(--t-3)", marginTop: 6 }}>{p.client} · Lead {p.lead} · Due {p.due}</div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn sm"><Icons.Upload size={14}/> Upload WPS</button>
            <button className="btn sm"><Icons.Download size={14}/> Export</button>
            <button className="btn primary sm"><Icons.Plus size={14}/> New batch</button>
          </div>
        </div>
        {/* progress strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", borderTop: "1px solid var(--border-1)" }}>
          {[
            { l: "Joints total",  v: p.joints },
            { l: "Completed",     v: p.joints_done },
            { l: "Pass rate",     v: p.pass ? `${p.pass.toFixed(1)}%` : "—", color: "var(--ok)" },
            { l: "Progress",      v: `${p.progress}%`, color: "var(--amber)" },
            { l: "Open NCRs",     v: 4 },
            { l: "Team",          v: `${p.team} ppl` },
          ].map((c, i) => (
            <div key={i} style={{ padding: "14px 18px", borderRight: i < 5 ? "1px solid var(--border-1)" : "none" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--t-4)", textTransform: "uppercase" }}>{c.l}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: c.color || "var(--t-1)", marginTop: 4 }}>{c.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* tabs row */}
      <div className="row" style={{ marginBottom: 12, gap: 4 }}>
        {[["joints","Joints (1842)"],["docs","Documents"],["timeline","Timeline"],["team","Team"],["traceability","Traceability"],["ai","AI History"]].map(([id,lbl]) => (
          <button key={id} className={`btn ${detailTab === id ? "" : "ghost"} sm`}
                  style={{ background: detailTab === id ? "var(--bg-3)" : "transparent" }}
                  onClick={() => setDetailTab(id)}>
            {lbl}
          </button>
        ))}
        <span style={{ flex: 1 }}/>
        <button className="btn ghost sm"><Icons.Filter size={14}/> Filter</button>
        <button className="btn ghost sm"><Icons.Search size={14}/> Search joint</button>
      </div>

      {detailTab === "joints" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 14 }}>
          {/* joint table */}
          <div className="panel glass" style={{ overflow: "hidden" }}>
            <div className="panel-header">
              <h3>Joint database</h3>
              <span className="sub">10 of 1,842 SHOWN</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Joint</th><th>Spool</th><th>WPS</th><th>Welder</th>
                    <th>Ø</th><th>Pos</th><th>Date</th><th>Verdict</th><th>Conf.</th>
                  </tr>
                </thead>
                <tbody>
                  {joints.map(j => (
                    <tr key={j.id}>
                      <td style={{ fontFamily: "var(--font-mono)", color: "var(--t-1)", fontWeight: 600 }}>{j.id}</td>
                      <td className="mono" style={{ color: "var(--t-3)" }}>{j.spool}</td>
                      <td><span className="chip amber">{j.wps}</span></td>
                      <td><span className="mono" style={{ color: "var(--t-2)" }}>{j.welder}</span></td>
                      <td className="mono">{j.dia}</td>
                      <td className="mono">{j.pos}</td>
                      <td className="mono" style={{ fontSize: 11.5, color: "var(--t-4)" }}>{j.date.slice(5)}</td>
                      <td>
                        {j.verdict === "pass"   && <span className="chip ok"><span className="dot"/>PASS</span>}
                        {j.verdict === "review" && <span className="chip warn"><span className="dot"/>REVIEW</span>}
                        {j.verdict === "fail"   && <span className="chip bad"><span className="dot"/>FAIL</span>}
                      </td>
                      <td className="mono nums" style={{ color: j.conf > 95 ? "var(--ok)" : j.conf > 85 ? "var(--t-1)" : "var(--warn)" }}>
                        {j.conf.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* side panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="panel glass">
              <div className="panel-header"><h3>Documents</h3><Icons.Plus size={14} stroke="var(--t-3)"/></div>
              <div className="panel-body flush">
                {[
                  { name: "WPS-001 rev C", kind: "WPS", date: "2026-02-12", icon: "Doc", color: "var(--amber)" },
                  { name: "PQR-001",       kind: "PQR", date: "2026-02-08", icon: "Doc", color: "var(--info)" },
                  { name: "ITP — SYN-L3",  kind: "ITP", date: "2026-04-22", icon: "Standard", color: "var(--ok)" },
                  { name: "Iso Drawing 12 of 47", kind: "DWG", date: "2026-04-30", icon: "Image", color: "var(--purple)" },
                  { name: "Daily Report 2026-05-13", kind: "RPT", date: "2026-05-13", icon: "Report", color: "var(--amber)" },
                ].map((d, i) => {
                  const Ico = Icons[d.icon];
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid var(--border-1)", cursor: "pointer" }}>
                      <Ico size={16} stroke={d.color}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, color: "var(--t-1)", fontWeight: 500 }}>{d.name}</div>
                        <div className="mono" style={{ fontSize: 10.5, color: "var(--t-4)", letterSpacing: "0.06em" }}>{d.kind} · {d.date}</div>
                      </div>
                      <Icons.Download size={14} stroke="var(--t-4)"/>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="panel glass">
              <div className="panel-header"><h3>Timeline</h3></div>
              <div className="panel-body" style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 22, top: 16, bottom: 16, width: 1, background: "var(--border-2)" }}/>
                {[
                  { t: "TODAY", l: "Batch SP-A-12 inspected · 24 joints", c: "var(--amber)" },
                  { t: "TODAY", l: "WPS-001 rev C signed by client", c: "var(--ok)" },
                  { t: "13 MAY", l: "Welder WD-019 returned to qualification", c: "var(--warn)" },
                  { t: "12 MAY", l: "Drawing 12 of 47 issued for construction", c: "var(--info)" },
                  { t: "10 MAY", l: "Project kickoff · ITP issued", c: "var(--t-3)" },
                ].map((e, i) => (
                  <div key={i} style={{ position: "relative", paddingLeft: 28, marginBottom: 14 }}>
                    <div style={{ position: "absolute", left: 18, top: 4, width: 9, height: 9, borderRadius: "50%", background: e.c, boxShadow: `0 0 8px ${e.c}` }}/>
                    <div className="mono" style={{ fontSize: 10, color: "var(--t-4)", letterSpacing: "0.1em" }}>{e.t}</div>
                    <div style={{ fontSize: 12, color: "var(--t-1)", marginTop: 2 }}>{e.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {detailTab === "team" && <TeamTab project={p}/>}

      {(detailTab === "docs" || detailTab === "timeline" || detailTab === "traceability" || detailTab === "ai") && (
        <div className="panel glass" style={{ padding: 32, textAlign: "center" }}>
          <div style={{ color: "var(--t-4)", fontSize: 13 }}>Select the Joints tab to view joint data, or Team to manage team assignments.</div>
        </div>
      )}
    </div>
  );
};

// =========== PROJECTS LIST ==========================================
const ProjectsScreen = () => {
  const [view, setView] = React.useState("card");
  const [filter, setFilter] = React.useState("all");
  const [openProject, setOpenProject] = React.useState(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [projects, setProjects] = React.useState(WQIS_DATA.projects);

  if (openProject) return <ProjectDetail p={openProject} onBack={() => setOpenProject(null)}/>;

  let list = projects;
  if (filter !== "all") list = list.filter(p => p.qa === filter);

  return (
    <div className="page">
      <div className="bg-grid"/>
      <div className="page-head">
        <div>
          <span className="kicker">PROJECTS · 23 ACTIVE</span>
          <h1 style={{ marginTop: 8 }}>Project portfolio</h1>
          <div className="sub">Track inspection progress across 6 industries and 142 welders.</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="seg">
            <button className={filter === "all" ? "on" : ""}       onClick={() => setFilter("all")}>All</button>
            <button className={filter === "in-review" ? "on" : ""} onClick={() => setFilter("in-review")}>In review</button>
            <button className={filter === "approved" ? "on" : ""}  onClick={() => setFilter("approved")}>Approved</button>
            <button className={filter === "pending" ? "on" : ""}   onClick={() => setFilter("pending")}>Pending</button>
          </div>
          <div className="seg">
            <button className={view === "card" ? "on" : ""}  onClick={() => setView("card")}>
              <Icons.Grid size={12}/>
            </button>
            <button className={view === "table" ? "on" : ""} onClick={() => setView("table")}>
              <Icons.Rows size={12}/>
            </button>
          </div>
          <button className="btn primary sm" onClick={() => setShowAdd(true)}><Icons.Plus size={14}/> New project</button>
        </div>
      </div>

      {/* industry filter pills */}
      <div className="row wrap" style={{ marginBottom: 18, gap: 6 }}>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--t-4)", letterSpacing: "0.12em", marginRight: 6 }}>INDUSTRY ·</span>
        {WQIS_DATA.industries.map(ind => (
          <span key={ind} className="chip" style={{ cursor: "pointer" }}>{ind}</span>
        ))}
      </div>

      {view === "card" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14 }}>
          {list.map(p => <ProjectCard key={p.id} p={p} onOpen={() => setOpenProject(p)}/>)}
        </div>
      ) : (
        <div className="panel glass" style={{ overflow: "hidden" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Code</th><th>Project</th><th>Client</th><th>Industry</th>
                <th>Progress</th><th>Pass</th><th>QA</th><th>Due</th><th></th>
              </tr>
            </thead>
            <tbody>
              {list.map(p => (
                <tr key={p.id} onClick={() => setOpenProject(p)} style={{ cursor: "pointer" }}>
                  <td className="mono" style={{ color: "var(--amber-2)" }}>{p.code}</td>
                  <td style={{ color: "var(--t-1)", fontWeight: 600 }}>{p.name}</td>
                  <td>{p.client}</td>
                  <td><span className="chip">{p.industry}</span></td>
                  <td style={{ width: 200 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <div className="bar grow"><i style={{ width: `${p.progress}%` }}/></div>
                      <span className="mono nums" style={{ width: 32, textAlign: "right" }}>{p.progress}%</span>
                    </div>
                  </td>
                  <td className="mono nums" style={{ color: p.pass > 96 ? "var(--ok)" : p.pass ? "var(--warn)" : "var(--t-4)" }}>
                    {p.pass ? `${p.pass.toFixed(1)}%` : "—"}
                  </td>
                  <td>{qaChip(p.qa)}</td>
                  <td className="mono">{p.due}</td>
                  <td><Icons.ChevR size={14} stroke="var(--t-4)"/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <AddProjectModal onClose={() => setShowAdd(false)} onAdd={form => {
        const newProj = { id: `PRJ-NEW-${Date.now()}`, code: form.name.slice(0,8).toUpperCase().replace(/\s/g,"-"),
          name: form.name, client: form.client, industry: form.industry,
          progress: 0, joints: 0, joints_done: 0, qa: "pending", pass: null, lead: "—",
          team: 0, due: form.due, desc: "" };
        setProjects(ps => [newProj, ...ps]);
      }}/>}
    </div>
  );
};

window.ProjectsScreen = ProjectsScreen;
