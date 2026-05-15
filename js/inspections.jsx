/* global React, Icons, Charts, WQIS_DATA, WQIS_FMT */

const InspectionsScreen = () => {
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const PAGE_SIZE = 12;

  const joints = WQIS_DATA.joints || [];
  let filtered = joints;
  if (filter !== "all") filtered = filtered.filter(j => j.verdict === filter);
  if (search) filtered = filtered.filter(j =>
    j.id.toLowerCase().includes(search.toLowerCase()) ||
    j.welder.toLowerCase().includes(search.toLowerCase()) ||
    j.spool.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  return (
    <div className="page">
      <div className="bg-grid"/>
      <div className="page-head">
        <div>
          <span className="kicker">INSPECTION RECORDS · {filtered.length.toLocaleString()} RESULTS</span>
          <h1 style={{ marginTop: 8 }}>Inspections</h1>
          <div className="sub">ประวัติการตรวจสอบทั้งหมด · Weld joint inspection history</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn ghost sm"><Icons.Download size={14}/> Export CSV</button>
          <button className="btn primary sm"><Icons.Plus size={14}/> New Inspection</button>
        </div>
      </div>

      {/* Filters */}
      <div className="row" style={{ gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div className="seg">
          {["all","pass","review","fail"].map(v => (
            <button key={v} className={filter === v ? "on" : ""} onClick={() => { setFilter(v); setPage(1); }}>
              {v === "all" ? "All" : v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
          <input className="input" style={{ paddingLeft: 34, width: "100%" }}
                 placeholder="Search joint, welder, spool…"
                 value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
          <div style={{ position: "absolute", left: 10, top: 9, color: "var(--t-4)" }}>
            <Icons.Search size={14}/>
          </div>
        </div>
        <div className="seg">
          <button className="on"><Icons.Calendar size={12}/> All dates</button>
          <button><Icons.Filter size={12}/> Filter</button>
        </div>
      </div>

      <div className="panel glass" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Joint ID</th><th>Spool</th><th>Welder</th><th>WPS</th>
                <th>Ø / Pos</th><th>Date</th><th>Verdict</th><th>Conf.</th><th></th>
              </tr>
            </thead>
            <tbody>
              {paged.map(j => (
                <tr key={j.id} onClick={() => setSelected(selected && selected.id === j.id ? null : j)}
                    style={{ cursor: "pointer", background: selected && selected.id === j.id ? "var(--amber-soft)" : "" }}>
                  <td><span className="mono" style={{ color: "var(--amber-2)", fontWeight: 600 }}>{j.id}</span></td>
                  <td className="mono" style={{ color: "var(--t-3)" }}>{j.spool}</td>
                  <td>{j.welder}</td>
                  <td><span className="chip amber">{j.wps}</span></td>
                  <td className="mono">{j.dia} · {j.pos}</td>
                  <td className="mono" style={{ color: "var(--t-4)", fontSize: 11.5 }}>{j.date}</td>
                  <td>
                    {j.verdict === "pass"   && <span className="chip ok"><span className="dot"/>PASS</span>}
                    {j.verdict === "review" && <span className="chip warn"><span className="dot"/>REVIEW</span>}
                    {j.verdict === "fail"   && <span className="chip bad"><span className="dot"/>FAIL</span>}
                  </td>
                  <td className="mono nums" style={{ color: j.conf > 95 ? "var(--ok)" : j.conf > 85 ? "var(--t-1)" : "var(--warn)" }}>
                    {j.conf.toFixed(1)}%
                  </td>
                  <td><Icons.ChevR size={14} stroke="var(--t-4)"/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid var(--border-1)" }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--t-4)" }}>
            Showing {filtered.length === 0 ? 0 : ((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="btn ghost sm icon" disabled={page <= 1} onClick={() => setPage(p => p-1)}>
              <Icons.ChevL size={14}/>
            </button>
            {Array.from({length: Math.min(5, totalPages)}, (_,i) => {
              const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (pg > totalPages) return null;
              return (
                <button key={pg} className={`btn ${page === pg ? "" : "ghost"} sm`}
                        style={{ minWidth: 32, justifyContent: "center" }}
                        onClick={() => setPage(pg)}>{pg}</button>
              );
            })}
            <button className="btn ghost sm icon" disabled={page >= totalPages} onClick={() => setPage(p => p+1)}>
              <Icons.ChevR size={14}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

window.InspectionsScreen = InspectionsScreen;
