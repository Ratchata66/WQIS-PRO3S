/* global React, window, ModalPortal */

// ── Add / Edit Modal ──────────────────────────────────────────
const ProjectModal = ({ project, onSave, onClose, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const isEdit = !!project;
  const [form, setForm] = React.useState(project || {
    name:'', client:'', startDate:'', endDate:'', totalWelds:'', status:'active', note:'',
  });

  const set = (k, v) => setForm(f => ({...f, [k]:v}));
  const valid = form.name.trim() && form.startDate && form.endDate && form.totalWelds;

  const handleSubmit = e => {
    e.preventDefault();
    if (!valid) return;
    onSave({
      ...form,
      totalWelds: parseInt(form.totalWelds)||0,
      inspected: isEdit ? (project.inspected||0) : 0,
      id: isEdit ? project.id : `PRJ-${String(Date.now()).slice(-4)}`,
      code: isEdit ? project.code : form.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,8),
      staff: isEdit ? project.staff : [],
    });
    onClose();
  };

  return (
    <ModalPortal>
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isEdit ? t('proj.edit_title') : t('proj.add_title')}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">{t('proj.name')} <span className="form-required">*</span></label>
                <input className="form-control" value={form.name} onChange={e=>set('name',e.target.value)}
                       placeholder="เช่น TPA Chonburi Line 4" required/>
              </div>
              <div className="form-group">
                <label className="form-label">{t('proj.client')}</label>
                <input className="form-control" value={form.client} onChange={e=>set('client',e.target.value)}
                       placeholder="ชื่อลูกค้า"/>
              </div>
            </div>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">{t('proj.start_date')} <span className="form-required">*</span></label>
                <input className="form-control" type="date" value={form.startDate} onChange={e=>set('startDate',e.target.value)} required/>
              </div>
              <div className="form-group">
                <label className="form-label">{t('proj.end_date')} <span className="form-required">*</span></label>
                <input className="form-control" type="date" value={form.endDate} onChange={e=>set('endDate',e.target.value)} required/>
              </div>
            </div>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">{t('proj.total_welds')} <span className="form-required">*</span></label>
                <input className="form-control" type="number" min="1" value={form.totalWelds}
                       onChange={e=>set('totalWelds',e.target.value)} placeholder="0" required/>
              </div>
              <div className="form-group">
                <label className="form-label">{t('proj.status')}</label>
                <select className="form-control" value={form.status} onChange={e=>set('status',e.target.value)}>
                  <option value="planning">{t('status.planning')}</option>
                  <option value="active">{t('status.active')}</option>
                  <option value="completed">{t('status.completed')}</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('proj.notes')}</label>
              <textarea className="form-control" value={form.note} onChange={e=>set('note',e.target.value)}
                        placeholder={t('proj.notes_ph')} rows="3"/>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>{t('btn.cancel')}</button>
            <button type="submit" className="btn btn-primary" disabled={!valid}>
              {isEdit ? t('proj.save_changes') : t('btn.add_project')}
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
};

// ── Staff Modal ───────────────────────────────────────────────
const StaffModal = ({ staff, onSave, onClose }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const isEdit = !!staff;
  const [form, setForm] = React.useState(staff || { name:'', position:'QC Inspector', team:'', cert:'' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <ModalPortal>
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:420}}>
        <div className="modal-header">
          <div className="modal-title">{isEdit ? t('proj.edit_staff') : t('proj.add_staff')}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{t('lbl.name')} <span className="form-required">*</span></label>
            <input className="form-control" value={form.name} onChange={e=>set('name',e.target.value)} placeholder={t('lbl.name')}/>
          </div>
          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">{t('lbl.position')}</label>
              <select className="form-control" value={form.position} onChange={e=>set('position',e.target.value)}>
                <option>QC Inspector</option>
                <option>Engineer</option>
                <option>ช่างเชื่อม</option>
                <option>Supervisor</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('lbl.team')}</label>
              <input className="form-control" value={form.team} onChange={e=>set('team',e.target.value)} placeholder="เช่น Mechanical"/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('lbl.certificate')}</label>
            <input className="form-control" value={form.cert} onChange={e=>set('cert',e.target.value)} placeholder="เช่น ISO 9606-1"/>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>{t('btn.cancel')}</button>
          <button className="btn btn-primary" disabled={!form.name.trim()}
                  onClick={()=>{ onSave({...form,id:isEdit?staff.id:Date.now()}); onClose(); }}>
            {isEdit ? t('btn.save') : t('proj.add_staff')}
          </button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};

// ── Delete Confirm ────────────────────────────────────────────
const DeleteConfirm = ({ label, onConfirm, onClose }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  return (
  <ModalPortal>
  <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal" style={{maxWidth:400}}>
      <div className="modal-header">
        <div className="modal-title">{t('lbl.confirm_delete')}</div>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">
        <div className="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {t('lbl.confirm_del_msg')} <strong>{label}</strong>? {t('lbl.del_warning')}
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onClose}>{t('btn.cancel')}</button>
        <button className="btn btn-danger" onClick={()=>{onConfirm();onClose();}}>{t('btn.delete')}</button>
      </div>
    </div>
  </div>
  </ModalPortal>
  );
};

// ── Project Detail Panel ──────────────────────────────────────
const ProjectDetail = ({ project, inspections, onUpdateProject }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const [activeTab, setActiveTab]  = React.useState('records');
  const [staffModal, setStaffModal]= React.useState(null); // null | 'add' | staffObj
  const [delStaff, setDelStaff]    = React.useState(null);

  const projInspections = inspections.filter(i => i.projectId === project.id);
  const pct = project.totalWelds ? Math.round(project.inspected / project.totalWelds * 100) : 0;

  const saveStaff = (staffMember) => {
    const existing = project.staff.find(s => s.id === staffMember.id);
    const newStaff = existing
      ? project.staff.map(s => s.id === staffMember.id ? staffMember : s)
      : [...project.staff, staffMember];
    onUpdateProject({ ...project, staff: newStaff });
  };

  const removeStaff = id => {
    onUpdateProject({ ...project, staff: project.staff.filter(s => s.id !== id) });
  };

  return (
    <div style={{padding:'20px 24px',background:'var(--bg)',borderTop:'1px solid var(--border-lt)'}}>
      {/* Project info bar */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
        {[
          {label: t('proj.start_date'),  value:project.startDate},
          {label: t('proj.end_date'),    value:project.endDate},
          {label: t('col.total_welds'),  value:`${project.totalWelds} ${t('lbl.welds')}`},
          {label: t('lbl.progress'),     value:`${pct}%`},
        ].map((item,i)=>(
          <div key={i} style={{background:'var(--white)',borderRadius:'var(--r)',padding:'10px 14px',border:'1px solid var(--border-lt)'}}>
            <div style={{fontSize:11,color:'var(--text-3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>
              {item.label}
            </div>
            <div style={{fontWeight:700,fontSize:15,color:'var(--navy)'}}>{item.value}</div>
          </div>
        ))}
      </div>

      {project.note && (
        <div className="alert alert-info mb-16" style={{fontSize:12.5}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          {project.note}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn${activeTab==='records'?' active':''}`} onClick={()=>setActiveTab('records')}>
          {t('proj.records_tab')} ({projInspections.length})
        </button>
        <button className={`tab-btn${activeTab==='staff'?' active':''}`} onClick={()=>setActiveTab('staff')}>
          Staff ({project.staff.length})
        </button>
      </div>

      {/* Tab: Records */}
      {activeTab === 'records' && (
        projInspections.length === 0
          ? <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              <div className="empty-state-title">{t('proj.no_records')}</div>
              <div className="empty-state-sub">{t('proj.no_records_sub')}</div>
            </div>
          : <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>#</th><th>{t('col.weld_id')}</th><th>{t('col.type')}</th><th>{t('col.welder')}</th><th>{t('col.ai_result')}</th><th>{t('col.qc_result')}</th><th>{t('col.date')}</th><th>{t('col.remarks')}</th></tr></thead>
                <tbody>
                  {projInspections.map((ins,i) => (
                    <tr key={ins.id}>
                      <td className="text-muted text-sm">{i+1}</td>
                      <td><code style={{fontSize:11.5,color:'var(--navy)'}}>{ins.weldId}</code></td>
                      <td className="text-sm">{ins.weldType}</td>
                      <td className="text-sm">{ins.welder}</td>
                      <td><span className={`badge badge-${ins.aiResult==='pass'?'success':'danger'}`} style={{fontSize:10}}>{ins.aiResult==='pass'?'PASS':'FAIL'}</span></td>
                      <td><span className={`badge badge-${ins.result==='pass'?'success':'danger'}`}>{ins.result==='pass' ? t('status.pass') : t('status.fail')}</span></td>
                      <td className="text-sm text-muted">{ins.date}</td>
                      <td className="text-sm text-muted" style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ins.comment||'—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      )}

      {/* Tab: Staff */}
      {activeTab === 'staff' && (
        <div>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
            <button className="btn btn-primary btn-sm" onClick={()=>setStaffModal('add')}>
              {t('btn.add_member')}
            </button>
          </div>
          {project.staff.length === 0
            ? <div className="empty-state">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>
                <div className="empty-state-title">{t('proj.no_staff')}</div>
              </div>
            : <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>#</th><th>{t('lbl.name')}</th><th>{t('lbl.position')}</th><th>{t('lbl.team')}</th><th>{t('lbl.certificate')}</th><th>{t('lbl.actions')}</th></tr></thead>
                  <tbody>
                    {project.staff.map((s,i) => (
                      <tr key={s.id}>
                        <td className="text-muted text-sm">{i+1}</td>
                        <td style={{fontWeight:500}}>{s.name}</td>
                        <td><span className="badge badge-navy" style={{fontSize:10.5}}>{s.position}</span></td>
                        <td className="text-sm">{s.team||'—'}</td>
                        <td className="text-sm">{s.cert||'—'}</td>
                        <td>
                          <div style={{display:'flex',gap:4}}>
                            <button className="btn btn-ghost btn-icon" title="แก้ไข" onClick={()=>setStaffModal(s)}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button className="btn btn-ghost btn-icon" title="ลบ" onClick={()=>setDelStaff(s)}
                                    style={{color:'var(--red)'}}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      )}

      {staffModal && (
        <StaffModal
          staff={staffModal !== 'add' ? staffModal : null}
          onSave={saveStaff}
          onClose={()=>setStaffModal(null)}
        />
      )}
      {delStaff && (
        <DeleteConfirm
          label={delStaff.name}
          onConfirm={()=>removeStaff(delStaff.id)}
          onClose={()=>setDelStaff(null)}
        />
      )}
    </div>
  );
};

// ── Projects Screen ───────────────────────────────────────────
const ProjectsScreen = ({ projects, setProjects, inspections, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const [modal,     setModal]     = React.useState(null); // null | 'add' | projectObj
  const [expanded,  setExpanded]  = React.useState(null); // project id
  const [delProject,setDelProject]= React.useState(null);
  const [search,    setSearch]    = React.useState('');

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    (p.client||'').toLowerCase().includes(search.toLowerCase())
  );

  const saveProject = proj => {
    setProjects(prev => {
      const exists = prev.find(p => p.id === proj.id);
      return exists ? prev.map(p => p.id === proj.id ? proj : p) : [...prev, proj];
    });
    if (typeof window !== 'undefined' && window.showToast) {
      const exists = projects.find(p => p.id === proj.id);
      window.showToast(exists ? `อัปเดตโปรเจค · ${proj.name}` : `เพิ่มโปรเจคใหม่ · ${proj.name}`, 'success');
    }
  };

  const deleteProject = id => {
    const proj = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (typeof window !== 'undefined' && window.showToast && proj) {
      window.showToast(`ลบโปรเจค · ${proj.name}`, 'info');
    }
  };

  const updateProject = proj => setProjects(prev => prev.map(p => p.id === proj.id ? proj : p));

  const STATUS_LABELS = { planning: t('status.planning'), active: t('status.active'), completed: t('status.completed') };
  const STATUS_BADGE  = { planning:'warning', active:'teal', completed:'success' };

  return (
    <div>
      <div className="page-hd">
        <div>
          <div className="page-title">{t('proj.title')}</div>
          <div className="page-sub">{t('proj.sub')}</div>
        </div>
        <div className="page-hd-right">
          <button className="btn btn-primary" onClick={()=>setModal('add')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {t('btn.add_project')}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{paddingBottom:8}}>
          <div className="search-row">
            <div className="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg>
              <input className="search-input" placeholder={t('proj.search_ph')} value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <span className="text-sm text-muted">{filtered.length} {t('lbl.projects')}</span>
          </div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width:40}}>#</th>
                <th>{t('proj.name')}</th>
                <th>{t('lbl.duration')}</th>
                <th style={{textAlign:'center'}}>{t('col.total_welds')}</th>
                <th style={{textAlign:'center'}}>{t('col.inspected')}</th>
                <th style={{textAlign:'center'}}>{t('lbl.remaining')}</th>
                <th style={{width:160}}>{t('lbl.progress')}</th>
                <th>{t('col.status')}</th>
                <th style={{textAlign:'right'}}>{t('lbl.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="9" style={{textAlign:'center',padding:'32px',color:'var(--text-3)'}}>{t('proj.not_found')}</td></tr>
              )}
              {filtered.map((p, i) => {
                const pct = p.totalWelds ? Math.round(p.inspected / p.totalWelds * 100) : 0;
                const remaining = Math.max(0, p.totalWelds - p.inspected);
                const isOpen = expanded === p.id;
                return (
                  <React.Fragment key={p.id}>
                    <tr className="tbl-clickable" onClick={()=>setExpanded(isOpen ? null : p.id)}
                        style={{background: isOpen ? 'var(--navy-soft)' : undefined}}>
                      <td className="text-sm text-muted">{i+1}</td>
                      <td>
                        <div style={{fontWeight:600,color:'var(--navy)'}}>{p.name}</div>
                        <div style={{fontSize:11.5,color:'var(--text-3)'}}>{p.code} · {p.client}</div>
                      </td>
                      <td className="text-sm">{p.startDate} — {p.endDate}</td>
                      <td style={{textAlign:'center',fontWeight:600}}>{p.totalWelds}</td>
                      <td style={{textAlign:'center',fontWeight:600,color:'var(--teal)'}}>{p.inspected}</td>
                      <td style={{textAlign:'center',fontWeight:600,color:remaining>0?'var(--orange)':'var(--green)'}}>{remaining}</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div className="progress" style={{flex:1}}>
                            <div className={`progress-bar ${p.status==='completed'?'green':p.status==='active'?'teal':'orange'}`} style={{width:`${pct}%`}}/>
                          </div>
                          <span style={{fontSize:12,fontWeight:700,color:'var(--navy)',minWidth:32,textAlign:'right'}}>{pct}%</span>
                        </div>
                      </td>
                      <td><span className={`badge badge-${STATUS_BADGE[p.status]||'gray'}`}>{STATUS_LABELS[p.status]||p.status}</span></td>
                      <td>
                        <div style={{display:'flex',gap:4,justifyContent:'flex-end'}} onClick={e=>e.stopPropagation()}>
                          <button className="btn btn-ghost btn-icon btn-sm" title="แก้ไข" onClick={()=>setModal(p)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm" title="ลบ" style={{color:'var(--red)'}} onClick={()=>setDelProject(p)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                          </button>
                          <span style={{color:'var(--text-3)',display:'flex',alignItems:'center',paddingLeft:4}}>
                            {isOpen ? '▲' : '▼'}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan="9" style={{padding:0}}>
                          <ProjectDetail project={p} inspections={inspections} onUpdateProject={updateProject}/>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <ProjectModal project={modal !== 'add' ? modal : null} onSave={saveProject} onClose={()=>setModal(null)}/>}
      {delProject && <DeleteConfirm label={delProject.name} onConfirm={()=>deleteProject(delProject.id)} onClose={()=>setDelProject(null)}/>}
    </div>
  );
};

window.ProjectsScreen = ProjectsScreen;
