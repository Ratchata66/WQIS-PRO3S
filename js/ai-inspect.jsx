/* global React, ReactDOM, WQIS_DATA, window, ModalPortal */

// Local YOLO is the only trusted analysis path. Do not fall back to random PASS/FAIL.

const buildUnavailableResult = reason => ({
  pass: false,
  conf: 0,
  reason,
  source: 'local-yolo-unavailable',
  predictions: [],
  imageMeta: null,
  zones: [
    { zone:'Local YOLO', area:'0 box', ref:reason, ok:false },
    { zone:'AI Verdict', area:'REVIEW', ref:'No trusted model result', ok:false },
  ],
});

const fileToDataUrl = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const normalizeAiClass = name => String(name || '').trim().toLowerCase().replace(/\s+/g, '_');

const evaluateLocalPredictions = (predictions = []) => {
  const sorted = [...predictions].sort((a, b) => Number(b.confidence || 0) - Number(a.confidence || 0));
  const top = sorted[0];
  if (!top) return { pass: false, conf: 0, reason: 'No weld detected' };

  const getConf = p => Number(p.confidence || 0);
  const getClass = p => normalizeAiClass(p.class);
  const notWeldHit = sorted.find(p => {
    const cls = getClass(p);
    return (cls.includes('negative') || cls.includes('not_a_weld') || cls.includes('not-weld')) && getConf(p) >= 0.20;
  });
  const failHit = sorted.find(p => getClass(p).includes('fail') && getConf(p) >= 0.25);
  const passHit = sorted.find(p => getClass(p).includes('pass') && getConf(p) >= 0.50);

  if (notWeldHit) return { pass: false, conf: Math.round(getConf(notWeldHit) * 1000) / 10, reason: 'Not a weld image' };
  if (failHit) return { pass: false, conf: Math.round(getConf(failHit) * 1000) / 10, reason: 'FAIL detected' };
  if (passHit) return { pass: true, conf: Math.round(getConf(passHit) * 1000) / 10, reason: 'PASS detected' };
  return { pass: false, conf: Math.round(getConf(top) * 1000) / 10, reason: 'Low confidence / no trusted PASS box' };
};

const isNotWeldResult = result => {
  if (!result) return false;
  if (result.reason === 'Not a weld image') return true;
  return (result.predictions || []).some(p => {
    const cls = normalizeAiClass(p.class);
    return cls.includes('negative') || cls.includes('not_a_weld') || cls.includes('not-weld');
  });
};

const _t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;

const formatAiReason = reason => {
  if (reason === 'Not a weld image') return _t('ai.not_a_weld');
  if (reason === 'No weld detected') return _t('ai.no_weld');
  if (reason === 'FAIL detected') return _t('ai.fail_detected');
  if (reason === 'PASS detected') return _t('ai.pass_detected');
  if (reason === 'Low confidence / no trusted PASS box') return _t('ai.low_conf');
  if (reason === 'No trusted model result') return _t('ai.no_model');
  return reason;
};

const getResultLabel = result => {
  if (!result) return 'WAITING';
  if (result.pass) return 'PASS';
  if (isNotWeldResult(result)) return 'NOT A WELD';
  return 'FAIL';
};

const getResultDescription = result => {
  if (!result) return '';
  if (result.pass) return _t('ai.weld_passed');
  if (isNotWeldResult(result)) return _t('ai.not_weld_desc');
  if (result.reason === 'No weld detected') return _t('ai.no_weld_desc');
  return _t('ai.fail_desc');
};

const runLocalAI = async file => {
  const imageData = await fileToDataUrl(file);
  const response = await fetch('/api/analyze-weld', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ imageData }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Local AI unavailable');
  const evaluation = evaluateLocalPredictions(payload.predictions || []);
  const verdictArea = evaluation.reason === 'Not a weld image'
    ? 'NOT A WELD'
    : evaluation.pass ? 'PASS' : 'FAIL/REVIEW';
  return {
    pass: evaluation.pass,
    conf: evaluation.conf,
    reason: evaluation.reason,
    source: payload.source || 'local-yolo',
    predictions: payload.predictions || [],
    imageMeta: payload.image || null,
    zones: [
      { zone:'YOLO Detection', area:`${(payload.predictions || []).length} box`, ref:'Local YOLO', ok:evaluation.pass },
      { zone:'AI Verdict', area:verdictArea, ref:evaluation.reason, ok:evaluation.pass },
    ],
  };
};

const AIInspectScreen = ({ projects, inspections, setInspections, setProjects, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k; // eslint-disable-line no-unused-vars
  const [files,       setFiles]       = React.useState([]);
  const [selected,    setSelected]    = React.useState(null);
  const [results,     setResults]     = React.useState({});
  const [analyzing,   setAnalyzing]   = React.useState(false);
  const [dragging,    setDragging]    = React.useState(false);
  const [saved,       setSaved]       = React.useState(false);
  const [zoomModal,      setZoomModal]      = React.useState(false);
  const [oxideOpen,      setOxideOpen]      = React.useState(false);
  const [exporting,      setExporting]      = React.useState(false);
  const [exportProgress, setExportProgress] = React.useState(0);
  const fileInputRef = React.useRef(null);
  const folderInputRef = React.useRef(null);

  // Inspection form state
  const [form, setForm] = React.useState({
    projectId:'', weldId:'', weldType:'GTAW (TIG)',
    welder:'', cert:'', date: new Date().toISOString().slice(0,10),
    inspector:'', comment:'',
  });
  const setF = (k,v) => setForm(f=>({...f,[k]:v}));

  // Handle file selection
  const addFiles = fileList => {
    const imgs = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (!imgs.length) return;
    const newFiles = imgs.map(f => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      name: f.name,
      url:  URL.createObjectURL(f),
      file: f,
    }));
    setFiles(prev => {
      const merged = [...prev, ...newFiles];
      if (!selected && merged.length > 0) setSelected(merged[0].id);
      return merged;
    });
  };

  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const clearAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.url));
    setFiles([]); setSelected(null); setResults({});
  };

  // Run AI
  const analyze = async () => {
    if (!files.length) return;
    setAnalyzing(true);
    const newResults = {};
    for (const f of files) {
      try {
        newResults[f.id] = await runLocalAI(f.file);
      } catch (err) {
        newResults[f.id] = buildUnavailableResult(err.message);
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(err.message, 'warning');
        }
      }
    }
    setResults(newResults);
    setAnalyzing(false);
    if (files.length > 0) setSelected(files[0].id);
  };

  // Save inspection record
  const saveRecord = () => {
    if (!form.projectId || !form.weldId || !form.welder) return;
    const selResult = selected && results[selected];
    const aiResult  = selResult ? (selResult.pass ? 'pass' : 'fail') : 'pending';
    const record = {
      id: `INS-${String(Date.now()).slice(-4)}`,
      projectId: form.projectId,
      weldId: form.weldId,
      weldType: form.weldType,
      welder: form.welder,
      cert: form.cert,
      date: form.date,
      inspector: form.inspector,
      comment: form.comment,
      aiResult,
      result: aiResult,
    };
    setInspections(prev => [record, ...prev]);

    // Sync project inspected count
    if (setProjects) {
      setProjects(prev => prev.map(p =>
        p.id === form.projectId ? { ...p, inspected: (p.inspected || 0) + 1 } : p
      ));
    }

    // Global toast
    if (typeof window !== 'undefined' && window.showToast) {
      const label = aiResult === 'pass' ? '✓ PASS' : aiResult === 'fail' ? '✗ FAIL' : t('lbl.pending');
      window.showToast(`${t('inspect.saved_lbl')} · ${form.weldId} · ${label}`, aiResult === 'pass' ? 'success' : aiResult === 'fail' ? 'error' : 'info');
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setForm(f => ({...f, weldId:'', welder:'', cert:'', comment:''}));
  };

  // QC Review — saves with result:'review' for manual follow-up
  const saveQCReview = () => {
    if (!form.projectId || !form.weldId.trim() || !form.welder.trim()) return;
    const record = {
      id: `INS-${String(Date.now()).slice(-4)}`,
      projectId: form.projectId,
      weldId: form.weldId,
      weldType: form.weldType,
      welder: form.welder,
      cert: form.cert,
      date: form.date,
      inspector: form.inspector,
      comment: form.comment,
      aiResult: 'review',
      result: 'review',
    };
    setInspections(prev => [record, ...prev]);
    if (setProjects) {
      setProjects(prev => prev.map(p =>
        p.id === form.projectId ? { ...p, inspected: (p.inspected || 0) + 1 } : p
      ));
    }
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast(`${t('inspect.qc_sent')} · ${form.weldId}`, 'warning');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setForm(f => ({...f, weldId:'', welder:'', cert:'', comment:''}));
  };

  // ── Export Pass/Fail to local folders ──
  const exportToFolders = async () => {
    if (!('showDirectoryPicker' in window)) {
      window.showToast && window.showToast(t('inspect.export_no_support'), 'error');
      return;
    }
    const analyzed = files.filter(f => results[f.id]);
    if (!analyzed.length) return;

    let rootHandle;
    try {
      rootHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    } catch(e) {
      return; // user cancelled
    }

    // Create Pass / Fail subfolders
    const passDir = await rootHandle.getDirectoryHandle('Pass', { create: true });
    const failDir = await rootHandle.getDirectoryHandle('Fail', { create: true });

    setExporting(true);
    setExportProgress(0);
    let done = 0;
    let passCount = 0;
    let failCount = 0;

    for (const f of analyzed) {
      const res = results[f.id];
      const targetDir = res.pass ? passDir : failDir;
      try {
        const fileHandle = await targetDir.getFileHandle(f.name, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(f.file);
        await writable.close();
        if (res.pass) passCount++; else failCount++;
      } catch(_) { /* skip on error */ }
      done++;
      setExportProgress(Math.round(done / analyzed.length * 100));
    }

    setExporting(false);
    setExportProgress(0);
    window.showToast && window.showToast(
      `${t('inspect.export_done')} · ✓ Pass: ${passCount}  ✗ Fail: ${failCount}`,
      'success'
    );
  };

  const selFile   = files.find(f => f.id === selected);
  const selResult = selected ? results[selected] : null;
  const selectedProj = projects.find(p => p.id === form.projectId);
  const staffOptions = selectedProj ? selectedProj.staff : [];

  const formValid = form.projectId && form.weldId.trim() && form.welder.trim();

  return (
    <div>
      <div className="page-hd">
        <div>
          <div className="page-title">AI Inspect</div>
          <div className="page-sub">{t('inspect.sub')}</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:20,alignItems:'start'}}>

        {/* ── Left: Upload + Result ── */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>

          {/* Upload zone */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">{t('inspect.upload_title')}</div>
              <div style={{display:'flex',gap:8}}>
                <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={e=>addFiles(e.target.files)}/>
                <input ref={folderInputRef} type="file" accept="image/*" multiple webkitdirectory="" hidden onChange={e=>addFiles(e.target.files)}/>
                <button className="btn btn-light btn-sm" onClick={()=>fileInputRef.current.click()}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {t('inspect.upload_file')}
                </button>
                <button className="btn btn-light btn-sm" onClick={()=>folderInputRef.current.click()}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                  {t('inspect.upload_folder')}
                </button>
              </div>
            </div>
            <div className="card-body">
              <div
                className={`upload-zone${dragging?' drag':''}`}
                onDragOver={e=>{e.preventDefault();setDragging(true);}}
                onDragLeave={()=>setDragging(false)}
                onDrop={handleDrop}
                onClick={()=>fileInputRef.current.click()}
                style={files.length>0?{padding:'16px 24px'}:undefined}
              >
                {files.length === 0 ? (
                  <>
                    <div className="upload-zone-icon">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <div className="upload-zone-title">{t('inspect.drop_hint')}</div>
                    <div className="upload-zone-sub">{t('inspect.click_drop')} · {t('inspect.drop_sub')}</div>
                  </>
                ) : (
                  <div className="img-grid" onClick={e=>e.stopPropagation()}>
                    {files.map(f => {
                      const res = results[f.id];
                      return (
                        <div key={f.id} className={`img-thumb${selected===f.id?' sel':''}`}
                             onClick={()=>setSelected(f.id)}>
                          <img src={f.url} alt={f.name}/>
                          {res && (
                            <span className={`img-thumb-badge badge-${res.pass?'success':'danger'}`}
                                  style={{background:res.pass?'#28a745':'#dc3545',color:'white'}}>
                              {getResultLabel(res)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {files.length > 0 && (
                <div style={{display:'flex',gap:8,marginTop:12,justifyContent:'flex-end',alignItems:'center'}}>
                  <span className="text-sm text-muted">{files.length} {t('lbl.files')}</span>
                  <button className="btn btn-outline-danger btn-sm" onClick={clearAll}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                    {t('btn.clear')}
                  </button>
                  <button className="btn btn-teal" onClick={analyze} disabled={analyzing || Object.keys(results).length>0}>
                    {analyzing ? (
                      <>
                        <div style={{width:13,height:13,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.6s linear infinite'}}/>
                        {t('btn.analyzing')}...
                      </>
                    ) : Object.keys(results).length > 0 ? t('inspect.analyzed') : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg>
                        {t('inspect.check_ai')}
                      </>
                    )}
                  </button>

                  {/* Export Pass/Fail button — shown only after analysis */}
                  {Object.keys(results).length > 0 && (
                    <button
                      className="btn btn-primary"
                      onClick={exportToFolders}
                      disabled={exporting}
                      title={t('inspect.export_title')}
                      style={{minWidth:160,position:'relative',overflow:'hidden'}}
                    >
                      {/* Progress bar behind button text */}
                      {exporting && (
                        <div style={{
                          position:'absolute',inset:0,left:0,top:0,
                          width: exportProgress + '%',
                          background:'rgba(255,255,255,0.18)',
                          transition:'width 0.3s',
                          borderRadius:'inherit',
                          pointerEvents:'none',
                        }}/>
                      )}
                      {exporting ? (
                        <>
                          <div style={{width:13,height:13,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.6s linear infinite'}}/>
                          {exportProgress}%
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                            <line x1="12" y1="11" x2="12" y2="17"/>
                            <polyline points="9 14 12 17 15 14"/>
                          </svg>
                          {t('inspect.export_btn')}
                        </>
                      )}
                    </button>
                  )}

                </div>
              )}
            </div>
          </div>

          {/* Selected image result */}
          {selFile && selResult && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">{selFile.name}</div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span className="text-sm text-muted">{t('inspect.ai_conf')}:</span>
                  <span style={{fontWeight:700,color:'var(--navy)'}}>{selResult.conf}%</span>
                  <span className={`badge badge-${selResult.pass?'success':'danger'}`} style={{fontSize:11}}>
                    {getResultLabel(selResult)}
                  </span>
                </div>
              </div>
              <div className="card-body" style={{display:'flex',flexDirection:'column',gap:14}}>

                {/* ── Large image preview with zoom button ── */}
                <div style={{position:'relative',borderRadius:'var(--r)',overflow:'hidden',border:'1px solid var(--border-lt)',
                             aspectRatio:selResult.imageMeta ? `${selResult.imageMeta.width}/${selResult.imageMeta.height}` : '16/9',
                             background:'#111',maxHeight:480}}>
                  <img src={selFile.url} alt="" style={{width:'100%',height:'100%',objectFit:'contain',display:'block'}}/>

                  {/* YOLO detection boxes */}
                  {selResult.imageMeta && (selResult.predictions || []).map((p, i) => {
                    const x = (Number(p.x || 0) - Number(p.width || 0) / 2) / selResult.imageMeta.width * 100;
                    const y = (Number(p.y || 0) - Number(p.height || 0) / 2) / selResult.imageMeta.height * 100;
                    const w = Number(p.width || 0) / selResult.imageMeta.width * 100;
                    const h = Number(p.height || 0) / selResult.imageMeta.height * 100;
                    const cls = normalizeAiClass(p.class);
                    const isFail = cls.includes('fail') || cls.includes('negative');
                    const col = isFail ? '#dc3545' : '#28a745';
                    return (
                      <div key={i} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${w}%`,height:`${h}%`,
                                           border:`2px solid ${col}`,boxShadow:`0 0 0 1px rgba(255,255,255,0.85), 0 0 12px ${col}`,
                                           pointerEvents:'none'}}>
                        <span style={{position:'absolute',left:-2,top:-22,background:col,color:'#fff',fontSize:10,fontWeight:800,padding:'2px 5px',whiteSpace:'nowrap'}}>
                          {String(p.class || 'YOLO').toUpperCase()} {Math.round(Number(p.confidence || 0) * 100)}%
                        </span>
                      </div>
                    );
                  })}

                  {/* Zoom button overlay */}
                  <button
                    onClick={()=>setZoomModal(true)}
                    title={t('btn.zoom')}
                    style={{position:'absolute',top:10,right:10,background:'rgba(0,0,0,0.6)',border:'1px solid rgba(255,255,255,0.25)',
                            borderRadius:7,color:'white',padding:'6px 10px',cursor:'pointer',display:'flex',
                            alignItems:'center',gap:5,fontSize:12.5,fontWeight:600,backdropFilter:'blur(4px)',
                            transition:'background 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.82)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0.6)'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                    {t('btn.zoom')}
                  </button>
                </div>

                {/* ── Result info row ── */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                  {/* Verdict */}
                  <div className={`ai-result ${selResult.pass?'pass':'fail'}`}>
                    <div className={`ai-verdict ${selResult.pass?'pass':'fail'}`}>
                      {selResult.pass
                        ? <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>PASS</>
                        : <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>{getResultLabel(selResult)}</>
                      }
                    </div>
                    <div style={{fontSize:12.5,marginTop:4,color:'var(--text-2)'}}>
                      {getResultDescription(selResult)}
                    </div>
                  </div>

                  {/* Zone table */}
                  <div>
                    <div style={{fontSize:11.5,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>
                      การวิเคราะห์สีออกไซด์
                    </div>
                    {selResult.zones.map((z,i) => (
                      <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',borderBottom:'1px solid var(--border-lt)',fontSize:12}}>
                        <div>
                          <div style={{fontWeight:500,color:'var(--text-1)'}}>{z.zone}</div>
                          <div style={{color:'var(--text-3)',fontSize:11}}>{formatAiReason(z.ref)}</div>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{fontWeight:600}}>{z.area}</span>
                          <span className={`badge badge-${z.ok?'success':'danger'}`} style={{fontSize:10}}>
                            {z.ok?'OK':'NG'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* ── Right: Inspection Form ── */}
        <div className="card" style={{position:'sticky',top:'calc(var(--topbar-h) + 24px)'}}>
          <div className="card-header">
            <div className="card-title">{t('inspect.record_title')}</div>
          </div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:14}}>

            {saved && (
              <div className="alert alert-success">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {t('inspect.save_ok_msg')}
              </div>
            )}

            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">{t('inspect.project')} <span className="form-required">*</span></label>
              <select className="form-control" value={form.projectId} onChange={e=>setF('projectId',e.target.value)}>
                <option value="">— เลือกโปรเจค —</option>
                {projects.filter(p=>p.status!=='planning').map(p=>(
                  <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">{t('inspect.weld_id')} / Weld ID <span className="form-required">*</span></label>
              <input className="form-control" value={form.weldId} onChange={e=>setF('weldId',e.target.value)}
                     placeholder={t('inspect.weld_id_ph')}/>
            </div>

            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">{t('inspect.weld_type')}</label>
              <select className="form-control" value={form.weldType} onChange={e=>setF('weldType',e.target.value)}>
                {WQIS_DATA.weldTypes.map(wt=><option key={wt}>{wt}</option>)}
              </select>
            </div>

            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">{t('inspect.welder')} <span className="form-required">*</span></label>
              {staffOptions.length > 0 ? (
                <select className="form-control" value={form.welder} onChange={e=>setF('welder',e.target.value)}>
                  <option value="">— เลือกช่างเชื่อม —</option>
                  {staffOptions.filter(s=>s.position==='ช่างเชื่อม'||s.position==='Engineer').map(s=>(
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  <option disabled>──────────</option>
                  {staffOptions.map(s=><option key={`all-${s.id}`} value={s.name}>{s.name} ({s.position})</option>)}
                </select>
              ) : (
                <input className="form-control" value={form.welder} onChange={e=>setF('welder',e.target.value)}
                       placeholder={t('inspect.welder_ph')}/>
              )}
            </div>

            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">{t('inspect.cert')} / Cert No.</label>
              <input className="form-control" value={form.cert} onChange={e=>setF('cert',e.target.value)}
                     placeholder={t('inspect.cert_ph')}/>
            </div>

            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">{t('inspect.date')}</label>
              <input className="form-control" type="date" value={form.date} onChange={e=>setF('date',e.target.value)}/>
            </div>

            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">{t('inspect.inspector_lbl')}</label>
              <input className="form-control" value={form.inspector} onChange={e=>setF('inspector',e.target.value)}
                     placeholder={t('inspect.inspector_ph')}/>
            </div>

            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">{t('inspect.comment_lbl')}</label>
              <textarea className="form-control" rows="3" value={form.comment} onChange={e=>setF('comment',e.target.value)}
                        placeholder={t('inspect.comment_ph')}/>
            </div>

            {/* AI Result preview */}
            {selResult && (
              <div style={{borderRadius:'var(--r)',padding:'10px 12px',border:'1px solid var(--border-lt)',background:'var(--bg)',fontSize:12.5}}>
                <div style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>{t('inspect.ai_result')}</div>
                <span className={`badge badge-${selResult.pass?'success':'danger'}`} style={{fontSize:12}}>
                  {getResultLabel(selResult)} · {selResult.conf}%
                </span>
              </div>
            )}

            {/* QC Review button */}
            <button
              className="btn w-full"
              disabled={!formValid}
              onClick={saveQCReview}
              style={{background:'#fd7e14',color:'white',border:'none',fontWeight:600,
                      opacity:formValid?1:0.5,cursor:formValid?'pointer':'not-allowed',
                      display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7"/>
                <path d="m20 20-3.5-3.5"/>
                <path d="M11 8v3l2 2"/>
              </svg>
              {t('btn.qc_review')}
            </button>

            <button className="btn btn-primary w-full" disabled={!formValid} onClick={saveRecord}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {t('btn.save_record')}
            </button>

          </div>
        </div>

      </div>


      {/* ── Oxide Color Reference ── */}
      <div className="card" style={{marginTop:20}}>
        <div className="card-header" style={{cursor:'pointer'}} onClick={()=>setOxideOpen(o=>!o)}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(90deg,#c8c8c0,#d4b87a,#c8a030,#a87820,#7a4814,#5060a8,#202840)',flexShrink:0,border:'1px solid var(--border)'}}/>
            <div>
              <div className="card-title" style={{marginBottom:0}}>{t('inspect.oxide_title')}</div>
              <div style={{fontSize:11.5,color:'var(--text-3)',marginTop:1}}>{t('inspect.oxide_sub')}</div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:20,
              background:'var(--green-soft)',color:'var(--green)'}}>AWS D18.1:2009</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                 style={{transform:oxideOpen?'rotate(180deg)':'rotate(0deg)',transition:'transform 0.2s'}}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        {oxideOpen && (
          <div className="card-body" style={{paddingTop:0}}>

            {/* Photo reference */}
            <div style={{marginBottom:16}}>
              <img
                src="assets/images/oxide-color-ref.jpg"
                alt="AWS D18.1:2009 Weld Oxide Color Chart"
                style={{width:'100%',borderRadius:8,display:'block',border:'1px solid var(--border)'}}
                onError={e=>{e.currentTarget.style.display='none';}}
              />
            </div>

            {/* Color zone legend */}
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>
              {[
                {c:'#c8ccc4',n:1,labelKey:'inspect.ox1',pass:true},
                {c:'#d4c07a',n:2,labelKey:'inspect.ox2',pass:true},
                {c:'#c8a030',n:3,labelKey:'inspect.ox3',pass:true},
                {c:'#a87820',n:4,labelKey:'inspect.ox4',pass:false},
                {c:'#8c5c18',n:5,labelKey:'inspect.ox5',pass:false},
                {c:'#7a4814',n:6,labelKey:'inspect.ox6',pass:false},
                {c:'#5060a8',n:7,labelKey:'inspect.ox7',pass:false},
                {c:'#304090',n:8,labelKey:'inspect.ox8',pass:false},
                {c:'#202840',n:9,labelKey:'inspect.ox9',pass:false},
                {c:'#141414',n:10,labelKey:'inspect.ox10',pass:false},
              ].map(({c:col,n,labelKey,pass})=>(
                <div key={n} style={{display:'flex',alignItems:'center',gap:5,
                  padding:'5px 9px',borderRadius:8,background:'var(--bg-alt)',
                  border:pass?'1.5px solid var(--green)':'1px solid var(--border)'}}>
                  <div style={{width:16,height:16,borderRadius:3,background:col,
                    border:'1.5px solid rgba(128,128,128,0.3)',flexShrink:0}}/>
                  <span style={{fontSize:11.5,fontWeight:700,color:'var(--text-3)'}}>{n}</span>
                  <span style={{fontSize:11,color:'var(--text-2)',whiteSpace:'nowrap'}}>{t(labelKey)}</span>
                  {pass
                    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3.2"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--red)"   strokeWidth="3.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  }
                </div>
              ))}
            </div>

            {/* Summary badges */}
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:8,
                background:'var(--green-soft)',border:'1px solid var(--green)',
                fontSize:12,color:'var(--green)',fontWeight:600}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                {t('inspect.ox_pass_note')}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:8,
                background:'var(--red-soft)',border:'1px solid var(--red)',
                fontSize:12,color:'var(--red)',fontWeight:600}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                {t('inspect.ox_fail_note')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Zoom lightbox ── */}
      {zoomModal && selFile && (
        <ModalPortal>
          <div className="modal-overlay" onClick={()=>setZoomModal(false)}
               style={{display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
            <div style={{background:'var(--bg-2)',borderRadius:'var(--r-lg)',boxShadow:'0 24px 80px rgba(0,0,0,0.55)',
                         display:'flex',flexDirection:'column',maxWidth:'92vw',maxHeight:'92vh',overflow:'hidden'}}
                 onClick={e=>e.stopPropagation()}>
              {/* Header */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 18px',
                           borderBottom:'1px solid var(--border-lt)',flexShrink:0}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <span style={{fontWeight:700,fontSize:14,color:'var(--text-1)'}}>{selFile.name}</span>
                  {selResult && (
                    <span className={`badge badge-${selResult.pass?'success':'danger'}`} style={{fontSize:11}}>
                      {getResultLabel(selResult)} · {selResult.conf}%
                    </span>
                  )}
                </div>
                <button className="modal-close" onClick={()=>setZoomModal(false)}>✕</button>
              </div>

              {/* Image */}
              <div style={{overflow:'auto',flex:1,background:'#0d0d0d',position:'relative',
                           display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{position:'relative',display:'inline-block'}}>
                  <img src={selFile.url} alt={selFile.name}
                       style={{maxWidth:'88vw',maxHeight:'80vh',display:'block',objectFit:'contain'}}/>

                  {/* YOLO boxes in zoom view */}
                  {selResult && selResult.imageMeta && (selResult.predictions || []).map((p, i) => {
                    const x = (Number(p.x || 0) - Number(p.width || 0) / 2) / selResult.imageMeta.width * 100;
                    const y = (Number(p.y || 0) - Number(p.height || 0) / 2) / selResult.imageMeta.height * 100;
                    const w = Number(p.width || 0) / selResult.imageMeta.width * 100;
                    const h = Number(p.height || 0) / selResult.imageMeta.height * 100;
                    const cls = normalizeAiClass(p.class);
                    const isFail = cls.includes('fail') || cls.includes('negative');
                    const col = isFail ? '#dc3545' : '#28a745';
                    return (
                      <div key={i} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${w}%`,height:`${h}%`,
                                           border:`2.5px solid ${col}`,
                                           boxShadow:`0 0 0 1.5px rgba(255,255,255,0.9), 0 0 18px ${col}88`,
                                           pointerEvents:'none'}}>
                        <span style={{position:'absolute',left:-2,top:-24,background:col,color:'#fff',
                                      fontSize:11,fontWeight:800,padding:'2px 6px',whiteSpace:'nowrap',borderRadius:3}}>
                          {String(p.class || 'YOLO').toUpperCase()} {Math.round(Number(p.confidence || 0) * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer hint */}
              <div style={{padding:'8px 18px',borderTop:'1px solid var(--border-lt)',fontSize:11.5,
                           color:'var(--text-3)',textAlign:'center',flexShrink:0}}>
                {t('lbl.zoom_close')}
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

    </div>
  );
};
