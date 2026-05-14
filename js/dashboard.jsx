/* global React, Icons, Charts, WQIS_DATA, WQIS_FMT */

const KPI_META = {
  welds:   { icon: "Activity", color: "var(--amber)",  thaiLabel: "งานเชื่อมทั้งหมด" },
  pass:    { icon: "Tick",     color: "var(--ok)",     thaiLabel: "อัตราผ่าน" },
  reject:  { icon: "Cross",   color: "var(--bad)",    thaiLabel: "อัตราปฏิเสธ" },
  pending: { icon: "Warn",    color: "var(--warn)",   thaiLabel: "รอตรวจสอบ" },
  active:  { icon: "Project", color: "var(--info)",   thaiLabel: "โครงการที่ใช้งาน" },
  ai:      { icon: "Cpu",     color: "var(--purple)", thaiLabel: "ความแม่นยำ AI" },
};

const KpiCard = ({ k }) => {
  const inverted = k.id === "reject" || k.id === "pending";
  const goodDir = (k.delta > 0 && !inverted) || (k.delta < 0 && inverted);
  const meta = KPI_META[k.id] || { icon: "Activity", color: "var(--amber)", thaiLabel: "" };
  const Ico = Icons[meta.icon];
  return (
    <div className="kpi" style={{ borderTop: `2px solid ${meta.color}44`, position: "relative", overflow: "hidden" }}>
      {/* background glow */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80,
                    borderRadius: "50%", background: meta.color, opacity: 0.05, pointerEvents: "none" }}/>
      <div className="label">
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span style={{ color: "var(--t-2)", fontWeight: 500 }}>{k.label}</span>
          <span className="mono" style={{ fontSize: 9.5, color: "var(--t-5)", letterSpacing: "0.08em", marginTop: 1 }}>
            {meta.thaiLabel}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: `${meta.color}1a`,
                        border: `1px solid ${meta.color}33`, display: "grid", placeItems: "center",
                        color: meta.color, flexShrink: 0 }}>
            <Ico size={14}/>
          </div>
          <Charts.Spark data={k.trend} width={56} height={18}
                        color={goodDir ? "var(--ok)" : "var(--bad)"} />
        </div>
      </div>
      <div className="value">
        <span style={{ color: meta.color }}>
          {typeof k.value === "number" && k.value % 1 !== 0 ? k.value.toFixed(1) : WQIS_FMT.num(k.value)}
        </span>
        {k.unit && <span className="unit">{k.unit}</span>}
      </div>
      <div className="foot">
        <span className={`delta ${goodDir ? "up" : "down"}`}>
          {k.delta > 0 ? "▲" : "▼"} {Math.abs(k.delta).toFixed(1)}{k.unit === "%" ? "pp" : "%"} vs 7d
        </span>
        <span className="mono" style={{ color: "var(--t-5)", fontSize: 10, letterSpacing: "0.1em" }}>
          {k.id.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

const PassDistribution = () => {
  const data = WQIS_DATA.passDist.map(d => ({ ...d, glow: d.label === "Pass" }));
  return (
    <div className="panel glass">
      <div className="panel-header">
        <h3>Pass / Review / Reject</h3>
        <span className="sub">LAST 24 H · 484 INSP.</span>
      </div>
      <div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Charts.Doughnut data={data} size={170} thickness={22}
          center={
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600 }}>96.8<span style={{ fontSize: 14, color: "var(--t-3)", marginLeft: 2 }}>%</span></div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--ok)" }}>PASS RATE</div>
            </div>
          }/>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          {data.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, boxShadow: `0 0 8px ${d.color}` }}/>
              <span style={{ flex: 1, fontSize: 12.5 }}>{d.label}</span>
              <span className="mono nums" style={{ fontSize: 13, color: "var(--t-1)" }}>{d.value.toFixed(1)}%</span>
            </div>
          ))}
          <div className="divider"/>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.1em", color: "var(--t-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>BENCHMARK</span><span style={{ color: "var(--t-2)" }}>95.0%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>TREND 7D</span><span style={{ color: "var(--ok)" }}>▲ 1.1pp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DefectMix = () => {
  return (
    <div className="panel glass">
      <div className="panel-header">
        <h3>Defect classification</h3>
        <span className="sub">DETECTED · 7D</span>
      </div>
      <div className="panel-body">
        <Charts.Bars
          data={WQIS_DATA.defectMix.map(d => ({
            label: d.label.split(" ").map(w => w.slice(0,4)).join(" "),
            value: d.value,
          }))}
          height={170} width={520} color="var(--amber)" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 12 }}>
          {WQIS_DATA.defectMix.map(d => (
            <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5 }}>
              <span className={`chip ${d.severity === "critical" ? "bad" : d.severity === "major" ? "warn" : "info"}`}
                    style={{ height: 16, padding: "0 6px", fontSize: 9.5 }}>
                {d.severity[0].toUpperCase()}
              </span>
              <span style={{ color: "var(--t-2)" }}>{d.label}</span>
              <span className="mono" style={{ marginLeft: "auto", color: "var(--t-3)" }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InspectionTimeline = () => (
  <div className="panel glass">
    <div className="panel-header">
      <h3>Inspection timeline</h3>
      <div className="row" style={{ gap: 8 }}>
        <span className="seg">
          <button className="on">24H</button>
          <button>7D</button>
          <button>30D</button>
        </span>
      </div>
    </div>
    <div className="panel-body">
      <Charts.Area data={WQIS_DATA.timeline} width={760} height={200}
                   valueKey="insp" labelKey="hour" color="var(--amber)" />
      <div style={{ display: "flex", gap: 18, marginTop: 8, fontSize: 11.5 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--amber)", boxShadow: "0 0 8px var(--amber)" }}/>
          <span style={{ color: "var(--t-3)" }}>Inspections</span>
          <span className="mono" style={{ color: "var(--t-1)" }}>568</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--ok)" }}/>
          <span style={{ color: "var(--t-3)" }}>Pass</span>
          <span className="mono" style={{ color: "var(--t-1)" }}>545</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--bad)" }}/>
          <span style={{ color: "var(--t-3)" }}>Fail</span>
          <span className="mono" style={{ color: "var(--t-1)" }}>23</span>
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", color: "var(--t-4)", fontSize: 10.5, letterSpacing: "0.1em" }}>
          PEAK 14:00 · 104 INSP/HR
        </span>
      </div>
    </div>
  </div>
);

const WelderRanking = () => {
  const top = WQIS_DATA.welders.slice(0, 5);
  const MEDALS = ["🥇", "🥈", "🥉"];
  return (
    <div className="panel glass">
      <div className="panel-header">
        <h3><Icons.Welder size={14} style={{ marginRight: 6 }}/>Welder performance</h3>
        <span className="sub">AI RANKING · 30D</span>
      </div>
      <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {top.map((w, i) => {
          const rankColor = i === 0 ? "var(--amber)" : i === 1 ? "var(--t-2)" : i === 2 ? "var(--warn)" : "var(--t-4)";
          return (
            <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 10,
                                     padding: "6px 8px", borderRadius: 8,
                                     background: i === 0 ? "var(--amber-soft)" : "transparent",
                                     border: `1px solid ${i === 0 ? "var(--amber-line)" : "transparent"}`,
                                     transition: "background 0.12s" }}
                 onMouseEnter={e => { if (i > 0) e.currentTarget.style.background = "var(--bg-2)"; }}
                 onMouseLeave={e => { if (i > 0) e.currentTarget.style.background = "transparent"; }}>
              <div style={{ width: 20, fontFamily: "var(--font-mono)", fontSize: i < 3 ? 14 : 11,
                            fontWeight: 600, color: rankColor, textAlign: "center", flexShrink: 0 }}>
                {i < 3 ? MEDALS[i] : `#${w.rank}`}
              </div>
              <div className="avatar sm" style={{ background: i === 0 ? "linear-gradient(135deg, var(--amber), #c75300)" : "var(--bg-3)" }}>
                {w.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--t-1)",
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {w.name}
                </div>
                <div className="mono" style={{ fontSize: 9.5, color: "var(--t-5)", letterSpacing: "0.07em", marginTop: 1 }}>
                  {w.code} · {w.jobs} JOBS
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span className="mono nums" style={{ fontSize: 13, fontWeight: 600,
                                                      color: w.pass >= 98 ? "var(--ok)" : w.pass >= 96 ? "var(--amber)" : "var(--warn)" }}>
                  {w.pass.toFixed(1)}%
                </span>
                <div style={{ width: 80 }}>
                  <div className="bar ok"><i style={{ width: `${(w.pass - 90) / 10 * 100}%` }}/></div>
                </div>
              </div>
            </div>
          );
        })}
        <button className="btn ghost sm" style={{ marginTop: 4, justifyContent: "center" }}>
          <Icons.Users size={13}/> View all 142 welders <Icons.ChevR size={12} style={{ marginLeft: 4 }}/>
        </button>
      </div>
    </div>
  );
};

const DefectHeatmap = () => {
  const { rows, data } = WQIS_DATA.heat;
  const max = 5;
  const colorAt = (v) => {
    if (v === 0) return "rgba(255,255,255,0.04)";
    const t = v / max;
    // amber-graded ramp
    return `rgba(255, ${Math.round(180 - t*80)}, ${Math.round(60 - t*40)}, ${0.25 + t*0.55})`;
  };
  return (
    <div className="panel glass">
      <div className="panel-header">
        <h3>Defect heatmap</h3>
        <span className="sub">SPOOL × HOUR · 14H</span>
      </div>
      <div className="panel-body" style={{ paddingTop: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8 }}>
          <div></div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${data[0].length}, 1fr)`, gap: 3,
                        fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--t-5)", textAlign: "center", letterSpacing: "0.08em" }}>
            {Array.from({ length: 14 }).map((_, i) => <div key={i}>{(i*2).toString().padStart(2,"0")}</div>)}
          </div>
          {data.map((row, ri) => (
            <React.Fragment key={ri}>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--t-3)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                {rows[ri]}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${row.length}, 1fr)`, gap: 3, height: 28 }}>
                {row.map((v, ci) => (
                  <div key={ci} className="heat-cell"
                       title={`${rows[ri]} · ${(ci*2).toString().padStart(2,"0")}:00 · ${v} defect${v===1?"":"s"}`}
                       style={{ background: colorAt(v) }}/>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <span className="mono" style={{ fontSize: 10.5, letterSpacing: "0.1em", color: "var(--t-4)" }}>
            5 SPOOLS · 14 H WINDOW · 47 DEFECTS DETECTED
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="mono" style={{ fontSize: 10, color: "var(--t-5)" }}>0</span>
            <div style={{ display: "flex", gap: 2 }}>
              {[0,1,2,3,4,5].map(v => (
                <div key={v} style={{ width: 14, height: 10, background: colorAt(v), borderRadius: 2 }}/>
              ))}
            </div>
            <span className="mono" style={{ fontSize: 10, color: "var(--t-5)" }}>5+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityFeed = () => {
  const META = {
    ai:     { ico: "Cpu",    color: "var(--amber)", bg: "var(--amber-soft)" },
    review: { ico: "Check",  color: "var(--info)",  bg: "var(--info-soft)" },
    fail:   { ico: "Cross",  color: "var(--bad)",   bg: "var(--bad-soft)" },
    upload: { ico: "Upload", color: "var(--t-2)",   bg: "var(--bg-3)" },
    wps:    { ico: "Doc",    color: "var(--purple)", bg: "var(--purple-soft)" },
    ok:     { ico: "Tick",   color: "var(--ok)",    bg: "var(--ok-soft)" },
  };
  return (
    <div className="panel glass">
      <div className="panel-header">
        <h3><span className="live-dot" style={{ marginRight: 8 }}/>Real-time activity</h3>
        <span className="sub mono" style={{ fontSize: 10 }}>LIVE FEED</span>
      </div>
      <div className="panel-body flush" style={{ maxHeight: 320, overflow: "auto" }}>
        {WQIS_DATA.activity.map((a, i) => {
          const m = META[a.kind] || META.upload;
          const Ico = Icons[m.ico];
          return (
            <div key={i} style={{ display: "flex", gap: 12, padding: "9px 16px",
                                  borderBottom: "1px solid var(--border-1)",
                                  transition: "background 0.12s" }}
                 onMouseEnter={e => e.currentTarget.style.background = "var(--bg-2)"}
                 onMouseLeave={e => e.currentTarget.style.background = ""}>
              <span className="mono" style={{ fontSize: 10, color: "var(--t-5)", width: 36, paddingTop: 4, letterSpacing: "0.06em", flexShrink: 0 }}>
                {a.t}
              </span>
              <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 1,
                            background: m.bg, border: `1px solid ${m.color}33`,
                            display: "grid", placeItems: "center", color: m.color }}>
                <Ico size={13}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: "var(--t-1)", fontWeight: 500 }}>{a.msg}</div>
                <div style={{ fontSize: 11, color: "var(--t-4)", marginTop: 2, display: "flex", gap: 6 }}>
                  <span style={{ color: "var(--t-3)" }}>{a.who}</span>
                  {a.proj !== "system" && (
                    <>
                      <span>·</span>
                      <span className="mono" style={{ color: "var(--amber-2)", fontSize: 10.5 }}>{a.proj}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border-1)" }}>
        <button className="btn ghost sm" style={{ width: "100%", justifyContent: "center", fontSize: 11.5 }}>
          View full activity log <Icons.ChevR size={12} style={{ marginLeft: "auto" }}/>
        </button>
      </div>
    </div>
  );
};

const ApprovalsCompact = () => (
  <div className="panel glass">
    <div className="panel-header">
      <h3><Icons.Workflow size={14} style={{ marginRight: 6 }}/>Pending approvals</h3>
      <span className="chip warn"><span className="dot"/>5 pending · รออนุมัติ</span>
    </div>
    <div className="panel-body flush">
      {WQIS_DATA.pendingApprovals.slice(0,5).map((a, i) => {
        const stageColor = a.stage === "client" ? "var(--info)" : a.stage === "qa" ? "var(--warn)" : "var(--amber)";
        const stageLabel = a.stage === "client" ? "CLIENT" : a.stage === "qa" ? "QA ENG." : "INSP.";
        return (
          <div key={a.id}
               style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 16px",
                        borderBottom: "1px solid var(--border-1)", transition: "background 0.12s",
                        borderLeft: `3px solid ${stageColor}66` }}
               onMouseEnter={e => e.currentTarget.style.background = "var(--bg-2)"}
               onMouseLeave={e => e.currentTarget.style.background = ""}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--t-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {a.item}
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--t-4)", marginTop: 2, letterSpacing: "0.06em", display: "flex", gap: 6 }}>
                <span style={{ color: "var(--amber-2)" }}>{a.proj}</span>
                <span>·</span>
                <span>{a.sub}</span>
                <span>·</span>
                <span>{a.age} ago</span>
              </div>
            </div>
            <span className="chip" style={{ borderColor: `${stageColor}55`, color: stageColor, fontSize: 9.5 }}>
              {stageLabel}
            </span>
          </div>
        );
      })}
    </div>
    <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border-1)" }}>
      <button className="btn ghost sm" style={{ width: "100%", justifyContent: "center", fontSize: 11.5 }}>
        Open workflow board <Icons.ChevR size={12} style={{ marginLeft: "auto" }}/>
      </button>
    </div>
  </div>
);

const DashboardScreen = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const thaiGreeting = hour < 12 ? "สวัสดีตอนเช้า" : hour < 17 ? "สวัสดีตอนบ่าย" : "สวัสดีตอนเย็น";
  return (
    <div className="page">
      <div className="bg-grid"/>
      <div className="page-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span className="kicker" style={{ color: "var(--amber-2)" }}>OVERVIEW · TH-1 · LIVE</span>
            <span style={{ width: 1, height: 12, background: "var(--border-2)" }}/>
            <span className="mono" style={{ fontSize: 10.5, color: "var(--ok)", letterSpacing: "0.1em" }}>
              <span className="live-dot" style={{ marginRight: 6 }}/>AI ONLINE
            </span>
          </div>
          <h1 style={{ marginTop: 0 }}>
            {greeting}, <span style={{ color: "var(--amber)" }}>Manop</span>.
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 16, color: "var(--t-3)", marginLeft: 12 }}>
              {thaiGreeting} คุณมนพ
            </span>
          </h1>
          <div className="sub">
            <span style={{ color: "var(--ok)" }}>23</span> active projects ·{" "}
            <span style={{ color: "var(--amber)" }}>484</span> inspections in the last 24 h ·{" "}
            <span style={{ color: "var(--purple)" }}>AI accuracy 99.2%</span>
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn ghost sm"><Icons.Calendar size={14}/> Today · 14 May 2026</button>
          <button className="btn ghost sm"><Icons.Filter size={14}/> All projects</button>
          <button className="btn primary sm"><Icons.Plus size={14}/> New inspection</button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 18 }}>
        {WQIS_DATA.kpis.map(k => <KpiCard key={k.id} k={k}/>)}
      </div>

      {/* Row 2 — charts + welder ranking */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <PassDistribution/>
          <DefectMix/>
        </div>
        <WelderRanking/>
      </div>

      {/* Row 3 — timeline + activity */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14, marginBottom: 14 }}>
        <InspectionTimeline/>
        <ActivityFeed/>
      </div>

      {/* Row 4 — approvals compact full width */}
      <ApprovalsCompact/>
    </div>
  );
};

window.DashboardScreen = DashboardScreen;
