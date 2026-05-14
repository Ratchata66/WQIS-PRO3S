/* global React, Icons, Charts, WeldImage, WQIS_DATA */
// App shell: Splash, Login, Sidebar, Topbar

// ============== Splash / Opening Animation ==========================
const Splash = ({ onDone }) => {
  const lines = [
    { t: 320,  txt: "BOOTING PRO3S WQIS CORE" },
    { t: 900,  txt: "INITIALIZING AI INSPECTION ENGINE" },
    { t: 1600, txt: "LOADING WELD DATABASE · 18,742 RECORDS" },
    { t: 2300, txt: "SYNCING WPS / PQR · 6 ACTIVE" },
    { t: 2900, txt: "MODEL cloud-v2 · ACC 99.24%" },
    { t: 3500, txt: "SYSTEM READY" },
  ];
  const [shown, setShown] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const ts = lines.map((l, i) => setTimeout(() => setShown(i+1), l.t));
    const pi = setInterval(() => setProgress(p => Math.min(p + 1.8, 100)), 60);
    const done = setTimeout(() => onDone && onDone(), 4200);
    return () => { ts.forEach(clearTimeout); clearInterval(pi); clearTimeout(done); };
  }, []);

  return (
    <div className="splash">
      <div className="bg-grid" style={{ opacity: 0.5 }}/>
      <div className="scan-line"/>
      {/* corner brackets */}
      <div className="bracket tl" style={{ position: "absolute", top: 24, left: 24, width: 32, height: 32 }}/>
      <div className="bracket tr" style={{ position: "absolute", top: 24, right: 24, width: 32, height: 32 }}/>
      <div className="bracket bl" style={{ position: "absolute", bottom: 24, left: 24, width: 32, height: 32 }}/>
      <div className="bracket br" style={{ position: "absolute", bottom: 24, right: 24, width: 32, height: 32 }}/>

      <div style={{ position: "absolute", top: 28, left: 28, display: "flex", alignItems: "center", gap: 10 }}>
        <span className="kicker" style={{ color: "var(--amber-2)" }}>PRO3S · INDUSTRIAL QA/QC PLATFORM</span>
      </div>
      <div style={{ position: "absolute", top: 28, right: 28, display: "flex", alignItems: "center", gap: 10 }}>
        <span className="kicker" style={{ color: "var(--t-4)" }}>BUILD 1.0.0 · CLOUD-V2 · TH-1</span>
      </div>

      <div style={{ textAlign: "center", maxWidth: 640 }}>
        <BrandHero animate />
        <div style={{ marginTop: 36, height: 1, background: "var(--border-2)", width: 280, marginLeft: "auto", marginRight: "auto" }}/>

        <div style={{ marginTop: 22, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em", color: "var(--t-3)", textAlign: "left", margin: "22px auto 0", display: "inline-block" }}>
          {lines.slice(0, shown).map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 6, animation: "fadeIn 0.3s" }}>
              <span style={{ color: i === shown - 1 ? "var(--amber)" : "var(--ok)" }}>
                {i === shown - 1 ? "▸" : "✓"}
              </span>
              <span style={{ color: i === shown - 1 ? "var(--t-1)" : "var(--t-3)" }}>{l.txt}</span>
              {i === shown - 1 && <span style={{ color: "var(--amber)", animation: "blink 0.8s infinite" }}>_</span>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 26, width: 360, marginLeft: "auto", marginRight: "auto" }}>
          <div className="bar tall"><i style={{ width: `${progress}%` }}/></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--t-4)", letterSpacing: "0.1em" }}>
            <span>SYSTEM CHECK</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
};

// ============== Brand mark (logo + wordmark) ========================
const BrandHero = ({ animate }) => (
  <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    <div style={{ position: "relative", width: 92, height: 92 }}>
      <svg width="92" height="92" viewBox="0 0 92 92" style={{ filter: "drop-shadow(0 0 22px var(--amber-glow))" }}>
        <defs>
          <linearGradient id="brandGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffc176"/>
            <stop offset="50%" stopColor="#ff8c1a"/>
            <stop offset="100%" stopColor="#c75300"/>
          </linearGradient>
        </defs>
        {/* outer hex ring */}
        <polygon points="46,4 84,26 84,66 46,88 8,66 8,26"
                 fill="none" stroke="url(#brandGrad)" strokeWidth="1.4" opacity="0.8"/>
        <polygon points="46,12 78,30 78,62 46,80 14,62 14,30"
                 fill="rgba(255,140,26,0.08)" stroke="url(#brandGrad)" strokeWidth="1.2"/>
        {/* inner mark — stylized P3S monogram with weld dots */}
        <g fill="url(#brandGrad)">
          <rect x="32" y="30" width="4" height="32" rx="1"/>
          <path d="M36 30 h12 a8 8 0 0 1 0 16 h-12" fill="none" stroke="url(#brandGrad)" strokeWidth="4"/>
          <circle cx="46" cy="53" r="2.5"/>
          <circle cx="54" cy="53" r="2.5"/>
          <circle cx="62" cy="53" r="2.5"/>
        </g>
        {/* targeting ticks */}
        <line x1="46" y1="0" x2="46" y2="6" stroke="var(--amber)" strokeWidth="1.2"/>
        <line x1="46" y1="86" x2="46" y2="92" stroke="var(--amber)" strokeWidth="1.2"/>
        <line x1="0" y1="46" x2="6" y2="46" stroke="var(--amber)" strokeWidth="1.2"/>
        <line x1="86" y1="46" x2="92" y2="46" stroke="var(--amber)" strokeWidth="1.2"/>
        {animate && (
          <circle cx="46" cy="46" r="40" fill="none" stroke="var(--amber)" strokeWidth="1"
                  strokeDasharray="6 8" opacity="0.5"
                  style={{ transformOrigin: "46px 46px", animation: "spin-slow 10s linear infinite" }}/>
        )}
      </svg>
    </div>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, letterSpacing: "0.04em", color: "var(--t-1)" }}>
        WQIS<span style={{ color: "var(--amber)" }}>·</span>PRO<span style={{ color: "var(--amber)" }}>3</span>S
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.28em", color: "var(--t-3)", marginTop: 6, textTransform: "uppercase" }}>
        Weld Quality Inspection System
      </div>
    </div>
  </div>
);

// ============== Login screen ========================================
const Login = ({ onLogin }) => {
  const [user, setUser] = React.useState("manop.k@pro3s.co.th");
  const [pwd, setPwd] = React.useState("••••••••••");
  const [scan, setScan] = React.useState(true);

  return (
    <div className="login">
      <div className="left">
        <div className="bg-grid"/>
        {/* corner brackets */}
        <div className="bracket tl" style={{ top: 18, left: 18, width: 28, height: 28 }}/>
        <div className="bracket tr" style={{ top: 18, right: 18, width: 28, height: 28 }}/>
        <div className="bracket bl" style={{ bottom: 18, left: 18, width: 28, height: 28 }}/>
        <div className="bracket br" style={{ bottom: 18, right: 18, width: 28, height: 28 }}/>

        <div style={{ position: "absolute", top: 28, left: 28, display: "flex", alignItems: "center", gap: 12 }}>
          <span className="kicker" style={{ color: "var(--amber-2)" }}>AI INSPECTION ENGINE</span>
        </div>
        <div style={{ position: "absolute", top: 28, right: 28, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="live-dot"/>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--t-3)", textTransform: "uppercase" }}>
            LIVE · {new Date().toISOString().slice(11,19)} UTC
          </span>
        </div>

        {/* hero weld viewer with scan */}
        <div style={{ position: "absolute", inset: "16% 12% 22%", borderRadius: "var(--r-lg)", overflow: "hidden",
                      border: "1px solid var(--border-2)", boxShadow: "var(--shadow-2), 0 0 60px -20px var(--amber-glow)" }}>
          <WeldImage variant="tig-review" showBoxes showHeatmap={false} showScan={scan} />
          {/* HUD readout */}
          <div style={{ position: "absolute", left: 12, bottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <span className="chip ok solid"><span className="dot"/>AI ONLINE</span>
            <span className="chip amber"><span className="dot"/>SCANNING</span>
            <span className="chip info">cloud-v2</span>
          </div>
          <div style={{ position: "absolute", right: 12, top: 12, display: "flex", gap: 6 }}>
            {["BOX","HEAT","SCAN"].map((s, i) => (
              <span key={s} className="chip" style={{ background: "rgba(8,12,18,0.7)" }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", left: 28, bottom: 28, maxWidth: 480 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            AI‑driven weld inspection<br/>
            for <span style={{ color: "var(--amber)" }}>Industry 4.0</span> fabrication.
          </h2>
          <div style={{ marginTop: 14, fontSize: 13.5, color: "var(--t-3)", lineHeight: 1.55 }}>
            ตรวจสอบคุณภาพงานเชื่อมอัตโนมัติด้วย AI — Porosity · Undercut · Crack · Incomplete Fusion · Burn Through · Oxide Discoloration · พร้อม Traceability เต็มรูปแบบตามมาตรฐาน ASME IX · ISO 5817 · BPE 2024.
          </div>
          <div style={{ marginTop: 18, display: "flex", gap: 18, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--t-4)", textTransform: "uppercase" }}>
            <span>F&B</span><span>·</span>
            <span>Pharma</span><span>·</span>
            <span>Oil & Gas</span><span>·</span>
            <span>Hygienic Piping</span><span>·</span>
            <span>Process Plant</span>
          </div>
        </div>
      </div>

      <div className="right">
        <div className="bg-grid"/>
        <form className="login-card" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div className="bracket tl"/>
          <div className="bracket tr"/>
          <div className="bracket bl"/>
          <div className="bracket br"/>

          <BrandHero/>
          <div style={{ height: 24 }}/>

          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Sign in to your workspace</h3>
            <div style={{ marginTop: 6, fontSize: 12.5, color: "var(--t-3)" }}>
              ลงชื่อเข้าใช้บัญชี PRO3S WQIS ของคุณ
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div className="label-row"><span>Username / Email</span><span style={{ color: "var(--t-5)" }}>SSO</span></div>
              <div style={{ position: "relative" }}>
                <input className="input" style={{ paddingLeft: 38 }} value={user} onChange={e => setUser(e.target.value)}/>
                <div style={{ position: "absolute", left: 12, top: 9, color: "var(--t-4)" }}>
                  <Icons.Mail size={16}/>
                </div>
              </div>
            </div>
            <div>
              <div className="label-row"><span>Password</span><a style={{ color: "var(--t-3)", textDecoration: "none", fontSize: 11 }}>FORGOT?</a></div>
              <div style={{ position: "relative" }}>
                <input className="input" type="password" style={{ paddingLeft: 38 }} value={pwd} onChange={e => setPwd(e.target.value)}/>
                <div style={{ position: "absolute", left: 12, top: 9, color: "var(--t-4)" }}>
                  <Icons.Lock size={16}/>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "var(--t-3)", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "var(--amber)" }}/> Keep me signed in
              </label>
              <span className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--t-4)" }}>2FA · ACTIVE</span>
            </div>

            <button type="submit" className="btn primary lg" style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>
              <Icons.Shield size={16}/> Sign In Securely
              <Icons.ChevR size={14} style={{ marginLeft: "auto" }}/>
            </button>

            <div style={{ position: "relative", textAlign: "center", margin: "8px 0" }}>
              <div className="divider" style={{ margin: 0 }}/>
              <span className="mono" style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: "var(--bg-glass-strong)", padding: "0 10px", fontSize: 10, letterSpacing: "0.14em", color: "var(--t-4)" }}>
                OR
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button type="button" className="btn ghost sm" style={{ justifyContent: "center" }}>
                <Icons.Shield size={14}/> SSO · Azure AD
              </button>
              <button type="button" className="btn ghost sm" style={{ justifyContent: "center" }}>
                <Icons.User size={14}/> Guest Inspector
              </button>
            </div>
          </div>

          <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--border-1)",
                        display: "flex", justifyContent: "space-between", fontSize: 10.5,
                        fontFamily: "var(--font-mono)", color: "var(--t-4)", letterSpacing: "0.1em" }}>
            <span>v1.0.0 · PRO3S</span>
            <span>ISO 27001 · CERTIFIED</span>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============== Sidebar ==============================================
const NAV = [
  { section: "Main", items: [
    { id: "dashboard", label: "Dashboard",    icon: "Dashboard" },
    { id: "inspect",   label: "AI Inspect",   icon: "Inspect", badge: 3 },
  ]},
  { section: "Operations", items: [
    { id: "projects",  label: "Projects",     icon: "Project",  count: 23 },
    { id: "welders",   label: "Welders",      icon: "Welder",   count: 142 },
    { id: "wps",       label: "WPS / PQR",    icon: "Doc",      count: 6 },
    { id: "workflow",  label: "Approvals",    icon: "Workflow", count: 5, hot: true },
  ]},
  { section: "Insights", items: [
    { id: "reports",   label: "Reports",      icon: "Report" },
    { id: "standards", label: "Standards",    icon: "Standard" },
  ]},
  { section: "System", items: [
    { id: "settings",  label: "Admin · Settings", icon: "Settings" },
  ]},
];

const Sidebar = ({ active, onNav, collapsed, onToggle }) => {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2"/>
            <path d="M9 8h3a3 3 0 0 1 0 6h-3v4" stroke="#1a0d00" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="brand-name">
          WQIS·PRO3S
          <span className="sub">v1.0.0</span>
        </div>
      </div>

      <div className="scroll-y" style={{ flex: 1 }}>
        {NAV.map(sec => (
          <div className="nav-section" key={sec.section}>
            <div className="nav-section-label">{sec.section}</div>
            {sec.items.map(it => {
              const Ico = Icons[it.icon];
              const isActive = active === it.id;
              return (
                <div key={it.id}
                     className={`nav-item ${isActive ? "active" : ""}`}
                     onClick={() => onNav(it.id)}
                     title={collapsed ? it.label : ""}>
                  <span className="ico"><Ico size={17}/></span>
                  <span>{it.label}</span>
                  {it.count != null && <span className="count">{it.count}</span>}
                  {it.badge != null && <span className="count" style={{ background: "var(--amber)", color: "#1a0d00" }}>{it.badge}</span>}
                  {it.hot && !it.count && <span className="live-dot" style={{ marginLeft: "auto" }}/>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="sidebar-foot">
        {/* AI status pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6,
                      background: "var(--ok-soft)", border: "1px solid var(--ok-line)", marginBottom: 8 }}>
          <span className="live-dot"/>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--ok)", flex: 1, textTransform: "uppercase" }}>
            AI cloud-v2 · Online
          </span>
          <span className="mono" style={{ fontSize: 9.5, color: "var(--t-4)" }}>99.24%</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 8,
                      border: "1px solid var(--border-1)", background: "var(--bg-2)" }}>
          <div className="avatar" style={{ background: "linear-gradient(135deg, var(--ok), #1c8763)" }}>MK</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--t-1)" }}>Manop Kosolwong</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--t-4)" }}>QA MANAGER · TH</div>
          </div>
          <Icons.Logout size={14} style={{ color: "var(--t-4)", cursor: "pointer" }}/>
        </div>
        <button className="btn ghost sm" style={{ width: "100%", marginTop: 8, justifyContent: "center" }} onClick={onToggle}>
          <Icons.ChevL size={14}/> Collapse
        </button>
      </div>
    </aside>
  );
};

// ============== Topbar =============================================
const useClock = () => {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

const Topbar = ({ active, theme, onToggleTheme, onNotifications }) => {
  const now = useClock();
  const titles = {
    dashboard: ["Main", "Dashboard"],
    inspect:   ["AI", "Inspection"],
    projects:  ["Operations", "Projects"],
    welders:   ["Operations", "Welder Management"],
    wps:       ["Operations", "WPS / PQR"],
    workflow:  ["Operations", "Approval Workflow"],
    reports:   ["Insights", "Reports & Analytics"],
    standards: ["Insights", "Standards Library"],
    settings:  ["System", "Admin · Settings"],
  };
  const [a, b] = titles[active] || ["Main", "Dashboard"];

  const timeStr = now.toISOString().slice(11,19);
  const dateStr = now.toISOString().slice(0,10);

  return (
    <header className="topbar">
      <div className="crumb">
        <span>{a}</span>
        <Icons.ChevR size={12}/>
        <b>{b}</b>
      </div>

      <div className="search" style={{ marginLeft: 16 }}>
        <Icons.Search size={14}/>
        <span>Search joints, welders, WPS, projects…</span>
        <kbd>⌘K</kbd>
      </div>

      <div className="right">
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", height: 30,
                      background: "var(--ok-soft)", border: "1px solid var(--ok-line)", borderRadius: 99 }}>
          <span className="live-dot"/>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "#5af0c4", textTransform: "uppercase" }}>
            AI · Online · cloud-v2
          </span>
        </div>

        <div className="clock">
          <span className="t">{timeStr}</span>
          <span className="d">{dateStr} · UTC+7</span>
        </div>

        <div className="bell" onClick={onNotifications} title="Notifications">
          <Icons.Bell size={17}/>
          <span className="pip"/>
        </div>
        <div className="bell" title={theme === "light" ? "Switch to dark" : "Switch to light"} onClick={onToggleTheme}>
          {theme === "light" ? <Icons.Moon size={17}/> : <Icons.Sun size={17}/>}
        </div>

        <div className="user-card">
          <div className="avatar" style={{ background: "linear-gradient(135deg, var(--ok), #1c8763)" }}>MK</div>
          <div className="who">
            <span className="n">Manop K.</span>
            <span className="r">QA Manager</span>
          </div>
          <Icons.ChevD size={12} style={{ color: "var(--t-4)" }}/>
        </div>
      </div>
    </header>
  );
};

// ============== Notifications drawer ================================
const NotificationsDrawer = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }} onClick={onClose}>
      <aside className="panel glass" onClick={e => e.stopPropagation()}
             style={{ position: "absolute", top: 64, right: 20, width: 380, maxHeight: "calc(100vh - 88px)",
                      display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="panel-header">
          <h3><span className="live-dot"/>Notifications</h3>
          <span className="sub">{WQIS_DATA.notifications.length} new</span>
        </div>
        <div className="scroll-y">
          {WQIS_DATA.notifications.map((n, i) => (
            <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-1)", display: "flex", gap: 12 }}>
              <div style={{ marginTop: 2 }}>
                {n.kind === "bad"  && <Icons.Cross  size={18} stroke="var(--bad)"/>}
                {n.kind === "warn" && <Icons.Warn   size={18} stroke="var(--warn)"/>}
                {n.kind === "ok"   && <Icons.Tick   size={18} stroke="var(--ok)"/>}
                {n.kind === "info" && <Icons.Info   size={18} stroke="var(--info)"/>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--t-1)" }}>{n.title}</span>
                  <span className="mono" style={{ fontSize: 10, color: "var(--t-4)" }}>{n.t}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--t-3)", marginTop: 4 }}>{n.body}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: "1px solid var(--border-1)", display: "flex", gap: 8 }}>
          <button className="btn sm ghost" style={{ flex: 1, justifyContent: "center" }}>Mark all read</button>
          <button className="btn sm primary" style={{ flex: 1, justifyContent: "center" }}>Open inbox</button>
        </div>
      </aside>
    </div>
  );
};

Object.assign(window, { Splash, Login, Sidebar, Topbar, NotificationsDrawer, BrandHero, NAV });
