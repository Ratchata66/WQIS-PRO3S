/* global React */
// Hand-rolled SVG charts: doughnut, bar, sparkline, area, ring

const Charts = {};

// Doughnut chart ----------------------------------------------------
Charts.Doughnut = function Doughnut({ data, size = 180, thickness = 22, gap = 2, center }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2 - thickness / 2 - 2;
  const C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={thickness} />
      {data.map((d, i) => {
        const len = (d.value / total) * C - gap;
        const seg = (
          <circle key={i}
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={d.color}
            strokeWidth={thickness}
            strokeDasharray={`${Math.max(len, 0.1)} ${C}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ filter: d.glow ? `drop-shadow(0 0 6px ${d.color})` : undefined }}
          />
        );
        offset += (d.value / total) * C;
        return seg;
      })}
      {center && (
        <foreignObject x="0" y="0" width={size} height={size}>
          <div style={{ width: size, height: size, display: "grid", placeItems: "center" }}>
            {center}
          </div>
        </foreignObject>
      )}
    </svg>
  );
};

// Vertical bar chart ------------------------------------------------
Charts.Bars = function Bars({ data, height = 160, width = 480, color = "var(--amber)" }) {
  const max = Math.max(...data.map(d => d.value)) || 1;
  const pad = 24;
  const bw = (width - pad*2) / data.length * 0.62;
  const gap = (width - pad*2) / data.length;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.18"/>
        </linearGradient>
      </defs>
      {/* y-axis grid */}
      {[0.25, 0.5, 0.75, 1].map((p, i) => (
        <g key={i}>
          <line x1={pad} x2={width-pad} y1={height - 22 - (height-44)*p} y2={height - 22 - (height-44)*p}
                stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4"/>
        </g>
      ))}
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 44);
        const x = pad + i*gap + (gap - bw)/2;
        const y = height - 22 - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={h} rx="2" fill="url(#barGrad)" />
            <rect x={x} y={y} width={bw} height={2} fill={color} opacity="0.9"/>
            <text x={x + bw/2} y={height - 6} fontSize="10.5" fill="var(--t-4)"
                  fontFamily="var(--font-mono)" textAnchor="middle"
                  style={{ letterSpacing: "0.06em" }}>
              {d.label}
            </text>
            <text x={x + bw/2} y={y - 6} fontSize="10.5" fill="var(--t-2)"
                  fontFamily="var(--font-mono)" textAnchor="middle">
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Area + line --------------------------------------------------------
Charts.Area = function Area({ data, width = 640, height = 200, valueKey = "value", labelKey = "label", color = "var(--amber)" }) {
  const max = Math.max(...data.map(d => d[valueKey])) || 1;
  const pad = { l: 32, r: 16, t: 16, b: 26 };
  const W = width - pad.l - pad.r;
  const H = height - pad.t - pad.b;
  const dx = W / (data.length - 1);
  const pts = data.map((d, i) => [pad.l + i*dx, pad.t + H - (d[valueKey]/max)*H]);
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const fill = `${path} L ${pts[pts.length-1][0]} ${pad.t + H} L ${pts[0][0]} ${pad.t + H} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1={pad.l} x2={pad.l+W}
              y1={pad.t + H*p} y2={pad.t + H*p}
              stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4"/>
      ))}
      <path d={fill} fill="url(#areaFill)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" style={{ filter: `drop-shadow(0 0 6px ${color})` }}/>
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill={color}/>
      ))}
      {data.map((d, i) => (
        <text key={i} x={pad.l + i*dx} y={height - 8} fontSize="10.5"
              fill="var(--t-4)" fontFamily="var(--font-mono)" textAnchor="middle">
          {d[labelKey]}
        </text>
      ))}
      {/* y labels */}
      {[0, 0.5, 1].map((p, i) => (
        <text key={i} x={pad.l - 6} y={pad.t + H - H*p + 3}
              fontSize="10" fill="var(--t-5)" textAnchor="end" fontFamily="var(--font-mono)">
          {Math.round(max * p)}
        </text>
      ))}
    </svg>
  );
};

// Sparkline ---------------------------------------------------------
Charts.Spark = function Spark({ data, width = 90, height = 30, color = "var(--amber)", fill = true }) {
  const max = Math.max(...data) || 1;
  const min = Math.min(...data);
  const range = (max - min) || 1;
  const dx = width / (data.length - 1);
  const pts = data.map((v, i) => [i*dx, height - ((v-min)/range)*(height-4) - 2]);
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const fillPath = `${path} L ${pts[pts.length-1][0]} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill && (
        <>
          <defs>
            <linearGradient id={`sg${color.replace(/[^a-z]/gi,'')}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={fillPath} fill={`url(#sg${color.replace(/[^a-z]/gi,'')})`}/>
        </>
      )}
      <path d={path} fill="none" stroke={color} strokeWidth="1.4"/>
    </svg>
  );
};

// Progress ring ----------------------------------------------------
Charts.Ring = function Ring({ value, max = 100, size = 120, thickness = 8, color = "var(--amber)", trackColor = "rgba(255,255,255,0.08)", children }) {
  const r = size/2 - thickness/2 - 1;
  const C = 2 * Math.PI * r;
  const v = Math.min(Math.max(value/max, 0), 1);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={thickness}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={thickness}
                strokeDasharray={`${C * v} ${C}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size/2} ${size/2})`}
                style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dasharray 0.6s ease" }}/>
      </svg>
      {children && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
          {children}
        </div>
      )}
    </div>
  );
};

// Horizontal stacked timeline (steps) ------------------------------
Charts.WorkflowSteps = function WorkflowSteps({ steps, current }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 0 }}>
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        const color = state === "done" ? "var(--ok)" : state === "active" ? "var(--amber)" : "var(--t-5)";
        return (
          <div key={s.label} style={{ position: "relative", padding: "8px 0 0 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: state === "done" ? "var(--ok-soft)" : state === "active" ? "var(--amber-soft)" : "var(--bg-3)",
                border: `1px solid ${state === "done" ? "var(--ok-line)" : state === "active" ? "var(--amber-line)" : "var(--border-2)"}`,
                display: "grid", placeItems: "center",
                color, fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600,
                boxShadow: state === "active" ? `0 0 12px ${color}` : "none",
                flexShrink: 0,
              }}>
                {state === "done" ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 2,
                  background: i < current ? "var(--ok)" : "var(--bg-3)",
                  borderRadius: 2,
                }}/>
              )}
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: state === "todo" ? "var(--t-4)" : "var(--t-1)" }}>
                {s.label}
              </div>
              {s.sub && (
                <div style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "var(--t-4)", marginTop: 3 }}>
                  {s.sub}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

window.Charts = Charts;
