/* global React, Icons, Charts, WQIS_DATA */

const AnalyticsScreen = () => {
  return (
    <div className="page">
      <div className="bg-grid"/>
      <div className="page-head">
        <div>
          <span className="kicker">DATA · INSIGHTS</span>
          <h1 style={{ marginTop: 8 }}>Analytics</h1>
          <div className="sub">วิเคราะห์ข้อมูลเชิงลึก · Deep-dive performance and defect analytics</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn ghost sm"><Icons.Calendar size={14}/> Last 90 days</button>
          <button className="btn ghost sm"><Icons.Download size={14}/> Export</button>
        </div>
      </div>

      {/* Metric strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
        {[
          { l: "Inspections (MTD)", v: "2,842", c: "var(--amber)", icon: "Inspect" },
          { l: "Pass rate trend",   v: "97.1%", c: "var(--ok)",    icon: "Tick" },
          { l: "Defect rate",       v: "3.2%",  c: "var(--bad)",   icon: "Cross" },
          { l: "Repair hours (7D)", v: "262 h", c: "var(--warn)",  icon: "Refresh" },
        ].map(k => {
          const Ico = Icons[k.icon];
          return (
            <div key={k.l} className="panel glass" style={{ padding: "14px 16px" }}>
              <div className="row" style={{ marginBottom: 10 }}>
                <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.1em", color: "var(--t-4)", textTransform: "uppercase" }}>{k.l}</div>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: `${k.c}1a`, border: `1px solid ${k.c}33`,
                              display: "grid", placeItems: "center", color: k.c }}>
                  <Ico size={14}/>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: k.c }}>{k.v}</div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 14 }}>
        <div className="panel glass">
          <div className="panel-header"><h3>Pass rate · 90 days</h3><span className="sub">ALL PROJECTS</span></div>
          <div className="panel-body" style={{ paddingTop: 8 }}>
            <Charts.Area data={[91,92,93,94,94.5,95,95.2,95.8,96.4,96.8,97.1,96.9].map((v,i)=>({label:`W${i+1}`,value:v}))}
                         width={700} height={200} color="var(--ok)"/>
          </div>
        </div>
        <div className="panel glass">
          <div className="panel-header"><h3>Defect classification</h3><span className="sub">7D</span></div>
          <div className="panel-body" style={{ paddingTop: 8 }}>
            <Charts.Bars data={WQIS_DATA.defectMix.map(d => ({ label: d.label.split(" ")[0], value: d.value }))}
                         width={400} height={200} color="var(--amber)"/>
          </div>
        </div>
      </div>

      {/* Defect heatmap + Welder ranking */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        {/* Defect heatmap */}
        <div className="panel glass">
          <div className="panel-header"><h3>Defect heatmap</h3><span className="sub">SPOOL × HOUR · 14H</span></div>
          <div className="panel-body" style={{ paddingTop: 8 }}>
            {(() => {
              const { rows, data } = WQIS_DATA.heat;
              const max = 5;
              const colorAt = v => {
                if (v === 0) return "rgba(255,255,255,0.04)";
                const t = v / max;
                return `rgba(255, ${Math.round(180 - t*80)}, ${Math.round(60 - t*40)}, ${0.25 + t*0.55})`;
              };
              return (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8 }}>
                    <div/>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${data[0].length}, 1fr)`, gap: 3,
                                  fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--t-5)", textAlign: "center" }}>
                      {Array.from({length:14},(_,i)=><div key={i}>{(i*2).toString().padStart(2,"0")}</div>)}
                    </div>
                    {data.map((row,ri) => (
                      <React.Fragment key={ri}>
                        <div className="mono" style={{ fontSize: 10.5, color: "var(--t-3)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>{rows[ri]}</div>
                        <div style={{ display: "grid", gridTemplateColumns: `repeat(${row.length}, 1fr)`, gap: 3, height: 28 }}>
                          {row.map((v,ci) => <div key={ci} className="heat-cell" style={{ background: colorAt(v) }} title={`${rows[ri]} · ${v} defects`}/>)}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Welder ranking */}
        <div className="panel glass">
          <div className="panel-header"><h3>Welder ranking</h3><span className="sub">AI SCORE · 30D</span></div>
          <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {WQIS_DATA.welders.slice(0,8).map((w, i) => {
              const medals = ["🥇","🥈","🥉"];
              return (
                <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 22, textAlign: "center", fontSize: i < 3 ? 14 : 11, fontFamily: "var(--font-mono)", color: "var(--t-3)" }}>
                    {i < 3 ? medals[i] : `#${w.rank}`}
                  </div>
                  <div className="avatar sm">{w.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.name}</div>
                    <div className="mono" style={{ fontSize: 9.5, color: "var(--t-5)" }}>{w.code}</div>
                  </div>
                  <span className="mono nums" style={{ fontSize: 12, color: w.pass >= 97 ? "var(--ok)" : "var(--amber)" }}>{w.pass}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

window.AnalyticsScreen = AnalyticsScreen;
