/* global React, window */

const AnalyticsScreen = ({ projects, inspections, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const insp = inspections || [];
  const proj = projects || [];

  // ── Aggregate stats ──
  const totalInspected = insp.length;
  const passCount  = insp.filter(i => i.result === 'pass').length;
  const failCount  = totalInspected - passCount;
  const passRate   = totalInspected ? (passCount / totalInspected * 100).toFixed(1) : '0.0';

  // ── Pass rate by project ──
  const projBarData = proj
    .filter(p => p.status !== 'planning')
    .map(p => {
      const pi = insp.filter(i => i.projectId === p.id);
      const pp = pi.filter(i => i.result === 'pass').length;
      return { label: p.code, value: pi.length ? Math.round(pp / pi.length * 100) : 0 };
    });

  // ── Weld-type breakdown ──
  const typeMap = {};
  insp.forEach(i => {
    const wt = (i.weldType || 'Unknown').split(' ')[0];
    typeMap[wt] = (typeMap[wt] || 0) + 1;
  });
  const typeData = Object.entries(typeMap).map(([label, value]) => ({ label, value }));

  // ── Welder ranking ──
  const welderMap = {};
  insp.forEach(i => {
    if (!i.welder) return;
    if (!welderMap[i.welder]) welderMap[i.welder] = { name: i.welder, pass: 0, total: 0 };
    welderMap[i.welder].total++;
    if (i.result === 'pass') welderMap[i.welder].pass++;
  });
  const welderRanking = Object.values(welderMap)
    .map(w => ({ ...w, rate: w.total ? Math.round(w.pass / w.total * 100) : 0 }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 8);

  // ── Local Chart.js wrappers ──
  const BarChart = ({ labels, data, color = '#1B3A6B', height = 200 }) => {
    const ref = React.useRef(null);
    const ch  = React.useRef(null);
    React.useEffect(() => {
      if (!ref.current || !window.Chart) return;
      if (ch.current) ch.current.destroy();
      ch.current = new window.Chart(ref.current, {
        type: 'bar',
        data: { labels, datasets: [{ data, backgroundColor: color, borderRadius: 5, borderSkipped: false }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#6C757D', font: { size: 11 } }, max: 100 },
            x: { grid: { display: false }, ticks: { color: '#6C757D', font: { size: 11 }, maxRotation: 30 } },
          },
        },
      });
      return () => ch.current && ch.current.destroy();
    }, [JSON.stringify(labels), JSON.stringify(data), color]);
    return <div style={{ position: 'relative', height }}><canvas ref={ref}/></div>;
  };

  const BarChartRaw = ({ labels, data, color = '#1B3A6B', height = 180 }) => {
    const ref = React.useRef(null);
    const ch  = React.useRef(null);
    React.useEffect(() => {
      if (!ref.current || !window.Chart) return;
      if (ch.current) ch.current.destroy();
      ch.current = new window.Chart(ref.current, {
        type: 'bar',
        data: { labels, datasets: [{ data, backgroundColor: color, borderRadius: 5, borderSkipped: false }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#6C757D', font: { size: 11 } } },
            x: { grid: { display: false }, ticks: { color: '#6C757D', font: { size: 11 }, maxRotation: 30 } },
          },
        },
      });
      return () => ch.current && ch.current.destroy();
    }, [JSON.stringify(labels), JSON.stringify(data), color]);
    return <div style={{ position: 'relative', height }}><canvas ref={ref}/></div>;
  };

  const DonutChart = ({ labels, data, colors, height = 200 }) => {
    const ref = React.useRef(null);
    const ch  = React.useRef(null);
    React.useEffect(() => {
      if (!ref.current || !window.Chart) return;
      if (ch.current) ch.current.destroy();
      ch.current = new window.Chart(ref.current, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 4 }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          cutout: '65%',
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12, font: { size: 12 } } } },
        },
      });
      return () => ch.current && ch.current.destroy();
    }, [JSON.stringify(data)]);
    return <div style={{ position: 'relative', height }}><canvas ref={ref}/></div>;
  };

  const activeProjects = proj.filter(p => p.status === 'active').length;

  return (
    <div>
      <div className="page-hd">
        <div>
          <div className="page-title">{t('ana.title')}</div>
          <div className="page-sub">{t('ana.sub')}</div>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid-4 mb-24">
        {[
          { label: t('ana.total_insp'), value:totalInspected, sub: t('lbl.welds'),
            bg:'var(--navy-soft)', clr:'var(--navy)',
            icon:'M3 3v18h18M7 16l4-8 4 4 3-5' },
          { label: t('ana.pass_std'), value:passCount, sub:`${passRate}% ${t('dash.pass_rate').toLowerCase()}`,
            bg:'var(--green-soft)', clr:'var(--green)',
            icon:'M20 6L9 17l-5-5' },
          { label: t('ana.fail'), value:failCount, sub: t('ana.need_fix'),
            bg:'var(--red-soft)', clr:'var(--red)',
            icon:'M18 6L6 18M6 6l12 12' },
          { label: t('ana.active_proj'), value:activeProjects, sub: t('status.active'),
            bg:'var(--teal-soft)', clr:'var(--teal)',
            icon:'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 11h18' },
        ].map((kpi, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: kpi.bg }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={kpi.clr}
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {kpi.icon.split('M').filter(Boolean).map((seg, j) => (
                  <path key={j} d={`M${seg}`}/>
                ))}
              </svg>
            </div>
            <div>
              <div className="stat-label">{kpi.label}</div>
              <div className="stat-value" style={{ color: kpi.clr }}>{kpi.value}</div>
              <div className="stat-delta">{kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row 1 ── */}
      <div className="grid-2 mb-24">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t('ana.pass_by_proj')}</div>
              <div className="card-subtitle">{t('ana.pass_by_proj_sub')}</div>
            </div>
          </div>
          <div className="card-body">
            {projBarData.length > 0
              ? <BarChart labels={projBarData.map(d => d.label)} data={projBarData.map(d => d.value)}
                          color="#0D7377" height={200}/>
              : <div className="empty-state" style={{ padding: '32px 0' }}>
                  <div className="empty-state-title">{t('lbl.no_data')}</div>
                </div>
            }
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">{t('ana.pass_fail_ratio')}</div>
          </div>
          <div className="card-body">
            <DonutChart
              labels={[`${t('status.pass')} (${passCount})`, `${t('status.fail')} (${failCount})`]}
              data={[passCount || 1, failCount]}
              colors={['#28a745', '#dc3545']}
              height={200}
            />
          </div>
        </div>
      </div>

      {/* ── Charts row 2 ── */}
      <div className="grid-2 mb-24">
        <div className="card">
          <div className="card-header">
            <div className="card-title">{t('ana.weld_types')}</div>
          </div>
          <div className="card-body">
            {typeData.length > 0
              ? <BarChartRaw labels={typeData.map(d => d.label)} data={typeData.map(d => d.value)}
                             color="#1B3A6B" height={180}/>
              : <div className="empty-state" style={{ padding: '24px 0' }}>
                  <div className="empty-state-title">{t('lbl.no_data')}</div>
                </div>
            }
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t('ana.welder_rank')}</div>
              <div className="card-subtitle">{t('ana.rank_sub')}</div>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {welderRanking.length === 0
              ? <div style={{ color: 'var(--text-3)', fontSize: 13, textAlign: 'center', padding: 24 }}>{t('lbl.no_data')}</div>
              : welderRanking.map((w, i) => (
                <div key={w.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 22, textAlign: 'center', fontWeight: 700, fontSize: 11,
                                color: i === 0 ? 'var(--navy)' : 'var(--text-3)', flexShrink: 0 }}>
                    #{i+1}
                  </div>
                  <div className="av av-sm">{w.name.charAt(0)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden',
                                  textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {w.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{w.total} {t('ana.jobs')}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 80 }}>
                      <div className="progress">
                        <div className="progress-bar teal" style={{ width: `${w.rate}%` }}/>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 13,
                                   minWidth: 38, textAlign: 'right' }}>
                      {w.rate}%
                    </span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* ── Project summary table ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">{t('ana.proj_summary')}</div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{t('col.project')}</th>
                <th>{t('col.client')}</th>
                <th style={{ textAlign: 'center' }}>{t('col.inspected')}</th>
                <th style={{ textAlign: 'center' }}>{t('col.pass')}</th>
                <th style={{ textAlign: 'center' }}>{t('col.fail')}</th>
                <th style={{ textAlign: 'center' }}>{t('col.pass_rate')}</th>
                <th>{t('col.status')}</th>
              </tr>
            </thead>
            <tbody>
              {proj.map(p => {
                const pi   = insp.filter(i => i.projectId === p.id);
                const pp   = pi.filter(i => i.result === 'pass').length;
                const pf   = pi.length - pp;
                const rate = pi.length ? Math.round(pp / pi.length * 100) : 0;
                const STATUS_BADGE = { planning: 'warning', active: 'teal', completed: 'success' };
                const STATUS_LABEL = { planning: t('status.planning'), active: t('status.active'), completed: t('status.completed') };
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{p.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{p.code}</div>
                    </td>
                    <td className="text-sm">{p.client}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{pi.length}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--green)' }}>{pp}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: pf > 0 ? 'var(--red)' : 'var(--text-3)' }}>{pf}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                        <div className="progress" style={{ width: 80 }}>
                          <div className={`progress-bar ${rate >= 90 ? 'green' : rate >= 70 ? 'teal' : 'orange'}`}
                               style={{ width: `${rate}%` }}/>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 13, minWidth: 36 }}>
                          {rate}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${STATUS_BADGE[p.status] || 'gray'}`}>
                        {STATUS_LABEL[p.status] || p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.AnalyticsScreen = AnalyticsScreen;
