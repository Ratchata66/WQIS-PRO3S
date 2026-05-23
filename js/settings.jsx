/* global React, window */

const SettingsScreen = ({ settings, setSettings, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const [saveStatus, setSaveStatus] = React.useState('idle'); // 'idle'|'saving'|'saved'
  const saveDebounce = React.useRef(null);
  const mountedRef   = React.useRef(false);

  // Auto-save whenever settings change
  React.useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    setSaveStatus('saving');
    clearTimeout(saveDebounce.current);
    saveDebounce.current = setTimeout(() => {
      try { localStorage.setItem('wqis-settings', JSON.stringify(settings)); } catch(_) {}
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
    return () => clearTimeout(saveDebounce.current);
  }, [settings]);

  const set = (path, value) => {
    setSettings(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const saveNow = () => {
    clearTimeout(saveDebounce.current);
    try { localStorage.setItem('wqis-settings', JSON.stringify(settings)); } catch(_) {}
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast(t('set.saved_toast'), 'success');
    }
  };

  const ToggleRow = ({ label, desc, checked, onChange }) => (
    <div className="toggle-row">
      <div className="toggle-row-info">
        <div className="toggle-row-label">{label}</div>
        {desc && <div className="toggle-row-desc">{desc}</div>}
      </div>
      <label className="toggle-sw">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}/>
        <span className="toggle-track"/>
      </label>
    </div>
  );

  const SectionHd = ({ icon, title }) => (
    <div className="settings-section-hd">
      {icon}
      {title}
    </div>
  );

  return (
    <div style={{maxWidth:760,margin:'0 auto'}}>
      <div className="page-hd">
        <div>
          <div className="page-title">{t('set.title')}</div>
          <div className="page-sub">{t('set.sub')}</div>
        </div>
        <div className="page-hd-right" style={{gap:10}}>
          {saveStatus === 'saving' && (
            <span style={{fontSize:12,color:'var(--text-3)',display:'flex',alignItems:'center',gap:5}}>
              <div style={{width:10,height:10,border:'2px solid var(--border)',borderTopColor:'var(--accent)',borderRadius:'50%',animation:'spin 0.6s linear infinite'}}/>
              {t('prof.saving')}
            </span>
          )}
          {saveStatus === 'saved' && (
            <span style={{fontSize:12,color:'var(--ok)',display:'flex',alignItems:'center',gap:4,fontWeight:600}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              {t('btn.saved')}
            </span>
          )}
          <button className="btn btn-primary" onClick={saveNow}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {t('btn.save_settings')}
          </button>
        </div>
      </div>

      {/* ── General ── */}
      <div className="card mb-20">
        <div className="card-body">
          <div className="settings-section">
            <SectionHd
              title={t('set.general')}
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>}
            />
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">{t('set.sys_name')}</label>
                <input className="form-control" value={settings.systemName}
                       onChange={e=>set('systemName',e.target.value)}/>
              </div>
              <div className="form-group">
                <label className="form-label">{t('set.language')}</label>
                <select className="form-control" value={settings.language}
                        onChange={e=>{ set('language',e.target.value); if(window.setLang) window.setLang(e.target.value.toLowerCase()); }}>
                  <option value="TH">ภาษาไทย (TH)</option>
                  <option value="EN">English (EN)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('set.logo')}</label>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <img src="PRO3S_Logo_001.png" alt="Logo"
                     style={{width:44,height:44,objectFit:'contain',border:'1px solid var(--border-lt)',borderRadius:'var(--r)',padding:4,background:'var(--bg)'}}/>
                <button className="btn btn-ghost btn-sm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {t('set.change_logo')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notifications ── */}
      <div className="card mb-20">
        <div className="card-body">
          <div className="settings-section">
            <SectionHd
              title={t('set.notifications')}
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/></svg>}
            />
            <ToggleRow
              label={t('set.email_notif')}
              desc={t('set.email_desc')}
              checked={settings.notifications.email}
              onChange={v=>set('notifications.email',v)}
            />
            <ToggleRow
              label={t('set.inapp_notif')}
              desc={t('set.inapp_desc')}
              checked={settings.notifications.inApp}
              onChange={v=>set('notifications.inApp',v)}
            />
            <ToggleRow
              label={t('set.daily_report')}
              desc={t('set.daily_desc')}
              checked={settings.notifications.dailyReport}
              onChange={v=>set('notifications.dailyReport',v)}
            />
            <ToggleRow
              label={t('set.fail_alert')}
              desc={t('set.fail_desc')}
              checked={settings.notifications.failAlert}
              onChange={v=>set('notifications.failAlert',v)}
            />
          </div>
        </div>
      </div>

      {/* ── AI Settings ── */}
      <div className="card mb-20">
        <div className="card-body">
          <div className="settings-section">
            <SectionHd
              title={t('set.ai')}
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg>}
            />

            <div className="form-group">
              <label className="form-label">{t('set.confidence')}</label>
              <div className="range-wrap">
                <input type="range" min="50" max="99" step="1"
                       value={settings.ai.confidenceThreshold}
                       onChange={e=>set('ai.confidenceThreshold',parseInt(e.target.value))}/>
                <div className="range-val">{settings.ai.confidenceThreshold}%</div>
              </div>
              <div className="form-hint">{t('set.conf_hint')}</div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('set.color_tol')}</label>
              <div className="range-wrap">
                <input type="range" min="1" max="30" step="1"
                       value={settings.ai.colorTolerance}
                       onChange={e=>set('ai.colorTolerance',parseInt(e.target.value))}/>
                <div className="range-val">{settings.ai.colorTolerance}</div>
              </div>
              <div className="form-hint">{t('set.color_hint')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Backup ── */}
      <div className="card mb-20">
        <div className="card-body">
          <div className="settings-section">
            <SectionHd
              title={t('set.backup')}
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>}
            />
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              <button className="btn btn-secondary"
                      onClick={()=>{ const d=JSON.stringify(WQIS_DATA,null,2); const b=new Blob([d],{type:'application/json'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='wqis-backup.json'; a.click(); URL.revokeObjectURL(u); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {t('btn.export')}
              </button>
              <button className="btn btn-ghost">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {t('btn.import')}
              </button>
            </div>
            <div className="form-hint mt-8">{t('set.backup_hint')}</div>
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <div className="card">
        <div className="card-body">
          <div className="settings-section" style={{marginBottom:0}}>
            <SectionHd
              title={t('set.about')}
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>}
            />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px 24px'}}>
              {[
                {label:t('set.sys_name_lbl'),  value:'PRO3S WQIS'},
                {label:t('set.version_lbl'),   value:'v1.0.0'},
                {label:t('set.build_lbl'),     value:'2026-05-15'},
                {label:t('set.platform_lbl'),  value:'Netlify · Node 18'},
                {label:t('set.ai_engine_lbl'), value:'Cloud-V2 (Roboflow)'},
                {label:t('set.license_lbl'),   value:'PRO3S Industrial QA/QC'},
              ].map((item,i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border-lt)',fontSize:13}}>
                  <span style={{color:'var(--text-3)'}}>{item.label}</span>
                  <span style={{fontWeight:600,color:'var(--text-1)'}}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.SettingsScreen = SettingsScreen;
