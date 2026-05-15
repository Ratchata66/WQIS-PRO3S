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
const BrandHero = ({ animate, size = 92 }) => (
  <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 92 92" style={{ filter: "drop-shadow(0 0 22px var(--amber-glow))" }}>
        <defs>
          <linearGradient id="brandGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffc176"/>
            <stop offset="50%" stopColor="#ff8c1a"/>
            <stop offset="100%" stopColor="#c75300"/>
          </linearGradient>
        </defs>
        <polygon points="46,4 84,26 84,66 46,88 8,66 8,26"
                 fill="none" stroke="url(#brandGrad)" strokeWidth="1.4" opacity="0.8"/>
        <polygon points="46,12 78,30 78,62 46,80 14,62 14,30"
                 fill="rgba(255,140,26,0.08)" stroke="url(#brandGrad)" strokeWidth="1.2"/>
        <g fill="url(#brandGrad)">
          <rect x="32" y="30" width="4" height="32" rx="1"/>
          <path d="M36 30 h12 a8 8 0 0 1 0 16 h-12" fill="none" stroke="url(#brandGrad)" strokeWidth="4"/>
          <circle cx="46" cy="53" r="2.5"/>
          <circle cx="54" cy="53" r="2.5"/>
          <circle cx="62" cy="53" r="2.5"/>
        </g>
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
const Login = ({ onLogin, theme, onToggleTheme }) => {
  const [user, setUser] = React.useState("manop.k@pro3s.co.th");
  const [pwd, setPwd] = React.useState("");
  const [showPwd, setShowPwd] = React.useState(false);
  const [remember, setRemember] = React.useState(true);

  return (
    <div className="login">
      {/* Left panel — branding */}
      <div className="left">
        <div className="bg-grid"/>
        <div className="bracket tl" style={{ top: 18, left: 18, width: 28, height: 28 }}/>
        <div className="bracket tr" style={{ top: 18, right: 18, width: 28, height: 28 }}/>
        <div className="bracket bl" style={{ bottom: 18, left: 18, width: 28, height: 28 }}/>
        <div className="bracket br" style={{ bottom: 18, right: 18, width: 28, height: 28 }}/>

        <div style={{ position: "absolute", top: 28, left: 28 }}>
          <span className="kicker" style={{ color: "var(--amber-2)" }}>AI INSPECTION ENGINE · CLOUD-V2</span>
        </div>
        <div style={{ position: "absolute", top: 28, right: 28, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="live-dot"/>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--t-3)", textTransform: "uppercase" }}>
            LIVE · {new Date().toISOString().slice(11,19)} UTC
          </span>
        </div>

        {/* Centered branding */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 60px" }}>
          <BrandHero animate size={120}/>

          <div style={{ marginTop: 40, textAlign: "center", maxWidth: 480 }}>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.2, color: "var(--t-1)" }}>
              AI‑driven weld inspection<br/>
              for <span style={{ color: "var(--amber)" }}>Industry 4.0</span>
            </h2>
            <div style={{ marginTop: 12, fontSize: 13.5, color: "var(--t-3)", lineHeight: 1.6 }}>
              ระบบตรวจสอบคุณภาพงานเชื่อมด้วย AI
            </div>

            <div style={{ marginTop: 28, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {["F&B", "Pharma", "Oil & Gas", "Hygienic Piping"].map(p => (
                <span key={p} className="chip amber" style={{ fontSize: 11 }}>{p}</span>
              ))}
            </div>

            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { l: "Total Welds", v: "18,742", c: "var(--amber)" },
                { l: "Pass Rate",   v: "96.8%",  c: "var(--ok)" },
                { l: "AI Accuracy", v: "99.24%", c: "var(--info)" },
              ].map(s => (
                <div key={s.l} style={{ padding: "12px 14px", background: "var(--bg-glass)", backdropFilter: "blur(12px)",
                                        border: "1px solid var(--border-2)", borderRadius: 10 }}>
                  <div className="mono" style={{ fontSize: 9.5, color: "var(--t-5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{s.l}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Standards pills bottom */}
        <div style={{ position: "absolute", bottom: 28, left: 28, right: 28, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {["ASME IX · 2023", "ISO 5817 · Level B", "ASME BPE · 2024", "AWS D18.2", "ISO 9606-1", "API 1104"].map(s => (
            <span key={s} className="chip" style={{ fontSize: 9.5, background: "rgba(8,12,18,0.6)" }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="right">
        <div className="bg-grid"/>

        {/* Theme toggle top-right */}
        <div style={{ position: "absolute", top: 20, right: 20 }}>
          <div className="bell" title={theme === "light" ? "Switch to dark" : "Switch to light"} onClick={onToggleTheme}>
            {theme === "light" ? <Icons.Moon size={17}/> : <Icons.Sun size={17}/>}
          </div>
        </div>

        <form className="login-card" onSubmit={e => { e.preventDefault(); onLogin(); }}>
          <div className="bracket tl"/>
          <div className="bracket tr"/>
          <div className="bracket bl"/>
          <div className="bracket br"/>

          {/* Small logo mark */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div className="brand-mark" style={{ width: 48, height: 48, borderRadius: 12 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2"/>
                <path d="M9 8h3a3 3 0 0 1 0 6h-3v4" stroke="#1a0d00" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Sign in to PRO3S WQIS</h3>
            <div style={{ marginTop: 6, fontSize: 12.5, color: "var(--t-3)" }}>
              ลงชื่อเข้าใช้บัญชีของคุณ
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div className="label-row"><span>Email</span></div>
              <div style={{ position: "relative" }}>
                <input className="input" type="email" style={{ paddingLeft: 38, width: "100%" }}
                       value={user} onChange={e => setUser(e.target.value)}/>
                <div style={{ position: "absolute", left: 12, top: 9, color: "var(--t-4)" }}>
                  <Icons.Mail size={16}/>
                </div>
              </div>
            </div>
            <div>
              <div className="label-row">
                <span>Password</span>
                <a href="#" style={{ color: "var(--t-3)", textDecoration: "none", fontSize: 11 }}>Forgot password?</a>
              </div>
              <div style={{ position: "relative" }}>
                <input className="input" type={showPwd ? "text" : "password"} style={{ paddingLeft: 38, paddingRight: 36, width: "100%" }}
                       value={pwd} onChange={e => setPwd(e.target.value)} placeholder="••••••••"/>
                <div style={{ position: "absolute", left: 12, top: 9, color: "var(--t-4)" }}>
                  <Icons.Lock size={16}/>
                </div>
                <div style={{ position: "absolute", right: 10, top: 9, color: "var(--t-4)", cursor: "pointer" }}
                     onClick={() => setShowPwd(s => !s)}>
                  <Icons.Eye size={16}/>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "var(--t-3)", cursor: "pointer" }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: "var(--amber)" }}/>
                Remember me
              </label>
              <span className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--t-4)" }}>2FA · ACTIVE</span>
            </div>

            <button type="submit" className="btn primary lg" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
              <Icons.Shield size={16}/> Sign In
              <Icons.ChevR size={14} style={{ marginLeft: "auto" }}/>
            </button>

            <div style={{ position: "relative", textAlign: "center", margin: "8px 0" }}>
              <div className="divider" style={{ margin: 0 }}/>
              <span className="mono" style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                                              background: "var(--bg-glass-strong)", padding: "0 10px",
                                              fontSize: 10, letterSpacing: "0.14em", color: "var(--t-4)" }}>OR</span>
            </div>

            <button type="button" className="btn ghost sm" style={{ justifyContent: "center", width: "100%" }}>
              <Icons.Shield size={14}/> SSO · Azure AD
            </button>
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
  { section: "MAIN", items: [
    { id: "dashboard",   label: "Dashboard",       icon: "Dashboard" },
    { id: "inspect",     label: "AI Inspect",      icon: "Inspect",  badge: 3 },
    { id: "inspections", label: "Inspections",     icon: "Rows",     count: 1842 },
    { id: "projects",    label: "Projects",        icon: "Project",  count: 23 },
  ]},
  { section: "DATA", items: [
    { id: "reports",     label: "Reports",         icon: "Report" },
    { id: "analytics",   label: "Analytics",       icon: "Chart" },
  ]},
  { section: "REFERENCE", items: [
    { id: "standards",   label: "Standard Ref.",   icon: "Standard" },
  ]},
  { section: "SYSTEM", items: [
    { id: "users",       label: "Users & Teams",   icon: "Users" },
    { id: "settings",    label: "Settings",        icon: "Settings" },
    { id: "info",        label: "Information",     icon: "Info" },
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
                  {it.count != null && <span className="count">{it.count.toLocaleString()}</span>}
                  {it.badge != null && <span className="count" style={{ background: "var(--amber)", color: "#1a0d00" }}>{it.badge}</span>}
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
          <Icons.ChevL size={14}/> {collapsed ? "" : "Collapse"}
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

const ACCENT_COLORS = ["#ff8c1a", "#4fa8ff", "#a06bff", "#2dd4a4"];

const Topbar = ({ active, theme, onToggleTheme, onNotifications, onProfile, accent, onAccentChange }) => {
  const now = useClock();
  const titles = {
    dashboard:   ["Main",      "Dashboard"],
    inspect:     ["AI",        "Inspection"],
    inspections: ["Records",   "Inspections"],
    projects:    ["Operations","Projects"],
    reports:     ["Data",      "Reports"],
    analytics:   ["Data",      "Analytics"],
    standards:   ["Reference", "Standard Ref."],
    users:       ["System",    "Users & Teams"],
    settings:    ["System",    "Settings"],
    info:        ["System",    "Information"],
    profile:     ["Account",   "Profile"],
  };
  const [a, b] = titles[active] || ["Main", "Dashboard"];

  const timeStr = now.toLocaleTimeString("en-GB");
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
        {/* Accent color dots */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", paddingRight: 10, borderRight: "1px solid var(--border-1)" }}>
          {ACCENT_COLORS.map(c => (
            <div key={c} onClick={() => onAccentChange && onAccentChange(c)}
                 style={{ width: 14, height: 14, borderRadius: "50%", background: c, cursor: "pointer",
                          outline: accent === c ? `2px solid ${c}` : "none",
                          outlineOffset: 2, transition: "outline 0.12s" }}/>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", height: 30,
                      background: "var(--ok-soft)", border: "1px solid var(--ok-line)", borderRadius: 99 }}>
          <span className="live-dot"/>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "#5af0c4", textTransform: "uppercase" }}>
            AI · Online
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

        <div className="user-card" onClick={onProfile}>
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
          <h3><span className="live-dot" style={{ marginRight: 8 }}/>Notifications</h3>
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
