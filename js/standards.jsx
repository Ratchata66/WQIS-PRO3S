/* global React, Icons, WQIS_DATA */

const StandardsScreen = () => {
  const [uploadName, setUploadName] = React.useState("");
  const [uploadCode, setUploadCode] = React.useState("");
  const [pdfs, setPdfs] = React.useState([
    { code: "ASME IX", file: "ASME_IX_2023.pdf", size: "4.2 MB", uploaded: "2026-03-01" },
    { code: "ISO 5817", file: "ISO_5817_2023.pdf", size: "2.8 MB", uploaded: "2026-03-01" },
    { code: "ASME BPE", file: "ASME_BPE_2024.pdf", size: "6.1 MB", uploaded: "2026-04-15" },
  ]);

  const standards = [
    { code: "ASME IX",    title: "Welding & Brazing Qualifications",  desc: "Procedure (PQR) and performance (WPQ) qualification rules.", rev: "2023 Ed.", color: "var(--amber)", scope: "F&B · Pharma · O&G" },
    { code: "ISO 5817",   title: "Quality Levels for Imperfections",  desc: "Acceptance levels B (strict), C (intermediate), D (low).", rev: "Level B", color: "var(--info)", scope: "All industries" },
    { code: "ASME BPE",   title: "Bioprocessing Equipment",           desc: "Hygienic tubing, surface finish Ra ≤ 0.4 µm, oxide grading.", rev: "2024 Ed.", color: "var(--ok)", scope: "Pharma · F&B" },
    { code: "AWS D18.2",  title: "Stainless Discoloration Guide",     desc: "Visual sample chart for oxide acceptance (silver → black).", rev: "2009 R23", color: "var(--purple)", scope: "Stainless" },
    { code: "ISO 9606-1", title: "Welder Qualification — Steels",     desc: "Test piece + acceptance criteria for performance qualification.", rev: "2017", color: "var(--warn)", scope: "Welder cert." },
    { code: "API 1104",   title: "Welding of Pipelines",              desc: "Oil & Gas — radiographic examination acceptance limits.", rev: "22nd Ed.", color: "var(--bad)", scope: "Oil & Gas" },
  ];

  return (
    <div className="page">
      <div className="bg-grid"/>
      <div className="page-head">
        <div>
          <span className="kicker">REFERENCE LIBRARY · {standards.length} STANDARDS</span>
          <h1 style={{ marginTop: 8 }}>Standard Reference</h1>
          <div className="sub">คลังมาตรฐานอ้างอิง · Governing codes used by AI grading and human review.</div>
        </div>
      </div>

      {/* Standards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 22 }}>
        {standards.map(s => {
          const hasPdf = pdfs.find(p => p.code === s.code);
          return (
            <div key={s.code} className="panel glass"
                 style={{ borderTop: `2px solid ${s.color}44`, transition: "all 0.16s" }}
                 onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 0 1px ${s.color}33, 0 14px 30px -14px ${s.color}44`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                 onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
              <div className="panel-body">
                <div className="row" style={{ marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`,
                                border: `1px solid ${s.color}44`, display: "grid", placeItems: "center", color: s.color }}>
                    <Icons.Standard size={19}/>
                  </div>
                  <div style={{ flex: 1, marginLeft: 10 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: s.color }}>{s.code}</div>
                    <div className="mono" style={{ fontSize: 9.5, color: "var(--t-5)", letterSpacing: "0.1em", marginTop: 1 }}>{s.rev}</div>
                  </div>
                  {hasPdf
                    ? <span className="chip ok" style={{ fontSize: 9.5 }}><span className="dot"/>PDF</span>
                    : <span className="chip" style={{ fontSize: 9.5 }}>No PDF</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--t-1)" }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--t-3)", marginTop: 5, lineHeight: 1.5 }}>{s.desc}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12,
                              paddingTop: 10, borderTop: "1px solid var(--border-1)" }}>
                  <span className="mono" style={{ fontSize: 9.5, color: "var(--t-5)" }}>◈ {s.scope}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {hasPdf && <button className="btn ghost sm" style={{ fontSize: 11 }}>View PDF</button>}
                    {hasPdf && <button className="btn ghost sm icon"><Icons.Download size={13}/></button>}
                    {!hasPdf && <button className="btn ghost sm" style={{ fontSize: 11 }}>Upload PDF</button>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
        <div className="panel glass">
          <div className="panel-header"><h3><Icons.Upload size={14}/> Upload Standard PDF</h3></div>
          <div className="panel-body">
            <div style={{ border: "1.5px dashed var(--border-3)", borderRadius: 10, padding: 24, textAlign: "center", marginBottom: 14,
                          background: "var(--amber-soft)" }}>
              <Icons.Doc size={32} stroke="var(--amber)"/>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>Drop PDF here or click to browse</div>
              <div style={{ fontSize: 11.5, color: "var(--t-3)", marginTop: 4 }}>PDF · Max 50 MB</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div className="label-row"><span>Standard Code</span></div>
                <input className="input" style={{ width: "100%" }} placeholder="e.g. ASME IX" value={uploadCode} onChange={e => setUploadCode(e.target.value)}/>
              </div>
              <div>
                <div className="label-row"><span>Description (optional)</span></div>
                <input className="input" style={{ width: "100%" }} placeholder="e.g. ASME IX 2023 Edition" value={uploadName} onChange={e => setUploadName(e.target.value)}/>
              </div>
              <button className="btn primary sm" style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => {
                        if (uploadCode.trim()) {
                          setPdfs(p => [...p, { code: uploadCode, file: `${uploadCode.replace(/\s/g,"_")}.pdf`, size: "—", uploaded: new Date().toISOString().slice(0,10) }]);
                          setUploadCode(""); setUploadName("");
                        }
                      }}>
                <Icons.Upload size={14}/> Upload PDF
              </button>
            </div>
          </div>
        </div>

        <div className="panel glass">
          <div className="panel-header"><h3>Uploaded PDFs</h3><span className="sub">{pdfs.length} FILES</span></div>
          <div className="panel-body flush">
            {pdfs.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid var(--border-1)" }}>
                <Icons.Doc size={16} stroke="var(--amber-2)"/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{p.code}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: "var(--t-4)" }}>{p.file} · {p.size} · {p.uploaded}</div>
                </div>
                <button className="btn ghost sm icon" title="View"><Icons.Eye size={13}/></button>
                <button className="btn ghost sm icon" title="Download"><Icons.Download size={13}/></button>
              </div>
            ))}
            {pdfs.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: "var(--t-5)", fontSize: 12 }}>No PDFs uploaded yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Oxide discoloration scale */}
      <div className="panel glass">
        <div className="panel-header"><h3>Oxide discoloration scale · BPE 2024 / AWS D18.2</h3><span className="sub">REFERENCE STRIP</span></div>
        <div className="panel-body">
          <div style={{ height: 60, background: "linear-gradient(90deg, #d8d8c4, #b8c8d0, #d8b870, #a07020, #4a2c10, #1f1208)",
                        borderRadius: 6, border: "1px solid var(--border-2)", marginBottom: 12 }}/>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
            {[
              { lvl:"A", label:"Silver",           v:"0–2 ppm O₂",  ok:true },
              { lvl:"B", label:"Light straw",      v:"≤ 5 ppm",     ok:true },
              { lvl:"C", label:"Straw / blue",     v:"≤ 12 ppm",    ok:true },
              { lvl:"D", label:"Gold",             v:"≤ 32 ppm",    ok:"review" },
              { lvl:"E", label:"Dark blue / brown",v:"≤ 100 ppm",   ok:false },
              { lvl:"F", label:"Black",            v:"> 100 ppm",   ok:false },
            ].map(s => (
              <div key={s.lvl} style={{ padding: 10, background: "var(--bg-2)", borderRadius: 6, border: "1px solid var(--border-1)" }}>
                <div className="row" style={{ marginBottom: 4 }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--amber-2)", fontWeight: 700 }}>LVL {s.lvl}</span>
                  {s.ok === true     && <span className="chip ok" style={{ marginLeft:"auto",fontSize:9 }}>PASS</span>}
                  {s.ok === "review" && <span className="chip warn" style={{ marginLeft:"auto",fontSize:9 }}>REVIEW</span>}
                  {s.ok === false    && <span className="chip bad" style={{ marginLeft:"auto",fontSize:9 }}>REJECT</span>}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--t-4)", marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

window.StandardsScreen = StandardsScreen;
