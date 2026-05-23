/* global React, window, ModalPortal */

const StandardsScreen = ({ standards, setStandards, lang }) => {
  const t = k => (typeof window !== 'undefined' && window.t) ? window.t(k) : k;
  const [pdfModal, setPdfModal]   = React.useState(null);
  const [delDoc,   setDelDoc]     = React.useState(null);
  const [uploading,setUploading]  = React.useState(false);
  const [stdSaved, setStdSaved]   = React.useState(false);
  const fileInputRef = React.useRef(null);
  const mountedStd   = React.useRef(false);

  // Show "saved" indicator when standards list changes
  React.useEffect(() => {
    if (!mountedStd.current) { mountedStd.current = true; return; }
    setStdSaved(true);
    const t2 = setTimeout(() => setStdSaved(false), 2500);
    return () => clearTimeout(t2);
  }, [standards]);

  const STANDARD_COLORS = {
    'AWS D1.1': '#1B3A6B', 'ASME IX': '#0D7377', 'ISO 5817': '#28a745',
    'ASME BPE': '#6f42c1', 'AWS D18.2': '#fd7e14', 'ISO 9606-1': '#17a2b8',
    'API 1104': '#dc3545',
  };

  const handleUpload = e => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      if (window.showToast) window.showToast(t('std.pdf_only'), 'warning'); return;
    }
    setUploading(true);
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      const stdName = file.name.replace('.pdf','').replace(/_/g,' ');
      const newDoc = {
        id: `STD-${Date.now()}`,
        name: stdName,
        standard: stdName.split(' ')[0],
        year: new Date().getFullYear().toString(),
        scope: 'งานเชื่อมทั่วไป',
        fileUrl: url,
        fileName: file.name,
        uploadDate: new Date().toISOString().slice(0,10),
      };
      setStandards(prev => [newDoc, ...prev]);
      setUploading(false);
      e.target.value = '';
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`${t('std.upload_ok')} · ${stdName}`, 'success');
      }
    }, 800);
  };

  const deleteDoc = id => {
    const doc = standards.find(s => s.id === id);
    if (doc && doc.fileUrl && doc.fileUrl.startsWith('blob:')) URL.revokeObjectURL(doc.fileUrl);
    setStandards(prev => prev.filter(s => s.id !== id));
    if (typeof window !== 'undefined' && window.showToast && doc) {
      window.showToast(`${t('std.delete_ok')} · ${doc.name}`, 'info');
    }
  };

  const getColor = stdName => {
    for (const key of Object.keys(STANDARD_COLORS)) {
      if (stdName && stdName.includes(key.split(' ')[0])) return STANDARD_COLORS[key];
    }
    return '#6C757D';
  };

  return (
    <div>
      <div className="page-hd">
        <div>
          <div className="page-title">{t('std.title')}</div>
          <div className="page-sub">{t('std.sub')}</div>
        </div>
        <div className="page-hd-right">
          {stdSaved && (
            <span style={{fontSize:12,color:'var(--ok)',display:'flex',alignItems:'center',gap:4,fontWeight:600}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              บันทึกแล้ว
            </span>
          )}
          <input ref={fileInputRef} type="file" accept=".pdf" hidden onChange={handleUpload}/>
          <button className="btn btn-primary" onClick={()=>fileInputRef.current.click()} disabled={uploading}>
            {uploading ? (
              <>
                <div style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.6s linear infinite'}}/>
                {t('btn.uploading')}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {t('btn.upload_pdf')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div className="alert alert-info mb-20" style={{fontSize:12.5}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        {t('std.info')}
      </div>

      {/* Standards grid */}
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {standards.map(doc => {
          const color = getColor(doc.standard);
          return (
            <div key={doc.id} className="doc-card">
              {/* Icon */}
              <div className="doc-icon" style={{background:`${color}15`,color}}>
                <div style={{textAlign:'center',lineHeight:1.2}}>
                  <div style={{fontSize:16,marginBottom:2}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M14 3v5h5"/>
                    </svg>
                  </div>
                  <div style={{fontSize:8,fontWeight:800}}>PDF</div>
                </div>
              </div>

              {/* Info */}
              <div className="doc-info">
                <div className="doc-name">{doc.name}</div>
                <div className="doc-meta">
                  <span className="badge" style={{background:`${color}12`,color,fontSize:10.5,padding:'2px 7px',fontWeight:700,borderRadius:3}}>
                    {doc.standard}
                  </span>
                  {' · '}
                  {doc.year && <span>{doc.year} · </span>}
                  {doc.scope && <span>{doc.scope} · </span>}
                  {t('std.uploaded')} {doc.uploadDate}
                </div>
              </div>

              {/* Actions */}
              <div style={{display:'flex',gap:6,flexShrink:0}}>
                <button className="btn btn-secondary btn-sm"
                        onClick={()=>setPdfModal({name:doc.name, url:doc.fileUrl, fileName:doc.fileName})}
                        disabled={!doc.fileUrl}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
                  {t('btn.view')}
                </button>
                <button className="btn btn-ghost btn-icon" style={{color:'var(--red)'}}
                        onClick={()=>setDelDoc(doc)} title="ลบ">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                </button>
              </div>
            </div>
          );
        })}

        {standards.length === 0 && (
          <div className="empty-state">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M14 3v5h5M9 13h7M9 17h5"/></svg>
            <div className="empty-state-title">{t('std.no_docs')}</div>
            <div className="empty-state-sub">{t('std.no_docs_sub')}</div>
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {pdfModal && (
        <ModalPortal>
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setPdfModal(null)}>
          <div className="modal modal-pdf">
            <div className="modal-header">
              <div className="modal-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" style={{marginRight:6}}>
                  <path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M14 3v5h5"/>
                </svg>
                {pdfModal.name}
              </div>
              <button className="modal-close" onClick={()=>setPdfModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{padding:'16px 20px'}}>
              {pdfModal.url ? (
                <div className="pdf-wrap">
                  <iframe src={pdfModal.url} title={pdfModal.name}/>
                </div>
              ) : (
                <div className="pdf-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M14 3v5h5"/></svg>
                  <div style={{fontWeight:600,color:'var(--text-2)'}}>{t('std.no_preview')}</div>
                  <div style={{fontSize:12.5}}>{pdfModal.fileName}</div>
                  <div style={{fontSize:12,color:'var(--text-3)'}}>{t('std.sample_note')}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Delete confirm */}
      {delDoc && (
        <ModalPortal>
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setDelDoc(null)}>
          <div className="modal" style={{maxWidth:380}}>
            <div className="modal-header">
              <div className="modal-title">{t('lbl.confirm_delete')}</div>
              <button className="modal-close" onClick={()=>setDelDoc(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-error">{t('std.del_confirm')} <strong>{delDoc.name}</strong>?</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setDelDoc(null)}>{t('btn.cancel')}</button>
              <button className="btn btn-danger" onClick={()=>{deleteDoc(delDoc.id);setDelDoc(null);}}>{t('btn.delete')}</button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  );
};

window.StandardsScreen = StandardsScreen;
