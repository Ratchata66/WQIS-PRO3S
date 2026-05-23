/* global React, window */

const ROLES = ['QA Manager', 'QA Engineer', 'Inspector', 'Client View', 'Welder', 'Auditor (R/O)'];

const USERS_INIT = [
  { id: 1, name: 'Manop Kosolwong',   initials: 'MK', email: 'manop.k@pro3s.co.th',   role: 'QA Manager',    proj: 'All',    tfa: true,  last: 'now',  act: 'active' },
  { id: 2, name: 'Wirot Chanthorn',   initials: 'WC', email: 'wirot.c@pro3s.co.th',   role: 'QA Engineer',   proj: '8',      tfa: true,  last: '4m',   act: 'active' },
  { id: 3, name: 'Niran Kosolwat',    initials: 'NK', email: 'niran.k@pro3s.co.th',   role: 'Inspector',     proj: '6',      tfa: false, last: '22m',  act: 'active' },
  { id: 4, name: 'Boonmee Saengtho.', initials: 'BS', email: 'boonmee.s@pro3s.co.th', role: 'Inspector',     proj: '4',      tfa: true,  last: '1h',   act: 'active' },
  { id: 5, name: 'Client · Synova',   initials: 'CS', email: 'qa@synova.com',          role: 'Client View',   proj: 'SYN-L3', tfa: true,  last: '12h',  act: 'active' },
  { id: 6, name: 'Apinya R.',         initials: 'AR', email: 'apinya.r@pro3s.co.th',  role: 'Welder',        proj: '3',      tfa: false, last: '3d',   act: 'active' },
  { id: 7, name: 'Audit · External',  initials: 'AE', email: 'audit@bvqi.com',         role: 'Auditor (R/O)', proj: 'Q2',     tfa: true,  last: '20d',  act: 'paused' },
];

const TEAMS = [
  { id: 1, name: 'Team Alpha',  lead: 'Somchai P.',  process: 'GTAW',      members: 4, projects: ['SYN-L3', 'TPA-CIP'] },
  { id: 2, name: 'Team Beta',   lead: 'Wirot C.',    process: 'GMAW/FCAW', members: 3, projects: ['RB25-P91'] },
  { id: 3, name: 'Team Gamma',  lead: 'Niran K.',    process: 'SMAW',      members: 5, projects: ['SYN-L3'] },
  { id: 4, name: 'Inspection',  lead: 'Manop K.',    process: 'QA/QC',     members: 2, projects: ['All'] },
];

// ── initials from name ────────────────────────────────────────────────────────
const toInitials = name =>
  name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();

// ── Edit User Modal ───────────────────────────────────────────────────────────
const EditUserModal = ({ user, onSave, onClose }) => {
  const [form, setForm] = React.useState({ ...user });
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = e => {
    e.preventDefault();
    const trimmed = { ...form, name: form.name.trim(), email: form.email.trim(), proj: form.proj.trim() };
    if (!trimmed.name || !trimmed.email) return;
    trimmed.initials = toInitials(trimmed.name);
    onSave(trimmed);
  };

  // Close on backdrop click
  const handleBackdrop = e => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        style={{
          background: 'var(--surface)', borderRadius: 14,
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          width: '100%', maxWidth: 480,
          display: 'flex', flexDirection: 'column',
          maxHeight: '90vh', overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '18px 20px 16px', borderBottom: '1px solid var(--border-lt)',
        }}>
          <div className="av av-sm">{form.initials || toInitials(form.name || 'U')}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>แก้ไขผู้ใช้</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 1 }}>{user.email}</div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSave} style={{ overflowY: 'auto', padding: '18px 20px' }}>
          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">ชื่อ-นามสกุล <span className="form-required">*</span></label>
              <input className="form-control" value={form.name}
                     onChange={e => set('name', e.target.value)} placeholder="ชื่อ นามสกุล" required/>
            </div>
            <div className="form-group">
              <label className="form-label">Email <span className="form-required">*</span></label>
              <input className="form-control" type="email" value={form.email}
                     onChange={e => set('email', e.target.value)} placeholder="user@pro3s.co.th" required/>
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">สิทธิ์การใช้งาน</label>
              <select className="form-control" value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">โปรเจค</label>
              <input className="form-control" value={form.proj}
                     onChange={e => set('proj', e.target.value)} placeholder="All, SYN-L3, …"/>
            </div>
          </div>

          <div className="form-row form-row-2" style={{ alignItems: 'flex-start' }}>
            {/* Status toggle */}
            <div className="form-group">
              <label className="form-label">สถานะบัญชี</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {['active', 'paused'].map(s => (
                  <button key={s} type="button"
                    onClick={() => set('act', s)}
                    className={`btn btn-sm ${form.act === s ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {s === 'active' ? 'Active' : 'Paused'}
                  </button>
                ))}
              </div>
            </div>

            {/* 2FA toggle */}
            <div className="form-group">
              <label className="form-label">Two-Factor Auth (2FA)</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {[true, false].map(v => (
                  <button key={String(v)} type="button"
                    onClick={() => set('tfa', v)}
                    className={`btn btn-sm ${form.tfa === v ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {v ? 'เปิด' : 'ปิด'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div style={{
            marginTop: 8, padding: '12px 14px', borderRadius: 8,
            border: '1px solid var(--border-lt)', background: 'var(--surface-2)',
          }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Danger Zone
            </div>
            {confirmDelete
              ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-2)', flex: 1 }}>ยืนยันการลบผู้ใช้นี้?</span>
                  <button type="button" className="btn btn-sm" style={{ background: 'var(--red)', color: '#fff', border: 'none' }}
                          onClick={() => { onSave(null); }}>
                    ลบถาวร
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>
                    ยกเลิก
                  </button>
                </div>
              ) : (
                <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}
                        onClick={() => setConfirmDelete(true)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                  ลบผู้ใช้
                </button>
              )
            }
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="btn btn-primary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main screen ───────────────────────────────────────────────────────────────
// ── Persist users to localStorage ───────────────────────────────────────────
const USERS_KEY = 'wqis-users';
const loadUsers = () => {
  try { const d = localStorage.getItem(USERS_KEY); return d ? JSON.parse(d) : USERS_INIT; } catch(_) { return USERS_INIT; }
};
const saveUsers = u => { try { localStorage.setItem(USERS_KEY, JSON.stringify(u)); } catch(_) {} };

// ── Main screen ───────────────────────────────────────────────────────────────
const UsersTeamsScreen = ({ lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const [tab,       setTab]      = React.useState('users');
  const [users,     setUsers]    = React.useState(() => loadUsers());
  const [editUser,  setEditUser] = React.useState(null);
  const [savedBadge,setSavedBadge] = React.useState(false);
  const mountedU    = React.useRef(false);

  // Auto-save users whenever list changes
  React.useEffect(() => {
    if (!mountedU.current) { mountedU.current = true; return; }
    saveUsers(users);
    setSavedBadge(true);
    const t2 = setTimeout(() => setSavedBadge(false), 2500);
    return () => clearTimeout(t2);
  }, [users]);

  const activeCount = users.filter(u => u.act === 'active').length;

  const handleSave = updated => {
    if (updated === null) {
      setUsers(prev => prev.filter(u => u.id !== editUser.id));
      if (window.showToast) window.showToast('ลบผู้ใช้แล้ว', 'info');
    } else {
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      if (window.showToast) window.showToast('บันทึกข้อมูลผู้ใช้สำเร็จ', 'success');
    }
    setEditUser(null);
  };

  return (
    <div>
      <div className="page-hd">
        <div>
          <div className="page-title">{t('users.title')}</div>
          <div className="page-sub">{t('users.sub')} · {users.length} {t('col.user').toLowerCase()} · {activeCount} {t('users.online')}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {savedBadge && (
            <span style={{fontSize:12,color:'var(--ok)',display:'flex',alignItems:'center',gap:4,fontWeight:600}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              บันทึกแล้ว
            </span>
          )}
          {tab === 'users' && (
            <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              {t('btn.invite_user')}
            </button>
          )}
          {tab === 'teams' && (
            <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              {t('btn.create_team')}
            </button>
          )}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="tabs mb-24" style={{ gap: 4 }}>
        {[['users', t('users.users_tab')], ['teams', t('users.teams_tab')]].map(([id, lbl]) => (
          <button key={id} className={`tab-btn${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ── Users tab ── */}
      {tab === 'users' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t('users.all_users')}</div>
              <div className="card-subtitle">{users.length} accounts · {activeCount} active</div>
            </div>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>{t('col.user')}</th>
                  <th>Email</th>
                  <th>{t('col.permissions')}</th>
                  <th>{t('users.tab_proj')}</th>
                  <th style={{ textAlign: 'center' }}>{t('col.2fa')}</th>
                  <th>{t('col.last_login')}</th>
                  <th>{t('col.status')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="av av-sm">{u.initials}</div>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</span>
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: 11.5, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
                        {u.email}
                      </code>
                    </td>
                    <td>
                      <span className="badge badge-navy" style={{ fontSize: 10 }}>{u.role}</span>
                    </td>
                    <td className="text-sm text-muted">{u.proj}</td>
                    <td style={{ textAlign: 'center' }}>
                      {u.tfa
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.6L2.1 18a2 2 0 001.7 3h16.4a2 2 0 001.7-3L13.7 3.6a2 2 0 00-3.4 0z"/></svg>
                      }
                    </td>
                    <td className="text-sm text-muted">{u.last}</td>
                    <td>
                      <span className={`badge badge-${u.act === 'active' ? 'success' : 'gray'}`}>
                        {u.act === 'active' ? t('status.active') : t('status.paused')}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm btn-icon"
                        title="แก้ไขผู้ใช้"
                        onClick={() => setEditUser(u)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Teams tab ── */}
      {tab === 'teams' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {TEAMS.map(team => (
            <div key={team.id} className="card">
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: 'var(--navy-soft)', border: '1px solid var(--navy-mid)',
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>{team.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)', marginTop: 2 }}>
                      {t('users.team_lead')}: {team.lead}
                    </div>
                  </div>
                  <span className="badge badge-gray">{team.members} {t('users.team_members').toLowerCase()}</span>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>
                  {t('users.team_process')}: <strong style={{ color: 'var(--text-1)' }}>{team.process}</strong>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {team.projects.map(p => (
                    <span key={p} className="badge badge-teal" style={{ fontSize: 10.5 }}>{p}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    {t('users.manage')}
                  </button>
                  <button className="btn btn-ghost btn-sm btn-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Edit User Modal ── */}
      {editUser && (
        <EditUserModal
          user={editUser}
          onSave={handleSave}
          onClose={() => setEditUser(null)}
        />
      )}
    </div>
  );
};

window.UsersTeamsScreen = UsersTeamsScreen;
