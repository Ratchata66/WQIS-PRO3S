/* global React */

// ── Reports Screen ────────────────────────────────────────────────────
const ReportsScreen = ({ projects, inspections, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const insp = inspections || [];
  const proj = projects   || [];

  const totalInspected = insp.length;
  const passCount = insp.filter(i => i.result === 'pass').length;
  const passRate  = totalInspected ? (passCount / totalInspected * 100).toFixed(1) : '0.0';

  const REPORT_TYPES = [
    { icon:'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3',
      title:()=>t('rpt.daily'),        en:'Daily QA/QC',         freq:`${t('rpt.auto')} · 06:00`,  color:'var(--navy)' },
    { icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      title:()=>t('rpt.weekly'),       en:'Weekly Summary',      freq:'Mon 07:00',     color:'var(--teal)' },
    { icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      title:()=>t('rpt.welder_perf'),  en:'Welder Performance',  freq:t('rpt.weekly'), color:'var(--green)' },
    { icon:'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      title:()=>t('rpt.defect_ana'),   en:'Defect Analytics',    freq:t('rpt.30d'),    color:'var(--orange)' },
  ];

  const RECENT_REPORTS = [
    { id:'DR-20260514', kind:'Daily QA/QC',      proj:'TPA-CHB-3', inspCount:48,  passRateVal:96.8, signed:'Manop K.',   date:'2026-05-14', status:'auto'   },
    { id:'WR-W19',      kind:'Weekly Summary',   proj:'All',       inspCount:284, passRateVal:97.1, signed:'Manop K.',   date:'2026-05-12', status:'signed' },
    { id:'WP-WD-014',   kind:'Welder Perform.',  proj:'—',         inspCount:128, passRateVal:98.4, signed:'AI Engine',  date:'2026-05-13', status:'signed' },
    { id:'DR-20260513', kind:'Daily QA/QC',      proj:'CPF-RYG-A', inspCount:31,  passRateVal:93.5, signed:'รอลงนาม',   date:'2026-05-13', status:'open'   },
    { id:'DR-20260512', kind:'Daily QA/QC',      proj:'BTG-NKR-1', inspCount:22,  passRateVal:100,  signed:'Manop K.',   date:'2026-05-12', status:'signed' },
  ];

  return (
    <div>
      <div className="page-hd">
        <div>
          <div className="page-title">{t('rpt.title')}</div>
          <div className="page-sub">{t('rpt.sub')}</div>
        </div>
        <div className="page-hd-right">
          <button className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t('btn.create_report')}
          </button>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid-4 mb-24">
        {[
          { label:t('rpt.this_month'),  value:'48',   sub:t('lbl.items'),         clr:'var(--navy)',   bg:'var(--navy-soft)'  },
          { label:t('rpt.auto'),        value:'32',   sub:'Auto-generated',        clr:'var(--teal)',   bg:'var(--teal-soft)'  },
          { label:t('rpt.pending_sign'),value:'3',    sub:'Pending signature',     clr:'var(--orange)', bg:'var(--orange-soft)'},
          { label:t('rpt.total_insp'),  value:totalInspected.toLocaleString(), sub:`${passRate}% pass rate`, clr:'var(--green)', bg:'var(--green-soft)' },
        ].map((k, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: k.bg }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={k.clr}
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6M9 13h6M9 17h4"/>
              </svg>
            </div>
            <div>
              <div className="stat-label">{k.label}</div>
              <div className="stat-value" style={{ color: k.clr }}>{k.value}</div>
              <div className="stat-delta">{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Report templates ── */}
      <div className="grid-4 mb-24">
        {REPORT_TYPES.map((rpt, i) => (
          <div key={i} className="card" style={{ cursor: 'pointer', borderTop: `3px solid ${rpt.color}` }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${rpt.color}18`,
                              border: `1px solid ${rpt.color}44`, display: 'grid', placeItems: 'center', color: rpt.color }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                       strokeLinecap="round" strokeLinejoin="round">
                    {rpt.icon.split('M').filter(Boolean).map((seg, j) => <path key={j} d={`M${seg}`}/>)}
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost btn-sm btn-icon" title="PDF">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <path d="M14 2v6h6"/>
                    </svg>
                  </button>
                  <button className="btn btn-ghost btn-sm btn-icon" title="Excel">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-1)' }}>{typeof rpt.title === 'function' ? rpt.title() : rpt.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>{rpt.en}</div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-lt)',
                            display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
                  <span style={{ color: rpt.color }}>●</span> {rpt.freq}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-4)' }}>PDF · XLSX</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Project progress ── */}
      <div className="card mb-24">
        <div className="card-header">
          <div className="card-title">{t('rpt.proj_progress')}</div>
          <div className="card-subtitle">{t('rpt.rate_by_proj')}</div>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {proj.filter(p => p.totalWelds > 0).map(p => {
            const pct = Math.round(p.inspected / p.totalWelds * 100);
            return (
              <div key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{p.code}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 8 }}>{p.client}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                      {p.inspected}/{p.totalWelds}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14 }}>{pct}%</span>
                  </div>
                </div>
                <div className="progress">
                  <div className={`progress-bar ${p.status === 'completed' ? 'green' : p.status === 'active' ? 'teal' : 'orange'}`}
                       style={{ width: `${pct}%` }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recent reports table ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">{t('rpt.recent')}</div>
          <div className="card-subtitle">{RECENT_REPORTS.length} {t('lbl.items')} · {t('rpt.30d')}</div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{t('col.report_id')}</th>
                <th>{t('col.type')}</th>
                <th>{t('col.project')}</th>
                <th style={{ textAlign: 'center' }}>{t('col.inspected')}</th>
                <th style={{ textAlign: 'center' }}>{t('col.pass_rate')}</th>
                <th>{t('col.signed_by')}</th>
                <th>{t('col.date')}</th>
                <th>{t('col.status')}</th>
                <th style={{ textAlign: 'right' }}>{t('col.download')}</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_REPORTS.map(r => (
                <tr key={r.id}>
                  <td>
                    <code style={{ fontSize: 12, color: 'var(--navy)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                      {r.id}
                    </code>
                  </td>
                  <td className="text-sm">{r.kind}</td>
                  <td><code style={{ fontSize: 11.5, fontFamily: 'var(--mono)' }}>{r.proj}</code></td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{r.inspCount}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: 700,
                                   color: r.passRateVal >= 95 ? 'var(--green)' : r.passRateVal >= 90 ? 'var(--orange)' : 'var(--red)' }}>
                      {r.passRateVal}%
                    </span>
                  </td>
                  <td className="text-sm">{r.signed}</td>
                  <td className="text-sm text-muted">{r.date}</td>
                  <td>
                    <span className={`badge ${r.status === 'signed' ? 'badge-success' : r.status === 'auto' ? 'badge-teal' : 'badge-danger'}`}>
                      {r.status === 'signed' ? t('status.signed') : r.status === 'auto' ? t('rpt.auto') : t('status.unsigned')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm btn-icon" title="PDF">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                          <path d="M14 2v6h6"/>
                        </svg>
                      </button>
                      <button className="btn btn-ghost btn-sm btn-icon" title="Excel">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Info Screen ───────────────────────────────────────────────────────
const InfoScreen = ({ lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  return (
  <div>
    <div className="page-hd">
      <div>
        <div className="page-title">{t('info.title')}</div>
        <div className="page-sub">{t('info.sub')}</div>
      </div>
    </div>

    <div className="grid-2 mb-24">
      {/* App info */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">{t('info.sys_info')}</div>
        </div>
        <div className="card-body">
          {[
            [t('info.sys_name'), 'PRO3S WQIS'],
            [t('info.version'),  'v1.0.0'],
            ['Build Date',  '2026-05-15'],
            ['AI Engine',   'Cloud-V2 (Roboflow YOLOv8-x)'],
            ['Accuracy',    '99.24%'],
            ['Environment', 'Production · TH-1'],
            ['Platform',    'Netlify · Static'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0',
                                   borderBottom: '1px solid var(--border-lt)', fontSize: 13 }}>
              <span style={{ color: 'var(--text-3)' }}>{k}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-1)', fontFamily: v.startsWith('v') || v.includes('.') ? 'var(--mono)' : 'inherit' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">{t('info.tech_stack')}</div>
        </div>
        <div className="card-body">
          {[
            { name:'React 18.3.1',      desc:'UI framework',             color:'var(--teal)' },
            { name:'Babel Standalone',  desc:'JSX transpiler (browser)', color:'var(--orange)' },
            { name:'Chart.js 4.4.4',    desc:'Data visualization',       color:'var(--navy)' },
            { name:'Netlify',           desc:'Hosting & serverless',      color:'var(--green)' },
            { name:'YOLOv8-x',          desc:'AI defect detection',       color:'var(--red)' },
            { name:'ISO 5817 / AWS D18.2', desc:'Welding standards',     color:'var(--text-3)' },
          ].map((tech, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0',
                                   borderBottom: '1px solid var(--border-lt)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: tech.color, flexShrink: 0 }}/>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>{tech.name}</span>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-3)' }}>{tech.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Standards */}
    <div className="card mb-24">
      <div className="card-header">
        <div className="card-title">{t('info.standards')}</div>
      </div>
      <div className="card-body">
        <div className="grid-4">
          {[
            { std:'ISO 5817',   desc:'Quality levels for imperfections',  clr:'#28a745' },
            { std:'AWS D18.2',  desc:'Stainless steel discoloration',      clr:'#fd7e14' },
            { std:'ASME IX',    desc:'Welding & brazing qualifications',   clr:'#0D7377' },
            { std:'ASME BPE',   desc:'Bioprocessing equipment 2024',       clr:'#6f42c1' },
            { std:'AWS D1.1',   desc:'Structural welding (steel)',         clr:'#1B3A6B' },
            { std:'ISO 9606-1', desc:'Welder qualification',               clr:'#17a2b8' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--r)',
                                   border: `1px solid ${s.clr}33`, background: `${s.clr}0d` }}>
              <div style={{ fontWeight: 700, color: s.clr, fontSize: 13, marginBottom: 4 }}>{s.std}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Support */}
    <div className="card">
      <div className="card-header">
        <div className="card-title">{t('info.contact')}</div>
      </div>
      <div className="card-body">
        <div className="grid-2">
          {[
            { label:'Email', value:'pro3s@pro3s.co.th', href:'mailto:pro3s@pro3s.co.th' },
            { label:'Website', value:'www.pro3s.co.th', href:'#' },
            { label:'Line Official', value:'@pro3s.qc', href:'#' },
            { label:'Tel', value:'+66 2 XXX XXXX', href:'#' },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                                   borderBottom: '1px solid var(--border-lt)', fontSize: 13 }}>
              <span style={{ color: 'var(--text-3)' }}>{c.label}</span>
              <a href={c.href} style={{ fontWeight: 600, color: 'var(--navy)', textDecoration: 'none' }}>{c.value}</a>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 'var(--r)',
                      background: 'var(--navy-soft)', fontSize: 12.5, color: 'var(--text-2)' }}>
          PRO3S WQIS v1.0.0 · Industrial QA/QC Platform · © 2026 PRO3S Co., Ltd.
          All rights reserved.
        </div>
      </div>
    </div>
  </div>
  );
};

Object.assign(window, { ReportsScreen, InfoScreen });
