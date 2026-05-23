/* global React, ReactDOM, Auth, window */

// ── Portal: renders children directly at document.body (bypasses stacking contexts) ──
const ModalPortal = ({ children }) =>
  ReactDOM.createPortal(children, document.body);
window.ModalPortal = ModalPortal;

// ── Nav definitions (static; labels resolved dynamically via window.t) ───────
const NAV_ITEMS = [
  { id:'dashboard',   labelKey:'nav.dashboard',   group:'nav.group.main',
    icon:(s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="9" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/></svg> },
  { id:'inspect',     labelKey:'nav.inspect',      group:'nav.group.main',
    icon:(s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4.5-4.5M8 11h6M11 8v6"/></svg> },
  { id:'inspections', labelKey:'nav.inspections',  group:'nav.group.main',
    icon:(s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3 8-8"/><path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8l-5-5z"/><path d="M15 3v5h5"/></svg> },
  { id:'projects',    labelKey:'nav.projects',     group:'nav.group.main',
    icon:(s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M3 11h18"/></svg> },
  { id:'reports',     labelKey:'nav.reports',      group:'nav.group.analysis',
    icon:(s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg> },
  { id:'analytics',   labelKey:'nav.analytics',    group:'nav.group.analysis',
    icon:(s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { id:'standards',   labelKey:'nav.standards',    group:'nav.group.system',
    icon:(s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M14 3v5h5M9 13h7M9 17h5"/></svg> },
  { id:'users',       labelKey:'nav.users',        group:'nav.group.system',
    icon:(s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87"/></svg> },
  { id:'settings',    labelKey:'nav.settings',     group:'nav.group.system',
    icon:(s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg> },
  { id:'info',        labelKey:'nav.info',         group:'nav.group.system',
    icon:(s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12.01" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg> },
];

const getPageLabel = (id) => {
  const item = NAV_ITEMS.find(n => n.id === id);
  return item ? (window.t ? window.t(item.labelKey) : item.labelKey) : id;
};

// ── Splash ───────────────────────────────────────────────────────────────────
const Splash = ({ onDone }) => {
  const [progress, setProgress] = React.useState(0);
  const [fading,   setFading]   = React.useState(false);

  React.useEffect(() => {
    const steps = [[22,70],[52,170],[76,300],[92,500],[100,760]];
    const timers = [];
    let elapsed = 0;
    steps.forEach(([val, delay]) => {
      elapsed += delay;
      timers.push(setTimeout(() => setProgress(val), elapsed));
    });
    timers.push(setTimeout(() => setFading(true), elapsed + 140));
    timers.push(setTimeout(() => onDone && onDone(), elapsed + 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`splash${fading ? ' fading' : ''}`}>
      <div className="splash-inner">
        <div className="splash-brand">
          <div className="splash-logo-wrap">
            <img src="PRO3S_Logo_001.png" alt="PRO3S" className="splash-logo"
                 onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
            <div className="splash-logo-ph" style={{display:'none'}}>P3</div>
          </div>
          <div className="splash-title">PRO3S WQIS</div>
          <div className="splash-sub">Weld Quality Inspection System</div>
          <div className="splash-sub-th">ระบบตรวจสอบคุณภาพงานเชื่อม</div>
        </div>
        <div className="splash-loader">
          <div className="splash-bar-wrap">
            <div className="splash-bar-fill" style={{width:`${progress}%`}}/>
          </div>
          <div className="splash-pct">{progress}%</div>
        </div>
      </div>
    </div>
  );
};

// ── Login ────────────────────────────────────────────────────────────────────
const Login = ({ onLogin, theme, onToggleTheme, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPwd,  setShowPwd]  = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [loading,  setLoading]  = React.useState(false);
  const [error,    setError]    = React.useState('');
  const [shaking,  setShaking]  = React.useState(false);
  const [demoOpen, setDemoOpen] = React.useState(false);

  const DEMOS_FALLBACK = [
    { username:'admin',     password:'pro3s@admin', role:'admin',     label: t('role.admin') },
    { username:'inspector', password:'weld@2024',   role:'inspector', label: t('role.inspector') },
    { username:'viewer',    password:'view@2024',   role:'viewer',    label: t('role.viewer') },
  ];
  const DEMOS = (typeof window !== 'undefined' && Array.isArray(window.WQIS_USERS) && window.WQIS_USERS.length)
    ? window.WQIS_USERS.filter(u => u.status !== 'disabled').map(u => ({
        username: u.username, password: u.password, role: u.role,
        label: t(`role.${u.role}`) || u.role,
      }))
    : DEMOS_FALLBACK;

  const ROLE_BADGE = { admin:'badge-navy', inspector:'badge-teal', viewer:'badge-gray' };

  const handleSubmit = async e => {
    e.preventDefault();
    const u = username.trim();
    if (!u || !password) { setError(t('auth.error_empty')); return; }
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 480));
    const result = await Auth.login(u, password, remember);
    setLoading(false);
    if (result.ok) {
      onLogin && onLogin();
    } else {
      setError(t('auth.error_invalid'));
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
    }
  };

  const fillDemo = d => { setUsername(d.username); setPassword(d.password); setDemoOpen(false); };
  const roleT = r => r === 'admin' ? t('role.admin') : r === 'inspector' ? t('role.inspector') : t('role.viewer');

  const EyeOpen  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>;
  const EyeClose = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18M10.6 10.6A3 3 0 0113.4 13.4M1 12s4-7 11-7c1.9 0 3.6.5 5.1 1.4M20.9 12.8C19.7 15.2 17 18 12 18c-1.5 0-2.9-.3-4.1-.8"/></svg>;
  const SunIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>;
  const MoonIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.1A8 8 0 119.9 4a6 6 0 1010.1 10.1z"/></svg>;

  return (
    <div className="login-page">
      <button className="login-theme-btn" onClick={onToggleTheme} title="Toggle theme">
        {theme === 'dark' ? <SunIcon/> : <MoonIcon/>}
      </button>

      <div className={`login-card${shaking ? ' shake' : ''}`}>
        {/* Brand */}
        <div className="login-logo-wrap">
          <div className="login-logo-ring">
            <img src="PRO3S_Logo_001.png" alt="PRO3S" className="login-logo"
                 onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
            <div className="login-logo-ph" style={{display:'none'}}>P3</div>
          </div>
          <div className="login-app-name">PRO3S WQIS</div>
          <div className="login-app-sub">{t('auth.app_sub')}</div>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" autoComplete="on">
          <div className="login-field">
            <label className="login-label">{t('auth.username')}</label>
            <div className="login-input-wrap">
              <div className="login-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/>
                </svg>
              </div>
              <input className="login-input" type="text" value={username} autoComplete="username"
                     placeholder={t('auth.username_ph')} onChange={e => setUsername(e.target.value)} autoFocus/>
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">{t('auth.password')}</label>
            <div className="login-input-wrap">
              <div className="login-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0110 0v3"/>
                </svg>
              </div>
              <input className="login-input login-input-pw" type={showPwd ? 'text' : 'password'}
                     value={password} autoComplete="current-password"
                     placeholder={t('auth.password_ph')} onChange={e => setPassword(e.target.value)}/>
              <button type="button" className="login-pw-toggle" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeClose/> : <EyeOpen/>}
              </button>
            </div>
          </div>

          <div className="login-row-opts">
            <label className="login-remember">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/>
              <span>{t('auth.remember')}</span>
            </label>
            <button type="button" className="login-forgot"
                    onClick={() => alert(t('auth.forgot_msg'))}>
              {t('auth.forgot')}
            </button>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <><div className="login-spinner"/><span>{t('auth.logging_in')}</span></> : <span>{t('auth.login')}</span>}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="login-demo-wrap">
          <button className="login-demo-toggle" onClick={() => setDemoOpen(o => !o)}>
            <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
                 style={{transform: demoOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s'}}>
              <path d="M5 8l5 5 5-5"/>
            </svg>
            {t('auth.demo')}
          </button>
          {demoOpen && (
            <div className="login-demo-list">
              {DEMOS.map((d, i) => (
                <button key={i} className="login-demo-item" onClick={() => fillDemo(d)}>
                  <div>
                    <div className="login-demo-user">{d.username}</div>
                    <div className="login-demo-pw">{d.password}</div>
                  </div>
                  <span className={`badge ${ROLE_BADGE[d.role] || 'badge-gray'}`}>{roleT(d.role)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="login-footer">
        PRO3S WQIS v1.0.0 &nbsp;·&nbsp; Industrial QA/QC Platform &nbsp;·&nbsp; © 2026 PRO3S
      </div>
    </div>
  );
};

// ── Sidebar ──────────────────────────────────────────────────────────────────
const loadSidebarProfile = username => {
  try {
    const raw = localStorage.getItem(`wqis_profile_${username}`);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
};
const loadSidebarAvatar = username => {
  try { return localStorage.getItem(`wqis_avatar_${username}`) || null; } catch (_) { return null; }
};

const Sidebar = ({ active, onNav, collapsed, onToggle, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const session = Auth.getSession ? Auth.getSession() : null;
  const username = session?.username || '';

  // Live-update when ProfileScreen saves
  const [savedProfile, setSavedProfile] = React.useState(() => loadSidebarProfile(username));
  const [savedAvatar,  setSavedAvatar]  = React.useState(() => loadSidebarAvatar(username));

  React.useEffect(() => {
    const onUpdate = () => {
      setSavedProfile(loadSidebarProfile(username));
      setSavedAvatar(loadSidebarAvatar(username));
    };
    window.addEventListener('wqis:profile-updated', onUpdate);
    return () => window.removeEventListener('wqis:profile-updated', onUpdate);
  }, [username]);

  const displayName = savedProfile?.displayName || savedProfile?.fullName
    || session?.name || session?.username || '—';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const roleLabel   = !session ? '' :
    session.role === 'admin' ? t('role.admin') :
    session.role === 'inspector' ? t('role.inspector') : t('role.viewer');

  const groups = [];
  let lastGroup = null;
  NAV_ITEMS.forEach(item => {
    if (item.group !== lastGroup) { groups.push({ group: item.group, items: [] }); lastGroup = item.group; }
    groups[groups.length - 1].items.push(item);
  });

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <img src="PRO3S_Logo_001.png" alt="PRO3S" className="sidebar-brand-logo"
             onError={e => { e.target.style.display='none'; e.target.nextSibling && (e.target.nextSibling.style.display='flex'); }}/>
        <div className="sidebar-brand-ph" style={{display:'none'}}>P3</div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">PRO3S WQIS</div>
            <div className="sidebar-brand-sub">Weld Inspection</div>
          </div>
        )}
        <button className="sidebar-toggle" onClick={onToggle}
                title={collapsed ? t('nav.expand') : t('nav.collapse')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {groups.map(({ group, items }) => (
          <div key={group}>
            {!collapsed && <div className="nav-section-label">{t(group)}</div>}
            {items.map(({ id, labelKey, icon }) => {
              const label = t(labelKey);
              return (
                <button key={id}
                  className={`nav-item${active === id ? ' active' : ''}`}
                  onClick={() => onNav(id)}
                  title={collapsed ? label : undefined}>
                  {icon(18)}
                  {!collapsed && <span>{label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="nav-item danger" onClick={() => Auth.logout && Auth.logout()}
                title={collapsed ? t('nav.logout') : undefined}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && <span>{t('nav.logout')}</span>}
        </button>

        {!collapsed && session && (
          <>
            <div className="sidebar-divider"/>
            <div className="sidebar-user" onClick={() => onNav('profile')}>
              {savedAvatar
                ? <img src={savedAvatar} alt={initials} className="av av-sm"
                       style={{ borderRadius:'50%', objectFit:'cover', flexShrink:0 }}/>
                : <div className="av av-sm">{initials}</div>
              }
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{displayName}</div>
                <div className="sidebar-user-role">{roleLabel}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

// ── ThemePanel ───────────────────────────────────────────────────────────────
const THEME_LIST = [
  {
    id: 'light', name: 'Office', nameTh: 'ออฟฟิศ', emoji: '🌤',
    bg: '#F8F9FA', sidebar: '#FFFFFF', topbar: '#FFFFFF', accent: '#1B3A6B', card: '#FFFFFF',
    swatches: ['#F8F9FA','#1B3A6B','#0D7377'],
  },
  {
    id: 'dark', name: 'Dark', nameTh: 'ดาร์ก', emoji: '🌑',
    bg: '#141929', sidebar: '#1c2235', topbar: '#1c2235', accent: '#5aabff', card: '#1e2740',
    swatches: ['#141929','#5aabff','#2dd4a4'],
  },
  {
    id: 'neon', name: 'Neon', nameTh: 'นีออน', emoji: '⚡',
    bg: '#060c14', sidebar: '#0d1117', topbar: '#0d1117', accent: '#00ff88', card: '#0d1520',
    swatches: ['#060c14','#00ff88','#00e5ff'],
  },
  {
    id: 'midnight', name: 'Midnight', nameTh: 'มิดไนต์', emoji: '🌌',
    bg: '#09071a', sidebar: '#12102a', topbar: '#12102a', accent: '#a78bfa', card: '#100e28',
    swatches: ['#09071a','#a78bfa','#818cf8'],
  },
  {
    id: 'sunset', name: 'Sunset', nameTh: 'ซันเซ็ต', emoji: '🌅',
    bg: '#100604', sidebar: '#1e0e08', topbar: '#1e0e08', accent: '#f97316', card: '#1a0c08',
    swatches: ['#100604','#f97316','#f43f5e'],
  },
];

const ThemePanel = ({ theme, onThemeChange, onClose, lang }) => {
  const isTh = (lang || 'th') === 'th';
  return (
    <>
      <div className="theme-panel-backdrop" onClick={onClose}/>
      <div className="theme-panel">
        {/* Header */}
        <div className="theme-panel-header">
          <div>
            <div style={{fontWeight:700,fontSize:15,color:'var(--text-1)',display:'flex',alignItems:'center',gap:7}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="13.5" cy="6.5" r="0.5" fill="var(--navy)"/>
                <circle cx="17.5" cy="10.5" r="0.5" fill="var(--navy)"/>
                <circle cx="8.5"  cy="7.5"  r="0.5" fill="var(--navy)"/>
                <circle cx="6.5"  cy="12.5" r="0.5" fill="var(--navy)"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.041 0-.92.725-1.646 1.648-1.646H16c2.209 0 4-1.791 4-4 0-4.971-4-9-8-9z"/>
              </svg>
              {isTh ? 'ธีมและสไตล์' : 'Theme & Style'}
            </div>
            <div style={{fontSize:11.5,color:'var(--text-3)',marginTop:2}}>
              {isTh ? 'เลือกสไตล์ที่ชอบ' : 'Pick your favourite look'}
            </div>
          </div>
          <button className="theme-btn" onClick={onClose} title="Close">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Theme cards */}
        <div className="theme-panel-body">
          {THEME_LIST.map(th => (
            <button key={th.id}
              className={`theme-card${theme===th.id?' active':''}`}
              onClick={() => { onThemeChange(th.id); onClose(); }}
            >
              {/* Mini preview */}
              <div className="theme-preview" style={{background:th.bg}}>
                <div className="theme-preview-sidebar" style={{background:th.sidebar}}/>
                <div className="theme-preview-topbar" style={{background:th.topbar, borderBottom:`1px solid ${th.accent}30`}}/>
                <div className="theme-preview-content" style={{background:th.accent+'22', borderRadius:3}}/>
                <div className="theme-preview-bar" style={{background:th.accent, opacity:0.85}}/>
                <div className="theme-preview-dot" style={{background:th.accent, boxShadow:`0 0 6px ${th.accent}`}}/>
              </div>

              {/* Info */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,color:'var(--text-1)',marginBottom:5,display:'flex',alignItems:'center',gap:5}}>
                  <span>{th.emoji}</span>
                  <span>{isTh ? th.nameTh : th.name}</span>
                </div>
                <div style={{display:'flex',gap:5,alignItems:'center'}}>
                  {th.swatches.map((c,i) => (
                    <div key={i} style={{
                      width:15, height:15, borderRadius:4, background:c,
                      border:'1.5px solid rgba(128,128,128,0.25)',
                      boxShadow: i===1 ? `0 0 5px ${c}99` : 'none',
                    }}/>
                  ))}
                </div>
              </div>

              {/* Active badge */}
              {theme===th.id
                ? <div className="theme-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                : <div style={{width:24,height:24,borderRadius:'50%',border:'2px solid var(--border)',flexShrink:0}}/>
              }
            </button>
          ))}

          {/* Accent section */}
          <div style={{marginTop:6,padding:'14px 0 2px',borderTop:'1px solid var(--border-lt)'}}>
            <div style={{fontSize:12,fontWeight:600,color:'var(--text-3)',marginBottom:10,letterSpacing:'0.04em',textTransform:'uppercase'}}>
              {isTh ? 'สีหลัก (Accent)' : 'Accent Color'}
            </div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {[
                {c:'#ff8c1a',n:'Amber'},
                {c:'#4fa8ff',n:'Blue'},
                {c:'#a06bff',n:'Purple'},
                {c:'#2dd4a4',n:'Teal'},
                {c:'#f43f5e',n:'Rose'},
                {c:'#facc15',n:'Gold'},
              ].map(({c,n}) => (
                <button key={c}
                  onClick={() => typeof window.onAccentChange === 'function' && window.onAccentChange(c)}
                  title={n}
                  style={{
                    width:28, height:28, borderRadius:8, background:c, border:'none',
                    cursor:'pointer', boxShadow:`0 0 8px ${c}88`,
                    transform:'scale(1)', transition:'transform 0.15s',
                  }}
                  onMouseEnter={e=>e.currentTarget.style.transform='scale(1.18)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Topbar ───────────────────────────────────────────────────────────────────
const Topbar = ({ active, theme, onToggleTheme, onThemeChange, onNotifications, onProfile, accent, onAccentChange, lang, onLangChange }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const pageLabel = getPageLabel(active);
  const ACCENTS   = ['#ff8c1a','#4fa8ff','#a06bff','#2dd4a4'];
  const NAMES     = { '#ff8c1a':'Amber','#4fa8ff':'Blue','#a06bff':'Purple','#2dd4a4':'Teal' };
  const [themePanel, setThemePanel] = React.useState(false);

  // expose accent handler for ThemePanel accent buttons
  React.useEffect(() => { window.onAccentChange = onAccentChange; }, [onAccentChange]);

  const session  = Auth.getSession ? Auth.getSession() : null;
  const tbUsername = session?.username || '';
  const [tbAvatar, setTbAvatar] = React.useState(() => loadSidebarAvatar(tbUsername));
  const [tbName,   setTbName]   = React.useState(() => {
    const p = loadSidebarProfile(tbUsername);
    return p?.displayName || p?.fullName || session?.name || session?.username || 'U';
  });
  React.useEffect(() => {
    const onUpdate = () => {
      const p = loadSidebarProfile(tbUsername);
      setTbAvatar(loadSidebarAvatar(tbUsername));
      setTbName(p?.displayName || p?.fullName || session?.name || session?.username || 'U');
    };
    window.addEventListener('wqis:profile-updated', onUpdate);
    return () => window.removeEventListener('wqis:profile-updated', onUpdate);
  }, [tbUsername]);
  const initials = tbName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  // ── Live clock ──
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = n => String(n).padStart(2, '0');
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  // Date string — TH Buddhist year or EN Gregorian
  let dateStr;
  if ((lang || window.WQIS_LANG || 'th') === 'en') {
    const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const DAYS_EN   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    dateStr = `${DAYS_EN[now.getDay()]} ${now.getDate()} ${MONTHS_EN[now.getMonth()]} ${now.getFullYear()}`;
  } else {
    const MONTHS_TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
    const DAYS_TH   = ['อา','จ','อ','พ','พฤ','ศ','ส'];
    dateStr = `${DAYS_TH[now.getDay()]} ${now.getDate()} ${MONTHS_TH[now.getMonth()]} ${now.getFullYear() + 543}`;
  }

  return (
    <>
    <header className="topbar">
      <div className="topbar-breadcrumb">
        <span className="topbar-bc-root">PRO3S WQIS</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <span className="topbar-bc-page">{pageLabel}</span>
      </div>

      <div className="topbar-right">
        {/* Live clock */}
        <div className="topbar-clock">
          <div className="topbar-clock-time">{timeStr}</div>
          <div className="topbar-clock-date">{dateStr}</div>
        </div>

        {/* TH / EN language toggle */}
        <div className="lang-toggle" style={{display:'flex',gap:2,border:'1px solid var(--border-lt)',borderRadius:'var(--r)',padding:2,background:'var(--white)'}}>
          {['th','en'].map(l => (
            <button key={l}
              onClick={() => onLangChange && onLangChange(l)}
              style={{
                padding:'2px 9px', borderRadius:'calc(var(--r) - 2px)',
                fontWeight: 700, fontSize: 11, letterSpacing:'0.03em',
                border:'none', cursor:'pointer', transition:'all 0.15s',
                background: (lang||'th') === l ? 'var(--navy)' : 'transparent',
                color: (lang||'th') === l ? '#fff' : 'var(--text-3)',
              }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 🎨 Theme button */}
        <button
          className="topbar-btn"
          onClick={() => setThemePanel(true)}
          title={lang === 'en' ? 'Theme & Style' : 'ธีมและสไตล์'}
          style={{position:'relative'}}
        >
          {/* Palette icon */}
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            <circle cx="17.5" cy="10.5" r="1" fill="currentColor" stroke="none"/>
            <circle cx="8.5"  cy="7.5"  r="1" fill="currentColor" stroke="none"/>
            <circle cx="6.5"  cy="12.5" r="1" fill="currentColor" stroke="none"/>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.041 0-.92.725-1.646 1.648-1.646H16c2.209 0 4-1.791 4-4 0-4.971-4-9-8-9z"/>
          </svg>
          {/* Active theme dot indicator */}
          {(()=>{
            const th = THEME_LIST.find(th=>th.id===theme);
            return th ? <span style={{position:'absolute',bottom:4,right:4,width:6,height:6,borderRadius:'50%',background:th.accent,boxShadow:`0 0 5px ${th.accent}`}}/> : null;
          })()}
        </button>

        {/* Notifications */}
        <button className="topbar-btn" onClick={onNotifications} title={t('lbl.notifications')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>
          </svg>
          <span className="notif-dot"/>
        </button>

        {/* Profile avatar */}
        <button className="topbar-avatar" onClick={onProfile} title={t('prof.title')}
                style={{border:'none',font:'inherit',lineHeight:1,padding:0,overflow:'hidden'}}>
          {tbAvatar
            ? <img src={tbAvatar} alt={initials} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            : initials
          }
        </button>
      </div>
    </header>

    {/* Theme Panel */}
    {themePanel && (
      <ThemePanel
        theme={theme}
        onThemeChange={onThemeChange || onToggleTheme}
        onClose={() => setThemePanel(false)}
        lang={lang}
      />
    )}
  </>
  );
};

// ── NotificationsDrawer ──────────────────────────────────────────────────────
const NotificationsDrawer = ({ open, onClose, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const NOTIFS = [
    { id:1, type:'fail', title:'ผล FAIL — TPA Chonburi',    body:'W-0041 ไม่ผ่าน ISO 5817 Grade C',          time:'5 นาทีที่แล้ว',   read:false },
    { id:2, type:'info', title:'นำเข้าภาพสำเร็จ',           body:'24 รายการ — CPF-RYG Batch #7',              time:'1 ชั่วโมงที่แล้ว', read:false },
    { id:3, type:'ok',   title:'โปรเจคเสร็จสมบูรณ์',       body:'Dutch Mill SRB ผ่านครบ 100% (312 แนว)',     time:'3 ชั่วโมงที่แล้ว', read:true  },
    { id:4, type:'info', title:'รายงานประจำวันพร้อมแล้ว',  body:'สรุปผล 15 พ.ค. 2026 — 47 แนวเชื่อม',        time:'6 ชั่วโมงที่แล้ว', read:true  },
    { id:5, type:'ok',   title:'AI ตรวจสอบเสร็จแบตช์',     body:'W-0038 → W-0042 ผ่านทั้ง 5 แนว',           time:'เมื่อวาน 14:22',   read:true  },
  ];

  const TYPE_STYLE = {
    fail: { bg:'var(--red-soft)',    fg:'var(--red)'   },
    info: { bg:'var(--navy-soft)',   fg:'var(--navy)'  },
    ok:   { bg:'var(--green-soft)', fg:'var(--green)' },
  };
  const TypeIcon = ({ type }) => (
    <div className="notif-dot-type" style={{background:TYPE_STYLE[type].bg, color:TYPE_STYLE[type].fg}}>
      {type === 'fail'
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        : type === 'ok'
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12.01" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>
      }
    </div>
  );

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose}/>}
      <div className={`drawer${open ? ' open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title">{t('notif.title')}</div>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          {NOTIFS.map(n => (
            <div key={n.id} className={`notif-item${n.read ? ' read' : ''}`}>
              <TypeIcon type={n.type}/>
              <div className="notif-body">
                <div className="notif-title">{n.title}</div>
                <div className="notif-text">{n.body}</div>
                <div className="notif-time">{n.time}</div>
              </div>
              {!n.read && <div className="notif-unread"/>}
            </div>
          ))}
        </div>

        <div className="drawer-footer">
          <button className="btn btn-ghost btn-sm" style={{width:'100%',justifyContent:'center'}}>
            {t('notif.view_all')}
          </button>
        </div>
      </div>
    </>
  );
};

// ── Global ripple (covers .btn and .login-submit) ────────────────────────────
if (typeof document !== 'undefined') {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn,.login-submit');
    if (!btn) return;
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;margin:0`;
    btn.appendChild(r);
    r.addEventListener('animationend', () => r.remove(), { once:true });
  });
}

Object.assign(window, { Splash, Login, Sidebar, Topbar, NotificationsDrawer });
