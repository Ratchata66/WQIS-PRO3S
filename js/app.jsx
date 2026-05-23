/* global React, ReactDOM, Auth, WQIS_DATA,
   Splash, Login, Sidebar, Topbar, NotificationsDrawer,
   DashboardScreen, AIInspectScreen, InspectionsScreen, ProjectsScreen,
   ReportsScreen, AnalyticsScreen, StandardsScreen,
   UsersTeamsScreen, SettingsScreen, InfoScreen, ProfileScreen */

const PALETTES = {
  '#ff8c1a': { a:'#ff8c1a', a2:'#ffa645', a3:'#ffc176', glow:'rgba(255,140,26,0.45)' },
  '#4fa8ff': { a:'#4fa8ff', a2:'#82c0ff', a3:'#b8dcff', glow:'rgba(79,168,255,0.5)'  },
  '#a06bff': { a:'#a06bff', a2:'#bf95ff', a3:'#dabfff', glow:'rgba(160,107,255,0.5)' },
  '#2dd4a4': { a:'#2dd4a4', a2:'#6ee5be', a3:'#9bf0d4', glow:'rgba(45,212,164,0.5)'  },
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

const App = () => {
  const [phase,   setPhase]   = React.useState('splash');  // splash → login → app
  const [page,    setPage]    = React.useState('dashboard');
  const [theme,   setTheme]   = React.useState(() => localStorage.getItem('wqis-theme') || 'dark');
  const [accent,  setAccent]  = React.useState('#ff8c1a');
  const [lang,    setLang]    = React.useState(() => localStorage.getItem('wqis-lang') || 'th');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);

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

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

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
      case 'inspections': return <InspectionsScreen inspections={inspections} projects={projects} lang={lang}/>;
      case 'reports':     return <ReportsScreen     projects={projects} inspections={inspections} lang={lang}/>;
      case 'analytics':   return <AnalyticsScreen   projects={projects} inspections={inspections} lang={lang}/>;
      case 'standards':   return <StandardsScreen   standards={standards} setStandards={setStandards} lang={lang}/>;
      case 'users':       return <UsersTeamsScreen  lang={lang}/>;
      case 'settings':    return <SettingsScreen    settings={appSettings} setSettings={setAppSettings} lang={lang}/>;
      case 'info':        return <InfoScreen        lang={lang}/>;
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
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
