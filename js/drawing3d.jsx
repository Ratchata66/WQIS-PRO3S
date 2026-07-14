/* global React, THREE, pdfjsLib */

// ── Build helpers (Three.js geometry builders) ──────────────────────────────

function buildBox(w, h, d, mat, edgeMat, wf) {
  const items = [];
  const g = new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(g, mat()); m.position.y = h/2; items.push(m);
  if (!wf) { const eg = new THREE.EdgesGeometry(g); const el = new THREE.LineSegments(eg, edgeMat()); el.position.y = h/2; items.push(el); }
  return items;
}

function buildCylinder(w, h, d, mat, edgeMat, wf) {
  const r = Math.min(w,d)/2;
  const g = new THREE.CylinderGeometry(r, r, h, 48);
  const m = new THREE.Mesh(g, mat()); m.position.y = h/2;
  const items = [m];
  if (!wf) { const eg = new THREE.EdgesGeometry(g); const el = new THREE.LineSegments(eg, edgeMat()); el.position.y = h/2; items.push(el); }
  return items;
}

function buildPipe(w, h, d, thick, mat, edgeMat, wf) {
  const oR = Math.min(w,d)/2; const iR = Math.max(4, oR - Math.min(thick, oR-4));
  const og = new THREE.CylinderGeometry(oR,oR,h,48,1,true);
  const om = new THREE.Mesh(og, mat()); om.position.y = h/2;
  const ig = new THREE.CylinderGeometry(iR,iR,h,48,1,true);
  const im = new THREE.Mesh(ig, mat()); im.material.side = THREE.BackSide; im.position.y = h/2;
  const cT = new THREE.Mesh(new THREE.RingGeometry(iR,oR,48), mat()); cT.rotation.x=-Math.PI/2; cT.position.y=h;
  const cB = new THREE.Mesh(new THREE.RingGeometry(iR,oR,48), mat()); cB.rotation.x=Math.PI/2;
  const eo = new THREE.EdgesGeometry(og); const el = new THREE.LineSegments(eo, edgeMat()); el.position.y=h/2;
  const items = [om, im, cT, cB]; if (!wf) items.push(el);
  return items;
}

function buildFrame(w, h, d, ts, mat, edgeMat, wf) {
  // ts = tube section size
  const items = [];
  const hs = ts / 2;
  const addTube = (bw, bh, bd, x, y, z) => {
    const g = new THREE.BoxGeometry(bw, bh, bd);
    const m = new THREE.Mesh(g, mat()); m.position.set(x, y, z); items.push(m);
    if (!wf) { const eg = new THREE.EdgesGeometry(g); const el = new THREE.LineSegments(eg, edgeMat()); el.position.set(x,y,z); items.push(el); }
  };
  // 4 vertical corner posts
  addTube(ts,h,ts,  w/2-hs, h/2,  d/2-hs);
  addTube(ts,h,ts, -w/2+hs, h/2,  d/2-hs);
  addTube(ts,h,ts,  w/2-hs, h/2, -d/2+hs);
  addTube(ts,h,ts, -w/2+hs, h/2, -d/2+hs);
  // Top rails
  addTube(w-ts*2,ts,ts, 0, h-hs,  d/2-hs);
  addTube(w-ts*2,ts,ts, 0, h-hs, -d/2+hs);
  addTube(ts,ts,d-ts*2,  w/2-hs, h-hs, 0);
  addTube(ts,ts,d-ts*2, -w/2+hs, h-hs, 0);
  // Bottom rails
  addTube(w-ts*2,ts,ts, 0, hs,  d/2-hs);
  addTube(w-ts*2,ts,ts, 0, hs, -d/2+hs);
  addTube(ts,ts,d-ts*2,  w/2-hs, hs, 0);
  addTube(ts,ts,d-ts*2, -w/2+hs, hs, 0);
  // Mid cross braces (optional, for rigidity look)
  addTube(w-ts*2,ts,ts, 0, h/2,  d/2-hs);
  addTube(w-ts*2,ts,ts, 0, h/2, -d/2+hs);
  return items;
}

function buildLBracket(w, h, d, ts, mat, edgeMat, wf) {
  const items = [];
  const addTube = (bw, bh, bd, x, y, z) => {
    const g = new THREE.BoxGeometry(bw, bh, bd);
    const m = new THREE.Mesh(g, mat()); m.position.set(x, y, z); items.push(m);
    if (!wf) { const eg = new THREE.EdgesGeometry(g); const el = new THREE.LineSegments(eg, edgeMat()); el.position.set(x,y,z); items.push(el); }
  };
  // Vertical web
  addTube(ts, h, d, -w/2+ts/2, h/2, 0);
  // Horizontal flange
  addTube(w, ts, d, 0, ts/2, 0);
  return items;
}

// ── Main Component ───────────────────────────────────────────────────────────

const Drawing3DScreen = ({ lang }) => {
  const mountRef    = React.useRef(null);
  const sceneRef    = React.useRef(null);
  const cameraRef   = React.useRef(null);
  const rendererRef = React.useRef(null);
  const groupRef    = React.useRef(null);
  const frameRef    = React.useRef(null);
  const orbit       = React.useRef({ theta:0.7, phi:1.05, r:1200, drag:false, lx:0, ly:0 });

  // Input (staging)
  const [shape,    setShape]    = React.useState('frame');
  const [dims,     setDims]     = React.useState({ w:1200, h:800, d:600 });
  const [ts,       setTs]       = React.useState(60);   // tube section
  const [thick,    setThick]    = React.useState(30);   // pipe wall

  // Applied (drives 3D)
  const [applied,  setApplied]  = React.useState(null);
  const [building, setBuilding] = React.useState(false);

  const [wfMode,   setWfMode]   = React.useState(false);
  const [showGrid, setShowGrid] = React.useState(true);
  const [showAxes, setShowAxes] = React.useState(true);
  const [pages,     setPages]     = React.useState([]);
  const [pdfLoad,   setPdfLoad]   = React.useState(false);
  const [pdfName,   setPdfName]   = React.useState('');
  const [noThree,   setNoThree]   = React.useState(false);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [aiResult,  setAiResult]  = React.useState(null);

  // ── Init Three.js ────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!window.THREE) { setNoThree(true); return; }
    const mount = mountRef.current; if (!mount) return;
    const W = mount.clientWidth || 600; const H = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1220);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, W/H, 1, 20000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const d1 = new THREE.DirectionalLight(0xffffff, 0.9); d1.position.set(1,2,1.5); d1.castShadow=true; scene.add(d1);
    const d2 = new THREE.DirectionalLight(0x6699ff, 0.4); d2.position.set(-1,-1,-1); scene.add(d2);

    const grid = new THREE.GridHelper(3000, 30, 0x1a2a44, 0x111d33);
    grid.name = 'grid'; scene.add(grid);
    const axes = new THREE.AxesHelper(400); axes.name = 'axes'; scene.add(axes);

    const g = new THREE.Group(); g.name = 'g'; scene.add(g);
    groupRef.current = g;

    syncCamera(camera);
    const loop = () => { frameRef.current = requestAnimationFrame(loop); renderer.render(scene,camera); };
    loop();

    const obs = new ResizeObserver(() => {
      if (!mount || !renderer) return;
      const w2=mount.clientWidth; const h2=mount.clientHeight;
      camera.aspect=w2/h2; camera.updateProjectionMatrix(); renderer.setSize(w2,h2);
    });
    obs.observe(mount);

    return () => { cancelAnimationFrame(frameRef.current); obs.disconnect(); renderer.dispose(); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); };
  }, []);

  const syncCamera = (cam) => {
    const c = cam || cameraRef.current; if (!c) return;
    const { theta, phi, r } = orbit.current;
    c.position.set(r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.cos(theta));
    c.lookAt(0,0,0);
  };

  // ── Orbit controls ───────────────────────────────────────────────────────
  const onDown  = e => { orbit.current.drag=true; orbit.current.lx=e.clientX; orbit.current.ly=e.clientY; };
  const onUp    = () => { orbit.current.drag=false; };
  const onMove  = e => {
    if (!orbit.current.drag) return;
    const dx=e.clientX-orbit.current.lx; const dy=e.clientY-orbit.current.ly;
    orbit.current.theta -= dx*0.006;
    orbit.current.phi = Math.max(0.04, Math.min(Math.PI-0.04, orbit.current.phi+dy*0.006));
    orbit.current.lx=e.clientX; orbit.current.ly=e.clientY;
    syncCamera();
  };
  const onWheel = e => { e.preventDefault(); orbit.current.r=Math.max(80,Math.min(8000,orbit.current.r+e.deltaY*2)); syncCamera(); };

  // ── Rebuild geometry ────────────────────────────────────────────────────
  React.useEffect(() => {
    const group = groupRef.current;
    if (!group || !window.THREE || !applied) return;
    while (group.children.length) {
      const m = group.children[0];
      if (m.geometry) m.geometry.dispose();
      if (m.material) [].concat(m.material).forEach(mt=>mt.dispose());
      group.remove(m);
    }
    const { w, h, d } = applied.dims;
    const mkMat  = () => new THREE.MeshPhongMaterial({ color:0x4fa8ff, emissive:0x001033, shininess:100, wireframe:wfMode, side:THREE.DoubleSide });
    const mkEdge = () => new THREE.LineBasicMaterial({ color:0x88ccff });

    let items = [];
    if (applied.shape === 'box')       items = buildBox(w,h,d, mkMat, mkEdge, wfMode);
    else if (applied.shape === 'frame')  items = buildFrame(w,h,d, applied.ts, mkMat, mkEdge, wfMode);
    else if (applied.shape === 'cylinder') items = buildCylinder(w,h,d, mkMat, mkEdge, wfMode);
    else if (applied.shape === 'pipe')   items = buildPipe(w,h,d, applied.thick, mkMat, mkEdge, wfMode);
    else if (applied.shape === 'lbracket') items = buildLBracket(w,h,d, applied.ts, mkMat, mkEdge, wfMode);
    items.forEach(m => group.add(m));

    orbit.current.r = Math.max(w,h,d) * 2.8;
    syncCamera();
    setBuilding(false);
  }, [applied, wfMode]);

  // ── Grid / Axes ──────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!sceneRef.current) return;
    const gr = sceneRef.current.getObjectByName('grid');
    const ax = sceneRef.current.getObjectByName('axes');
    if (gr) gr.visible = showGrid;
    if (ax) ax.visible = showAxes;
  }, [showGrid, showAxes]);

  // ── View presets ─────────────────────────────────────────────────────────
  const setView = (p) => {
    const r = orbit.current.r;
    const P = { iso:{theta:0.7,phi:1.05}, front:{theta:0,phi:Math.PI/2}, side:{theta:Math.PI/2,phi:Math.PI/2}, top:{theta:0,phi:0.05} };
    Object.assign(orbit.current, P[p], {r}); syncCamera();
  };

  // ── Generate 3D ──────────────────────────────────────────────────────────
  const generate = () => {
    const w = Math.max(1, Number(dims.w)||1);
    const h = Math.max(1, Number(dims.h)||1);
    const d = Math.max(1, Number(dims.d)||1);
    setBuilding(true);
    setTimeout(() => setApplied({ shape, dims:{w,h,d}, ts:Math.max(10,Number(ts)||60), thick:Math.max(4,Number(thick)||30) }), 80);
  };

  // ── Analyze drawing with AI ───────────────────────────────────────────────
  const analyzeDrawing = async () => {
    if (!pages.length) return;
    setAnalyzing(true); setAiResult(null);
    try {
      // Compress first page to JPEG ≤1024px for API
      const imgEl = new Image();
      await new Promise((res, rej) => { imgEl.onload=res; imgEl.onerror=rej; imgEl.src=pages[0].url; });
      const maxSide = 1024;
      const scale = Math.min(maxSide/imgEl.width, maxSide/imgEl.height, 1);
      const cv = document.createElement('canvas');
      cv.width = Math.round(imgEl.width*scale); cv.height = Math.round(imgEl.height*scale);
      cv.getContext('2d').drawImage(imgEl, 0, 0, cv.width, cv.height);
      const base64 = cv.toDataURL('image/jpeg', 0.85).split(',')[1];

      const resp = await fetch('/.netlify/functions/analyze-drawing', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ imageBase64:base64, mediaType:'image/jpeg' }),
      });
      const data = await resp.json();
      if (data.error) {
        alert('วิเคราะห์ไม่สำเร็จ:\n' + data.error +
          (data.error.includes('ANTHROPIC_API_KEY') ? '\n\nวิธีแก้: ตั้งค่า ANTHROPIC_API_KEY ใน Netlify Environment Variables' : ''));
        return;
      }

      const SHAPES = ['frame','box','cylinder','pipe','lbracket'];
      const newShape = SHAPES.includes(data.shape) ? data.shape : 'frame';
      const newDims  = { w:Math.max(1,Number(data.w)||1200), h:Math.max(1,Number(data.h)||800), d:Math.max(1,Number(data.d)||600) };
      const newTs    = Math.max(5, Number(data.ts)||60);
      const newThick = Math.max(1, Number(data.thick)||30);

      setShape(newShape); setDims(newDims); setTs(newTs); setThick(newThick);
      setAiResult(data);
      // Auto-generate immediately
      setBuilding(true);
      setTimeout(() => setApplied({ shape:newShape, dims:newDims, ts:newTs, thick:newThick }), 80);
    } catch(e) {
      alert('ไม่สามารถเชื่อมต่อ AI ได้\n' + e.message +
        '\n\n(ฟีเจอร์นี้ใช้งานได้ใน Production หรือ netlify dev เท่านั้น)');
    } finally {
      setAnalyzing(false);
    }
  };

  // ── PDF upload ────────────────────────────────────────────────────────────
  const handlePdf = async (file) => {
    if (!file) return;
    if (!window.pdfjsLib) { alert('PDF.js ยังโหลดไม่เสร็จ กรุณา Refresh แล้วลองใหม่'); return; }
    setPdfLoad(true); setPdfName(file.name);
    try {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      const buf = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data:buf }).promise;
      const lbls = ['Front','Side','Top','Section A-A','Detail'];
      const out = [];
      for (let i=1; i<=Math.min(pdf.numPages,5); i++) {
        const pg = await pdf.getPage(i);
        const vp = pg.getViewport({ scale:1.4 });
        const cv = document.createElement('canvas');
        cv.width=vp.width; cv.height=vp.height;
        await pg.render({ canvasContext:cv.getContext('2d'), viewport:vp }).promise;
        out.push({ url:cv.toDataURL(), label:lbls[i-1]||`Page ${i}` });
      }
      setPages(out);
    } catch(e) { alert('โหลด PDF ไม่สำเร็จ: '+e.message); }
    setPdfLoad(false);
  };

  // ── Template cards ───────────────────────────────────────────────────────
  const TEMPLATES = [
    { id:'frame',    label:'Frame',    sub:'โครงเหล็ก',
      icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg> },
    { id:'box',      label:'Box',      sub:'กล่องทึบ',
      icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
    { id:'cylinder', label:'Cylinder', sub:'ทรงกระบอก',
      icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg> },
    { id:'pipe',     label:'Pipe',     sub:'ท่อกลวง',
      icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><ellipse cx="12" cy="5" rx="5" ry="1.5"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M7 5v14M17 5v14"/></svg> },
    { id:'lbracket', label:'L-Bracket', sub:'เหล็กฉาก',
      icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="5 3 5 19 21 19"/><polyline points="5 19 5 14 21 14"/></svg> },
  ];

  const btnBase = { border:'1px solid var(--border-lt)', cursor:'pointer', borderRadius:6, fontSize:12, fontWeight:600, fontFamily:'inherit', transition:'all .15s' };

  if (noThree) return (
    <div style={{padding:40,textAlign:'center',color:'var(--text-2)'}}>
      <div style={{fontSize:32,marginBottom:12}}>⚠️</div>
      <div>Three.js ยังโหลดไม่สำเร็จ — กรุณา Refresh หน้าเว็บ</div>
    </div>
  );

  return (
    <div style={{ display:'flex', gap:14, height:'calc(100vh - 128px)', minHeight:480 }}>

      {/* ── LEFT: PDF panel ─────────────────────────────────────────────── */}
      <div style={{ width:280, flexShrink:0, display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>
        <div style={{ fontWeight:700, fontSize:13, color:'var(--text-1)', display:'flex', alignItems:'center', gap:7 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h7M9 17h5"/></svg>
          Drawing Views (PDF)
        </div>

        {/* Upload zone */}
        <label style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5,
          padding:'16px 10px', borderRadius:9, border:'2px dashed var(--border-lt)',
          cursor:'pointer', background:'var(--bg2)', textAlign:'center' }}
          onDragOver={e=>e.preventDefault()} onDrop={e=>{ e.preventDefault(); handlePdf(e.dataTransfer.files[0]); }}>
          <input type="file" accept=".pdf" style={{display:'none'}} onChange={e=>handlePdf(e.target.files[0])}/>
          {pdfLoad ? <span style={{fontSize:12,color:'var(--text-3)'}}>⏳ กำลังโหลด...</span> : <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span style={{fontSize:11.5,color:'var(--text-2)',fontWeight:600}}>{pdfName || 'อัปโหลด PDF Drawing'}</span>
            <span style={{fontSize:10,color:'var(--text-3)'}}>คลิกหรือลากวางไฟล์</span>
          </>}
        </label>

        {/* AI analyze button — shown after PDF is loaded */}
        {pages.length > 0 && (
          <button onClick={analyzeDrawing} disabled={analyzing} style={{
            padding:'11px 14px', borderRadius:8, border:'none',
            cursor: analyzing ? 'wait' : 'pointer',
            background: analyzing ? 'var(--text-3)' : 'linear-gradient(135deg,#7c3aed,#5b21b6)',
            color:'#fff', fontWeight:700, fontSize:12.5, fontFamily:'inherit',
            display:'flex', alignItems:'center', justifyContent:'center', gap:7,
            boxShadow: analyzing ? 'none' : '0 3px 14px rgba(124,58,237,0.4)',
            transition:'all .2s', opacity: analyzing ? .7 : 1,
          }}>
            {analyzing
              ? <><span style={{animation:'spin 1s linear infinite',display:'inline-block'}}>⏳</span> กำลังวิเคราะห์แบบ...</>
              : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>วิเคราะห์แบบอัตโนมัติ (AI)</>
            }
          </button>
        )}

        {/* AI result summary */}
        {aiResult && !analyzing && (
          <div style={{
            padding:'10px 12px', borderRadius:8,
            background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.28)',
            fontSize:11.5, lineHeight:1.8,
          }}>
            <div style={{fontWeight:700, color:'#10b981', marginBottom:2, display:'flex', alignItems:'center', gap:5}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              วิเคราะห์สำเร็จ
            </div>
            <div style={{color:'var(--text-2)'}}><b>Shape:</b> {aiResult.shape}</div>
            <div style={{color:'var(--text-2)'}}><b>ขนาด:</b> {aiResult.w} × {aiResult.h} × {aiResult.d} mm</div>
            {aiResult.notes && <div style={{color:'var(--text-3)',fontSize:11,marginTop:3}}>{aiResult.notes}</div>}
          </div>
        )}

        {/* PDF pages */}
        {pages.map((pg,i) => (
          <div key={i} style={{ borderRadius:8, border:'1px solid var(--border-lt)', overflow:'hidden' }}>
            <div style={{ padding:'5px 10px', background:'var(--navy)', display:'flex', alignItems:'center' }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#fff', flex:1 }}>{pg.label}</span>
              <select value={pg.label} onChange={e=>setPages(prev=>prev.map((p,j)=>j===i?{...p,label:e.target.value}:p))}
                style={{ fontSize:10, padding:'1px 3px', borderRadius:4, border:'none', background:'rgba(255,255,255,0.15)', color:'#fff', cursor:'pointer' }}>
                {['Front','Side','Top','Section A-A','Section B-B','Detail','Isometric'].map(l=><option key={l} value={l} style={{color:'#000'}}>{l}</option>)}
              </select>
            </div>
            <img src={pg.url} alt={pg.label} style={{ width:'100%', display:'block', background:'#fff' }}/>
          </div>
        ))}

        {pages.length === 0 && !pdfLoad && (
          <div style={{ padding:'18px 12px', borderRadius:8, background:'var(--bg2)', border:'1px solid var(--border-lt)', textAlign:'center' }}>
            <div style={{ fontSize:11.5, color:'var(--text-3)', lineHeight:1.9 }}>
              อัปโหลด PDF Engineering Drawing<br/>เพื่อดูแบบควบคู่กับโมเดล 3D
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Controls + 3D viewer ─────────────────────────────────── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10, minWidth:0 }}>

        {/* Template selector */}
        <div style={{ display:'flex', gap:8 }}>
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={()=>setShape(t.id)} style={{
              flex:1, padding:'10px 6px', borderRadius:9, border:'2px solid',
              borderColor: shape===t.id ? 'var(--navy)' : 'var(--border-lt)',
              background: shape===t.id ? 'rgba(30,60,110,0.12)' : 'var(--bg2)',
              cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4,
              color: shape===t.id ? 'var(--navy)' : 'var(--text-3)', transition:'all .15s',
            }}>
              {t.icon}
              <span style={{ fontSize:11, fontWeight:700 }}>{t.label}</span>
              <span style={{ fontSize:9.5, opacity:.75 }}>{t.sub}</span>
            </button>
          ))}
        </div>

        {/* Dimension inputs + Generate button */}
        <div style={{ display:'flex', alignItems:'flex-end', gap:10, padding:'14px 16px',
          borderRadius:10, background:'var(--bg2)', border:'1px solid var(--border-lt)' }}>

          {/* Dims */}
          <div style={{ display:'flex', gap:10, flex:1, flexWrap:'wrap', alignItems:'center' }}>
            {[['w','W (กว้าง)'],['h','H (สูง)'],['d','D (ลึก)']].map(([k,lbl]) => (
              <label key={k} style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <span style={{ fontSize:10.5, color:'var(--text-3)', fontWeight:600 }}>{lbl}</span>
                <input type="number" min="1" max="99999" value={dims[k]}
                  onChange={e=>setDims(p=>({...p,[k]:e.target.value}))}
                  onBlur={e=>setDims(p=>({...p,[k]:Math.max(1,Number(e.target.value)||1)}))}
                  style={{ width:88, padding:'7px 10px', border:'2px solid var(--border-lt)', borderRadius:7,
                    background:'var(--bg-card)', color:'var(--text-1)', fontSize:14, fontFamily:'inherit', fontWeight:700 }}/>
              </label>
            ))}

            {(shape==='frame'||shape==='lbracket') && (
              <label style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <span style={{ fontSize:10.5, color:'var(--text-3)', fontWeight:600 }}>ขนาดท่อ (ts)</span>
                <input type="number" min="5" max="500" value={ts}
                  onChange={e=>setTs(e.target.value)} onBlur={e=>setTs(Math.max(5,Number(e.target.value)||60))}
                  style={{ width:72, padding:'7px 10px', border:'2px solid var(--border-lt)', borderRadius:7,
                    background:'var(--bg-card)', color:'var(--text-1)', fontSize:14, fontFamily:'inherit', fontWeight:700 }}/>
              </label>
            )}

            {shape==='pipe' && (
              <label style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <span style={{ fontSize:10.5, color:'var(--text-3)', fontWeight:600 }}>Wall (t)</span>
                <input type="number" min="1" max="500" value={thick}
                  onChange={e=>setThick(e.target.value)} onBlur={e=>setThick(Math.max(1,Number(e.target.value)||30))}
                  style={{ width:72, padding:'7px 10px', border:'2px solid var(--border-lt)', borderRadius:7,
                    background:'var(--bg-card)', color:'var(--text-1)', fontSize:14, fontFamily:'inherit', fontWeight:700 }}/>
              </label>
            )}

            <span style={{ fontSize:11, color:'var(--text-3)', alignSelf:'flex-end', paddingBottom:8 }}>mm</span>
          </div>

          {/* Generate button */}
          <button onClick={generate} disabled={building} style={{
            padding:'12px 28px', borderRadius:9, border:'none', cursor:building?'wait':'pointer',
            background: building ? 'var(--text-3)' : 'linear-gradient(135deg,#ff8c1a,#e67300)',
            color:'#fff', fontWeight:800, fontSize:15, fontFamily:'inherit',
            letterSpacing:'.3px', boxShadow:'0 4px 18px rgba(255,140,26,0.45)',
            transition:'all .2s', flexShrink:0,
            opacity: building ? .7 : 1,
          }}>
            {building ? '⏳ กำลังสร้าง...' : '⚡ Generate 3D'}
          </button>
        </div>

        {/* Canvas + view controls row */}
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {/* View presets */}
          <div style={{ display:'flex', gap:4 }}>
            {[['iso','ISO'],['front','FRT'],['side','SID'],['top','TOP']].map(([p,l])=>(
              <button key={p} onClick={()=>setView(p)} style={{...btnBase, padding:'5px 10px', background:'var(--bg2)', color:'var(--text-2)'}}>{l}</button>
            ))}
          </div>
          <div style={{ width:1, height:20, background:'var(--border-lt)' }}/>
          {/* Toggles */}
          {[['Wireframe',wfMode,()=>setWfMode(v=>!v)],['Grid',showGrid,()=>setShowGrid(v=>!v)],['Axes',showAxes,()=>setShowAxes(v=>!v)]].map(([lbl,on,fn])=>(
            <button key={lbl} onClick={fn} style={{...btnBase, padding:'5px 10px',
              background:on?'rgba(79,168,255,0.15)':'var(--bg2)',
              color:on?'#4fa8ff':'var(--text-3)', borderColor:on?'rgba(79,168,255,0.35)':'var(--border-lt)',
            }}>{lbl}</button>
          ))}
          {applied && (
            <span style={{ fontSize:11, color:'var(--text-3)', marginLeft:'auto' }}>
              {applied.shape} — <strong style={{color:'var(--text-2)'}}>{applied.dims.w} × {applied.dims.h} × {applied.dims.d}</strong> mm
            </span>
          )}
        </div>

        {/* Canvas */}
        <div ref={mountRef}
          style={{ flex:1, borderRadius:10, overflow:'hidden', border:'1px solid var(--border-lt)',
            cursor:orbit.current.drag?'grabbing':'grab', minHeight:300, background:'#0a1220',
            position:'relative' }}
          onMouseDown={onDown} onMouseUp={onUp} onMouseLeave={onUp} onMouseMove={onMove} onWheel={onWheel}>
          {/* Placeholder before first generate */}
          {!applied && !building && (
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:16, color:'rgba(255,255,255,0.2)', pointerEvents:'none' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <div style={{ textAlign:'center', lineHeight:1.8, fontSize:13 }}>
                ตั้งค่าขนาดด้านบน<br/>แล้วกด <span style={{color:'#ff8c1a',fontWeight:700}}>⚡ Generate 3D</span>
              </div>
            </div>
          )}
        </div>

        {/* Hint */}
        <div style={{ fontSize:10.5, color:'var(--text-3)', textAlign:'center', paddingBottom:2 }}>
          🖱 ลากเพื่อหมุน · Scroll เพื่อ Zoom · ISO / FRT / SID / TOP เพื่อดูมุมที่ต้องการ
        </div>
      </div>
    </div>
  );
};
