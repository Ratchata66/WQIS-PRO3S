/* global React */

const InspectionsScreen = ({ inspections, projects, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const insp = inspections || [];
  const proj = projects   || [];

  const [search,  setSearch]  = React.useState('');
  const [filter,  setFilter]  = React.useState('all');
  const [page,    setPage]    = React.useState(1);
  const PAGE_SIZE = 15;

  let filtered = [...insp].reverse();
  if (filter !== 'all') filtered = filtered.filter(i => i.result === filter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(i =>
      (i.weldId    || '').toLowerCase().includes(q) ||
      (i.welder    || '').toLowerCase().includes(q) ||
      (i.projectId || '').toLowerCase().includes(q) ||
      (i.weldType  || '').toLowerCase().includes(q) ||
      (i.comment   || '').toLowerCase().includes(q)
    );
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const passCount = insp.filter(i => i.result === 'pass').length;
  const failCount = insp.filter(i => i.result === 'fail').length;

  const getProject = id => proj.find(p => p.id === id);

  return (
    <div>
      <div className="page-hd">
        <div>
          <div className="page-title">{t('insp.title')}</div>
          <div className="page-sub">{t('insp.sub')} · {insp.length} {t('lbl.items')}</div>
        </div>
        <div className="page-hd-right">
          <span className="badge badge-success">{passCount} {t('status.pass')}</span>
          <span className="badge badge-danger">{failCount} {t('status.fail')}</span>
        </div>
      </div>

      <div className="card">
        {/* ── Filters ── */}
        <div className="card-body" style={{ paddingBottom: 8 }}>
          <div className="search-row">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
              <div className="search-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>
                </svg>
                <input className="search-input" placeholder={t('insp.search_ph')}
                       value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
              </div>
              <div className="tabs" style={{ gap: 4 }}>
                {[['all', t('status.all')],['pass', t('status.pass')],['fail', t('status.fail')],['pending', t('status.pending')]].map(([v, lbl]) => (
                  <button key={v} className={`tab-btn${filter === v ? ' active' : ''}`}
                          onClick={() => { setFilter(v); setPage(1); }}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-sm text-muted">{filtered.length} {t('lbl.items')}</span>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('col.weld_id')}</th>
                <th>{t('col.project')}</th>
                <th>{t('col.weld_type')}</th>
                <th>{t('col.welder')}</th>
                <th>{t('col.ai_result')}</th>
                <th>{t('col.qc_result')}</th>
                <th>{t('col.date')}</th>
                <th>{t('col.remarks')}</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>
                    {search || filter !== 'all' ? t('lbl.not_found') : t('lbl.no_records')}
                  </td>
                </tr>
              )}
              {paged.map((ins, idx) => {
                const p = getProject(ins.projectId);
                const rowNum = (page - 1) * PAGE_SIZE + idx + 1;
                const resultAI = ins.aiResult || 'pending';
                const resultQC = ins.result   || 'pending';
                return (
                  <tr key={ins.id}>
                    <td className="text-sm text-muted">{rowNum}</td>
                    <td>
                      <code style={{ fontSize: 12, color: 'var(--navy)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                        {ins.weldId}
                      </code>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {p ? (
                        <>
                          <div style={{ fontWeight: 500 }}>{p.code}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.client}</div>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-3)' }}>{ins.projectId || '—'}</span>
                      )}
                    </td>
                    <td className="text-sm">{ins.weldType || '—'}</td>
                    <td className="text-sm">{ins.welder || '—'}</td>
                    <td>
                      <span className={`badge badge-${resultAI === 'pass' ? 'success' : resultAI === 'fail' ? 'danger' : 'gray'}`}
                            style={{ fontSize: 10 }}>
                        {resultAI === 'pass' ? t('status.pass') : resultAI === 'fail' ? t('status.fail') : t('status.pending')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${resultQC === 'pass' ? 'success' : resultQC === 'fail' ? 'danger' : 'gray'}`}>
                        {resultQC === 'pass' ? t('status.pass') : resultQC === 'fail' ? t('status.fail') : t('status.pending')}
                      </span>
                    </td>
                    <td className="text-sm text-muted">{ins.date || '—'}</td>
                    <td className="text-sm text-muted"
                        style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={ins.comment}>
                      {ins.comment || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 20px', borderTop: '1px solid var(--border-lt)' }}>
          <span className="text-sm text-muted">
            {filtered.length === 0
              ? `0 ${t('lbl.items')}`
              : `${(page-1)*PAGE_SIZE+1}–${Math.min(page*PAGE_SIZE, filtered.length)} / ${filtered.length} ${t('lbl.items')}`
            }
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-ghost btn-sm btn-icon"
                    disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (pg > totalPages) return null;
              return (
                <button key={pg}
                        className={`btn btn-sm${page === pg ? ' btn-primary' : ' btn-ghost'}`}
                        style={{ minWidth: 32, justifyContent: 'center' }}
                        onClick={() => setPage(pg)}>
                  {pg}
                </button>
              );
            })}
            <button className="btn btn-ghost btn-sm btn-icon"
                    disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

window.InspectionsScreen = InspectionsScreen;
