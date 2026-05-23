const fs = require('fs');
let c = fs.readFileSync('D:/2026/WQIS_DEMO ตัวโปรแกรม/js/ai-inspect.jsx', 'utf8');

// Add oxideOpen state after zoomModal state
c = c.replace(
  'const [zoomModal, setZoomModal] = React.useState(false);',
  'const [zoomModal, setZoomModal] = React.useState(false);\n  const [oxideOpen,  setOxideOpen]  = React.useState(false);'
);

// Build the oxide card JSX string (no backtick template literals inside)
const oxideCard = `
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

`;

const target = '      {/* ── Zoom lightbox ── */}';
if (!c.includes(target)) { console.log('TARGET NOT FOUND'); process.exit(1); }

c = c.replace(target, oxideCard + target);
fs.writeFileSync('D:/2026/WQIS_DEMO ตัวโปรแกรม/js/ai-inspect.jsx', c, 'utf8');
console.log('Done! oxide card:', c.includes('oxide-color-ref'));
