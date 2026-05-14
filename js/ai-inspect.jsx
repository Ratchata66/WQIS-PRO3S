/* global React, Icons, Charts, WeldImage, WQIS_DATA */

// Batch items shown in left panel (simulated upload queue)
const BATCH = [
  { id: "J-1602", file: "weld_240514_0942.jpg", variant: "tig-pass",   status: "done",   verdict: "pass",   conf: 99.1, time: "09:42" },
  { id: "J-1601", file: "weld_240514_0918.jpg", variant: "tig-pass",   status: "done",   verdict: "pass",   conf: 98.6, time: "09:18" },
  { id: "J-1600", file: "weld_240514_0854.jpg", variant: "tig-review", status: "done",   verdict: "review", conf: 78.2, time: "08:54" },
  { id: "J-1599", file: "weld_240514_0830.jpg", variant: "tig-fail",   status: "done",   verdict: "fail",   conf: 94.4, time: "08:30" },
  { id: "J-1598", file: "weld_240514_0806.jpg", variant: "tig-pass",   status: "queue",  verdict: "—",      conf: 0,    time: "08:06" },
  { id: "J-1597", file: "weld_240514_0742.jpg", variant: "tig-pass",   status: "queue",  verdict: "—",      conf: 0,    time: "07:42" },
];

const verdictChip = (v, conf) => {
  if (v === "pass")   return <span className="chip ok"><span className="dot"/>PASS · {conf}%</span>;
  if (v === "fail")   return <span className="chip bad"><span className="dot"/>FAIL · {conf}%</span>;
  if (v === "review") return <span className="chip warn"><span className="dot"/>REVIEW · {conf}%</span>;
  return <span className="chip">QUEUED</span>;
};

// =============== LEFT PANEL =========================================
const LeftPanel = ({ selected, onSelect, onAnalyze, scanning }) => {
  return (
    <div className="panel glass" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
      <div className="panel-header">
        <h3><Icons.Upload size={14}/> Capture & Batch</h3>
        <span className="sub">{BATCH.length} ITEMS</span>
      </div>

      <div style={{ padding: 12 }}>
        <div style={{
          border: "1.5px dashed var(--amber-line)",
          borderRadius: 10,
          padding: 18,
          textAlign: "center",
          background: "linear-gradient(180deg, var(--amber-soft), transparent)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%",
                        background: "var(--amber-soft)",
                        border: "1px solid var(--amber-line)",
                        display: "grid", placeItems: "center", margin: "0 auto 10px",
                        color: "var(--amber-2)" }}>
            <Icons.Upload size={20}/>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Drop weld images here</div>
          <div style={{ fontSize: 11.5, color: "var(--t-3)", marginTop: 4 }}>
            JPG · PNG · BMP · TIFF · ≤ 24 MB · ≥ 1024×768
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12 }}>
            <span className="chip">JPG</span>
            <span className="chip">PNG</span>
            <span className="chip">BMP</span>
            <span className="chip amber">RAW</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          <button className="btn sm ghost" style={{ justifyContent: "center" }}>
            <Icons.Folder size={14}/> Folder
          </button>
          <button className="btn sm ghost" style={{ justifyContent: "center" }}>
            <Icons.Camera size={14}/> Camera
          </button>
        </div>
      </div>

      <div style={{ padding: "0 12px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="mono" style={{ fontSize: 10.5, letterSpacing: "0.12em", color: "var(--t-4)", textTransform: "uppercase" }}>
          INSPECTION QUEUE
        </span>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--t-4)" }}>
          {BATCH.filter(b => b.status === "queue").length} queued
        </span>
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: "0 8px" }}>
        {BATCH.map(b => {
          const sel = selected === b.id;
          return (
            <div key={b.id}
                 onClick={() => onSelect(b.id)}
                 style={{
                   display: "flex", gap: 10, padding: 8,
                   borderRadius: 8,
                   border: `1px solid ${sel ? "var(--amber-line)" : "transparent"}`,
                   background: sel ? "var(--amber-soft)" : "transparent",
                   marginBottom: 4,
                   cursor: "pointer",
                 }}>
              <div style={{ width: 48, height: 36, borderRadius: 4, overflow: "hidden",
                            border: "1px solid var(--border-2)", position: "relative", flexShrink: 0 }}>
                <WeldImage variant={b.variant} w={120} h={80}/>
                {b.status === "queue" && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
                                display: "grid", placeItems: "center",
                                color: "var(--t-3)", fontFamily: "var(--font-mono)", fontSize: 9 }}>
                    QUEUE
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="mono" style={{ fontSize: 11.5, color: "var(--t-1)", fontWeight: 600 }}>{b.id}</span>
                  <span className="mono" style={{ fontSize: 10, color: "var(--t-4)" }}>{b.time}</span>
                </div>
                <div style={{ fontSize: 10.5, color: "var(--t-4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--font-mono)" }}>
                  {b.file}
                </div>
                <div style={{ marginTop: 4 }}>
                  {b.status === "done"
                    ? verdictChip(b.verdict, b.conf)
                    : <span className="chip">PENDING</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: 12, borderTop: "1px solid var(--border-1)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button className="btn primary sm" style={{ justifyContent: "center" }}
                onClick={onAnalyze}
                disabled={scanning}>
          {scanning ? <><span className="live-dot"/> Analyzing…</> : <><Icons.Zap size={14}/> Analyze</>}
        </button>
        <button className="btn sm" style={{ justifyContent: "center" }}>
          <Icons.Compare size={14}/> Compare
        </button>
        <button className="btn ghost sm" style={{ justifyContent: "center" }}>
          <Icons.Trash size={14}/> Clear
        </button>
        <button className="btn ghost sm" style={{ justifyContent: "center" }}>
          <Icons.Download size={14}/> Export
        </button>
      </div>
    </div>
  );
};

// =============== CENTER PANEL =======================================
const CenterPanel = ({ batch, showBoxes, showHeat, showScan, setBoxes, setHeat, setScan }) => {
  const [zoom, setZoom] = React.useState(100);
  return (
    <div className="panel glass" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
      {/* viewer toolbar */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid var(--border-1)", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--t-2)", fontWeight: 600 }}>{batch.id}</span>
          <span className="chip">Spool SP-A-12</span>
          <span className="chip">WPS-001</span>
          <span className="chip">GTAW · SUS316L</span>
        </div>

        <div style={{ flex: 1 }}/>

        <div className="seg" style={{ marginRight: 8 }}>
          <button className={showBoxes ? "on" : ""} onClick={() => setBoxes(!showBoxes)}>
            <Icons.Grid size={12} style={{ marginRight: 4, verticalAlign: -2 }}/> Boxes
          </button>
          <button className={showHeat ? "on" : ""} onClick={() => setHeat(!showHeat)}>
            <Icons.Layers size={12} style={{ marginRight: 4, verticalAlign: -2 }}/> Heatmap
          </button>
          <button className={showScan ? "on" : ""} onClick={() => setScan(!showScan)}>
            <Icons.Scan size={12} style={{ marginRight: 4, verticalAlign: -2 }}/> Scan
          </button>
        </div>
        <div className="seg">
          <button onClick={() => setZoom(z => Math.max(50, z-25))}>−</button>
          <button>{zoom}%</button>
          <button onClick={() => setZoom(z => Math.min(400, z+25))}>+</button>
        </div>
      </div>

      {/* viewer */}
      <div style={{ flex: 1, position: "relative", background: "var(--bg-0)", overflow: "hidden" }}>
        <div className="bg-grid"/>
        {/* corner brackets / hud */}
        <div className="bracket tl"/>
        <div className="bracket tr"/>
        <div className="bracket bl"/>
        <div className="bracket br"/>

        <div style={{
          position: "absolute", inset: "32px 40px",
          border: "1px solid var(--border-2)",
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px var(--border-1) inset",
          transform: `scale(${zoom/100})`,
          transformOrigin: "center center",
          transition: "transform 0.25s ease",
        }}>
          <WeldImage variant={batch.variant} showBoxes={showBoxes} showHeatmap={showHeat} showScan={showScan} />
        </div>

        {/* HUD top-left — image meta */}
        <div style={{ position: "absolute", top: 18, left: 24, display: "flex", gap: 6 }}>
          <span className="chip" style={{ background: "rgba(8,12,18,0.85)" }}>
            <Icons.Image size={11}/> {batch.file}
          </span>
          <span className="chip" style={{ background: "rgba(8,12,18,0.85)" }}>
            2848×1872 · 6.2 MP
          </span>
        </div>

        {/* HUD top-right — model */}
        <div style={{ position: "absolute", top: 18, right: 24, display: "flex", gap: 6 }}>
          <span className="chip amber">
            <span className="dot"/>cloud-v2 · YOLOv8-x
          </span>
          <span className="chip">99.24% acc</span>
        </div>

        {/* bottom strip - scale + measurements */}
        <div style={{ position: "absolute", bottom: 16, left: 24, right: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span className="mono" style={{ fontSize: 10.5, color: "var(--t-4)", letterSpacing: "0.1em" }}>
            CAL · 1 px = 0.042 mm
          </span>
          <div style={{ flex: 1, height: 4, background: "var(--bg-2)", borderRadius: 2, position: "relative" }}>
            <div style={{ position: "absolute", left: "20%", right: "20%", top: 0, bottom: 0, background: "var(--amber)", borderRadius: 2, opacity: 0.7 }}/>
            <div style={{ position: "absolute", left: "20%", top: -4, bottom: -4, width: 1, background: "var(--amber)" }}/>
            <div style={{ position: "absolute", left: "80%", top: -4, bottom: -4, width: 1, background: "var(--amber)" }}/>
          </div>
          <span className="mono" style={{ fontSize: 10.5, color: "var(--t-2)" }}>BEAD W · 4.84 mm</span>
        </div>
      </div>
    </div>
  );
};

// =============== RIGHT PANEL ========================================
const VerdictCard = ({ batch }) => {
  const isPass = batch.verdict === "pass";
  const isFail = batch.verdict === "fail";
  const color = isPass ? "var(--ok)" : isFail ? "var(--bad)" : "var(--warn)";
  const verdictText = batch.verdict.toUpperCase();
  return (
    <div className="panel accent" style={{ position: "relative", overflow: "hidden" }}>
      <div className="bracket tl"/>
      <div className="bracket tr"/>
      <div style={{ padding: 18, display: "flex", alignItems: "center", gap: 18 }}>
        <Charts.Ring value={batch.conf} size={108} thickness={9} color={color}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color, lineHeight: 1 }}>
              {batch.conf.toFixed(1)}
            </div>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--t-4)", marginTop: 4 }}>
              CONFIDENCE
            </div>
          </div>
        </Charts.Ring>
        <div style={{ flex: 1 }}>
          <div className="kicker">VERDICT · cloud-v2</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em", marginTop: 8, color,
                        textShadow: `0 0 24px ${color}` }}>
            {verdictText}
          </div>
          <div className="mono" style={{ fontSize: 10.5, color: "var(--t-3)", letterSpacing: "0.06em", marginTop: 6 }}>
            DETECTED IN <b style={{ color: "var(--t-1)" }}>1.84 s</b> · 12,486 PARAMS
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span className="chip">{batch.id}</span>
            <span className="chip">Spool SP-A-12</span>
            <span className="chip">5G · 2"</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DefectList = ({ variant }) => {
  // Mock defects shown depending on variant
  const setsByVariant = {
    "tig-pass":   [],
    "tig-review": [{ type: "porosity", count: 2, sev: "minor",    size: "Ø 0.6 mm",  loc: "x=302 y=216", conf: 78 }],
    "tig-fail":   [
      { type: "undercut",          count: 1, sev: "major", size: "L 7.2 mm · D 0.4 mm", loc: "x=152 y=192", conf: 94 },
      { type: "incomplete-fusion", count: 1, sev: "major", size: "L 11.0 mm",           loc: "x=398 y=212", conf: 87 },
    ],
    "smaw-fail":  [{ type: "crack", count: 1, sev: "critical", size: "L 13.6 mm", loc: "x=304 y=202", conf: 96 }],
  };
  const list = setsByVariant[variant] || [];
  const defMap = Object.fromEntries(WQIS_DATA.defects.map(d => [d.id, d]));

  if (list.length === 0) {
    return (
      <div className="panel glass" style={{ padding: 16, textAlign: "center" }}>
        <Icons.Tick size={28} stroke="var(--ok)"/>
        <div style={{ marginTop: 8, fontSize: 13.5, fontWeight: 600 }}>No defects detected</div>
        <div className="mono" style={{ fontSize: 10.5, color: "var(--t-4)", marginTop: 4, letterSpacing: "0.06em" }}>
          BEAD WIDTH 4.84 mm · OXIDE LEVEL ≤ 5 ppm · WITHIN BPE 2024
        </div>
      </div>
    );
  }

  return (
    <div className="panel glass">
      <div className="panel-header">
        <h3>Detected defects</h3>
        <span className="sub">{list.length} FOUND · GRAD-CAM ON</span>
      </div>
      <div className="panel-body flush">
        {list.map((d, i) => {
          const meta = defMap[d.type];
          const sevColor = d.sev === "critical" ? "var(--bad)" : d.sev === "major" ? "var(--warn)" : "var(--info)";
          return (
            <div key={i} style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: sevColor, boxShadow: `0 0 8px ${sevColor}` }}/>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{meta.label}</span>
                <span className={`chip ${d.sev === "critical" ? "bad" : d.sev === "major" ? "warn" : "info"}`}>
                  {d.sev.toUpperCase()}
                </span>
                <span className="mono nums" style={{ marginLeft: "auto", fontSize: 11, color: "var(--t-2)" }}>
                  {d.conf}%
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--t-3)", marginBottom: 8 }}>{meta.desc}</div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--t-4)", letterSpacing: "0.06em", display: "flex", gap: 14 }}>
                <span>SIZE · <b style={{ color: "var(--t-2)" }}>{d.size}</b></span>
                <span>LOC · <b style={{ color: "var(--t-2)" }}>{d.loc}</b></span>
                <span>QTY · <b style={{ color: "var(--t-2)" }}>{d.count}</b></span>
              </div>
              <div className="bar" style={{ marginTop: 8 }}>
                <i style={{ width: `${d.conf}%`, background: sevColor }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StandardRef = ({ batch }) => (
  <div className="panel glass">
    <div className="panel-header">
      <h3><Icons.Standard size={14}/> Reference standards</h3>
    </div>
    <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[
        { code: "ISO 5817", level: "B", desc: "Welding — Quality levels for imperfections (stricter).", match: 98 },
        { code: "ASME IX",  level: "QW-194", desc: "Visual examination — qualification of welders & procedures.", match: 95 },
        { code: "ASME BPE 2024", level: "§MJ-7.3", desc: "Hygienic process tubing — oxide acceptance.", match: 92 },
        { code: "AWS D18.2", level: "Sample 3", desc: "Oxide discoloration in austenitic stainless.", match: 88 },
      ].map(s => (
        <div key={s.code} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 4, background: "var(--bg-2)",
                        border: "1px solid var(--border-2)", display: "grid", placeItems: "center" }}>
            <Icons.Beaker size={14}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--t-1)" }}>{s.code}</span>
              <span className="mono" style={{ fontSize: 10, color: "var(--amber-2)" }}>{s.level}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--t-4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {s.desc}
            </div>
          </div>
          <span className="mono" style={{ fontSize: 11, color: "var(--t-2)", width: 32, textAlign: "right" }}>{s.match}%</span>
        </div>
      ))}
    </div>
  </div>
);

const AICommentary = ({ batch }) => {
  const text = {
    "tig-pass":
      "การวิเคราะห์ภาพแนวเชื่อมไม่พบความไม่ต่อเนื่อง ค่า oxide ที่ระดับ silver/straw อยู่ในเกณฑ์ยอมรับตาม ASME BPE 2024 · §MJ-7.3. Bead width and ripple frequency consistent with WPS-001. Recommend release for next stage.",
    "tig-review":
      "Two clusters of fine porosity detected near 5 o'clock. ขนาดเล็กกว่าเกณฑ์ของ ISO 5817 Level B (≤ Ø 1 mm) แต่ confidence ต่ำกว่า threshold 85% — ส่งให้ QA Inspector ตรวจซ้ำด้วย dye-penetrant ก่อนตัดสิน.",
    "tig-fail":
      "Continuous undercut 7.2 mm and incomplete fusion detected on cap pass. ตามมาตรฐาน ASME IX QW-194 และ ISO 5817 Level B ถือว่า unacceptable. Recommend grind out and re-weld; pre-heat to 120 °C and lower travel speed by 15%.",
    "smaw-fail":
      "Surface-breaking crack detected (transverse, 13.6 mm). AUTO-REJECT under all governing standards. Recommend full removal of joint, re-prep, MT after grinding, and welder re-qualification per WPS-004 rev. B.",
  }[batch.variant];

  return (
    <div className="panel glass">
      <div className="panel-header">
        <h3><Icons.Cpu size={14}/> AI commentary</h3>
        <span className="sub">cloud-v2 · TH/EN</span>
      </div>
      <div className="panel-body">
        <div style={{ fontSize: 12.5, color: "var(--t-2)", lineHeight: 1.6 }}>
          {text}
        </div>
      </div>
    </div>
  );
};

const SuggestedAction = ({ batch }) => {
  if (batch.verdict === "pass") {
    return (
      <div className="panel glass">
        <div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Icons.Tick size={22} stroke="var(--ok)"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Release to QA Engineer</div>
            <div style={{ fontSize: 11.5, color: "var(--t-4)" }}>Auto-route enabled · Manop K. notified</div>
          </div>
          <button className="btn primary sm">Approve · Sign</button>
        </div>
      </div>
    );
  }
  if (batch.verdict === "review") {
    return (
      <div className="panel glass" style={{ borderColor: "var(--warn-line)" }}>
        <div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Icons.Warn size={22} stroke="var(--warn)"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Manual review required</div>
            <div style={{ fontSize: 11.5, color: "var(--t-4)" }}>Confidence below threshold — dye-penetrant suggested</div>
          </div>
          <button className="btn sm">Send to inspector</button>
        </div>
      </div>
    );
  }
  return (
    <div className="panel glass" style={{ borderColor: "var(--bad-line)" }}>
      <div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icons.Cross size={22} stroke="var(--bad)"/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bad)" }}>Reject — repair required</div>
          <div style={{ fontSize: 11.5, color: "var(--t-4)" }}>Grind out · re-weld · re-inspect</div>
        </div>
        <button className="btn sm" style={{ color: "var(--bad)", borderColor: "var(--bad-line)" }}>
          Open repair ticket
        </button>
      </div>
    </div>
  );
};

const WorkflowMini = ({ verdict }) => {
  const steps = [
    { label: "Inspector", sub: "AI Engine" },
    { label: "QA Eng.",   sub: "Manop K." },
    { label: "Client",    sub: "Synova" },
    { label: "Approved",  sub: "—" },
  ];
  const current = verdict === "pass" ? 1 : verdict === "review" ? 0 : 0;
  return (
    <div className="panel glass">
      <div className="panel-header">
        <h3><Icons.Workflow size={14}/> Approval workflow</h3>
        <span className="sub">AP-2148</span>
      </div>
      <div className="panel-body">
        <Charts.WorkflowSteps steps={steps} current={current}/>
      </div>
    </div>
  );
};

// =============== AI INSPECT SCREEN ==================================
const AIInspectScreen = () => {
  const [selectedId, setSelectedId] = React.useState("J-1599");
  const [boxes, setBoxes] = React.useState(true);
  const [heat, setHeat] = React.useState(true);
  const [scan, setScan] = React.useState(false);
  const [scanning, setScanning] = React.useState(false);
  const batch = BATCH.find(b => b.id === selectedId) || BATCH[0];

  const onAnalyze = () => {
    setScanning(true);
    setScan(true);
    setTimeout(() => { setScanning(false); setScan(false); }, 2500);
  };

  return (
    <div style={{ padding: 14, height: "100%", display: "grid",
                  gridTemplateColumns: "300px 1fr 360px",
                  gap: 12, overflow: "hidden" }}>
      <LeftPanel selected={selectedId} onSelect={setSelectedId} onAnalyze={onAnalyze} scanning={scanning}/>
      <CenterPanel batch={batch}
                   showBoxes={boxes} showHeat={heat} showScan={scan || scanning}
                   setBoxes={setBoxes} setHeat={setHeat} setScan={setScan}/>
      <div className="scroll-y" style={{ display: "flex", flexDirection: "column", gap: 10, paddingRight: 2 }}>
        <VerdictCard batch={batch}/>
        <DefectList variant={batch.variant}/>
        <SuggestedAction batch={batch}/>
        <WorkflowMini verdict={batch.verdict}/>
        <AICommentary batch={batch}/>
        <StandardRef batch={batch}/>
      </div>
    </div>
  );
};

window.AIInspectScreen = AIInspectScreen;
