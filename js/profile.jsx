/* global React, Auth, window */

// ── Persistence helpers ──────────────────────────────────────────────────────
const PROFILE_KEY = u => `wqis_profile_${u}`;
const AVATAR_KEY  = u => `wqis_avatar_${u}`;

const loadSavedProfile = (username, session) => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY(username));
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    fullName:    session?.name || '',
    displayName: session?.name || '',
    email:       username ? `${username}@pro3s.com` : '',
    phone:       '',
    position:    session?.role === 'admin' ? (window.t ? window.t('role.admin') : 'ผู้ดูแลระบบ') : session?.role === 'inspector' ? 'QC Inspector' : (window.t ? window.t('role.viewer') : 'ผู้ชม'),
    team:        'Quality Assurance',
    department:  'Engineering',
    bio:         '',
  };
};

const persistProfile = (username, data) => {
  try { localStorage.setItem(PROFILE_KEY(username), JSON.stringify(data)); } catch (_) {}
};

const loadSavedAvatar = username => {
  try { return localStorage.getItem(AVATAR_KEY(username)) || null; } catch (_) { return null; }
};

const persistAvatar = (username, dataUrl) => {
  try { localStorage.setItem(AVATAR_KEY(username), dataUrl); } catch (_) {}
};

// ── Avatar upload + overlay ──────────────────────────────────────────────────
const ProfileAvatar = ({ avatarUrl, initials, size = 88, onUpload }) => {
  const [hovered, setHovered] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const fileRef = React.useRef(null);

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onerror = () => setLoading(false);
    reader.onload = ev => {
      const img = new Image();
      img.onerror = () => setLoading(false);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const S = 240;
        canvas.width = S; canvas.height = S;
        const ctx = canvas.getContext('2d');
        const min = Math.min(img.width, img.height);
        const sx  = (img.width  - min) / 2;
        const sy  = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, S, S);
        onUpload(canvas.toDataURL('image/jpeg', 0.85));
        setLoading(false);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div
      className="profile-av-wrap"
      style={{ width: size, height: size, cursor: 'pointer', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => fileRef.current.click()}
    >
      {avatarUrl
        ? <img src={avatarUrl} alt="avatar" className="profile-av-img" style={{ width: size, height: size }}/>
        : <div className="av" style={{ width: size, height: size, fontSize: size * 0.28, borderRadius: '50%',
                                       display:'flex', alignItems:'center', justifyContent:'center',
                                       background:'var(--navy-soft)', color:'var(--navy)', fontWeight:700 }}>
            {initials}
          </div>
      }
      <div className={`profile-av-overlay${hovered ? ' show' : ''}`}>
        {loading
          ? <div className="profile-av-spinner"/>
          : <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <span style={{ fontSize: 10, marginTop: 4, fontWeight: 600, letterSpacing: '0.04em' }}>{window.t ? window.t('prof.change_photo') : 'เปลี่ยนรูป'}</span>
            </>
        }
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile}/>
    </div>
  );
};

// ── Stat item ────────────────────────────────────────────────────────────────
const StatItem = ({ icon, label, value, unit, color = 'var(--navy)' }) => (
  <div className="profile-stat-item">
    <div className="profile-stat-icon" style={{ background: color + '15', color }}>
      {icon}
    </div>
    <div>
      <div className="profile-stat-value" style={{ color }}>
        {value}<span className="profile-stat-unit">{unit}</span>
      </div>
      <div className="profile-stat-label">{label}</div>
    </div>
  </div>
);

// ── Password strength ────────────────────────────────────────────────────────
const PwdStrength = ({ pwd }) => {
  let s = 0;
  if (pwd.length >= 8)           s++;
  if (/[A-Z]/.test(pwd))        s++;
  if (/[0-9]/.test(pwd))        s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  const tw = k => window.t ? window.t(k) : k;
  const LABELS = ['', tw('prof.pwd_weak'), tw('prof.pwd_fair'), tw('prof.pwd_good'), tw('prof.pwd_strong')];
  const COLORS = ['', 'var(--red)', 'var(--orange)', '#eab308', 'var(--green)'];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,2,3,4].map(n => (
          <div key={n} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: s >= n ? COLORS[s] : 'var(--border)',
            transition: 'background 0.25s ease',
          }}/>
        ))}
      </div>
      <div style={{ fontSize: 11.5, marginTop: 5, color: COLORS[s] || 'var(--text-3)', fontWeight: 500 }}>
        {pwd ? `${window.t ? window.t('prof.pwd_strength') : 'ความแข็งแกร่ง'}: ${LABELS[s]}` : ''}
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const ProfileScreen = ({ onBack, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const session  = Auth.getSession ? Auth.getSession() : null;
  const username = session?.username || 'guest';

  const [tab, setTab] = React.useState('info');
  const [profile,   setProfile]   = React.useState(() => loadSavedProfile(username, session));
  const [avatarUrl, setAvatarUrl] = React.useState(() => loadSavedAvatar(username));
  const [saveStatus, setSaveStatus] = React.useState('idle'); // 'idle' | 'saving' | 'saved'

  const [pwd,     setPwd]     = React.useState({ current: '', newPwd: '', confirm: '' });
  const [showPwd, setShowPwd] = React.useState({ current: false, newPwd: false, confirm: false });
  const [pwdErr,  setPwdErr]  = React.useState('');

  // ── Refs for debounce ──
  const saveDebounce  = React.useRef(null);
  const mountedRef    = React.useRef(false);
  const statusTimer   = React.useRef(null);

  // ── Real-time: notify sidebar immediately, debounce localStorage persist ──
  React.useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    // Notify sidebar/topbar immediately (real-time update)
    window.dispatchEvent(new CustomEvent('wqis:profile-updated'));
    // Show "saving..." then auto-save after 600ms
    setSaveStatus('saving');
    clearTimeout(saveDebounce.current);
    clearTimeout(statusTimer.current);
    saveDebounce.current = setTimeout(() => {
      persistProfile(username, profile);
      setSaveStatus('saved');
      statusTimer.current = setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
    return () => { clearTimeout(saveDebounce.current); clearTimeout(statusTimer.current); };
  }, [profile]);

  const setP = (k, v) => setProfile(p => ({ ...p, [k]: v }));
  const setPw = (k, v) => setPwd(p => ({ ...p, [k]: v }));
  const toggleShow = k => setShowPwd(s => ({ ...s, [k]: !s[k] }));

  const switchTab = tabKey => setTab(tabKey);

  const initials = (profile.fullName || profile.displayName || username || 'U')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const roleLabel = session?.role === 'admin' ? t('role.admin') : session?.role === 'inspector' ? 'QC Inspector' : t('role.viewer');
  const roleBadge = session?.role === 'admin'     ? 'badge-navy' :
                    session?.role === 'inspector'  ? 'badge-teal' : 'badge-gray';

  // ── Handlers ──
  const handleAvatarUpload = dataUrl => {
    setAvatarUrl(dataUrl);
    persistAvatar(username, dataUrl);
    window.dispatchEvent(new CustomEvent('wqis:profile-updated'));
    if (window.showToast) window.showToast(t('prof.upload_ok'), 'success');
  };

  // Force-save now (flush debounce)
  const saveNow = e => {
    if (e) e.preventDefault();
    clearTimeout(saveDebounce.current);
    persistProfile(username, profile);
    setSaveStatus('saved');
    clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setSaveStatus('idle'), 2000);
    if (window.showToast) window.showToast(t('prof.save_ok2'), 'success');
  };

  const savePwd = e => {
    e.preventDefault();
    setPwdErr('');
    if (!pwd.current)                       { setPwdErr(t('prof.pwd_missing')); return; }
    if (pwd.newPwd.length < 6)              { setPwdErr(t('prof.pwd_too_short')); return; }
    if (pwd.newPwd !== pwd.confirm)         { setPwdErr(t('prof.pwd_mismatch')); return; }
    if (window.showToast) window.showToast(t('prof.pwd_change_ok'), 'success');
    setPwd({ current: '', newPwd: '', confirm: '' });
  };

  const removeAvatar = () => {
    setAvatarUrl(null);
    try { localStorage.removeItem(AVATAR_KEY(username)); } catch (_) {}
    window.dispatchEvent(new CustomEvent('wqis:profile-updated'));
    if (window.showToast) window.showToast(t('prof.remove_ok'), 'info');
  };

  const META_ROWS = [
    { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 21V9h6v12', label: t('prof.dept_label'), val: profile.department },
    { icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', label: t('prof.team_label'), val: profile.team },
    { icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 5.18 2 2 0 015.08 3h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L9.09 10.1a16 16 0 006.86 6.86l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 18v.92z', label: t('prof.phone_label'), val: profile.phone },
    { icon: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01', label: t('prof.pos_label'), val: profile.position },
  ];

  const SESSIONS_DATA = [
    { device: 'Chrome · Windows 11', icon: 'desktop', location: 'Bangkok, TH',   time: t('prof.now_session'), current: true  },
  ];

  const DeviceIcon = ({ type }) => type === 'mobile'
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;

  const EyeToggle = ({ show, onToggle }) => (
    <button type="button" className="profile-eye-btn" onClick={onToggle} tabIndex={-1}>
      {show
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l18 18M10.6 10.6A3 3 0 0013.4 13.4M1 12s4-7 11-7c1.9 0 3.6.5 5.1 1.4M20.9 12.8C19.7 15.2 17 18 12 18c-1.5 0-2.9-.3-4.1-.8"/></svg>
      }
    </button>
  );

  return (
    <div>
      {/* Page header */}
      <div className="page-hd">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {onBack && (
            <button className="btn btn-ghost btn-icon" onClick={onBack} title={t('btn.back')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}
          <div>
            {t('prof.title')}</div>
            {t('prof.sub')}</div>
          </div>
        </div>
      </div>

      <div className="profile-layout">

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Identity card */}
          <div className="card" style={{ overflow: 'hidden' }}>
            {/* Banner */}
            <div className="profile-banner">
              <div className="profile-banner-pattern"/>
            </div>

            {/* Avatar + name (overlapping banner) */}
            <div className="profile-card-identity">
              <ProfileAvatar
                avatarUrl={avatarUrl}
                initials={initials}
                size={88}
                onUpload={handleAvatarUpload}
              />
              {avatarUrl && (
                <button className="profile-remove-av" onClick={removeAvatar} title={t('prof.remove_photo')}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <div className="profile-name">
                  {profile.displayName || profile.fullName || username}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
                  <span className={`badge ${roleBadge}`}>{roleLabel}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 5 }}>
                  {profile.email}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--border-lt)', margin: '0 20px' }}/>

            {/* Meta rows */}
            <div className="profile-meta">
              {META_ROWS.map((item, i) => (
                <div key={i} className="profile-meta-row">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon.split('M').filter(Boolean).map((seg, j) => (
                      <path key={j} d={`M${seg}`}/>
                    ))}
                  </svg>
                  <span className="profile-meta-label">{item.label}</span>
                  <span className="profile-meta-value">{item.val || '—'}</span>
                </div>
              ))}
              {profile.bio && (
                <div style={{ padding: '10px 0', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55 }}>
                  {profile.bio}
                </div>
              )}
            </div>
          </div>

          {/* Stats card */}
          <div className="card">
            <div className="card-header" style={{ padding: '12px 16px 10px' }}>
              <div className="card-title" style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)' }}>
                {t('prof.usage_stats')}
              </div>
            </div>
            <div style={{ padding: '8px 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <StatItem
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4.5-4.5"/></svg>}
                label={t("prof.stat_insp_lbl")} value="142" unit={" "+t("lbl.items")}
                color="var(--navy)"
              />
              <StatItem
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
                label="Pass Rate" value="97.8" unit="%"
                color="var(--green)"
              />
              <StatItem
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                label={t("prof.stat_days_lbl")} value="86" unit={" "+t("lbl.duration")}
                color="var(--teal)"
              />
              <StatItem
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                label="Fail Review" value="3" unit={" "+t("lbl.items")}
                color="var(--orange)"
              />
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div className="tabs mb-0" style={{ borderBottom: '1px solid var(--border-lt)', paddingBottom: 0, marginBottom: 16 }}>
            {[['info', t('prof.info_tab')],['pwd', t('prof.security_tab')],['sessions','Sessions']].map(([key, lbl]) => (
              <button key={key} className={`tab-btn${tab === key ? ' active' : ''}`} onClick={() => switchTab(key)}>
                {lbl}
              </button>
            ))}
          </div>

          {/* ── Info tab ── */}
          {tab === 'info' && (
            <div className="card profile-tab-panel">
              <div className="card-header">
                <div>
                  <div className="card-title">{t('prof.info_tab')}</div>
                  <div className="card-subtitle">{t('prof.edit_sub2')}</div>
                </div>
                {/* Auto-save status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {saveStatus === 'saving' && (
                    <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 10, height: 10, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}/>
                      {t('prof.saving')}
                    </span>
                  )}
                  {saveStatus === 'saved' && (
                    <span style={{ fontSize: 12, color: 'var(--ok)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      {t('btn.saved')}
                    </span>
                  )}
                  <button type="button" className="btn btn-primary btn-sm" onClick={saveNow}
                          style={{ fontSize: 12, padding: '4px 12px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    {t('btn.save')}
                  </button>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={saveNow} autoComplete="off">
                  <div className="form-row form-row-2">
                    <div className="form-group">
                      <label className="form-label">{t('prof.full_name')} <span className="form-required">*</span></label>
                      <input className="form-control" value={profile.fullName}
                             onChange={e => setP('fullName', e.target.value)} placeholder={t('prof.fullname_ph')} required/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('prof.display_name')}</label>
                      <input className="form-control" value={profile.displayName}
                             onChange={e => setP('displayName', e.target.value)} placeholder="Display Name"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('prof.email')} <span className="form-required">*</span></label>
                    <input className="form-control" type="email" value={profile.email}
                           onChange={e => setP('email', e.target.value)} placeholder="email@pro3s.com" required/>
                  </div>
                  <div className="form-row form-row-2">
                    <div className="form-group">
                      <label className="form-label">{t('prof.phone')}</label>
                      <input className="form-control" value={profile.phone}
                             onChange={e => setP('phone', e.target.value)} placeholder="+66 XX XXX XXXX"/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('prof.position')}</label>
                      <input className="form-control" value={profile.position}
                             onChange={e => setP('position', e.target.value)} placeholder={t('prof.position_ph')}/>
                    </div>
                  </div>
                  <div className="form-row form-row-2">
                    <div className="form-group">
                      <label className="form-label">{t('prof.department')}</label>
                      <input className="form-control" value={profile.department}
                             onChange={e => setP('department', e.target.value)} placeholder={t('prof.dept_ph')}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('lbl.team')}</label>
                      <input className="form-control" value={profile.team}
                             onChange={e => setP('team', e.target.value)} placeholder={t('prof.team_ph')}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('prof.bio')}</label>
                    <textarea className="form-control" rows="2" value={profile.bio}
                              onChange={e => setP('bio', e.target.value)}
                              placeholder={t('prof.bio_ph')}/>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                    <button type="button" className="btn btn-ghost btn-sm"
                            onClick={() => { setProfile(loadSavedProfile(username, session)); setSaveStatus('idle'); }}>
                      {t('prof.reset')}
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      {t('prof.save_now')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── Password tab ── */}
          {tab === 'pwd' && (
            <div className="card profile-tab-panel">
              <div className="card-header">
                <div>
                  <div className="card-title">{t('prof.change_pwd')}</div>
                  <div className="card-subtitle">{t('prof.pwd_tab_sub')}</div>
                </div>
              </div>
              <div className="card-body">
                {pwdErr && (
                  <div className="alert alert-error mb-16" style={{ fontSize: 13 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {pwdErr}
                  </div>
                )}
                <form onSubmit={savePwd}>
                  {[
                    { key: 'current', label: t('prof.pwd_old_lbl'), ph: t('prof.old_pwd') },
                    { key: 'newPwd',  label: t('prof.pwd_new_lbl'), ph: t('prof.new_pwd_ph') },
                    { key: 'confirm', label: t('prof.pwd_confirm_lbl'), ph: t('prof.pwd_confirm_ph') },
                  ].map(({ key, label, ph }) => (
                    <div key={key} className="form-group">
                      <label className="form-label">{label}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="form-control"
                          type={showPwd[key] ? 'text' : 'password'}
                          value={pwd[key]}
                          onChange={e => setPw(key, e.target.value)}
                          placeholder={ph}
                          style={{ paddingRight: 38 }}
                        />
                        <EyeToggle show={showPwd[key]} onToggle={() => toggleShow(key)}/>
                      </div>
                      {key === 'newPwd' && pwd.newPwd && <PwdStrength pwd={pwd.newPwd}/>}
                      {key === 'confirm' && pwd.confirm && pwd.newPwd !== pwd.confirm && (
                        <div className="form-error">{t('prof.pwd_mismatch_inline')}</div>
                      )}
                    </div>
                  ))}
                  <div className="alert alert-info mb-16" style={{ fontSize: 12.5 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12.01" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>
                    {t('prof.demo_mode')}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary"
                            disabled={!pwd.current || !pwd.newPwd || pwd.newPwd !== pwd.confirm}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0110 0v3"/></svg>
                      {t('prof.change_pwd')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── Sessions tab ── */}
          {tab === 'sessions' && (
            <div className="card profile-tab-panel">
              <div className="card-header">
                <div>
                  <div className="card-title">{t('prof.sessions_title')}</div>
                  <div className="card-subtitle">{t('prof.sessions_sub2')}</div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}
                        onClick={() => window.showToast && window.showToast(t('prof.revoke_all') + ' Session', 'info')}>
                  {t('prof.revoke_all_btn')}
                </button>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {SESSIONS_DATA.map((s, i) => (
                  <div key={i} className="profile-session-row"
                       style={{ borderBottom: i < SESSIONS_DATA.length - 1 ? '1px solid var(--border-lt)' : 'none' }}>
                    <div className="profile-session-icon">
                      <DeviceIcon type={s.icon}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>{s.device}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                        {s.location} &nbsp;·&nbsp; {s.time}
                      </div>
                    </div>
                    {s.current
                      ? <span className="badge badge-teal">{t('prof.current_badge')}</span>
                      : <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', flexShrink: 0 }}
                                onClick={() => window.showToast && window.showToast(`${t('prof.revoke')} Session: ${s.device}`, 'info')}>
                          {t('prof.revoke_btn')}
                        </button>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
