/* global React, ReactDOM, Auth, WQIS_DATA,
   Splash, Login, Sidebar, Topbar, NotificationsDrawer,
   DashboardScreen, AIInspectScreen, InspectionsScreen, ProjectsScreen,
   ReportsScreen, AnalyticsScreen, StandardsScreen,
   UsersTeamsScreen, SettingsScreen, InfoScreen, ProfileScreen,
   Drawing3DScreen */

const PALETTES = {
  '#ff8c1a': { a:'#ff8c1a', a2:'#ffa645', a3:'#ffc176', glow:'rgba(255,140,26,0.45)' },
  '#4fa8ff': { a:'#4fa8ff', a2:'#82c0ff', a3:'#b8dcff', glow:'rgba(79,168,255,0.5)'  },
  '#a06bff': { a:'#a06bff', a2:'#bf95ff', a3:'#dabfff', glow:'rgba(160,107,255,0.5)' },
  '#2dd4a4': { a:'#2dd4a4', a2:'#6ee5be', a3:'#9bf0d4', glow:'rgba(45,212,164,0.5)'  },
  '#f43f5e': { a:'#f43f5e', a2:'#fb7185', a3:'#fda4af', glow:'rgba(244,63,94,0.5)'   },
  '#facc15': { a:'#facc15', a2:'#fde047', a3:'#fef08a', glow:'rgba(250,204,21,0.45)' },
};

// Theme flash helper — smooth morph between themes
const applyThemeTransition = (newTheme, setTheme) => {
  document.body.classList.add('theme-transitioning');
  setTheme(newTheme);
  setTimeout(() => document.body.classList.remove('theme-transitioning'), 400);
};

// ── Toast icons ──────────────────────────────────────────────────────────────
const TOAST_ICONS = {
  success: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  error:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)"   strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  info:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navy)"  strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12.01" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>,
  warning: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round"><path d="M10.3 3.6L2.1 18a2 2 0 001.7 3h16.4a2 2 0 001.7-3L13.7 3.6a2 2 0 00-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

// ── ToastStack ───────────────────────────────────────────────────────────────
const ToastStack = ({ toasts, onRemove }) => (
  <div className="toast-stack">
    {toasts.map(t => (
      <div key={t.id} className={`toast-item toast-${t.type}${t.leaving ? ' leaving' : ''}`}>
        <span className="toast-icon">{TOAST_ICONS[t.type] || TOAST_ICONS.info}</span>
        <span className="toast-msg">{t.message}</span>
        <button className="toast-close" onClick={() => onRemove(t.id)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    ))}
  </div>
);

// ── Demo Notice Modal ─────────────────────────────────────────────────────────
const DEMO_NOTICE_KEY = 'wqis-demo-notice-seen';

const DemoNoticeModal = ({ onClose, session }) => {
  const userKey = DEMO_NOTICE_KEY + (session ? '-' + session.username : '');
  const items = [
    {
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>,
      title: 'ข้อมูลเก็บเฉพาะในเครื่องของคุณ (Local Storage)',
      body:  'ผลการตรวจ โปรเจค และรายงานทั้งหมดถูกบันทึกใน Browser ของอุปกรณ์นี้เท่านั้น ไม่มีการซิงค์ข้ามเครื่องหรือแชร์ระหว่างผู้ใช้คนอื่น หากล้างข้อมูล Browser ข้อมูลจะหายถาวร',
    },
    {
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
      title: 'Demo Version — ยังไม่มีเซิร์ฟเวอร์กลาง',
      body:  'ระบบอยู่ในช่วงทดลองใช้งาน เหมาะสำหรับบันทึกผลการตรวจส่วนตัวและทดสอบระบบ AI ยังไม่รองรับการทำงานร่วมกันเป็นทีม',
    },
    {
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      title: 'อยู่ระหว่างการพัฒนาต่อเนื่อง',
      body:  'ระบบเซิร์ฟเวอร์กลาง การซิงค์ข้อมูล และฟีเจอร์สำหรับทีมอยู่ในแผนพัฒนา จะแจ้งให้ทราบเมื่อพร้อมใช้งาน',
    },
  ];

  return (
    <ModalPortal>
      <div style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:9999, padding:20, animation:'fadeIn .2s ease'
      }}>
        <div style={{
          background:'var(--bg-card)', borderRadius:12, maxWidth:480, width:'100%',
          boxShadow:'0 32px 80px rgba(0,0,0,0.45)', border:'1px solid var(--border-lt)',
          animation:'slideUp .28s ease', overflow:'hidden'
        }}>

          {/* ── Header ── */}
          <div style={{ background:'var(--navy)', padding:'18px 22px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:36, height:36, borderRadius:8, flexShrink:0,
              background:'rgba(255,255,255,0.12)', display:'grid', placeItems:'center'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:'#fff', letterSpacing:'.3px' }}>
                หมายเหตุสำคัญ — WQIS PRO3S
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:1, letterSpacing:'.2px' }}>
                DEMO VERSION · กรุณาอ่านก่อนเริ่มใช้งาน
              </div>
            </div>
          </div>

          {/* ── Items ── */}
          <div style={{ padding:'20px 22px 4px' }}>
            {items.map((item, i) => (
              <div key={i} style={{ display:'flex', gap:13, marginBottom:18 }}>
                <div style={{
                  width:32, height:32, borderRadius:8, flexShrink:0,
                  background:'var(--navy)', border:'none',
                  display:'grid', placeItems:'center', color:'#fff'
                }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:'var(--text-1)', marginBottom:4, lineHeight:1.35 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-2)', lineHeight:1.75 }}>
                    {item.body}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Divider ── */}
          <div style={{ height:1, background:'var(--border-lt)', margin:'0 22px' }}/>

          {/* ── Footer ── */}
          <div style={{ padding:'13px 22px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <label style={{ display:'flex', alignItems:'center', gap:7, cursor:'pointer', userSelect:'none' }}>
              <input type="checkbox" id="demoNoticeDontShow"
                style={{ width:13, height:13, cursor:'pointer', accentColor:'var(--navy)' }}/>
              <span style={{ fontSize:11.5, color:'var(--text-3)' }}>ไม่ต้องแสดงอีก</span>
            </label>
            <button
              onClick={() => {
                if (document.getElementById('demoNoticeDontShow')?.checked) {
                  try { localStorage.setItem(userKey, '1'); } catch(_) {}
                }
                onClose();
              }}
              style={{
                background:'var(--navy)', color:'#fff', border:'none', borderRadius:7,
                padding:'9px 22px', fontWeight:600, fontSize:12.5, cursor:'pointer',
                fontFamily:'inherit', letterSpacing:'.2px', transition:'opacity .15s'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity='.82'}
              onMouseLeave={e => e.currentTarget.style.opacity='1'}
            >รับทราบ เริ่มใช้งาน →</button>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
};

const App = () => {
  const [phase,   setPhase]   = React.useState('splash');  // splash → login → app
  const [page,    setPage]    = React.useState('dashboard');
  const [theme,   setTheme]   = React.useState(() => localStorage.getItem('wqis-theme') || 'dark');
  const [accent,  setAccent]  = React.useState('#ff8c1a');
  const [lang,    setLang]    = React.useState(() => localStorage.getItem('wqis-lang') || 'th');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [showDemoNotice, setShowDemoNotice] = React.useState(false);

  const loadStored = (key, fallback) => {
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch(_) { return fallback; }
  };

  const [projects,    setProjects]    = React.useState(() => loadStored('wqis-projects',    WQIS_DATA.projects));
  const [inspections, setInspections] = React.useState(() => loadStored('wqis-inspections', WQIS_DATA.inspections));
  const [standards,   setStandards]   = React.useState(() => loadStored('wqis-standards',   WQIS_DATA.standards));
  const [appSettings, setAppSettings] = React.useState(() => loadStored('wqis-settings',    WQIS_DATA.settings));

  // ── Toast system ──
  const [toasts, setToasts] = React.useState([]);
  const removeToast = React.useCallback(id => {
    setToasts(prev => prev.map(t => t.id === id ? {...t, leaving:true} : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 250);
  }, []);
  const showToast = React.useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, leaving:false }]);
    setTimeout(() => removeToast(id), 3200);
  }, [removeToast]);

  // Register globally so any component can call window.showToast(...)
  React.useEffect(() => {
    window.showToast = showToast;
    return () => { delete window.showToast; };
  }, [showToast]);

  // ── Persist app data to localStorage on every change ──
  React.useEffect(() => {
    try { localStorage.setItem('wqis-projects',    JSON.stringify(projects));    } catch(_) {}
  }, [projects]);
  React.useEffect(() => {
    try { localStorage.setItem('wqis-inspections', JSON.stringify(inspections)); } catch(_) {}
  }, [inspections]);
  React.useEffect(() => {
    try { localStorage.setItem('wqis-standards',   JSON.stringify(standards));   } catch(_) {}
  }, [standards]);
  React.useEffect(() => {
    try { localStorage.setItem('wqis-settings',    JSON.stringify(appSettings)); } catch(_) {}
  }, [appSettings]);

  // Sync lang to window globals and localStorage
  React.useEffect(() => {
    window.WQIS_LANG = lang;
    localStorage.setItem('wqis-lang', lang);
  }, [lang]);

  // Register window.setLang so i18n.jsx toggle can also trigger React re-render
  React.useEffect(() => {
    window.setLang = (l) => {
      window.WQIS_LANG = l;
      localStorage.setItem('wqis-lang', l);
      setLang(l);
    };
  }, []);

  // Apply theme
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wqis-theme', theme);
  }, [theme]);

  // Apply accent CSS vars
  React.useEffect(() => {
    const p = PALETTES[accent] || PALETTES['#ff8c1a'];
    const r = document.documentElement.style;
    r.setProperty('--accent',   p.a);
    r.setProperty('--accent-2', p.a2);
    r.setProperty('--accent-3', p.a3);
    r.setProperty('--accent-glow', p.glow);
  }, [accent]);

  // On mount: if already authenticated, skip to app
  React.useEffect(() => {
    const s = typeof Auth !== 'undefined' && Auth.getSession ? Auth.getSession() : null;
    if (s) setPhase('app');
  }, []);

  // Show demo notice every login unless this user permanently dismissed it
  React.useEffect(() => {
    if (phase === 'app') {
      const s = typeof Auth !== 'undefined' && Auth.getSession ? Auth.getSession() : null;
      const userKey = DEMO_NOTICE_KEY + (s ? '-' + s.username : '');
      if (!localStorage.getItem(userKey)) setShowDemoNotice(true);
    }
  }, [phase]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const handleThemeChange = (newTheme) => applyThemeTransition(newTheme, setTheme);

  // ── Splash ──
  if (phase === 'splash') {
    return <Splash onDone={() => setPhase('login')}/>;
  }

  // ── Login ──
  if (phase === 'login') {
    return <Login
      onLogin={() => setPhase('app')}
      theme={theme}
      onToggleTheme={toggleTheme}
    />;
  }

  // ── App ──
  const renderPage = () => {
    switch (page) {
      case 'dashboard':   return <DashboardScreen   projects={projects} inspections={inspections} lang={lang}/>;
      case 'projects':    return <ProjectsScreen    projects={projects} setProjects={setProjects} inspections={inspections} lang={lang}/>;
      case 'inspect':     return <AIInspectScreen   projects={projects} inspections={inspections} setInspections={setInspections} setProjects={setProjects} lang={lang}/>;
      case 'inspections': return <InspectionsScreen inspections={inspections} setInspections={setInspections} projects={projects} lang={lang}/>;
      case 'reports':     return <ReportsScreen     projects={projects} inspections={inspections} lang={lang}/>;
      case 'analytics':   return <AnalyticsScreen   projects={projects} inspections={inspections} lang={lang}/>;
      case 'standards':   return <StandardsScreen   standards={standards} setStandards={setStandards} lang={lang}/>;
      case 'users':       return <UsersTeamsScreen  lang={lang}/>;
      case 'settings':    return <SettingsScreen    settings={appSettings} setSettings={setAppSettings} lang={lang}/>;
      case 'info':        return <InfoScreen        lang={lang}/>;
      case 'drawing3d':   return <Drawing3DScreen   lang={lang}/>;
      case 'profile':     return <ProfileScreen     onBack={() => setPage('dashboard')} lang={lang}/>;
      default:            return <DashboardScreen   projects={projects} inspections={inspections} lang={lang}/>;
    }
  };

  return (
    <div className={`app-layout${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar
        active={page}
        onNav={setPage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        lang={lang}
      />
      <div className="main-area">
        <Topbar
          active={page}
          theme={theme}
          onToggleTheme={toggleTheme}
          onThemeChange={handleThemeChange}
          onNotifications={() => setNotifOpen(true)}
          onProfile={() => setPage('profile')}
          accent={accent}
          onAccentChange={setAccent}
          lang={lang}
          onLangChange={l => window.setLang(l)}
        />
        <main className="page-content">
          <div key={`${page}-${lang}`} className="page-enter">
            {renderPage()}
          </div>
        </main>
      </div>
      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} lang={lang}/>
      <ToastStack toasts={toasts} onRemove={removeToast}/>
      {showDemoNotice && <DemoNoticeModal onClose={() => setShowDemoNotice(false)} session={typeof Auth !== 'undefined' && Auth.getSession ? Auth.getSession() : null}/>}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
