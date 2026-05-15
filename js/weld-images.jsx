/* global React */
// Stylized SVG weld imagery — realistic-feeling but procedural.
// Used as the AI Inspection viewer canvas.

const WeldImage = ({ variant = "tig-pass", showBoxes = false, showHeatmap = false, showScan = false, w = 760, h = 480 }) => {
  // Variants change tone of weld + position of defects
  const isStainless = variant.startsWith("tig");
  const isPass = variant.endsWith("pass");

  // weld bead rings (TIG signature ripples)
  const rings = [];
  for (let i = 0; i < 22; i++) {
    rings.push(
      <ellipse key={i}
        cx={w/2}
        cy={h*0.52}
        rx={w*0.36}
        ry={14}
        fill="none"
        stroke={isStainless ? "rgba(220,228,242,0.18)" : "rgba(255,200,140,0.14)"}
        strokeWidth="0.9"
        transform={`translate(${(i - 11) * 28}, 0)`}
      />
    );
  }

  // Generate a few defect boxes depending on variant
  const defectsByVariant = {
    "tig-pass":   [],
    "tig-review": [{ x: 0.28, y: 0.46, w: 0.06, h: 0.08, label: "POROSITY", sev: "minor", conf: 78 },
                   { x: 0.62, y: 0.50, w: 0.04, h: 0.06, label: "POROSITY", sev: "minor", conf: 71 }],
    "tig-fail":   [{ x: 0.20, y: 0.40, w: 0.09, h: 0.12, label: "UNDERCUT",     sev: "major",    conf: 94 },
                   { x: 0.52, y: 0.44, w: 0.14, h: 0.06, label: "INCOMPLETE FUSION", sev: "major", conf: 87 }],
    "smaw-fail":  [{ x: 0.40, y: 0.42, w: 0.18, h: 0.10, label: "CRACK",        sev: "critical", conf: 96 }],
  };
  const defects = defectsByVariant[variant] || [];

  // base palette
  const baseFill = isStainless
    ? "url(#weldBase-stainless)"
    : "url(#weldBase-carbon)";
  const beadFill = isStainless
    ? "url(#weldBead-stainless)"
    : "url(#weldBead-carbon)";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice"
           style={{ display: "block", borderRadius: "inherit" }}>
        <defs>
          <linearGradient id="weldBase-stainless" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#363b46"/>
            <stop offset="50%" stopColor="#2a2f38"/>
            <stop offset="100%" stopColor="#1d2128"/>
          </linearGradient>
          <linearGradient id="weldBead-stainless" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"  stopColor="#c8d4e8"/>
            <stop offset="20%" stopColor="#a5b3cb"/>
            <stop offset="50%" stopColor="#8a98b0"/>
            <stop offset="80%" stopColor="#6e7c94"/>
            <stop offset="100%" stopColor="#4a5468"/>
          </linearGradient>
          <linearGradient id="weldBase-carbon" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b332a"/>
            <stop offset="100%" stopColor="#1f1812"/>
          </linearGradient>
          <linearGradient id="weldBead-carbon" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"  stopColor="#b88860"/>
            <stop offset="50%" stopColor="#8a5a3a"/>
            <stop offset="100%" stopColor="#3a2618"/>
          </linearGradient>
          <radialGradient id="heatRed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff3050" stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#ff7c00" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#ff7c00" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="heatYellow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffdd44" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#ffdd44" stopOpacity="0"/>
          </radialGradient>
          <pattern id="microTexture" patternUnits="userSpaceOnUse" width="3" height="3">
            <rect width="3" height="3" fill="transparent"/>
            <circle cx="1" cy="1" r="0.4" fill="rgba(255,255,255,0.04)"/>
          </pattern>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/>
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0"/>
            <feComposite in2="SourceGraphic" operator="in"/>
          </filter>
        </defs>

        {/* base metal */}
        <rect x="0" y="0" width={w} height={h} fill={baseFill}/>
        <rect x="0" y="0" width={w} height={h} fill="url(#microTexture)"/>

        {/* HAZ (heat affected zone) bands */}
        <rect x="0" y={h*0.34} width={w} height={h*0.04} fill="rgba(255,180,100,0.05)"/>
        <rect x="0" y={h*0.62} width={w} height={h*0.04} fill="rgba(255,180,100,0.05)"/>

        {/* tube edge highlights */}
        <line x1="0" y1={h*0.38} x2={w} y2={h*0.38} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        <line x1="0" y1={h*0.66} x2={w} y2={h*0.66} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>

        {/* weld bead — solid ellipse + rings on top */}
        <ellipse cx={w/2} cy={h*0.52} rx={w*0.5} ry={h*0.13} fill={beadFill} />
        <ellipse cx={w/2} cy={h*0.52} rx={w*0.5} ry={h*0.13} fill="url(#microTexture)" opacity="0.5"/>

        <g clipPath="url(#beadClip)">
          <clipPath id="beadClip">
            <ellipse cx={w/2} cy={h*0.52} rx={w*0.5} ry={h*0.13}/>
          </clipPath>
          {rings}
        </g>

        {/* slight specular highlight on top of bead */}
        <ellipse cx={w/2} cy={h*0.47} rx={w*0.46} ry={h*0.025} fill="rgba(255,255,255,0.10)" filter="blur(2px)"/>

        {/* oxide discoloration tint near bead edge for stainless */}
        {isStainless && (
          <>
            <rect x="0" y={h*0.38} width={w} height={h*0.05}
                  fill="url(#heatYellow)" opacity="0.35"/>
            <rect x="0" y={h*0.62} width={w} height={h*0.05}
                  fill="url(#heatYellow)" opacity="0.35"/>
          </>
        )}

        {/* subtle defects baked in (so even without overlays the image reads as imperfect) */}
        {defects.map((d, i) => (
          <g key={i} opacity="0.7">
            {d.label === "CRACK" ? (
              <path d={`M ${d.x*w + d.w*w*0.1} ${d.y*h + d.h*h*0.5}
                       q ${d.w*w*0.2} ${-d.h*h*0.2} ${d.w*w*0.4} 0
                       t ${d.w*w*0.4} 0
                       t ${d.w*w*0.2} ${d.h*h*0.15}`}
                    fill="none" stroke="rgba(20,8,8,0.85)" strokeWidth="2.4" strokeLinecap="round"/>
            ) : d.label === "POROSITY" ? (
              <>
                <circle cx={d.x*w + d.w*w*0.5} cy={d.y*h + d.h*h*0.5} r="3" fill="rgba(10,5,2,0.85)"/>
                <circle cx={d.x*w + d.w*w*0.7} cy={d.y*h + d.h*h*0.65} r="2" fill="rgba(10,5,2,0.7)"/>
                <circle cx={d.x*w + d.w*w*0.3} cy={d.y*h + d.h*h*0.4} r="1.6" fill="rgba(10,5,2,0.75)"/>
              </>
            ) : (
              <rect x={d.x*w} y={d.y*h} width={d.w*w} height={d.h*h}
                    fill="rgba(0,0,0,0.18)" rx="2"/>
            )}
          </g>
        ))}

        {/* film grain top layer */}
        <rect width={w} height={h} filter="url(#grain)" opacity="0.4"/>

        {/* heatmap overlay */}
        {showHeatmap && defects.map((d, i) => (
          <g key={"hm"+i}>
            <ellipse cx={d.x*w + d.w*w*0.5} cy={d.y*h + d.h*h*0.5}
                     rx={d.w*w*1.2} ry={d.h*h*1.6}
                     fill={d.sev === "critical" || d.sev === "major" ? "url(#heatRed)" : "url(#heatYellow)"}
                     style={{ mixBlendMode: "screen" }}/>
          </g>
        ))}
        {/* if pass and heatmap on, show green soft glow on bead */}
        {showHeatmap && defects.length === 0 && (
          <ellipse cx={w/2} cy={h*0.52} rx={w*0.4} ry={h*0.08}
                   fill="rgba(45,212,164,0.18)" style={{ mixBlendMode: "screen" }}/>
        )}

        {/* bounding boxes */}
        {showBoxes && defects.map((d, i) => {
          const col = d.sev === "critical" ? "#ff5570" : d.sev === "major" ? "#ffb547" : "#4fa8ff";
          return (
            <g key={"bb"+i}>
              <rect x={d.x*w} y={d.y*h} width={d.w*w} height={d.h*h}
                    fill="none" stroke={col} strokeWidth="1.6" strokeDasharray="4 3"
                    style={{ filter: `drop-shadow(0 0 4px ${col})` }}/>
              {/* corner ticks */}
              {[[0,0],[1,0],[0,1],[1,1]].map((c, k) => (
                <g key={k}>
                  <line
                    x1={d.x*w + c[0]*d.w*w + (c[0] ? -6 : 0)}
                    x2={d.x*w + c[0]*d.w*w + (c[0] ? 0 : 6)}
                    y1={d.y*h + c[1]*d.h*h}
                    y2={d.y*h + c[1]*d.h*h}
                    stroke={col} strokeWidth="2"/>
                  <line
                    x1={d.x*w + c[0]*d.w*w}
                    x2={d.x*w + c[0]*d.w*w}
                    y1={d.y*h + c[1]*d.h*h + (c[1] ? -6 : 0)}
                    y2={d.y*h + c[1]*d.h*h + (c[1] ? 0 : 6)}
                    stroke={col} strokeWidth="2"/>
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      {/* defect labels (HTML on top so they're crisp) */}
      {showBoxes && defects.map((d, i) => (
        <div key={"lb"+i} className="defect-label"
             style={{
               left: `${(d.x + d.w) * 100}%`,
               top: `calc(${d.y * 100}% - 22px)`,
               transform: "translateX(-2px)",
             }}>
          {d.label} · {d.conf}%
        </div>
      ))}

      {showScan && (
        <div className="scan-overlay">
          <div className="grid"/>
          <div className="line"/>
        </div>
      )}
    </div>
  );
};

window.WeldImage = WeldImage;
