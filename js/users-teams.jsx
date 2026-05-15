/* global React, Icons, WQIS_DATA */

const UsersTeamsScreen = () => {
  const [tab, setTab] = React.useState("users");
  const [showInvite, setShowInvite] = React.useState(false);

  const USERS = [
    { name: "Manop Kosolwong",   initials:"MK", email: "manop.k@pro3s.co.th",   role: "QA Manager",    proj: "All",    tfa: true,  last: "now",  act: "active" },
    { name: "Wirot Chanthorn",   initials:"WC", email: "wirot.c@pro3s.co.th",   role: "QA Engineer",   proj: "8",      tfa: true,  last: "4m",   act: "active" },
    { name: "Niran Kosolwat",    initials:"NK", email: "niran.k@pro3s.co.th",   role: "Inspector",     proj: "6",      tfa: false, last: "22m",  act: "active" },
    { name: "Boonmee Saengtho.", initials:"BS", email: "boonmee.s@pro3s.co.th", role: "Inspector",     proj: "4",      tfa: true,  last: "1h",   act: "active" },
    { name: "Client · Synova",   initials:"CS", email: "qa@synova.com",          role: "Client View",   proj: "SYN-L3", tfa: true,  last: "12h",  act: "active" },
    { name: "Apinya R.",         initials:"AR", email: "apinya.r@pro3s.co.th",  role: "Welder",        proj: "3",      tfa: false, last: "3d",   act: "active" },
    { name: "Audit · External",  initials:"AE", email: "audit@bvqi.com",         role: "Auditor (R/O)", proj: "Q2",     tfa: true,  last: "20d",  act: "paused" },
  ];

  const TEAMS = [
    { id: 1, name: "Team Alpha",  lead: "Somchai P.",  process: "GTAW",       members: 4, projects: ["SYN-L3", "TPA-CIP"] },
    { id: 2, name: "Team Beta",   lead: "Wirot C.",    process: "GMAW/FCAW",  members: 3, projects: ["RB25-P91"] },
    { id: 3, name: "Team Gamma",  lead: "Niran K.",    process: "SMAW",       members: 5, projects: ["SYN-L3"] },
    { id: 4, name: "Inspection",  lead: "Manop K.",    process: "QA/QC",      members: 2, projects: ["All"] },
  ];

  return (
    <div className="page">
      <div className="bg-grid"/>
      <div className="page-head">
        <div>
          <span className="kicker">SYSTEM · ACCESS CONTROL</span>
          <h1 style={{ marginTop: 8 }}>Users & Teams</h1>
          <div className="sub">จัดการผู้ใช้งานและทีมงาน · User management and team assignments</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          {tab === "users" && <button className="btn primary sm" onClick={() => setShowInvite(true)}><Icons.Plus size={14}/> Invite User</button>}
          {tab === "teams" && <button className="btn primary sm"><Icons.Plus size={14}/> Create Team</button>}
        </div>
      </div>

      <div className="row" style={{ gap: 4, marginBottom: 18 }}>
        {[["users","Users"],["teams","Teams"]].map(([id,lbl]) => (
          <button key={id} className={`btn ${tab === id ? "" : "ghost"} sm`} onClick={() => setTab(id)}>{lbl}</button>
        ))}
      </div>

      {tab === "users" && (
        <div className="panel glass" style={{ overflow: "hidden" }}>
          <div className="panel-header">
            <h3>Users <span className="chip" style={{ marginLeft: 8 }}>{USERS.length}</span></h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Projects</th><th>2FA</th><th>Last seen</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {USERS.map(u => (
                  <tr key={u.email}>
                    <td>
                      <div className="row" style={{ gap: 10 }}>
                        <div className="avatar sm">{u.initials}</div>
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td className="mono" style={{ fontSize: 11.5, color: "var(--t-3)" }}>{u.email}</td>
                    <td><span className="chip amber">{u.role}</span></td>
                    <td className="mono">{u.proj}</td>
                    <td>{u.tfa ? <Icons.Tick size={14} stroke="var(--ok)"/> : <Icons.Warn size={14} stroke="var(--warn)"/>}</td>
                    <td className="mono" style={{ color: "var(--t-3)" }}>{u.last}</td>
                    <td>{u.act === "active" ? <span className="chip ok"><span className="dot"/>ACTIVE</span> : <span className="chip"><span className="dot"/>PAUSED</span>}</td>
                    <td><button className="btn ghost sm icon"><Icons.More size={14}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "teams" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {TEAMS.map(t => (
            <div key={t.id} className="panel glass">
              <div className="panel-body">
                <div className="row" style={{ marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--amber-soft)", border: "1px solid var(--amber-line)",
                                display: "grid", placeItems: "center", color: "var(--amber)" }}>
                    <Icons.Users size={18}/>
                  </div>
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: "var(--t-4)" }}>Lead: {t.lead}</div>
                  </div>
                  <span className="chip">{t.members} members</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--t-3)", marginBottom: 10 }}>
                  Process: <strong style={{ color: "var(--t-1)" }}>{t.process}</strong>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {t.projects.map(p => <span key={p} className="chip amber" style={{ fontSize: 10.5 }}>{p}</span>)}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn ghost sm" style={{ flex: 1, justifyContent: "center" }}>Manage</button>
                  <button className="btn ghost sm icon"><Icons.More size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

window.UsersTeamsScreen = UsersTeamsScreen;
