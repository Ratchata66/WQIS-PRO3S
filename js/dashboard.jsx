/* global React, window, WQIS_DATA */

// ── Chart wrappers ────────────────────────────────────────────
const BarChart = ({ labels, data, color='#1B3A6B', height=200 }) => {
  const ref = React.useRef(null);
  const ch  = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.Chart) return;
    if (ch.current) ch.current.destroy();
    ch.current = new window.Chart(ref.current, {
      type:'bar',
      data:{ labels, datasets:[{ data, backgroundColor:color, borderRadius:5, borderSkipped:false }] },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false} },
        scales:{
          y:{ grid:{color:'rgba(0,0,0,0.05)'}, ticks:{color:'#6C757D',font:{size:11}} },
          x:{ grid:{display:false}, ticks:{color:'#6C757D',font:{size:11},maxRotation:30} },
        },
      },
    });
    return () => ch.current && ch.current.destroy();
  }, [JSON.stringify(labels), JSON.stringify(data), color]);
  return <div style={{position:'relative',height}}><canvas ref={ref}/></div>;
};

const DonutChart = ({ labels, data, colors, height=220 }) => {
  const ref = React.useRef(null);
  const ch  = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.Chart) return;
    if (ch.current) ch.current.destroy();
    ch.current = new window.Chart(ref.current, {
      type:'doughnut',
      data:{ labels, datasets:[{ data, backgroundColor:colors, borderWidth:0, hoverOffset:4 }] },
      options:{
        responsive:true, maintainAspectRatio:false,
        cutout:'65%',
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:12, padding:12, font:{size:12} } } },
      },
    });
    return () => ch.current && ch.current.destroy();
  }, [JSON.stringify(data)]);
  return <div style={{position:'relative',height}}><canvas ref={ref}/></div>;
};

const LineChart = ({ labels, data, color='#0D7377', height=160 }) => {
  const ref = React.useRef(null);
  const ch  = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.Chart) return;
    if (ch.current) ch.current.destroy();
    ch.current = new window.Chart(ref.current, {
      type:'line',
      data:{ labels, datasets:[{
        data, borderColor:color, backgroundColor:color+'22',
        fill:true, tension:0.4, pointRadius:3, pointHoverRadius:5,
        pointBackgroundColor:color, borderWidth:2,
      }] },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false} },
        scales:{
          y:{ grid:{color:'rgba(0,0,0,0.05)'}, ticks:{color:'#6C757D',font:{size:11}} },
          x:{ grid:{display:false}, ticks:{color:'#6C757D',font:{size:11},maxTicksLimit:8} },
        },
      },
    });
    return () => ch.current && ch.current.destroy();
  }, [JSON.stringify(data)]);
  return <div style={{position:'relative',height}}><canvas ref={ref}/></div>;
};

// ── Count-up hook ─────────────────────────────────────────────
const useCountUp = (target, duration = 900) => {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (typeof target !== 'number' || isNaN(target)) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return value;
};

// ── Dashboard Screen ──────────────────────────────────────────
const DashboardScreen = ({ projects, inspections, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const totalProjects  = projects.filter(p => p.status !== 'planning').length;
  const totalInspected = inspections.length;
  const passCount      = inspections.filter(i => i.result === 'pass').length;
  const failCount      = totalInspected - passCount;
  const passRate       = totalInspected ? Math.round(passCount / totalInspected * 1000) / 10 : 0;
  const pendingWelds   = projects.reduce((s,p) => s + Math.max(0, p.totalWelds - p.inspected), 0);

  const activeProjects = projects.filter(p => p.status !== 'planning');
  const barLabels = activeProjects.map(p => p.code);
  const barData   = activeProjects.map(p => p.inspected);

  const donutData   = [passCount, failCount];
  const donutColors = ['#28a745', '#dc3545'];
  const donutLabels = [`${t('status.pass')} (${passCount})`, `${t('status.fail')} (${failCount})`];

  const lineLabels = Array.from({length:14}, (_,i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return `${d.getDate()}/${d.getMonth()+1}`;
  });
  const lineData = [8,12,6,14,18,10,9,16,20,13,11,15,17,14];

  const recent = [...inspections].reverse().slice(0, 8);

  // Count-up animated values
  const cProjects  = useCountUp(totalProjects);
  const cInspected = useCountUp(totalInspected);
  const cPassRate  = useCountUp(parseFloat(passRate) * 10) / 10; // one decimal
  const cPending   = useCountUp(pendingWelds);

  const withProgress = projects.filter(p => p.totalWelds > 0).map(p => ({
    ...p, pct: Math.round(p.inspected / p.totalWelds * 100),
  }));

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid-4 mb-24">
        {[
          { label: t('dash.total_projects'), value:cProjects,
            sub:`${projects.filter(p=>p.status==='active').length} ${t('dash.active_count')}`,
            iconPath:'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 11h18',
            bg:'var(--navy-soft)', clr:'var(--navy)', delta:'up', accent:'accent-navy' },
          { label: t('dash.inspected'), value:cInspected.toLocaleString(),
            sub: t('dash.welds_all'),
            iconPath:'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
            bg:'var(--teal-soft)', clr:'var(--teal)', delta:'neu', accent:'accent-teal' },
          { label: t('dash.pass_rate'), value:`${cPassRate}%`,
            sub: t('dash.vs_target'),
            iconPath:'M20 6L9 17l-5-5',
            bg:'var(--green-soft)', clr:'var(--green)', delta:'up', accent:'accent-green' },
          { label: t('dash.pending'), value:cPending.toLocaleString(),
            sub: t('dash.remaining'),
            iconPath:'M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zM12 8v4M12 16h.01',
            bg:'var(--orange-soft)', clr:'var(--orange)', delta:'down', accent:'accent-orange' },
        ].map((kpi, i) => (
          <div key={i} className={`stat-card ${kpi.accent}`}>
            <div className="stat-icon" style={{background:kpi.bg}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={kpi.clr}
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {kpi.iconPath.split('M').filter(Boolean).map((seg,j)=>(
                  <path key={j} d={`M${seg}`}/>
                ))}
              </svg>
            </div>
            <div>
              <div className="stat-label">{kpi.label}</div>
              <div className="stat-value">{kpi.value}</div>
              <div className={`stat-delta delta-${kpi.delta}`}>{kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-3 mb-24">
        <div className="card" style={{gridColumn:'span 2'}}>
          <div className="card-header">
            <div>
              <div className="card-title">{t('dash.welds_by_proj')}</div>
              <div className="card-subtitle">{t('dash.inspected_count')}</div>
            </div>
          </div>
          <div className="card-body"><BarChart labels={barLabels} data={barData} height={200}/></div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{t('dash.pass_fail')}</div>
              <div className="card-subtitle">{t('dash.ratio_all')}</div>
            </div>
          </div>
          <div className="card-body">
            <DonutChart labels={[`${t('status.pass')} (${passCount})`, `${t('status.fail')} (${failCount})`]} data={donutData} colors={donutColors} height={200}/>
          </div>
        </div>
      </div>

      <div className="card mb-24">
        <div className="card-header">
          <div className="card-title">{t('dash.activity_14d')}</div>
        </div>
        <div className="card-body"><LineChart labels={lineLabels} data={lineData} height={160}/></div>
      </div>

      {/* Recent + Progress */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">{t('dash.recent')}</div></div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>{t('col.weld_code')}</th><th>{t('col.project')}</th><th>{t('col.result')}</th><th>{t('col.date')}</th></tr></thead>
              <tbody>
                {recent.map(ins => {
                  const proj = projects.find(p => p.id === ins.projectId);
                  return (
                    <tr key={ins.id}>
                      <td><code style={{fontSize:11.5,color:'var(--navy)'}}>{ins.weldId}</code></td>
                      <td style={{maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {proj ? proj.code : ins.projectId}
                      </td>
                      <td>
                        <span className={`badge badge-${ins.result==='pass'?'success':'danger'}`}>
                          {ins.result==='pass' ? t('status.pass') : t('status.fail')}
                        </span>
                      </td>
                      <td className="text-sm text-muted">{ins.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">{t('dash.proj_progress')}</div></div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:16}}>
            {withProgress.map(p => (
              <div key={p.id}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,gap:8}}>
                  <div style={{minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div>
                    <div style={{fontSize:11.5,color:'var(--text-3)'}}>{p.inspected}/{p.totalWelds} {t('lbl.welds')}</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                    <span className={`badge badge-${p.status==='completed'?'success':p.status==='active'?'teal':'warning'}`} style={{fontSize:10}}>
                      {p.status==='completed' ? t('status.completed') : p.status==='active' ? t('status.active') : t('status.planning')}
                    </span>
                    <span style={{fontWeight:800,color:'var(--navy)',fontSize:14,minWidth:34,textAlign:'right'}}>{p.pct}%</span>
                  </div>
                </div>
                <div className="progress">
                  <div className={`progress-bar ${p.status==='completed'?'green':p.status==='active'?'teal':'orange'}`}
                       style={{width:`${p.pct}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

window.DashboardScreen = DashboardScreen;
